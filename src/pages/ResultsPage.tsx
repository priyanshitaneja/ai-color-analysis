import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { seasons } from '../data/seasons';
import { SeasonCard } from '../components/results/SeasonCard';
import { PaletteGrid } from '../components/results/PaletteGrid';
import { WowColours } from '../components/results/WowColours';
import { FeatureSummary } from '../components/results/FeatureSummary';
import { JewelleryRec } from '../components/results/JewelleryRec';
import { ColourEmotions } from '../components/results/ColourEmotions';
import type { ColorProfile, SeasonId } from '../types';

interface LocationState {
  profile: ColorProfile;
  seasonId: SeasonId;
}

export function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const state = location.state as LocationState | null;

  if (!state?.seasonId || !state?.profile) {
    return <Navigate to="/" replace />;
  }

  const season = seasons[state.seasonId];

  if (!season) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      {/* Nav bar */}
      {/* <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <motion.button
            onClick={() => navigate('/')}
            className="squircle-lg border border-gray-200 px-4 sm:px-5 py-2.5 text-sm font-medium hover:bg-gray-50 transition-all
              flex items-center gap-2 cursor-pointer
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            aria-label="Go back to home page"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Start Over
          </motion.button>
          <h1 className="text-sm font-semibold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            {season.name}
          </h1>
          <div className="w-16 sm:w-20" />
        </div>
      </header> */}

      <div
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10 sm:space-y-14 text-center text-gray-800"
        aria-live="polite"
      >
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <SeasonCard season={season} />
        </motion.div>

        <WowColours colors={season.wowColors} />

        <PaletteGrid
          colors={season.palette}
          title={season.paletteDescription}
        />

        <FeatureSummary profile={state.profile} />

        <JewelleryRec jewellery={season.jewellery} />

        <ColourEmotions palette={season.palette} />

        <div className="flex justify-center pb-4">
          <motion.button
            onClick={() => navigate('/analyze')}
            className="px-10 py-4 text-base bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-full font-medium
              shadow-lg shadow-violet-500/25 hover:opacity-90 transition-opacity cursor-pointer
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
          >
            Analyze Again
          </motion.button>
        </div>
      </div>
    </main>
  );
}
