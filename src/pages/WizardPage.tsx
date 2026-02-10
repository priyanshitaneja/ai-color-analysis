import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { StepIndicator } from '../components/wizard/StepIndicator';
import { CameraCapture } from '../components/wizard/CameraCapture';
import { AnalysisProcessing } from '../components/wizard/AnalysisProcessing';
import { FeatureConfirm } from '../components/wizard/FeatureConfirm';
import { useWizardState } from '../hooks/useWizardState';
import { destroyFaceMesh } from '../analysis/faceDetection';

export function WizardPage() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const {
    step,
    capturedImage,
    colorProfile,
    seasonId,
    goToProcessing,
    goToConfirm,
    updateProfile,
    reset,
  } = useWizardState();

  const [error, setError] = useState<string | null>(null);

  // Clean up FaceMesh when leaving the wizard entirely
  useEffect(() => {
    return () => destroyFaceMesh();
  }, []);

  const handleCapture = useCallback(
    (canvas: HTMLCanvasElement) => {
      setError(null);
      goToProcessing(canvas);
    },
    [goToProcessing]
  );

  const handleError = useCallback((msg: string) => {
    setError(msg);
  }, []);

  const stepTitles = {
    capture: { title: 'Take a Photo', subtitle: 'Position your face in the guide for accurate analysis' },
    processing: { title: 'Analyzing', subtitle: 'Our AI is reading your unique color signature' },
    confirm: { title: 'Review Results', subtitle: 'Confirm your detected features before we find your palette' },
  };

  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 } as const,
        animate: { opacity: 1, y: 0 } as const,
        exit: { opacity: 0, y: -20 } as const,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
      };

  return (
    <main className="min-h-screen bg-gradient-to-b from-surface via-surface to-gray-100 relative overflow-hidden">
      {/* Subtle gradient mesh background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-pink-200/20 to-purple-200/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-blue-200/20 to-cyan-200/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-100/10 to-pink-100/10 blur-3xl" />
      </div>

      {/* Top nav */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex items-center justify-between">
          <motion.button
            onClick={() => step === 'capture' ? navigate('/') : reset()}
            className="glass squircle-lg px-4 sm:px-5 py-2.5 text-sm font-medium hover:bg-white/80 transition-all
              flex items-center gap-2 cursor-pointer
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            aria-label={step === 'capture' ? 'Go back to home page' : 'Retake photo'}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {step === 'capture' ? 'Home' : 'Retake'}
          </motion.button>

          <StepIndicator currentStep={step} />

          <div className="w-16 sm:w-20" /> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Step title */}
      <div className="relative z-10 text-center mt-6 mb-4 px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-gray-700">
              {stepTitles[step].title}
            </h1>
            <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-md mx-auto">
              {stepTitles[step].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Error toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="relative z-10 mx-auto max-w-md px-4 sm:px-6 mb-6"
            role="alert"
            initial={prefersReducedMotion ? false : { opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10, scale: 0.95 }}
          >
            <div className="glass squircle-lg p-4 border border-red-200/50 bg-red-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <span className="text-red-500 text-sm">!</span>
                </div>
                <p className="text-red-700 text-sm flex-1">{error}</p>
              </div>
              <button
                onClick={reset}
                className="mt-3 w-full py-2 rounded-xl bg-red-100 text-red-600 text-sm font-medium
                  hover:bg-red-200 transition-colors cursor-pointer
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              >
                Try again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step content */}
      <div className="relative z-10 px-4 sm:px-6 pb-20 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'capture' && (
            <motion.div
              key="capture"
              className="flex justify-center"
              {...motionProps}
            >
              <CameraCapture onCapture={handleCapture} />
            </motion.div>
          )}

          {step === 'processing' && capturedImage && (
            <motion.div
              key="processing"
              {...motionProps}
            >
              <AnalysisProcessing
                canvas={capturedImage}
                onComplete={goToConfirm}
                onError={handleError}
              />
            </motion.div>
          )}

          {step === 'confirm' && colorProfile && seasonId && (
            <motion.div
              key="confirm"
              {...motionProps}
            >
              <FeatureConfirm
                profile={colorProfile}
                seasonId={seasonId}
                onAdjust={updateProfile}
                onRetake={reset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
