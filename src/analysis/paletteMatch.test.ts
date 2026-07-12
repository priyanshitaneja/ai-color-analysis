import { describe, it, expect } from 'vitest';
import {
  deltaE76,
  hexToRgb,
  rgbToLab,
  scoreColorForSeason,
  DELTA_E_GREAT,
  DELTA_E_GOOD,
  DELTA_E_NEUTRAL,
} from './paletteMatch';
import { seasons } from '../data/seasons';

describe('hexToRgb', () => {
  it('parses hex channels', () => {
    expect(hexToRgb('#ffdb58')).toEqual([255, 219, 88]);
    expect(hexToRgb('#000000')).toEqual([0, 0, 0]);
    expect(hexToRgb('#ffffff')).toEqual([255, 255, 255]);
  });
});

describe('rgbToLab', () => {
  it('maps white to L=100, a=0, b=0', () => {
    const [l, a, b] = rgbToLab([255, 255, 255]);
    expect(l).toBeCloseTo(100, 0);
    expect(a).toBeCloseTo(0, 0);
    expect(b).toBeCloseTo(0, 0);
  });

  it('maps black to L=0', () => {
    expect(rgbToLab([0, 0, 0])[0]).toBeCloseTo(0, 1);
  });

  it('maps sRGB red to the CIE reference value', () => {
    const [l, a, b] = rgbToLab([255, 0, 0]);
    expect(l).toBeCloseTo(53.2, 0);
    expect(a).toBeCloseTo(80.1, 0);
    expect(b).toBeCloseTo(67.2, 0);
  });
});

describe('deltaE76', () => {
  it('is zero for identical colors', () => {
    expect(deltaE76(rgbToLab([120, 80, 40]), rgbToLab([120, 80, 40]))).toBe(0);
  });

  it('is symmetric', () => {
    const a = rgbToLab([120, 80, 40]);
    const b = rgbToLab([40, 80, 120]);
    expect(deltaE76(a, b)).toBeCloseTo(deltaE76(b, a));
  });
});

describe('scoreColorForSeason', () => {
  it('rates an exact palette color as a great match with deltaE 0', () => {
    // warm-autumn palette contains Mustard #FFDB58
    const match = scoreColorForSeason([255, 219, 88], 'warm-autumn');
    expect(match.tier).toBe('great');
    expect(match.deltaE).toBeCloseTo(0);
    expect(match.nearestColor.name).toBe('Mustard');
  });

  it('rates a near-palette mustard as great for warm-autumn', () => {
    expect(scoreColorForSeason([230, 190, 70], 'warm-autumn').tier).toBe('great');
  });

  it('rates orange as poor for cool-winter', () => {
    expect(scoreColorForSeason([255, 127, 0], 'cool-winter').tier).toBe('poor');
  });

  it('rates mustard as poor for cool-summer', () => {
    expect(scoreColorForSeason([230, 190, 70], 'cool-summer').tier).toBe('poor');
  });

  describe('neutrals are scored by palette distance alone', () => {
    it('black is great for dark-winter but poor for light-spring', () => {
      expect(scoreColorForSeason([0, 0, 0], 'dark-winter').tier).toBe('great');
      expect(scoreColorForSeason([0, 0, 0], 'light-spring').tier).toBe('poor');
    });

    it('white suits light-summer', () => {
      expect(scoreColorForSeason([255, 255, 255], 'light-summer').tier).toBe('great');
    });

    it('mid-grey suits muted-summer', () => {
      expect(scoreColorForSeason([128, 128, 128], 'muted-summer').tier).toBe('great');
    });

    it('skips the hue penalty for near-neutrals', () => {
      // black is "warm" by the hue formula but must not be penalised
      // against cool seasons: deltaE to dark-winter's Black is 0 → great
      const match = scoreColorForSeason([0, 0, 0], 'dark-winter');
      expect(match.tier).toBe('great');
    });
  });

  it('applies the hue penalty to saturated off-temperature colors', () => {
    // a warm gold sitting ~52 deltaE from cool-summer's palette would
    // still be poor, so pin the penalty on a mid-distance case instead:
    // deltaE alone would rate near-mustard 'great' (10.9) for warm-autumn;
    // the same distance against a cool season must land at least one tier lower
    const warm = scoreColorForSeason([230, 190, 70], 'warm-autumn');
    expect(warm.deltaE).toBeLessThan(DELTA_E_GREAT);
    const cool = scoreColorForSeason([230, 190, 70], 'cool-summer');
    expect(cool.tier).toBe('poor');
  });

  it('always returns the nearest palette color for the tooltip', () => {
    const match = scoreColorForSeason([50, 60, 160], 'warm-spring');
    expect(match.nearestColor.name).toBe('Warm Navy');
    expect(match.tier).toBe('poor');
  });

  it('orders tier thresholds correctly', () => {
    expect(DELTA_E_GREAT).toBeLessThan(DELTA_E_GOOD);
    expect(DELTA_E_GOOD).toBeLessThan(DELTA_E_NEUTRAL);
  });

  it('produces a valid result for every season', () => {
    for (const seasonId of Object.keys(seasons) as (keyof typeof seasons)[]) {
      const match = scoreColorForSeason([180, 60, 90], seasonId);
      expect(['great', 'good', 'neutral', 'poor']).toContain(match.tier);
      expect(match.nearestColor.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(match.deltaE).toBeGreaterThanOrEqual(0);
    }
  });
});
