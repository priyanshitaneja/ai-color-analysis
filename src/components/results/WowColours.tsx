import { motion, useReducedMotion } from 'framer-motion';
import type { NamedColor } from '../../types';

interface Props {
  colors: NamedColor[];
}

export function WowColours({ colors }: Props) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      className="squircle-lg border border-gray-200 p-8 sm:p-10"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      aria-label="Your WOW colours"
    >
      <h3 className="text-xl sm:text-2xl font-semibold text-center">Your WOW Colours</h3>
      <p className="text-sm text-gray-600 text-center mt-1">
        These standout colors will make you shine
      </p>

      <div className="mt-8 grid grid-cols-2 sm:flex sm:justify-center gap-6 sm:gap-8">
        {colors.map((color, i) => (
          <motion.div
            key={color.name}
            className="flex flex-col items-center gap-2"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <motion.div
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 squircle shadow-lg border border-black/5"
              style={{ backgroundColor: color.hex }}
              whileHover={
                prefersReducedMotion
                  ? {}
                  : {
                      scale: 1.1,
                      boxShadow: `0 8px 30px ${color.hex}40`,
                    }
              }
              tabIndex={0}
              role="img"
              aria-label={`WOW color: ${color.name} (${color.hex})`}
            />
            <span className="text-sm sm:text-base font-medium text-center">{color.name}</span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
