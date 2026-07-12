/** @vitest-environment jsdom */
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWizardState } from './useWizardState';
import type { ColorProfile, DetectedFeature } from '../types';

const feature: DetectedFeature = {
  rgb: [200, 180, 150],
  hex: '#c8b496',
  classification: { value: 'light', chroma: 'muted', hue: 'warm' },
};

const profile: ColorProfile = {
  skin: feature,
  eyes: feature,
  hair: feature,
  undertone: 'warm',
};

const canvas = {} as HTMLCanvasElement;

describe('useWizardState', () => {
  it('starts at the capture step with empty state', () => {
    const { result } = renderHook(() => useWizardState());
    expect(result.current.step).toBe('capture');
    expect(result.current.capturedImage).toBeNull();
    expect(result.current.colorProfile).toBeNull();
    expect(result.current.seasonId).toBeNull();
  });

  it('moves to processing with the captured canvas', () => {
    const { result } = renderHook(() => useWizardState());
    act(() => result.current.goToProcessing(canvas));
    expect(result.current.step).toBe('processing');
    expect(result.current.capturedImage).toBe(canvas);
  });

  it('moves to confirm with profile and season', () => {
    const { result } = renderHook(() => useWizardState());
    act(() => result.current.goToProcessing(canvas));
    act(() => result.current.goToConfirm(profile, 'light-spring'));
    expect(result.current.step).toBe('confirm');
    expect(result.current.colorProfile).toBe(profile);
    expect(result.current.seasonId).toBe('light-spring');
    expect(result.current.capturedImage).toBe(canvas);
  });

  it('updates profile without changing the step', () => {
    const { result } = renderHook(() => useWizardState());
    act(() => result.current.goToConfirm(profile, 'light-spring'));
    const updated: ColorProfile = { ...profile, undertone: 'cool' };
    act(() => result.current.updateProfile(updated, 'light-summer'));
    expect(result.current.step).toBe('confirm');
    expect(result.current.colorProfile).toBe(updated);
    expect(result.current.seasonId).toBe('light-summer');
  });

  it('resets back to the initial state', () => {
    const { result } = renderHook(() => useWizardState());
    act(() => result.current.goToProcessing(canvas));
    act(() => result.current.goToConfirm(profile, 'light-spring'));
    act(() => result.current.reset());
    expect(result.current.step).toBe('capture');
    expect(result.current.capturedImage).toBeNull();
    expect(result.current.colorProfile).toBeNull();
    expect(result.current.seasonId).toBeNull();
  });
});
