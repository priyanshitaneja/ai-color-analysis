import { describe, it, expect } from 'vitest';
import { dominantFromPixels } from './dominantColor';

function pixels(colors: Array<[number, number, number, number, number]>): Uint8ClampedArray {
  // each entry: [r, g, b, a, count]
  const total = colors.reduce((n, [, , , , count]) => n + count, 0);
  const data = new Uint8ClampedArray(total * 4);
  let i = 0;
  for (const [r, g, b, a, count] of colors) {
    for (let k = 0; k < count; k++) {
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = a;
      i += 4;
    }
  }
  return data;
}

describe('dominantFromPixels', () => {
  it('finds the modal color in a white-background swatch', () => {
    const data = pixels([
      [255, 255, 255, 255, 80], // background, skipped
      [200, 40, 40, 255, 20], // red garment block
    ]);
    expect(dominantFromPixels(data)).toEqual([200, 40, 40]);
  });

  it('returns null when nearly everything is background', () => {
    const data = pixels([
      [255, 255, 255, 255, 98],
      [200, 40, 40, 255, 2],
    ]);
    expect(dominantFromPixels(data)).toBeNull();
  });

  it('returns null for an empty array', () => {
    expect(dominantFromPixels(new Uint8ClampedArray(0))).toBeNull();
  });

  it('ignores transparent pixels', () => {
    const data = pixels([
      [10, 200, 10, 0, 50], // transparent, skipped
      [40, 40, 200, 255, 50],
    ]);
    expect(dominantFromPixels(data)).toEqual([40, 40, 200]);
  });

  it('picks the modal bucket over scattered noise', () => {
    const data = pixels([
      [60, 120, 180, 255, 40],
      [61, 121, 181, 255, 40], // same bucket as above
      [250, 10, 10, 255, 15],
      [10, 250, 10, 255, 5],
    ]);
    expect(dominantFromPixels(data)).toEqual([61, 121, 181]);
  });

  it('averages within the modal bucket', () => {
    const data = pixels([
      [64, 64, 64, 255, 1],
      [79, 79, 79, 255, 1], // same 4-bit bucket (64-79)
    ]);
    expect(dominantFromPixels(data)).toEqual([72, 72, 72]);
  });
});
