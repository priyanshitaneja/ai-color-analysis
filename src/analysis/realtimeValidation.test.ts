import { describe, it, expect } from 'vitest';
import type { NormalizedLandmark, Results } from '@mediapipe/face_mesh';
import {
  allChecksPass,
  estimateFaceSize,
  getEyelidDistance,
  validateFrame,
} from './realtimeValidation';
import { LANDMARKS } from './faceDetection';
import type { ValidationState } from '../types';

function landmark(x: number, y: number): NormalizedLandmark {
  return { x, y, z: 0, visibility: 1 };
}

const ALL_TRUE: ValidationState = {
  faceDetected: true,
  faceCentered: true,
  rightDistance: true,
  eyesVisible: true,
  faceStraight: true,
  goodLighting: true,
  evenLighting: true,
};

const ALL_FALSE: ValidationState = {
  faceDetected: false,
  faceCentered: false,
  rightDistance: false,
  eyesVisible: false,
  faceStraight: false,
  goodLighting: false,
  evenLighting: false,
};

describe('allChecksPass', () => {
  it('passes when every check is true', () => {
    expect(allChecksPass(ALL_TRUE)).toBe(true);
  });

  it.each(Object.keys(ALL_TRUE) as (keyof ValidationState)[])(
    'fails when %s is false',
    (key) => {
      expect(allChecksPass({ ...ALL_TRUE, [key]: false })).toBe(false);
    }
  );
});

describe('estimateFaceSize', () => {
  function landmarksWith(points: Partial<Record<number, NormalizedLandmark>>) {
    const arr: NormalizedLandmark[] = Array.from({ length: 478 }, () => landmark(0.5, 0.5));
    for (const [i, lm] of Object.entries(points)) arr[Number(i)] = lm!;
    return arr;
  }

  it('returns face height when taller than wide', () => {
    const lms = landmarksWith({
      [LANDMARKS.foreheadTop]: landmark(0.5, 0.3),
      [LANDMARKS.chinBottom]: landmark(0.5, 0.7),
      [LANDMARKS.leftEar]: landmark(0.4, 0.5),
      [LANDMARKS.rightEar]: landmark(0.6, 0.5),
    });
    // note: chinBottom (152) and leftEar (234) share indices with chin/leftCheek
    expect(estimateFaceSize(lms)).toBeCloseTo(0.4);
  });

  it('returns face width when wider than tall', () => {
    const lms = landmarksWith({
      [LANDMARKS.foreheadTop]: landmark(0.5, 0.45),
      [LANDMARKS.chinBottom]: landmark(0.5, 0.55),
      [LANDMARKS.leftEar]: landmark(0.2, 0.5),
      [LANDMARKS.rightEar]: landmark(0.8, 0.5),
    });
    expect(estimateFaceSize(lms)).toBeCloseTo(0.6);
  });
});

describe('getEyelidDistance', () => {
  it('measures vertical distance between eyelids', () => {
    expect(getEyelidDistance(landmark(0.5, 0.4), landmark(0.5, 0.42))).toBeCloseTo(0.02);
  });

  it('is symmetric', () => {
    expect(getEyelidDistance(landmark(0.5, 0.42), landmark(0.5, 0.4))).toBeCloseTo(0.02);
  });
});

describe('validateFrame early exits', () => {
  const dummyCanvas = {} as HTMLCanvasElement;

  it('returns all-false when no face is detected', () => {
    const results = { multiFaceLandmarks: [] } as unknown as Results;
    expect(validateFrame(results, dummyCanvas)).toEqual(ALL_FALSE);
  });

  it('returns all-false when landmarks are missing', () => {
    const results = {} as Results;
    expect(validateFrame(results, dummyCanvas)).toEqual(ALL_FALSE);
  });

  it('returns all-false when more than one face is detected', () => {
    const face: NormalizedLandmark[] = [];
    const results = { multiFaceLandmarks: [face, face] } as unknown as Results;
    expect(validateFrame(results, dummyCanvas)).toEqual(ALL_FALSE);
  });
});
