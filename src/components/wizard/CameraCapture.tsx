import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getFaceMesh } from '../../analysis/faceDetection';
import { validateFrame, allChecksPass } from '../../analysis/realtimeValidation';
import { FaceGuideOverlay } from './FaceGuideOverlay';
import { ValidationChecks } from './ValidationChecks';
import type { ValidationState } from '../../types';

interface Props {
  onCapture: (canvas: HTMLCanvasElement) => void;
}

const INITIAL_VALIDATION: ValidationState = {
  faceDetected: false,
  faceCentered: false,
  rightDistance: false,
  eyesVisible: false,
  faceStraight: false,
  goodLighting: false,
  evenLighting: false,
};

export function CameraCapture({ onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();

  const [validation, setValidation] = useState<ValidationState>(INITIAL_VALIDATION);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const ready = allChecksPass(validation);

  const startCamera = useCallback(async (signal: AbortSignal) => {
    // Skip if already have an active stream
    if (streamRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      // StrictMode guard: if effect was cleaned up while awaiting, stop the stream
      if (signal.aborted) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraReady(true);
      }
    } catch {
      if (!signal.aborted) {
        setCameraError(
          'Camera access denied. Please allow camera access in your browser settings.'
        );
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    startCamera(controller.signal);
    return () => {
      controller.abort();
      stopCamera();
    };
  }, [startCamera, stopCamera, retryCount]);

  useEffect(() => {
    if (!cameraReady || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let processing = false;

    const faceMesh = getFaceMesh((results) => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const state = validateFrame(results, canvas);
      setValidation(state);
      processing = false;
    });

    const processFrame = () => {
      if (!processing && video.readyState >= 2) {
        processing = true;
        faceMesh.send({ image: video });
      }
      animFrameRef.current = requestAnimationFrame(processFrame);
    };

    processFrame();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [cameraReady]);

  const handleCapture = () => {
    if (!ready || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    stopCamera();
    onCapture(canvas);
  };

  if (cameraError) {
    return (
      <motion.div
        className="squircle-lg border border-gray-200 p-8 sm:p-12 max-w-sm text-center"
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        role="alert"
      >
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.5">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
            <line x1="4" y1="4" x2="20" y2="20" strokeLinecap="round" />
          </svg>
        </div>  
        <h2 className="mt-5 text-lg font-semibold text-gray-800">Camera Access Required</h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          {cameraError}
        </p>
        <motion.button
          onClick={() => { setCameraError(null); setRetryCount((c) => c + 1); }}
          className="mt-6 px-8 py-3 bg-accent text-white rounded-full text-sm font-medium cursor-pointer
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
        >
          Grant Access
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 w-full max-w-4xl mx-auto">
      {/* Camera viewport */}
      <motion.div
        className="relative bg-black overflow-hidden shadow-2xl flex-shrink-0 w-full max-w-[420px] max-h-[80vh] border border-white/10"
        style={{
          aspectRatio: '3/4',
          borderRadius: 32,
        }}
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        role="img"
        aria-label="Camera viewfinder with face guide overlay"
      >
        {/* Camera loading state */}
        {!cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <motion.div
              className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full"
              animate={prefersReducedMotion ? {} : { rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              role="status"
              aria-label="Loading camera"
            />
          </div>
        )}

        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          style={{ transform: 'scaleX(-1)' }}
          aria-hidden="true"
        />
        <canvas ref={canvasRef} className="hidden" />

        <FaceGuideOverlay allPassed={ready} />

        {/* Bottom controls area */}
        <div className="absolute bottom-0 left-0 right-0 pb-4 sm:pb-6 pt-10 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex justify-center">
            <motion.button
              onClick={handleCapture}
              disabled={!ready}
              className="relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-full"
              style={{ width: 80, height: 80 }}
              whileTap={ready && !prefersReducedMotion ? { scale: 0.9 } : {}}
              aria-label="Capture photo"
              aria-disabled={!ready}
            >
              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-[3px]"
                style={{
                  borderColor: ready ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)',
                }}
                animate={
                  ready && !prefersReducedMotion
                    ? {
                        boxShadow: [
                          '0 0 0px rgba(34,197,94,0)',
                          '0 0 25px rgba(34,197,94,0.5)',
                          '0 0 0px rgba(34,197,94,0)',
                        ],
                        borderColor: ['rgba(255,255,255,0.9)', 'rgba(74,222,128,0.9)', 'rgba(255,255,255,0.9)'],
                      }
                    : {}
                }
                transition={{ duration: 2, repeat: Infinity }}
                aria-hidden="true"
              />
              {/* Inner circle */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  top: 6,
                  left: 6,
                  right: 6,
                  bottom: 6,
                  backgroundColor: ready ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
                }}
                animate={ready && !prefersReducedMotion ? { scale: [1, 0.95, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                aria-hidden="true"
              />
            </motion.button>
          </div>
        </div>

        {/* Tips strip at top */}
        <div className="absolute top-0 left-0 right-0 pt-3 sm:pt-4 pb-8 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex justify-center gap-2 sm:gap-3 px-3 sm:px-4">
            {['No filters', 'Good light', 'Hair visible'].map((tip) => (
              <span
                key={tip}
                className="text-[10px] sm:text-xs text-white/70 bg-white/10 px-2.5 sm:px-3 py-1 rounded-full backdrop-blur-sm"
              >
                {tip}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Validation panel */}
      <motion.div
        className="w-full lg:w-auto"
        initial={prefersReducedMotion ? false : { opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <ValidationChecks validation={validation} />
      </motion.div>
    </div>
  );
}
