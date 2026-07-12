import { scoreColorForSeason, type MatchTier } from '../../analysis/paletteMatch';
import { seasons } from '../../data/seasons';
import { resultStore, type SavedAnalysis } from '../../lib/resultStore';
import { findAdapter } from '../adapters';
import type { SiteAdapter } from '../adapters/types';
import { dominantFromPixels } from '../dominantColor';
import { resolveItemColor } from '../itemColor';

declare global {
  interface Window {
    __caBadges?: { rescan(): void };
  }
}

const BADGED_ATTR = 'data-ca-badged';
const HOST_ATTR = 'data-ca-badge-host';
const IMAGE_LOAD_TIMEOUT_MS = 4000;
const SCAN_DEBOUNCE_MS = 300;
const SAMPLE_SIZE = 50;
const CENTER_CROP = 0.6;

const TIER_STYLE: Record<MatchTier, { color: string; label: string }> = {
  great: { color: '#16a34a', label: 'Great match' },
  good: { color: '#84cc16', label: 'Good match' },
  neutral: { color: '#9ca3af', label: 'Okay match' },
  poor: { color: '#ef4444', label: 'Not your color' },
};

// Re-fetch the product image with CORS enabled: the page's own <img> was
// fetched without crossOrigin, which would taint the sampling canvas even
// though the CDN allows anonymous access.
function loadCorsImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => resolve(null), IMAGE_LOAD_TIMEOUT_MS);
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };
    img.src = src;
  });
}

async function imageDominantColor(
  pageImg: HTMLImageElement | null
): Promise<[number, number, number] | null> {
  const src = pageImg?.currentSrc || pageImg?.src;
  if (!src) return null;

  const img = await loadCorsImage(src);
  if (!img) return null;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = SAMPLE_SIZE;
    canvas.height = SAMPLE_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (!w || !h) return null;

    const cropW = w * CENTER_CROP;
    const cropH = h * CENTER_CROP;
    ctx.drawImage(
      img,
      (w - cropW) / 2,
      (h - cropH) / 2,
      cropW,
      cropH,
      0,
      0,
      SAMPLE_SIZE,
      SAMPLE_SIZE
    );
    return dominantFromPixels(ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data);
  } catch {
    return null;
  }
}

function renderBadge(
  mount: HTMLElement,
  tier: MatchTier,
  tooltip: string
): void {
  if (getComputedStyle(mount).position === 'static') {
    mount.style.position = 'relative';
  }

  const host = document.createElement('div');
  host.setAttribute(HOST_ATTR, '');
  host.style.cssText =
    'position:absolute;top:8px;right:8px;z-index:2147483646;pointer-events:auto;';

  const { color, label } = TIER_STYLE[tier];
  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `
    <style>
      .chip {
        display: flex;
        align-items: center;
        gap: 5px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 999px;
        padding: 3px 8px;
        font: 500 11px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: #333;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
        cursor: default;
        white-space: nowrap;
      }
      .dot {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: ${color};
        flex-shrink: 0;
      }
      .tip {
        display: none;
        position: absolute;
        top: calc(100% + 6px);
        right: 0;
        background: #1f2937;
        color: #f9fafb;
        border-radius: 8px;
        padding: 6px 10px;
        font: 400 11px/1.5 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        max-width: 220px;
        white-space: normal;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
      }
      :host(:hover) .tip { display: block; }
    </style>
    <div class="chip"><span class="dot"></span><span class="text"></span></div>
    <div class="tip"></div>
  `;
  shadow.querySelector('.text')!.textContent = label;
  shadow.querySelector('.tip')!.textContent = tooltip;

  mount.appendChild(host);
}

async function processCard(
  card: HTMLElement,
  adapter: SiteAdapter,
  saved: SavedAnalysis
): Promise<void> {
  card.setAttribute(BADGED_ATTR, '');

  const title = adapter.getTitle(card);
  const imageRgb = await imageDominantColor(adapter.getImage(card));
  const resolved = resolveItemColor(title, imageRgb);
  // absence of a badge is quieter than a wrong badge
  if (!resolved) return;

  const match = scoreColorForSeason(resolved.rgb, saved.seasonId);
  const seasonName = seasons[saved.seasonId].name;
  const tooltip = `${TIER_STYLE[match.tier].label} — close to '${match.nearestColor.name}' in your ${seasonName} palette`;
  renderBadge(adapter.getBadgeMount(card), match.tier, tooltip);
}

function init(adapter: SiteAdapter, saved: SavedAnalysis): void {
  const scan = () => {
    for (const card of adapter.findProductCards(document)) {
      if (!card.hasAttribute(BADGED_ATTR)) {
        void processCard(card, adapter, saved);
      }
    }
  };

  const fullRescan = () => {
    for (const host of document.querySelectorAll(`[${HOST_ATTR}]`)) host.remove();
    for (const card of document.querySelectorAll(`[${BADGED_ATTR}]`)) {
      card.removeAttribute(BADGED_ATTR);
    }
    scan();
  };

  let debounce: number | undefined;
  const observer = new MutationObserver(() => {
    clearTimeout(debounce);
    debounce = window.setTimeout(scan, SCAN_DEBOUNCE_MS);
  });
  observer.observe(adapter.observeRoot(document), {
    childList: true,
    subtree: true,
  });

  window.__caBadges = { rescan: fullRescan };
  scan();
}

async function main(): Promise<void> {
  if (window.__caBadges) {
    window.__caBadges.rescan();
    return;
  }

  const adapter = findAdapter(new URL(location.href));
  if (!adapter) return;

  const saved = await resultStore.load();
  if (!saved) return;

  init(adapter, saved);
}

void main();
