import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { ColorProfile, SeasonId } from '../../types';

interface Props {
  profile: ColorProfile;
  seasonId: SeasonId;
  onAdjust: (profile: ColorProfile, seasonId: SeasonId) => void;
  onRetake: () => void;
}

function FeatureCard({
  label,
  hex,
  traits,
  delay,
}: {
  label: string;
  hex: string;
  traits: { value: string; hue: string; chroma: string };
  delay: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="squircle-lg p-4 sm:p-6 flex flex-col items-center gap-3 sm:gap-4 text-white shadow-lg"
      style={{ backgroundColor: hex }}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="text-center">
        <p className="text-sm sm:text-base font-semibold">{label}</p>
        <p className="text-xs text-white/70 uppercase mt-0.5">{hex}</p>
      </div>
      <div className="flex flex-wrap gap-1 justify-center">
        <span className="text-[10px] px-2 py-0.5 bg-white/20 rounded-full text-white capitalize">
          {traits.value}
        </span>
        <span className="text-[10px] px-2 py-0.5 bg-white/20 rounded-full text-white capitalize">
          {traits.hue}
        </span>
        <span className="text-[10px] px-2 py-0.5 bg-white/20 rounded-full text-white capitalize">
          {traits.chroma}
        </span>
      </div>
    </motion.div>
  );
}

export function FeatureConfirm({ profile, seasonId, onRetake }: Props) {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const undertoneConfig = {
    warm: {
      label: 'Warm',
      description: 'Golden / yellow base',
      gradient: 'from-amber-300 to-orange-200',
    },
    cool: {
      label: 'Cool',
      description: 'Pink / blue base',
      gradient: 'from-blue-300 to-pink-200',
    },
    neutral: {
      label: 'Neutral',
      description: 'Balanced undertone',
      gradient: 'from-gray-300 to-stone-200',
    },
  };

  const undertone = undertoneConfig[profile.undertone];

  return (
    <section className="max-w-xl mx-auto" aria-label="Detected features confirmation">
      {/* Feature grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <FeatureCard
          label="Skin Tone"
          hex={profile.skin.hex}
          traits={profile.skin.classification}
          delay={0.1}
        />
        <FeatureCard
          label="Eye Color"
          hex={profile.eyes.hex}
          traits={profile.eyes.classification}
          delay={0.2}
        />
        <FeatureCard
          label="Hair Color"
          hex={profile.hair.hex}
          traits={profile.hair.classification}
          delay={0.3}
        />

        {/* Undertone card */}
        <motion.div
          className={`squircle-lg p-4 sm:p-6 flex flex-col items-center gap-3 sm:gap-4 text-white shadow-lg bg-gradient-to-br ${undertone.gradient}`}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="text-center">
            <p className="text-sm sm:text-base font-semibold">Undertone</p>
            <p className="text-xs text-white/80 mt-0.5">{undertone.description}</p>
          </div>
          <span className="text-[10px] px-2 py-0.5 bg-white/20 rounded-full text-white">
            {undertone.label}
          </span>
        </motion.div>
      </div>

      {/* Info note */}
      <motion.p
        className="text-xs text-gray-500 text-center mt-5 px-4"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        These values were detected from your photo. If something looks off, you can retake.
      </motion.p>

      {/* Action buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 mt-8 justify-center items-center"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <motion.button
          onClick={onRetake}
          className="px-8 py-3.5 rounded-full border border-gray-200 text-sm font-medium
            hover:bg-white/80 transition-all glass cursor-pointer w-full sm:w-auto
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
          whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
        >
          Retake Photo
        </motion.button>
        <motion.button
          onClick={() =>
            navigate('/results', {
              state: { profile, seasonId },
            })
          }
          className="px-10 py-3.5 bg-text-primary text-surface rounded-full text-sm font-medium
            shadow-lg shadow-black/10 cursor-pointer w-full sm:w-auto
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
          whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
        >
          See My Palette →
        </motion.button>
      </motion.div>
    </section>
  );
}
