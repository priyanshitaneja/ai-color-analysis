import { FaceMesh } from '@mediapipe/face_mesh';
import type { Results } from '@mediapipe/face_mesh';

let faceMeshInstance: FaceMesh | null = null;

export function getFaceMesh(onResults: (results: Results) => void): FaceMesh {
  if (!faceMeshInstance) {
    faceMeshInstance = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });
    faceMeshInstance.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true, // enables iris landmarks (468-477)
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
  }
  faceMeshInstance.onResults(onResults);
  return faceMeshInstance;
}

export function destroyFaceMesh() {
  if (faceMeshInstance) {
    faceMeshInstance.close();
    faceMeshInstance = null;
  }
}

// Key landmark indices for color sampling
export const LANDMARKS = {
  // Skin sampling points
  leftCheek: 234,
  rightCheek: 454,
  forehead: 10,
  chin: 152,
  noseBridge: 6,

  // Iris landmarks (available with refineLandmarks: true)
  leftIrisCenter: 468,
  leftIris: [468, 469, 470, 471, 472],
  rightIrisCenter: 473,
  rightIris: [473, 474, 475, 476, 477],

  // Eyelid landmarks for eye-open check
  leftEyeUpper: 159,
  leftEyeLower: 145,
  rightEyeUpper: 386,
  rightEyeLower: 374,

  // Nose bridge — glasses frame detection
  noseBridgeTop: 168,
  noseBridgeMid: 6,
  noseBridgeBottom: 197,

  // Eye contour outer points — glasses frame edge detection
  leftEyeOuterCorner: 33,
  leftEyeInnerCorner: 133,
  rightEyeOuterCorner: 263,
  rightEyeInnerCorner: 362,

  // Face boundary for hair sampling
  foreheadTop: 10,

  // Eyebrow landmarks — glasses frame sits between brow and eye
  leftEyebrowLower: 65,
  rightEyebrowLower: 295,
  leftEyebrowInner: 107,
  rightEyebrowInner: 336,

  // Upper eye contour extra points for brow-to-eye gap measurement
  leftEyeTop: 27,
  rightEyeTop: 257,

  // Face angle detection
  noseTip: 1,
  chinBottom: 152,
  leftEar: 234,
  rightEar: 454,
} as const;
