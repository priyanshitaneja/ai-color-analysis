import { motion, useReducedMotion } from 'framer-motion';
import type { NamedColor } from '../../types';

interface Props {
  palette: NamedColor[];
}

export function ColourCombinations({ palette }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const combos = generateCombinations(palette);

  return (
    <motion.section
      className="squircle-lg border border-gray-200 p-8 sm:p-10"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      aria-label="Colour combinations"
    >
      <h3 className="text-xl sm:text-2xl font-semibold text-center">Colour Combinations</h3>
      <p className="text-sm text-gray-600 text-center mt-1">
        Try these outfit combinations from your palette
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {combos.map((combo, i) => (
          <motion.div
            key={i}
            className="flex justify-center"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            role="group"
            aria-label={`Combination ${i + 1}: ${combo.map(c => c.name).join(', ')}`}
          >
            {/* Horizontal squircle swatches */}
            <div className="flex items-center gap-3">
              {combo.map((c, j) => (
                <div key={j} className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 squircle shadow-md border border-black/5"
                    style={{ backgroundColor: c.hex }}
                    role="img"
                    aria-label={c.name}
                  />
                  <span className="text-xs text-gray-600 text-center leading-tight truncate max-w-[4rem]">
                    {c.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function generateCombinations(palette: NamedColor[]): NamedColor[][] {
  if (palette.length < 4) return [];

  const combos: NamedColor[][] = [];
  const step = Math.floor(palette.length / 6);

  for (let start = 0; start < 3; start++) {
    const base = start * step * 2;
    const combo = [
      palette[base % palette.length],
      palette[(base + step) % palette.length],
      palette[(base + step * 2) % palette.length],
      palette[(base + step * 3) % palette.length],
    ];
    combos.push(combo);
  }

  return combos;
}
