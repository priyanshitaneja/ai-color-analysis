import { HeroSection } from '../components/landing/HeroSection';
import { HowItWorks } from '../components/landing/HowItWorks';
import { SeasonLinksGrid } from '../components/seo/SeasonLinksGrid';
import { JsonLd } from '../components/seo/JsonLd';

const BASE_URL = 'https://ai-color-analysis.vercel.app';

export function LandingPage() {
  return (
    <main className="w-full">
      <title>Color Analysis — Discover Your Perfect Palette</title>
      <meta
        name="description"
        content="Discover your seasonal color palette with AI-powered face analysis. Find your best colors in 60 seconds."
      />
      <link rel="canonical" href={BASE_URL} />
      <meta
        property="og:title"
        content="Color Analysis — Discover Your Perfect Palette"
      />
      <meta
        property="og:description"
        content="AI-powered seasonal color analysis. Find your best colors with a single photo."
      />
      <meta property="og:url" content={BASE_URL} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Color Analysis',
          description:
            'AI-powered seasonal color analysis. Discover your best colors with a single photo.',
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
