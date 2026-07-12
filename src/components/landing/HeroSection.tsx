import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

const PALETTE_COLORS = [
  '#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9',
  '#92A8D1', '#F0E68C', '#034F84', '#DD4132',
  '#79C753', '#B565A7', '#009B77', '#EFC050',
];

const ORBS = PALETTE_COLORS.map((color, i) => ({
  color,
  width: 80 + ((i * 53) % 120),
  height: 80 + ((i * 89) % 120),
  duration: 4 + ((i * 37) % 30) / 10,
}));

export function HeroSection() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const orbAnimation = prefersReducedMotion
    ? {}
    : {
        y: [0, -20, 0],
        x: [0, 10, 0],
        scale: [1, 1.1, 1],
      };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Floating color orbs background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {ORBS.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20 blur-2xl"
            style={{
              backgroundColor: orb.color,
              width: orb.width,
              height: orb.height,
              left: `${10 + (i % 4) * 25}%`,
              top: `${10 + Math.floor(i / 4) * 30}%`,
            }}
            animate={orbAnimation}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-2xl"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.p
          className="text-sm font-medium tracking-widest uppercase text-text-secondary mb-4"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Free AI Color Analysis — No Signup Required
        </motion.p>

        <h1
          id="hero-heading"
          className="text-4xl sm:text-5xl lg:text-7xl font-semibold tracking-tight leading-tight"
        >
          Discover Your
          <br />
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Perfect Colors
          </span>
        </h1>

        <motion.p
          className="mt-6 text-lg sm:text-xl text-text-secondary max-w-md mx-auto leading-relaxed"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Find your seasonal color palette with a single photo.
          100% free, works in your browser — no signup or download needed.
        </motion.p>

        <motion.button
          onClick={() => navigate('/analyze')}
          className="mt-6! px-16! py-4! text-2xl font-semibold min-w-[320px] w-full sm:w-auto
            bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-full
            shadow-lg shadow-violet-500/25 
            active:scale-95 transition-all cursor-pointer
            flex items-center justify-center gap-3 mx-auto!
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
          aria-label="Analyze my colors - open camera"
        >
          Analyze
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 10h10M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </motion.div>
    </section>
  );
}
