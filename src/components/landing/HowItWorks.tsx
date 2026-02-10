import { motion, useReducedMotion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Open Camera',
    description: 'Our smart camera guides you to the perfect position and lighting for accurate analysis.',
  },
  {
    number: '02',
    title: 'AI Analysis',
    description: 'Advanced face detection identifies your skin tone, eye color, hair color, and undertone.',
  },
  {
    number: '03',
    title: 'Your Palette',
    description: 'Get your seasonal color type with a curated palette of colors that make you shine.',
  },
];

export function HowItWorks() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="py-24 px-6 flex justify-center" aria-labelledby="how-it-works-heading">
      <div className="max-w-5xl w-full text-center">
        <motion.h2
          id="how-it-works-heading"
          className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          How It Works
        </motion.h2>

        <div className="mt-4! mb-8! grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="glass squircle-lg px-4! py-6! text-center"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <span className="text-5xl font-bold bg-gradient-to-b from-violet-500 to-violet-300 bg-clip-text text-transparent">
                {step.number}
              </span>
              <h3 className="mt-2! text-xl font-semibold">{step.title}</h3>
              <p className="mt-3! text-text-secondary leading-relaxed text-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
