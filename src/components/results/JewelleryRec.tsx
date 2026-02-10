import { motion, useReducedMotion } from 'framer-motion';

interface Props {
  jewellery: 'gold' | 'silver' | 'both';
}

const JEWELLERY_DATA = {
  gold: {
    label: 'Gold & Bronze',
    description: 'Gold and bronze jewellery & earth tones look best on you.',
    colors: ['#FFD700', '#CD7F32', '#DAA520'],
    colorNames: ['Gold', 'Bronze', 'Goldenrod'],
  },
  silver: {
    label: 'Silver & Platinum',
    description: 'Silver or platinum toned jewellery complements your cool undertones beautifully.',
    colors: ['#C0C0C0', '#E5E4E2', '#A9A9A9'],
    colorNames: ['Silver', 'Platinum', 'Dark Silver'],
  },
  both: {
    label: 'Both Gold & Silver',
    description: 'Both silver and gold jewellery look good on you. Rose gold is also a great choice.',
    colors: ['#FFD700', '#C0C0C0', '#B76E79'],
    colorNames: ['Gold', 'Silver', 'Rose Gold'],
  },
};

export function JewelleryRec({ jewellery }: Props) {
  const data = JEWELLERY_DATA[jewellery];
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      className="squircle-lg border border-gray-200 p-8 sm:p-10"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      aria-label="Jewellery recommendation"
    >
      <h3 className="text-xl sm:text-2xl font-semibold text-center">Jewellery</h3>

      <div className="mt-8 flex flex-col items-center gap-4">
        <div className="flex gap-5">
          {data.colors.map((hex, i) => (
            <motion.div
              key={i}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-lg"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${hex}ee, ${hex}88)`,
              }}
              initial={prefersReducedMotion ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1, type: 'spring' }}
              role="img"
              aria-label={data.colorNames[i]}
            />
          ))}
        </div>
        <p className="text-lg sm:text-xl font-medium">{data.label}</p>
        <p className="text-sm text-gray-600 text-center max-w-md">
          {data.description}
        </p>
      </div>
    </motion.section>
  );
}
