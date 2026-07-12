import { describe, it, expect } from 'vitest';
import { averageRGB, rgbToHex, rgbToHSL } from './colorSampling';

describe('rgbToHex', () => {
  it('converts black and white', () => {
    expect(rgbToHex([0, 0, 0])).toBe('#000000');
    expect(rgbToHex([255, 255, 255])).toBe('#ffffff');
  });

  it('pads single-digit channels', () => {
    expect(rgbToHex([10, 5, 255])).toBe('#0a05ff');
  });
});

describe('rgbToHSL', () => {
  it('converts pure red', () => {
    const [h, s, l] = rgbToHSL([255, 0, 0]);
    expect(h).toBeCloseTo(0);
    expect(s).toBeCloseTo(100);
    expect(l).toBeCloseTo(50);
  });

  it('converts pure green (green-max branch)', () => {
    const [h, s, l] = rgbToHSL([0, 255, 0]);
    expect(h).toBeCloseTo(120);
    expect(s).toBeCloseTo(100);
    expect(l).toBeCloseTo(50);
  });

  it('converts pure blue (blue-max branch)', () => {
    const [h, s, l] = rgbToHSL([0, 0, 255]);
    expect(h).toBeCloseTo(240);
    expect(s).toBeCloseTo(100);
    expect(l).toBeCloseTo(50);
  });

  it('handles the achromatic branch for greys', () => {
    const [h, s, l] = rgbToHSL([128, 128, 128]);
    expect(h).toBe(0);
    expect(s).toBe(0);
    expect(l).toBeCloseTo(50.2, 1);
  });

  it('wraps hue when green < blue with red max', () => {
    // magenta-ish: r max, g < b → hue in the 300° region
    const [h] = rgbToHSL([255, 0, 255]);
    expect(h).toBeCloseTo(300);
  });

  it('converts a known mid colour', () => {
    // #d2aa6e → H≈36, S≈53, L≈63
    const [h, s, l] = rgbToHSL([210, 170, 110]);
    expect(h).toBeCloseTo(36, 0);
    expect(s).toBeCloseTo(52.6, 0);
    expect(l).toBeCloseTo(62.7, 0);
  });
});

describe('averageRGB', () => {
  it('returns black for an empty list', () => {
    expect(averageRGB([])).toEqual([0, 0, 0]);
  });

  it('averages channel-wise', () => {
    expect(
      averageRGB([
        [100, 200, 50],
        [200, 100, 150],
      ])
    ).toEqual([150, 150, 100]);
  });

  it('rounds to the nearest integer', () => {
    expect(
      averageRGB([
        [1, 1, 2],
        [2, 2, 3],
      ])
    ).toEqual([2, 2, 3]);
  });
});
