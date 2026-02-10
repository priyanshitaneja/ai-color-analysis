import { motion, useReducedMotion } from 'framer-motion';
import { colorEmotions } from '../../data/colorEmotions';
import type { NamedColor } from '../../types';

interface Props {
  palette: NamedColor[];
}

export function ColourEmotions({ palette }: Props) {
  const prefersReducedMotion = useReducedMotion();

  // Find matching emotions for colors in the user's palette
  const paletteHues = palette.map((c) => c.hex.toLowerCase());

  const relevantEmotions = colorEmotions.filter((emotion) => {
    return paletteHues.some((hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);

      const emotionName = emotion.color.toLowerCase();
      if (emotionName === 'red' && r > 150 && g < 100 && b < 100) return true;
      if (emotionName === 'blue' && b > 150 && r < 100) return true;
      if (emotionName === 'green' && g > 150 && r < 150 && b < 150) return true;
      if (emotionName === 'yellow' && r > 200 && g > 200 && b < 100) return true;
      if (emotionName === 'purple' && r > 100 && b > 100 && g < 100) return true;
      if (emotionName === 'pink' && r > 200 && g < 150 && b > 100) return true;
      if (emotionName === 'orange' && r > 200 && g > 100 && g < 200 && b < 100) return true;
      if (emotionName === 'brown' && r > 100 && r < 200 && g < 100) return true;
      return false;
    });
  });

  const displayEmotions = relevantEmotions.length >= 3
    ? relevantEmotions
    : colorEmotions.slice(0, 6);

  return (
    <motion.section
      className="squircle-lg border border-gray-200 p-8 sm:p-10"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      aria-label="Colour and emotions"
    >
      <h3 className="text-xl sm:text-2xl font-semibold text-center">Colour & Emotions</h3>
      <p className="text-sm text-gray-600 text-center mt-1">
        What your colors communicate
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {displayEmotions.map((emotion, i) => (
          <motion.div
            key={emotion.color}
            className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors"
            initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.05 }}
          >
            <div
              className="w-10 h-10 squircle flex-shrink-0 shadow-sm"
              style={{ backgroundColor: emotion.hex }}
              role="img"
              aria-label={`${emotion.color} swatch`}
            />
            <div>
              <p className="text-base font-medium">{emotion.color}</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {emotion.emotions.slice(0, 3).join(', ')}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
