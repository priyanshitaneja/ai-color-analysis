import { motion, useReducedMotion } from 'framer-motion';

interface Props {
  allPassed: boolean;
}

export function FaceGuideOverlay({ allPassed }: Props) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {/* Dark overlay with oval cutout */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
        <defs>
          <mask id="face-cutout">
            <rect width="300" height="400" fill="white" />
            <ellipse cx="150" cy="175" rx="75" ry="100" fill="black" />
          </mask>
        </defs>
        <rect
          width="300"
          height="400"
          fill="rgba(0,0,0,0.45)"
          mask="url(#face-cutout)"
        />
      </svg>

      {/* Animated oval guide border */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ marginTop: '-6%' }}>
        <motion.div
          className="relative"
          style={{
            width: '50%',
            height: '50%',
          }}
        >
          <svg className="w-full h-full" viewBox="0 0 200 260">
            <motion.ellipse
              cx="100"
              cy="130"
              rx="80"
              ry="110"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                stroke: allPassed ? '#22C55E' : 'rgba(255,255,255,0.5)',
              }}
              strokeDasharray={allPassed ? '0' : '8 6'}
              animate={
                prefersReducedMotion
                  ? {}
                  : allPassed
                    ? {
                        stroke: ['#22C55E', '#4ADE80', '#22C55E'],
                        filter: [
                          'drop-shadow(0 0 0px rgba(34,197,94,0))',
                          'drop-shadow(0 0 12px rgba(34,197,94,0.6))',
                          'drop-shadow(0 0 0px rgba(34,197,94,0))',
                        ],
                      }
                    : {
                        strokeDashoffset: [0, 28],
                      }
              }
              transition={{
                duration: allPassed ? 1.5 : 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Corner markers */}
            {!allPassed && (
              <>
                <line x1="85" y1="22" x2="115" y2="22" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
                <line x1="85" y1="238" x2="115" y2="238" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
                <line x1="20" y1="115" x2="20" y2="145" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
                <line x1="180" y1="115" x2="180" y2="145" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </svg>
        </motion.div>
      </div>

      {/* Status text */}
      <div className="absolute bottom-20 sm:bottom-24 left-0 right-0 text-center">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md"
          style={{
            background: allPassed ? 'rgba(34,197,94,0.2)' : 'rgba(0,0,0,0.3)',
          }}
          animate={allPassed && !prefersReducedMotion ? { scale: [1, 1.03, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          role="status"
          aria-live="polite"
        >
          {allPassed && (
            <motion.div
              className="w-2 h-2 rounded-full bg-green-400"
              animate={prefersReducedMotion ? {} : { opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          <span className={`text-xs sm:text-sm font-medium ${allPassed ? 'text-green-300' : 'text-white/80'}`}>
            {allPassed ? 'Ready — tap to capture' : 'Align your face'}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
