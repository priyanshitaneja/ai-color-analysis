import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

// Read the client-built HTML template
const template = readFileSync(join(distDir, 'index.html'), 'utf-8');

// Import the server build
const serverEntry = pathToFileURL(
  join(distDir, 'server', 'entry-server.js')
).href;
const { render } = await import(serverEntry);

const BASE_URL = 'https://ai-color-analysis.vercel.app';

const seasonIds = [
  'light-spring',
  'bright-spring',
  'warm-spring',
  'light-summer',
  'muted-summer',
  'cool-summer',
  'dark-autumn',
  'muted-autumn',
  'warm-autumn',
  'dark-winter',
  'bright-winter',
  'cool-winter',
];

const seasonNames = {
  'light-spring': 'Light Spring',
  'bright-spring': 'Bright Spring',
  'warm-spring': 'Warm Spring',
  'light-summer': 'Light Summer',
  'muted-summer': 'Muted Summer',
  'cool-summer': 'Cool Summer',
  'dark-autumn': 'Dark Autumn',
  'muted-autumn': 'Muted Autumn',
  'warm-autumn': 'Warm Autumn',
  'dark-winter': 'Dark Winter',
  'bright-winter': 'Bright Winter',
  'cool-winter': 'Cool Winter',
};

const routes = ['/', ...seasonIds.map((id) => `/seasons/${id}`), '/privacy'];

function getPageMeta(route) {
  if (route === '/') {
    return {
      title: 'Free AI Color Analysis — Discover Your Best Colors Online',
      description:
        'Free online AI color analysis. Discover your seasonal color palette with a single photo — no signup, no download. Find your best colors in 60 seconds.',
      ogTitle: 'Free AI Color Analysis — Discover Your Best Colors Online',
      ogDescription:
        'Free online seasonal color analysis powered by AI. Find your best colors with a single photo — no signup required.',
      ogUrl: BASE_URL,
      ogType: 'website',
    };
  }

  if (route === '/privacy') {
    return {
      title: 'Privacy Policy — AI Color Analysis',
      description:
        'AI Color Analysis privacy policy: all analysis runs on your device. No photos uploaded, no data collected, no tracking.',
      ogTitle: 'Privacy Policy — AI Color Analysis',
      ogDescription:
        'All analysis runs on your device. No photos uploaded, no data collected, no tracking.',
      ogUrl: `${BASE_URL}/privacy`,
      ogType: 'website',
    };
  }

  const seasonId = route.replace('/seasons/', '');
  const name = seasonNames[seasonId];
  return {
    title: `${name} Color Palette — Best Colors, Jewelry & Style Guide`,
    description: `Free ${name} color palette guide. Discover your best ${name.toLowerCase()} colors, jewelry recommendations, and style tips — all online, no signup needed.`,
    ogTitle: `${name} Color Palette — Free Seasonal Color Analysis`,
    ogDescription: `Free ${name} color palette guide. Discover the best colors for ${name.toLowerCase()} season online.`,
    ogUrl: `${BASE_URL}${route}`,
    ogType: 'article',
  };
}

function escapeHtml(str) {
  return str.replace(/"/g, '&quot;');
}

function injectMeta(html, meta) {
  // Replace the existing <title> tag
  html = html.replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`);

  // Replace existing base meta/OG tags from index.html with route-specific ones
  html = html.replace(/<meta name="description"[^>]*\/>\s*/g, '');
  html = html.replace(/<meta property="og:[^"]*"[^>]*\/>\s*/g, '');
  html = html.replace(/<meta name="twitter:card"[^>]*\/>\s*/g, '');

  // Inject route-specific meta tags before </head>
  const metaTags = [
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.ogTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.ogDescription)}" />`,
    `<meta property="og:url" content="${meta.ogUrl}" />`,
    `<meta property="og:type" content="${meta.ogType}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<link rel="canonical" href="${meta.ogUrl}" />`,
  ].join('\n    ');

  html = html.replace('</head>', `    ${metaTags}\n  </head>`);
  return html;
}

// Generate each page
for (const route of routes) {
  console.log(`Pre-rendering: ${route}`);
  const { html: appHtml } = render(route);
  const meta = getPageMeta(route);

  let page = template.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`
  );
  page = injectMeta(page, meta);

  const filePath =
    route === '/'
      ? join(distDir, 'index.html')
      : join(distDir, route.slice(1), 'index.html');

  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, page);
  console.log(`  -> ${filePath}`);
}

// Generate sitemap.xml
const today = new Date().toISOString().split('T')[0];
const sitemapEntries = routes.map((route) => {
  const priority = route === '/' ? '1.0' : '0.8';
  const changefreq = route === '/' ? 'weekly' : 'monthly';
  const url = route === '/' ? BASE_URL : `${BASE_URL}${route}`;
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join('\n')}
</urlset>`;

writeFileSync(join(distDir, 'sitemap.xml'), sitemap);
console.log('Generated sitemap.xml');

// Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /
Disallow: /analyze
Disallow: /results
Sitemap: ${BASE_URL}/sitemap.xml
`;

writeFileSync(join(distDir, 'robots.txt'), robotsTxt);
console.log('Generated robots.txt');

console.log(`\nPre-rendering complete! Generated ${routes.length} pages.`);
