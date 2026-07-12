/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { Results } from '@mediapipe/face_mesh';
import { usePhotoAnalysis } from './usePhotoAnalysis';
import { getFaceMesh } from '../analysis/faceDetection';

vi.mock('../analysis/faceDetection', () => ({
  getFaceMesh: vi.fn(),
  LANDMARKS: {},
}));

vi.mock('../analysis/colorSampling', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../analysis/colorSampling')>();
  return {
    ...actual,
    sampleColors: vi.fn(() => ({
      skin: [210, 180, 150] as [number, number, number],
      eyes: [90, 70, 50] as [number, number, number],
      hair: [60, 45, 30] as [number, number, number],
    })),
  };
});

const mockedGetFaceMesh = vi.mocked(getFaceMesh);
const canvas = {} as HTMLCanvasElement;

function stubFaceMesh(behavior: {
  results?: Partial<Results>;
  sendError?: Error;
  never?: boolean;
}) {
  let onResults: ((results: Results) => void) | undefined;
  mockedGetFaceMesh.mockImplementation((cb) => {
    onResults = cb;
    return {
      send: vi.fn(async () => {
        if (behavior.sendError) throw behavior.sendError;
        if (!behavior.never) onResults?.(behavior.results as Results);
      }),
    } as unknown as ReturnType<typeof getFaceMesh>;
  });
}

describe('usePhotoAnalysis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('resolves with a profile and season when a face is found', async () => {
    stubFaceMesh({
      results: { multiFaceLandmarks: [[]] } as unknown as Results,
    });
    const { result } = renderHook(() => usePhotoAnalysis());
    const analysis = await result.current.analyze(canvas);

    expect(analysis.profile.skin.rgb).toEqual([210, 180, 150]);
    expect(analysis.profile.undertone).toBeDefined();
    expect(analysis.seasonId).toBeTruthy();
  });

  it('rejects when no face is detected', async () => {
    stubFaceMesh({
      results: { multiFaceLandmarks: [] } as unknown as Results,
    });
    const { result } = renderHook(() => usePhotoAnalysis());
    await expect(result.current.analyze(canvas)).rejects.toThrow(
      'No face detected in the captured image.'
    );
  });

  it('rejects after the 15s timeout when results never arrive', async () => {
    vi.useFakeTimers();
    stubFaceMesh({ never: true });
    const { result } = renderHook(() => usePhotoAnalysis());

    const pending = result.current.analyze(canvas);
    const assertion = expect(pending).rejects.toThrow('Analysis timed out. Please try again.');
    await vi.advanceTimersByTimeAsync(15_000);
    await assertion;
  });

  it('propagates a send failure', async () => {
    stubFaceMesh({ sendError: new Error('wasm blew up') });
    const { result } = renderHook(() => usePhotoAnalysis());
    await expect(result.current.analyze(canvas)).rejects.toThrow('wasm blew up');
  });
});
