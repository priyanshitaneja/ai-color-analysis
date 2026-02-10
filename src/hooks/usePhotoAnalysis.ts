import { useCallback } from 'react';
import { getFaceMesh } from '../analysis/faceDetection';
import { sampleColors } from '../analysis/colorSampling';
import { classifyColor, classifySkinUndertone } from '../analysis/colorClassification';
import { determineSeason } from '../analysis/seasonDetermination';
import type { ColorProfile, SeasonId } from '../types';

interface AnalysisResult {
  profile: ColorProfile;
  seasonId: SeasonId;
}

const ANALYSIS_TIMEOUT_MS = 15_000;

export function usePhotoAnalysis() {
  const analyze = useCallback(
    async (canvas: HTMLCanvasElement): Promise<AnalysisResult> => {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error('Analysis timed out. Please try again.'));
        }, ANALYSIS_TIMEOUT_MS);

        try {
          const faceMesh = getFaceMesh((results) => {
            clearTimeout(timer);

            if (
              !results.multiFaceLandmarks ||
              results.multiFaceLandmarks.length === 0
            ) {
              reject(new Error('No face detected in the captured image.'));
              return;
            }

            const landmarks = results.multiFaceLandmarks[0];
            const colors = sampleColors(landmarks, canvas);

            const skin = classifyColor(colors.skin);
            const eyes = classifyColor(colors.eyes);
            const hair = classifyColor(colors.hair);
            const undertone = classifySkinUndertone(colors.skin);

            const profile: ColorProfile = { skin, eyes, hair, undertone };
            const seasonId = determineSeason(profile);

            resolve({ profile, seasonId });
          });

          faceMesh.send({ image: canvas }).catch((err) => {
            clearTimeout(timer);
            reject(err instanceof Error ? err : new Error('FaceMesh send failed'));
          });
        } catch (err) {
          clearTimeout(timer);
          reject(err instanceof Error ? err : new Error('Analysis failed'));
        }
      });
    },
    []
  );

  return { analyze };
}
