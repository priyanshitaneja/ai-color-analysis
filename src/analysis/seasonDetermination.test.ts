import { describe, it, expect } from 'vitest';
import { determineSeason } from './seasonDetermination';
import type { ColorProfile, ColorTraits, DetectedFeature, SeasonId } from '../types';

function feature(
  value: ColorTraits['value'],
  chroma: ColorTraits['chroma'],
  hue: ColorTraits['hue']
): DetectedFeature {
  return { rgb: [0, 0, 0], hex: '#000000', classification: { value, chroma, hue } };
}

function profile(
  skin: DetectedFeature,
  eyes: DetectedFeature,
  hair: DetectedFeature
): ColorProfile {
  return { skin, eyes, hair, undertone: 'neutral' };
}

describe('determineSeason', () => {
  // Value-dominant: all three features share the value trait (score 3),
  // hue is split 2/1 to pick the secondary.
  const valueDominantCases: Array<[SeasonId, ColorProfile]> = [
    [
      'dark-autumn',
      profile(
        feature('dark', 'muted', 'warm'),
        feature('dark', 'bright', 'warm'),
        feature('dark', 'muted', 'cool')
      ),
    ],
    [
      'dark-winter',
      profile(
        feature('dark', 'muted', 'cool'),
        feature('dark', 'bright', 'cool'),
        feature('dark', 'muted', 'warm')
      ),
    ],
    [
      'light-spring',
      profile(
        feature('light', 'muted', 'warm'),
        feature('light', 'bright', 'warm'),
        feature('light', 'muted', 'cool')
      ),
    ],
    [
      'light-summer',
      profile(
        feature('light', 'muted', 'cool'),
        feature('light', 'bright', 'cool'),
        feature('light', 'muted', 'warm')
      ),
    ],
  ];

  // Chroma-dominant: chroma scores 3, value split 2/1 so it can't tie.
  const chromaDominantCases: Array<[SeasonId, ColorProfile]> = [
    [
      'muted-autumn',
      profile(
        feature('light', 'muted', 'warm'),
        feature('dark', 'muted', 'warm'),
        feature('dark', 'muted', 'cool')
      ),
    ],
    [
      'muted-summer',
      profile(
        feature('light', 'muted', 'cool'),
        feature('dark', 'muted', 'cool'),
        feature('dark', 'muted', 'warm')
      ),
    ],
    [
      'bright-spring',
      profile(
        feature('light', 'bright', 'warm'),
        feature('dark', 'bright', 'warm'),
        feature('dark', 'bright', 'cool')
      ),
    ],
    [
      'bright-winter',
      profile(
        feature('light', 'bright', 'cool'),
        feature('dark', 'bright', 'cool'),
        feature('dark', 'bright', 'warm')
      ),
    ],
  ];

  // Hue-dominant: hue scores 3 while value AND chroma are each split 2/1
  // (tie priority dark > light > muted > bright > warm > cool would otherwise
  // steal dominance from the hue trait).
  const hueDominantCases: Array<[SeasonId, ColorProfile]> = [
    [
      'warm-autumn',
      profile(
        feature('light', 'muted', 'warm'),
        feature('dark', 'muted', 'warm'),
        feature('dark', 'bright', 'warm')
      ),
    ],
    [
      'warm-spring',
      profile(
        feature('light', 'bright', 'warm'),
        feature('dark', 'bright', 'warm'),
        feature('dark', 'muted', 'warm')
      ),
    ],
    [
      'cool-summer',
      profile(
        feature('light', 'muted', 'cool'),
        feature('dark', 'muted', 'cool'),
        feature('dark', 'bright', 'cool')
      ),
    ],
    [
      'cool-winter',
      profile(
        feature('light', 'bright', 'cool'),
        feature('dark', 'bright', 'cool'),
        feature('dark', 'muted', 'cool')
      ),
    ],
  ];

  it.each([...valueDominantCases, ...chromaDominantCases, ...hueDominantCases])(
    'maps to %s',
    (expected, colorProfile) => {
      expect(determineSeason(colorProfile)).toBe(expected);
    }
  );

  it('reaches all 12 seasons across the fixtures', () => {
    const reached = new Set(
      [...valueDominantCases, ...chromaDominantCases, ...hueDominantCases].map(([id]) => id)
    );
    expect(reached.size).toBe(12);
  });

  describe('tie resolution', () => {
    it('prefers dark over muted and warm on a three-way tie', () => {
      const p = profile(
        feature('dark', 'muted', 'warm'),
        feature('dark', 'muted', 'warm'),
        feature('dark', 'muted', 'warm')
      );
      // dark, muted and warm all score 3; priority picks dark, secondary warm
      expect(determineSeason(p)).toBe('dark-autumn');
    });

    it('prefers light over bright and cool on a three-way tie', () => {
      const p = profile(
        feature('light', 'bright', 'cool'),
        feature('light', 'bright', 'cool'),
        feature('light', 'bright', 'cool')
      );
      expect(determineSeason(p)).toBe('light-summer');
    });
  });

  describe('secondary selection biases', () => {
    it('breaks a warm/cool hue tie toward warm when value dominates', () => {
      // hue never ties 2/1 with three features unless... it always splits 2/1 or 3/0,
      // so exercise the >= bias with warm=2 explicitly vs cool=1 reversed
      const p = profile(
        feature('dark', 'muted', 'warm'),
        feature('dark', 'bright', 'cool'),
        feature('dark', 'muted', 'warm')
      );
      expect(determineSeason(p)).toBe('dark-autumn');
    });

    it('breaks a muted/bright tie toward muted when hue dominates', () => {
      // chroma always splits 2/1 or 3/0 across three features; verify the
      // muted >= bright comparison picks muted when muted=2
      const p = profile(
        feature('light', 'muted', 'warm'),
        feature('dark', 'bright', 'warm'),
        feature('dark', 'muted', 'warm')
      );
      expect(determineSeason(p)).toBe('warm-autumn');
    });
  });
});
