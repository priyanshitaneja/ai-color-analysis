import { HeroSection } from '../components/landing/HeroSection';
import { HowItWorks } from '../components/landing/HowItWorks';
import { SeasonLinksGrid } from '../components/seo/SeasonLinksGrid';
import { JsonLd } from '../components/seo/JsonLd';

const BASE_URL = 'https://ai-color-analysis.vercel.app';

export function LandingPage() {
  return (
    <main className="w-full">
      <title>Free AI Color Analysis — Discover Your Best Colors Online</title>
      <meta
        name="description"
        content="Free online AI color analysis. Discover your seasonal color palette with a single photo — no signup, no download. Find your best colors in 60 seconds."
      />
      <link rel="canonical" href={BASE_URL} />
      <meta
        property="og:title"
        content="Free AI Color Analysis — Discover Your Best Colors Online"
      />
      <meta
        property="og:description"
        content="Free online seasonal color analysis powered by AI. Find your best colors with a single photo — no signup required."
      />
      <meta property="og:url" content={BASE_URL} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Free AI Color Analysis',
          description:
            'Free online AI color analysis. Discover your seasonal color palette with a single photo — no signup, no download.',
          url: BASE_URL,
          applicationCategory: 'LifestyleApplication',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        }}
      />

      <HeroSection />
      <HowItWorks />

      <section className="pb-24 px-6 flex justify-center">
        <div className="max-w-5xl w-full">
          <SeasonLinksGrid />
        </div>
      </section>
    </main>
  );
}
