import { COLOR_NAMES } from './colorNames';

type RGB = [number, number, number];

export interface NamedHex {
  name: string;
  hex: string;
}

export interface ResolvedItemColor {
  rgb: RGB;
  source: 'title' | 'image';
}

// longest phrases first so "navy blue" wins over "blue"
const LEXICON_ENTRIES = Object.entries(COLOR_NAMES).sort(
  (a, b) => b[0].length - a[0].length
);

function hexToRgb(hex: string): RGB {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
}

export function colorFromTitle(title: string): NamedHex | null {
  const haystack = title.toLowerCase();
  for (const [name, hex] of LEXICON_ENTRIES) {
    const pattern = new RegExp(`\\b${name.replace(/ /g, '\\s+')}\\b`);
    if (pattern.test(haystack)) return { name, hex };
  }
  return null;
}

// Title wins when it names a color: Myntra titles lead with the color word,
// while dominant-color extraction can be fooled by model skin and prints.
export function resolveItemColor(
  title: string | null,
  imageRgb: RGB | null
): ResolvedItemColor | null {
  const fromTitle = title ? colorFromTitle(title) : null;
  if (fromTitle) return { rgb: hexToRgb(fromTitle.hex), source: 'title' };
  if (imageRgb) return { rgb: imageRgb, source: 'image' };
  return null;
}
