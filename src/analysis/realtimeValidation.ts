import type { Results, NormalizedLandmark } from '@mediapipe/face_mesh';
import { LANDMARKS } from './faceDetection';
import type { ValidationState } from '../types';

const FACE_CENTER_TOLERANCE = 0.15; // 15% from center
const MIN_FACE_SIZE = 0.2;          // face must be at least 20% of frame
const MAX_FACE_SIZE = 0.45;         // face must be at most 45% of frame (prevent zoomed-in shots)
const EYE_OPEN_THRESHOLD = 0.015;   // min distance between upper/lower eyelid
const FACE_TILT_THRESHOLD = 0.08;   // max nose-to-midpoint offset
const MIN_BRIGHTNESS = 60;          // min average luminance (0-255)
const MAX_BRIGHTNESS = 220;         // max average luminance
const LIGHTING_BALANCE_THRESHOLD = 30; // max L/R cheek luminance difference

export function validateFrame(
  results: Results,
  canvas: HTMLCanvasElement
): ValidationState {
  const state: ValidationState = {
    faceDetected: false,
    faceCentered: false,
    rightDistance: false,
    eyesVisible: false,
    faceStraight: false,
    goodLighting: false,
    evenLighting: false,
  };

  if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
    return state;
  }

  // Only process if exactly 1 face
  if (results.multiFaceLandmarks.length !== 1) {
    return state;
  }

  const landmarks = results.multiFaceLandmarks[0];
  state.faceDetected = true;

  // Check face centered
  const noseTip = landmarks[LANDMARKS.noseTip];
  const centerOffsetX = Math.abs(noseTip.x - 0.5);
  const centerOffsetY = Math.abs(noseTip.y - 0.5);
  state.faceCentered =
    centerOffsetX < FACE_CENTER_TOLERANCE &&
    centerOffsetY < FACE_CENTER_TOLERANCE;

  // Check face distance (size)
  const faceSize = estimateFaceSize(landmarks);
  state.rightDistance = faceSize > MIN_FACE_SIZE && faceSize < MAX_FACE_SIZE;

  // Check eyes visible and open
  const leftEyeOpen = getEyelidDistance(
    landmarks[LANDMARKS.leftEyeUpper],
    landmarks[LANDMARKS.leftEyeLower]
  );
  const rightEyeOpen = getEyelidDistance(
    landmarks[LANDMARKS.rightEyeUpper],
    landmarks[LANDMARKS.rightEyeLower]
  );
  const hasIrisLandmarks =
    landmarks.length > 477 &&
    landmarks[LANDMARKS.leftIrisCenter] != null &&
    landmarks[LANDMARKS.rightIrisCenter] != null;

  state.eyesVisible =
    leftEyeOpen > EYE_OPEN_THRESHOLD &&
    rightEyeOpen > EYE_OPEN_THRESHOLD &&
    hasIrisLandmarks;

  // Check face straight-on
  const leftEar = landmarks[LANDMARKS.leftEar];
  const rightEar = landmarks[LANDMARKS.rightEar];
  const midpointX = (leftEar.x + rightEar.x) / 2;
  const noseOffset = Math.abs(noseTip.x - midpointX);
  state.faceStraight = noseOffset < FACE_TILT_THRESHOLD;

  // Pixel-based checks (glasses detection + lighting)
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const leftCheek = landmarks[LANDMARKS.leftCheek];
    const rightCheek = landmarks[LANDMARKS.rightCheek];
    const forehead = landmarks[LANDMARKS.forehead];

    const leftLum = sampleLuminance(ctx, leftCheek, canvas.width, canvas.height);
    const rightLum = sampleLuminance(ctx, rightCheek, canvas.width, canvas.height);
    const foreheadLum = sampleLuminance(ctx, forehead, canvas.width, canvas.height);
    const avgLuminance = (leftLum + rightLum + foreheadLum) / 3;

    state.goodLighting =
      avgLuminance > MIN_BRIGHTNESS && avgLuminance < MAX_BRIGHTNESS;

    state.evenLighting =
      Math.abs(leftLum - rightLum) < LIGHTING_BALANCE_THRESHOLD;
  }

  return state;
}

export function allChecksPass(state: ValidationState): boolean {
  return Object.values(state).every(Boolean);
}

export function estimateFaceSize(landmarks: NormalizedLandmark[]): number {
  const forehead = landmarks[LANDMARKS.foreheadTop];
  const chin = landmarks[LANDMARKS.chinBottom];
  const leftEar = landmarks[LANDMARKS.leftEar];
  const rightEar = landmarks[LANDMARKS.rightEar];

  const height = Math.abs(chin.y - forehead.y);
  const width = Math.abs(rightEar.x - leftEar.x);
  return Math.max(height, width);
}

export function getEyelidDistance(
  upper: NormalizedLandmark,
  lower: NormalizedLandmark
): number {
  return Math.abs(upper.y - lower.y);
}

function sampleLuminance(
  ctx: CanvasRenderingContext2D,
  point: NormalizedLandmark,
  canvasWidth: number,
  canvasHeight: number
): number {
  const x = Math.round(point.x * canvasWidth);
  const y = Math.round(point.y * canvasHeight);
  const radius = 5;

  let totalLuminance = 0;
  let count = 0;

  for (let dx = -radius; dx <= radius; dx++) {
    for (let dy = -radius; dy <= radius; dy++) {
      const px = x + dx;
      const py = y + dy;
      if (px >= 0 && px < canvasWidth && py >= 0 && py < canvasHeight) {
        const pixel = ctx.getImageData(px, py, 1, 1).data;
        // Relative luminance formula
        totalLuminance += 0.299 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2];
        count++;
      }
    }
  }

  return count > 0 ? totalLuminance / count : 0;
}
