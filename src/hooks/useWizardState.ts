import { useState, useCallback } from 'react';
import type { WizardStep, ColorProfile, SeasonId } from '../types';

interface WizardState {
  step: WizardStep;
  capturedImage: HTMLCanvasElement | null;
  colorProfile: ColorProfile | null;
  seasonId: SeasonId | null;
}

export function useWizardState() {
  const [state, setState] = useState<WizardState>({
    step: 'capture',
    capturedImage: null,
    colorProfile: null,
    seasonId: null,
  });

  const goToProcessing = useCallback((canvas: HTMLCanvasElement) => {
    setState((prev) => ({
      ...prev,
      step: 'processing',
      capturedImage: canvas,
    }));
  }, []);

  const goToConfirm = useCallback(
    (profile: ColorProfile, seasonId: SeasonId) => {
      setState((prev) => ({
        ...prev,
        step: 'confirm',
        colorProfile: profile,
        seasonId,
      }));
    },
    []
  );

  const updateProfile = useCallback(
    (profile: ColorProfile, seasonId: SeasonId) => {
      setState((prev) => ({
        ...prev,
        colorProfile: profile,
        seasonId,
      }));
    },
    []
  );

  const reset = useCallback(() => {
    setState({
      step: 'capture',
      capturedImage: null,
      colorProfile: null,
      seasonId: null,
    });
  }, []);

  return {
    ...state,
    goToProcessing,
    goToConfirm,
    updateProfile,
    reset,
  };
}
