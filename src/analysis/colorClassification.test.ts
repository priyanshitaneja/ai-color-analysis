import { describe, it, expect } from 'vitest';
import { classifyColor, classifySkinUndertone } from './colorClassification';

describe('classifyColor', () => {
  it('returns rgb and hex alongside the classification', () => {
    const result = classifyColor([210, 170, 110]);
    expect(result.rgb).toEqual([210, 170, 110]);
    expect(result.hex).toBe('#d2aa6e');
  });

  describe('value (lightness > 50 → light)', () => {
    it('classifies a light grey as light', () => {
      expect(classifyColor([200, 200, 200]).classification.value).toBe('light');
    });

    it('classifies a dark grey as dark', () => {
      expect(classifyColor([60, 60, 60]).classification.value).toBe('dark');
    });

    it('treats exactly L=50 as dark (strict >)', () => {
      // [128,127,128] → L ≈ 50; pure mid-grey [127.5] is unreachable in ints,
      // so pin the boundary with a colour whose lightness computes to exactly 50
      expect(classifyColor([127, 128, 127]).classification.value).toBe('dark');
    });
  });

  describe('chroma (saturation > 45 → bright)', () => {
    it('classifies a saturated red as bright', () => {
      expect(classifyColor([220, 40, 40]).classification.chroma).toBe('bright');
    });

    it('classifies a greyish tone as muted', () => {
      expect(classifyColor([140, 120, 110]).classification.chroma).toBe('muted');
    });

    it('classifies pure grey (zero saturation) as muted', () => {
      expect(classifyColor([128, 128, 128]).classification.chroma).toBe('muted');
    });
  });

  describe('hue (warm score vs cool score)', () => {
    it('classifies a golden tone as warm', () => {
      // warmScore = 210*0.5 + 170*0.3 - 110*0.3 = 123, coolScore = 110*0.5 + 45*0.2 = 64
      expect(classifyColor([210, 170, 110]).classification.hue).toBe('warm');
    });

    it('classifies a blue-violet tone as cool', () => {
      // warmScore = 80*0.5 + 60*0.3 - 200*0.3 = -2, coolScore = 200*0.5 + 175*0.2 = 135
      expect(classifyColor([80, 60, 200]).classification.hue).toBe('cool');
    });

    it('classifies pure blue as cool and pure red as warm', () => {
      expect(classifyColor([0, 0, 255]).classification.hue).toBe('cool');
      expect(classifyColor([255, 0, 0]).classification.hue).toBe('warm');
    });
  });
});

describe('classifySkinUndertone', () => {
  it('classifies a golden skin tone as warm', () => {
    // warmth = (200+180)/2 - 140 = 50 > 30, pinkness = 20 → not < 20... use 195
    // warmth = (200+185)/2 - 140 = 52.5, pinkness = 15 < 20
    expect(classifySkinUndertone([200, 185, 140])).toBe('warm');
  });

  it('classifies a pink-cast skin tone as cool via pinkness', () => {
    // pinkness = 230 - 180 = 50 > 25
    expect(classifySkinUndertone([230, 180, 170])).toBe('cool');
  });

  it('classifies a low-warmth skin tone as cool via warmth', () => {
    // warmth = (180+175)/2 - 175 = 2.5 < 10, pinkness = 5
    expect(classifySkinUndertone([180, 175, 175])).toBe('cool');
  });

  it('classifies a balanced skin tone as neutral', () => {
    // warmth = (190+175)/2 - 162 = 20.5 (between 10 and 30), pinkness = 15
    expect(classifySkinUndertone([190, 175, 162])).toBe('neutral');
  });

  describe('boundary semantics', () => {
    it('warmth exactly 30 is not warm (strict >)', () => {
      // warmth = (200+180)/2 - 160 = 30, pinkness = 20 → falls through; warmth ≥ 10 and pinkness ≤ 25 → neutral
      expect(classifySkinUndertone([200, 180, 160])).toBe('neutral');
    });

    it('pinkness exactly 20 is not warm (strict <)', () => {
      // warmth = (210+190)/2 - 160 = 40 > 30, pinkness = 20 → warm branch requires < 20 → neutral
      expect(classifySkinUndertone([210, 190, 160])).toBe('neutral');
    });

    it('warmth exactly 10 is not cool (strict <)', () => {
      // warmth = (180+170)/2 - 165 = 10, pinkness = 10 → neutral
      expect(classifySkinUndertone([180, 170, 165])).toBe('neutral');
    });

    it('pinkness exactly 25 is not cool (strict >)', () => {
      // warmth = (200+175)/2 - 170 = 17.5, pinkness = 25 → neutral
      expect(classifySkinUndertone([200, 175, 170])).toBe('neutral');
    });
  });
});
