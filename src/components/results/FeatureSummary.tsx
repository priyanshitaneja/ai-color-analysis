import { motion, useReducedMotion } from 'framer-motion';
import type { ColorProfile } from '../../types';

interface Props {
  profile: ColorProfile;
}

export function FeatureSummary({ profile }: Props) {
  const prefersReducedMotion = useReducedMotion();

  const features = [
    { label: 'Skin Tone', hex: profile.skin.hex, traits: profile.skin.classification },
    { label: 'Eye Color', hex: profile.eyes.hex, traits: profile.eyes.classification },
    { label: 'Hair Color', hex: profile.hair.hex, traits: profile.hair.classification },
  ];

  const undertoneGradient =
    profile.undertone === 'warm'
      ? 'from-amber-300 to-yellow-200'
      : profile.undertone === 'cool'
        ? 'from-blue-300 to-pink-200'
        : 'from-gray-300 to-gray-200';

  return (
    <motion.section
      className="squircle-lg border border-gray-200 p-8 sm:p-10"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      aria-label="Your detected features"
    >
      <h3 className="text-xl sm:text-2xl font-semibold text-center">Your Features</h3>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {features.map((f) => (
          <div key={f.label} className="flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 squircle shadow-md border border-black/5"
              style={{ backgroundColor: f.hex }}
              role="img"
              aria-label={`${f.label}: ${f.hex}`}
            />
            <span className="text-sm sm:text-base font-medium">{f.label}</span>
            <div className="flex gap-1 flex-wrap justify-center">
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                {f.traits.value}
              </span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                {f.traits.hue}
              </span>
            </div>
          </div>
        ))}

        <div className="flex flex-col items-center gap-2">
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 squircle shadow-md bg-gradient-to-br ${undertoneGradient}`}
            role="img"
            aria-label={`Undertone: ${profile.undertone}`}
          />
          <span className="text-sm sm:text-base font-medium">Undertone</span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 capitalize">
            {profile.undertone}
          </span>
        </div>
      </div>
    </motion.section>
  );
}
