import type { DetectedFeature } from '../types';
import { rgbToHex, rgbToHSL } from './colorSampling';

export function classifyColor(rgb: [number, number, number]): DetectedFeature {
  const [h, s, l] = rgbToHSL(rgb);

  return {
    rgb,
    hex: rgbToHex(rgb),
    classification: {
      value: classifyValue(l),
      chroma: classifyChroma(s),
      hue: classifyHue(h, rgb),
    },
  };
}

function classifyValue(lightness: number): 'light' | 'dark' {
  // Lightness on 0-100 scale
  return lightness > 50 ? 'light' : 'dark';
}

function classifyChroma(saturation: number): 'muted' | 'bright' {
  // Saturation on 0-100 scale
  return saturation > 45 ? 'bright' : 'muted';
}

function classifyHue(_hue: number, rgb: [number, number, number]): 'warm' | 'cool' {
  // For skin tones, we use a special warm/cool check based on
  // the yellow-blue axis rather than the standard hue wheel
  const [r, g, b] = rgb;

  // Warm indicator: more red+yellow (r > b, golden tones)
  // Cool indicator: more blue+pink (b > average of r,g)
  const warmScore = r * 0.5 + g * 0.3 - b * 0.3;
  const coolScore = b * 0.5 + (255 - r) * 0.2;

  if (warmScore > coolScore) return 'warm';
  return 'cool';
}

export function classifySkinUndertone(
  skinRGB: [number, number, number]
): 'warm' | 'cool' | 'neutral' {
  const [r, g, b] = skinRGB;

  // Analyze the undertone by looking at the ratio of warm to cool tones
  // Warm: golden/yellow base → higher red and green relative to blue
  // Cool: pink/blue base → higher blue relative to green, or pink cast
  // Neutral: balanced

  const warmth = (r + g) / 2 - b;
  const pinkness = r - g;

  if (warmth > 30 && pinkness < 20) {
    return 'warm'; // Golden/yellow undertone
  } else if (warmth < 10 || pinkness > 25) {
    return 'cool'; // Pink/blue undertone
  } else {
    return 'neutral';
  }
}
