import type { NormalizedLandmark } from '@mediapipe/face_mesh';
import { LANDMARKS } from './faceDetection';

interface SampledColors {
  skin: [number, number, number];
  eyes: [number, number, number];
  hair: [number, number, number];
}

export function sampleColors(
  landmarks: NormalizedLandmark[],
  canvas: HTMLCanvasElement
): SampledColors {
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;

  // Sample skin from cheeks and forehead
  const skinSamples = [
    sampleRegion(ctx, landmarks[LANDMARKS.leftCheek], w, h, 8),
    sampleRegion(ctx, landmarks[LANDMARKS.rightCheek], w, h, 8),
    sampleRegion(ctx, landmarks[LANDMARKS.forehead], w, h, 8),
  ];
  const skin = averageRGB(skinSamples);

  // Sample eye color from iris centers
  const eyeSamples = [
    sampleRegion(ctx, landmarks[LANDMARKS.leftIrisCenter], w, h, 3),
    sampleRegion(ctx, landmarks[LANDMARKS.rightIrisCenter], w, h, 3),
  ];
  const eyes = averageRGB(eyeSamples);

  // Sample hair from above forehead
  const foreheadPoint = landmarks[LANDMARKS.foreheadTop];
  // Sample multiple points above forehead for better accuracy
  const hairSamples: [number, number, number][] = [];
  for (let offset = 0.04; offset <= 0.12; offset += 0.02) {
    const point: NormalizedLandmark = {
      x: foreheadPoint.x,
      y: Math.max(0, foreheadPoint.y - offset),
      z: foreheadPoint.z,
      visibility: foreheadPoint.visibility,
    };
    hairSamples.push(sampleRegion(ctx, point, w, h, 6));
  }
  // Also sample slightly left and right of center
  for (const xOffset of [-0.05, 0.05]) {
    const point: NormalizedLandmark = {
      x: foreheadPoint.x + xOffset,
      y: Math.max(0, foreheadPoint.y - 0.08),
      z: foreheadPoint.z,
      visibility: foreheadPoint.visibility,
    };
    hairSamples.push(sampleRegion(ctx, point, w, h, 6));
  }
  const hair = averageRGB(hairSamples);

  return { skin, eyes, hair };
}

function sampleRegion(
  ctx: CanvasRenderingContext2D,
  point: NormalizedLandmark,
  canvasWidth: number,
  canvasHeight: number,
  radius: number
): [number, number, number] {
  const cx = Math.round(point.x * canvasWidth);
  const cy = Math.round(point.y * canvasHeight);

  let totalR = 0, totalG = 0, totalB = 0;
  let count = 0;

  // Sample a square region and average
  const startX = Math.max(0, cx - radius);
  const endX = Math.min(canvasWidth - 1, cx + radius);
  const startY = Math.max(0, cy - radius);
  const endY = Math.min(canvasHeight - 1, cy + radius);

  const imageData = ctx.getImageData(
    startX, startY,
    endX - startX + 1, endY - startY + 1
  );

  for (let i = 0; i < imageData.data.length; i += 4) {
    totalR += imageData.data[i];
    totalG += imageData.data[i + 1];
    totalB += imageData.data[i + 2];
    count++;
  }

  return count > 0
    ? [Math.round(totalR / count), Math.round(totalG / count), Math.round(totalB / count)]
    : [0, 0, 0];
}

function averageRGB(samples: [number, number, number][]): [number, number, number] {
  if (samples.length === 0) return [0, 0, 0];

  const sum = samples.reduce(
    (acc, [r, g, b]) => [acc[0] + r, acc[1] + g, acc[2] + b],
    [0, 0, 0]
  );

  return [
    Math.round(sum[0] / samples.length),
    Math.round(sum[1] / samples.length),
    Math.round(sum[2] / samples.length),
  ];
}

export function rgbToHex(rgb: [number, number, number]): string {
  return '#' + rgb.map((c) => c.toString(16).padStart(2, '0')).join('');
}

export function rgbToHSL(rgb: [number, number, number]): [number, number, number] {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return [0, 0, l * 100];
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h: number;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    default:
      h = ((r - g) / d + 4) / 6;
      break;
  }

  return [h * 360, s * 100, l * 100];
}
