import { motion, useReducedMotion } from 'framer-motion';
import type { NamedColor } from '../../types';

interface Props {
  colors: NamedColor[];
  title: string;
}

export function PaletteGrid({ colors, title }: Props) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      className="squircle-lg border border-gray-200 p-8 sm:p-10"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      aria-label="Your color palette"
    >
      <h3 className="text-xl sm:text-2xl font-semibold text-center">{title}</h3>

      <div className="mt-8 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 sm:gap-4">
        {colors.map((color, i) => (
          <motion.div
            key={color.name}
            className="flex flex-col items-center gap-1.5 group"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.02, duration: 0.3 }}
          >
            <motion.div
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 squircle shadow-md
                border border-black/5"
              style={{ backgroundColor: color.hex }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.2, zIndex: 10 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              tabIndex={0}
              role="img"
              aria-label={`${color.name}: ${color.hex}`}
            />
            <span className="text-xs text-gray-600 text-center leading-tight
              truncate max-w-full">
              {color.name}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
