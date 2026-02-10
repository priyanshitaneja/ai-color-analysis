import { motion, useReducedMotion } from 'framer-motion';
import type { WizardStep } from '../../types';

const STEPS: { key: WizardStep; label: string }[] = [
  { key: 'capture', label: 'Capture' },
  { key: 'processing', label: 'Analyze' },
  { key: 'confirm', label: 'Confirm' },
];

interface Props {
  currentStep: WizardStep;
}

export function StepIndicator({ currentStep }: Props) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);
  const prefersReducedMotion = useReducedMotion();

  return (
    <nav aria-label="Analysis steps" className="flex items-center">
      {STEPS.map((step, i) => {
        const isActive = i === currentIndex;
        const isCompleted = i < currentIndex;

        return (
          <div key={step.key} className="flex items-center">
            <div
              className="flex flex-col items-center"
              aria-current={isActive ? 'step' : undefined}
              aria-label={`${step.label}${isCompleted ? ' (completed)' : isActive ? ' (current)' : ''}`}
            >
              {/* Circle */}
              <motion.div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gray-800 text-white'
                    : isActive
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-200 text-gray-400'
                }`}
                layout
              >
                {isCompleted ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 6.5L4.5 9L10 3" />
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </motion.div>

              {/* Label */}
              <span className={`mt-1.5 text-[11px] font-medium transition-colors duration-300 ${
                isCompleted || isActive ? 'text-gray-700' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div className="w-10 sm:w-16 h-[2px] mx-2 sm:mx-3 -mt-4" aria-hidden="true">
                <motion.div
                  className={`h-full rounded-full transition-colors duration-300 ${
                    isCompleted ? 'bg-gray-800' : 'bg-gray-200'
                  }`}
                  initial={false}
                  animate={
                    isCompleted && !prefersReducedMotion
                      ? { scaleX: 1 }
                      : { scaleX: 1 }
                  }
                  style={{ transformOrigin: 'left' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
