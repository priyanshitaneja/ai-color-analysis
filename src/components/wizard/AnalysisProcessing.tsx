import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { usePhotoAnalysis } from '../../hooks/usePhotoAnalysis';
import type { ColorProfile, SeasonId } from '../../types';

interface Props {
  canvas: HTMLCanvasElement;
  onComplete: (profile: ColorProfile, seasonId: SeasonId) => void;
  onError: (error: string) => void;
}

const ANALYSIS_STEPS = [
  { label: 'Detecting facial features', icon: '👤' },
  { label: 'Sampling skin tone', icon: '🎨' },
  { label: 'Analyzing eye color', icon: '👁' },
  { label: 'Detecting hair color', icon: '✂' },
  { label: 'Determining your season', icon: '✨' },
];

export function AnalysisProcessing({ canvas, onComplete, onError }: Props) {
  const { analyze } = usePhotoAnalysis();
  const [activeStep, setActiveStep] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => Math.min(prev + 1, ANALYSIS_STEPS.length - 1));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const result = await analyze(canvas);
        if (!cancelled) {
          setTimeout(() => {
            if (!cancelled) {
              onComplete(result.profile, result.seasonId);
            }
          }, 2000);
        }
      } catch (err) {
        if (!cancelled) {
          onError(err instanceof Error ? err.message : 'Analysis failed');
        }
      }
    };

    run();
    return () => { cancelled = true; };
  }, [canvas, analyze, onComplete, onError]);

  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto px-4 sm:px-0">
      {/* Animated color ring */}
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-4 sm:mb-6" aria-hidden="true">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, #FF6F61, #6B5B95, #88B04B, #F7CAC9, #92A8D1, #E8B4B8, #FF6F61)',
          }}
          animate={prefersReducedMotion ? {} : { rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-2 rounded-full bg-surface" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-3xl"
            animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {ANALYSIS_STEPS[activeStep]?.icon}
          </motion.span>
        </div>
      </div>

      {/* Steps checklist */}
      <div className="squircle-lg border border-gray-200 p-4 sm:p-6 w-full" role="status" aria-live="assertive" aria-label="Analysis progress">
        <div className="space-y-3">
          {ANALYSIS_STEPS.map((step, i) => {
            const isActive = i === activeStep;
            const isDone = i < activeStep;

            return (
              <motion.div
                key={step.label}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isDone ? 'bg-green-50/80' : isActive ? 'bg-blue-50/80' : ''
                }`}
                initial={prefersReducedMotion ? false : { opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15, duration: 0.3 }}
              >
                <motion.div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all duration-300 ${
                    isDone
                      ? 'bg-green-500 text-white'
                      : isActive
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                  }`}
                  aria-hidden="true"
                >
                  {isDone ? (
                    '✓'
                  ) : isActive ? (
                    <motion.div
                      className="w-2.5 h-2.5 bg-white rounded-full"
                      animate={prefersReducedMotion ? {} : { scale: [1, 0.5, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  ) : (
                    ''
                  )}
                </motion.div>

                <span
                  className={`text-sm transition-colors duration-300 ${
                    isDone
                      ? 'text-green-700 font-medium'
                      : isActive
                        ? 'text-blue-700 font-medium'
                        : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>

                {isActive && !prefersReducedMotion && (
                  <motion.div
                    className="ml-auto flex gap-0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    aria-hidden="true"
                  >
                    {[0, 1, 2].map((dot) => (
                      <motion.div
                        key={dot}
                        className="w-1 h-1 rounded-full bg-blue-400"
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1, repeat: Infinity, delay: dot * 0.2 }}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
