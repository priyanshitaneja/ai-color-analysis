import { describe, it, expect } from 'vitest';
import { colorFromTitle, resolveItemColor } from './itemColor';
import { COLOR_NAMES } from './colorNames';

describe('colorFromTitle', () => {
  it('finds a simple color word', () => {
    expect(colorFromTitle('Men Slim Fit Green Shirt')?.name).toBe('green');
  });

  it('prefers the longest matching phrase', () => {
    expect(colorFromTitle('Women Navy Blue Kurta')?.name).toBe('navy blue');
    expect(colorFromTitle('Dusty Rose Wrap Dress')?.name).toBe('dusty rose');
  });

  it('is case-insensitive', () => {
    expect(colorFromTitle('MUSTARD Printed T-Shirt')?.name).toBe('mustard');
  });

  it('requires word boundaries', () => {
    // "tan" inside "standard" must not match
    expect(colorFromTitle('Standard Fit Trousers')).toBeNull();
  });

  it('returns null when no color word is present', () => {
    expect(colorFromTitle('Men Slim Fit Casual Shirt')).toBeNull();
  });

  it('maps every lexicon entry to a valid hex', () => {
    for (const hex of Object.values(COLOR_NAMES)) {
      expect(hex).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});

describe('resolveItemColor', () => {
  it('prefers the title color over the image color', () => {
    const resolved = resolveItemColor('Navy Blue Shirt', [200, 50, 50]);
    expect(resolved).toEqual({ rgb: [0, 0, 128], source: 'title' });
  });

  it('falls back to the image color when the title has no color word', () => {
    const resolved = resolveItemColor('Slim Fit Shirt', [200, 50, 50]);
    expect(resolved).toEqual({ rgb: [200, 50, 50], source: 'image' });
  });

  it('handles a null title', () => {
    expect(resolveItemColor(null, [10, 20, 30])).toEqual({
      rgb: [10, 20, 30],
      source: 'image',
    });
  });

  it('returns null when neither source yields a color', () => {
    expect(resolveItemColor('Slim Fit Shirt', null)).toBeNull();
    expect(resolveItemColor(null, null)).toBeNull();
  });
});
