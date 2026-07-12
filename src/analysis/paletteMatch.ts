import { seasons } from '../data/seasons';
import { classifyColor } from './colorClassification';
import { rgbToHSL } from './colorSampling';
import type { NamedColor, SeasonId } from '../types';

export type MatchTier = 'great' | 'good' | 'neutral' | 'poor';

export interface PaletteMatch {
  tier: MatchTier;
  nearestColor: NamedColor;
  deltaE: number;
}

type RGB = [number, number, number];
type Lab = [number, number, number];

// Tier thresholds on the hue-penalised Delta-E distance; tuned against
// the fixtures in paletteMatch.test.ts rather than derived from theory.
export const DELTA_E_GREAT = 12;
export const DELTA_E_GOOD = 22;
export const DELTA_E_NEUTRAL = 32;
export const HUE_MISMATCH_PENALTY = 10;

const NEUTRAL_SATURATION_MAX = 12;
const NEUTRAL_LIGHTNESS_MIN = 12;
const NEUTRAL_LIGHTNESS_MAX = 92;

export function hexToRgb(hex: string): RGB {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
}

export function rgbToLab(rgb: RGB): Lab {
  const linear = rgb.map((c) => {
    const v = c / 255;
    return v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92;
  });

  const [r, g, b] = linear;
  // sRGB → XYZ (D65), scaled to the D65 reference white
  const x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) / 0.95047;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
  const z = (r * 0.0193339 + g * 0.119192 + b * 0.9503041) / 1.08883;

  const f = (t: number) =>
    t > 0.008856 ? Math.cbrt(t) : (903.3 * t + 16) / 116;

  const [fx, fy, fz] = [f(x), f(y), f(z)];
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

export function deltaE76(a: Lab, b: Lab): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function isNearNeutral(rgb: RGB): boolean {
  const [, s, l] = rgbToHSL(rgb);
  return (
    s < NEUTRAL_SATURATION_MAX ||
    l < NEUTRAL_LIGHTNESS_MIN ||
    l > NEUTRAL_LIGHTNESS_MAX
  );
}

export function scoreColorForSeason(rgb: RGB, seasonId: SeasonId): PaletteMatch {
  const season = seasons[seasonId];
  const candidates = [...season.palette, ...season.wowColors];
  const itemLab = rgbToLab(rgb);

  let nearestColor = candidates[0];
  let deltaE = Infinity;
  for (const candidate of candidates) {
    const d = deltaE76(itemLab, rgbToLab(hexToRgb(candidate.hex)));
    if (d < deltaE) {
      deltaE = d;
      nearestColor = candidate;
    }
  }

  const seasonHue = season.dimensions.hue >= 50 ? 'warm' : 'cool';
  const huePenalty =
    !isNearNeutral(rgb) && classifyColor(rgb).classification.hue !== seasonHue
      ? HUE_MISMATCH_PENALTY
      : 0;
  const effective = deltaE + huePenalty;

  const tier: MatchTier =
    effective <= DELTA_E_GREAT
      ? 'great'
      : effective <= DELTA_E_GOOD
        ? 'good'
        : effective <= DELTA_E_NEUTRAL
          ? 'neutral'
          : 'poor';

  return { tier, nearestColor, deltaE };
}
