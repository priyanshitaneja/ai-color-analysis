import { motion, useReducedMotion } from 'framer-motion';
import type { ValidationState } from '../../types';

const CHECK_LABELS: { key: keyof ValidationState; label: string; icon: string }[] = [
  { key: 'faceDetected', label: 'Face detected', icon: '👤' },
  { key: 'faceCentered', label: 'Face centered', icon: '⊕' },
  { key: 'rightDistance', label: 'Right distance', icon: '↔' },
  { key: 'eyesVisible', label: 'Eyes visible', icon: '👁' },
  { key: 'faceStraight', label: 'Looking straight', icon: '↑' },
  { key: 'goodLighting', label: 'Good lighting', icon: '☀' },
  { key: 'evenLighting', label: 'Even lighting', icon: '◐' },
];

interface Props {
  validation: ValidationState;
}

export function ValidationChecks({ validation }: Props) {
  const passCount = Object.values(validation).filter(Boolean).length;
  const total = CHECK_LABELS.length;
  const allPassed = passCount === total;
  const prefersReducedMotion = useReducedMotion();
  const progressPercent = Math.round((passCount / total) * 100);

  return (
    <div className="squircle-lg bg-white border border-gray-200 p-6 w-full lg:w-80">
      {/* Header with progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Quality Checks
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${allPassed ? 'text-green-500' : 'text-gray-500'}`}>
            {passCount}/{total}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-4"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${passCount} of ${total} quality checks passed`}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: allPassed
              ? 'linear-gradient(90deg, #22C55E, #4ADE80)'
              : 'linear-gradient(90deg, #3B82F6, #60A5FA)',
          }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Check items */}
      <ul className="space-y-2" role="list" aria-label="Validation checks">
        {CHECK_LABELS.map(({ key, label, icon }) => {
          const passed = validation[key];
          return (
            <motion.li
              key={key}
              role="listitem"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors duration-300 ${
                passed ? 'bg-green-50/80' : 'bg-transparent'
              }`}
              animate={passed && !prefersReducedMotion ? { x: [0, 2, 0] } : {}}
              transition={{ duration: 0.3 }}
            >
              <span className="text-sm w-5 text-center opacity-60" aria-hidden="true">{icon}</span>

              <span
                className={`text-sm flex-1 transition-colors duration-300 ${
                  passed ? 'text-green-700 font-medium' : 'text-gray-500'
                }`}
              >
                {label}
              </span>

              <motion.div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 transition-all duration-300 ${
                  passed
                    ? 'bg-green-500 text-white shadow-sm shadow-green-200'
                    : 'bg-gray-200'
                }`}
                animate={passed && !prefersReducedMotion ? { scale: [0.8, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
                aria-hidden="true"
              >
                {passed ? '✓' : ''}
              </motion.div>
            </motion.li>
          );
        })}
      </ul>

      {/* Status message */}
      {/* Note about glasses and natural light */}
      <p className="mt-4 text-[11px] text-gray-400 text-center leading-relaxed">
        Please remove glasses and use natural daylight for best results.
      </p>

      <motion.div
        className={`mt-3 py-3 rounded-xl text-center text-sm font-medium transition-colors duration-500 ${
          allPassed
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-500'
        }`}
        animate={allPassed && !prefersReducedMotion ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
        aria-live="polite"
      >
        {allPassed ? 'All checks passed — capture now!' : 'Adjust position to pass all checks'}
      </motion.div>
    </div>
  );
}
