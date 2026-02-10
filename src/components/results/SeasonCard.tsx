import { motion, useReducedMotion } from 'framer-motion';
import type { SeasonData } from '../../types';

interface Props {
  season: SeasonData;
}

function DimensionBar({ label, value, lowLabel, highLabel }: { label: string; value: number; lowLabel: string; highLabel: string }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-600 w-14 text-right">{label}</span>
        <div
          className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${value}%`}
        >
          <motion.div
            className="h-full rounded-full bg-gray-400"
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          />
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-600 ml-17 pl-3 pr-3">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

export function SeasonCard({ season }: Props) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      className="squircle-lg border border-gray-200 p-8 sm:p-12"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      aria-label="Your season result"
    >
      <div className="text-center">
        <motion.p
          className="text-sm font-medium text-gray-600 uppercase tracking-[0.2em]"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Your Season
        </motion.p>
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mt-2 tracking-tight
            bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {season.name}
        </motion.h2>
        <motion.p
          className="text-base text-gray-600 mt-1"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {season.formula}
        </motion.p>
      </div>

      <motion.p
        className="mt-6 text-gray-600 leading-relaxed text-center max-w-lg mx-auto text-sm sm:text-base"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {season.skinDescription}
      </motion.p>

      {/* Dimensions */}
      <motion.div
        className="mt-6 sm:mt-8 max-w-md mx-auto space-y-4 px-2"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <DimensionBar label="Hue" value={season.dimensions.hue} lowLabel="Cool" highLabel="Warm" />
        <DimensionBar label="Value" value={season.dimensions.value} lowLabel="Dark" highLabel="Light" />
        <DimensionBar label="Chroma" value={season.dimensions.chroma} lowLabel="Muted" highLabel="Bright" />
      </motion.div>
    </motion.section>
  );
}
