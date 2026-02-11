import { useParams, Navigate, Link } from 'react-router-dom';
import { seasons } from '../data/seasons';
import { SeasonCard } from '../components/results/SeasonCard';
import { WowColours } from '../components/results/WowColours';
import { PaletteGrid } from '../components/results/PaletteGrid';
import { JewelleryRec } from '../components/results/JewelleryRec';

import { JsonLd } from '../components/seo/JsonLd';
import { SeasonLinksGrid } from '../components/seo/SeasonLinksGrid';
import type { SeasonId } from '../types';

const BASE_URL = 'https://ai-color-analysis.vercel.app';

export function SeasonPage() {
  const { seasonId } = useParams<{ seasonId: string }>();
  const season = seasonId ? seasons[seasonId as SeasonId] : undefined;

  if (!season) {
    return <Navigate to="/" replace />;
  }

  const canonicalUrl = `${BASE_URL}/seasons/${season.id}`;

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      <title>{`${season.name} Color Palette — Best Colors, Jewelry & Style Guide`}</title>
      <meta
        name="description"
        content={`Free ${season.name} color palette guide. ${season.description}. Discover your best ${season.name.toLowerCase()} colors, jewelry recommendations, and style tips — all online, no signup needed.`}
      />
      <link rel="canonical" href={canonicalUrl} />
      <meta
        property="og:title"
        content={`${season.name} Color Palette — Seasonal Color Analysis`}
      />
      <meta
        property="og:description"
        content={`Discover the ${season.name} color palette. ${season.skinDescription}`}
      />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content="summary_large_image" />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `${season.name} Color Palette — Best Colors & Style Guide`,
          description: `Discover the ${season.name} color palette. ${season.description}. ${season.skinDescription}`,
          mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            {
              '@type': 'ListItem',
              position: 2,
              name: season.name,
              item: canonicalUrl,
            },
          ],
        }}
      />

      {/* Breadcrumb nav */}
      <nav
        className="max-w-5xl mx-auto px-4 sm:px-6 pt-6"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link to="/" className="hover:text-gray-800 transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-800 font-medium">{season.name}</li>
        </ol>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10 sm:space-y-14 text-center text-gray-800">
        <SeasonCard season={season} showLabel={false} />
        <WowColours colors={season.wowColors} />
        <PaletteGrid colors={season.palette} title={season.paletteDescription} />
        <JewelleryRec jewellery={season.jewellery} />

        {/* CTA */}
        <div className="flex justify-center pb-4">
          <Link
            to="/analyze"
            className="px-10 py-4 text-base bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-full font-medium
              shadow-lg shadow-violet-500/25 hover:opacity-90 transition-opacity inline-block
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
          >
            Discover Your Season
          </Link>
        </div>

        <SeasonLinksGrid currentSeasonId={season.id} />
      </div>
    </main>
  );
}
