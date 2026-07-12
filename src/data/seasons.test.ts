import { describe, it, expect } from 'vitest';
import { seasons } from './seasons';
import type { SeasonId } from '../types';

const SEASON_IDS: SeasonId[] = [
  'light-spring', 'bright-spring', 'warm-spring',
  'light-summer', 'muted-summer', 'cool-summer',
  'dark-autumn', 'muted-autumn', 'warm-autumn',
  'dark-winter', 'bright-winter', 'cool-winter',
];

const HEX_RE = /^#[0-9A-Fa-f]{6}$/;

describe('seasons data', () => {
  it('contains exactly the 12 season ids', () => {
    expect(Object.keys(seasons).sort()).toEqual([...SEASON_IDS].sort());
  });

  describe.each(SEASON_IDS)('%s', (id) => {
    const season = seasons[id];

    it('has a matching id field', () => {
      expect(season.id).toBe(id);
    });

    it('has 30 palette colors and 4 wow colors', () => {
      expect(season.palette).toHaveLength(30);
      expect(season.wowColors).toHaveLength(4);
    });

    it('uses valid hex codes throughout', () => {
      for (const { hex } of [...season.palette, ...season.wowColors]) {
        expect(hex).toMatch(HEX_RE);
      }
    });

    // some palettes intentionally reuse a hex under synonym names
    // (e.g. dark-winter "Merlot"/"Wine"), so uniqueness is on names
    it('has no duplicate color names within the palette', () => {
      const names = season.palette.map((c) => c.name.toLowerCase());
      expect(new Set(names).size).toBe(names.length);
    });

    it('has named colors', () => {
      for (const { name } of [...season.palette, ...season.wowColors]) {
        expect(name).not.toBe('');
      }
    });

    it('has a valid jewellery recommendation', () => {
      expect(['gold', 'silver', 'both']).toContain(season.jewellery);
    });

    it('has dimensions within 0-100', () => {
      for (const v of Object.values(season.dimensions)) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      }
    });

    it('has non-empty descriptive fields', () => {
      expect(season.name).not.toBe('');
      expect(season.formula).not.toBe('');
      expect(season.description).not.toBe('');
      expect(season.skinDescription).not.toBe('');
      expect(season.paletteDescription).not.toBe('');
      expect(season.typicalHairColors.length).toBeGreaterThan(0);
      expect(season.typicalEyeColors.length).toBeGreaterThan(0);
    });
  });
});
