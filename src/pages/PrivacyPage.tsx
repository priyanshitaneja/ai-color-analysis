import { Link } from 'react-router-dom';

const sections = [
  {
    title: 'Your camera stays on your device',
    body: 'The color analysis runs entirely in your browser. Your camera feed and captured photo are processed locally by on-device face detection and are never uploaded, transmitted, or stored on any server. Closing the page discards the photo.',
  },
  {
    title: 'Your result is stored only on your device',
    body: 'When you confirm an analysis, your seasonal palette result (season name, undertone, and detected feature colors) is saved to your own browser storage so the app can remember it. It never leaves your device, and you can clear it at any time by clearing your browser data or removing the extension.',
  },
  {
    title: 'The shopping assistant reads pages only when you ask',
    body: 'If you use the browser extension on a supported shopping site, it looks at product names and images on the page only after you click the extension icon, and only on that tab. Color matching against your palette happens locally. Nothing about the products you view or your browsing is collected or sent anywhere.',
  },
  {
    title: 'No accounts, no analytics, no third parties',
    body: 'There is no signup, no analytics, no advertising, and no tracking of any kind. The app makes no network requests with your personal data — fonts, models, and code are all served with the app itself.',
  },
];

export function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-surface via-surface to-gray-100">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <Link
          to="/"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back to home
        </Link>

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-800 mt-6">
          Privacy Policy
        </h1>
        <p className="text-gray-500 mt-3">
          The short version: everything happens on your device, and nothing
          about you is collected — ever.
        </p>

        <div className="mt-10 space-y-8">
          {sections.map(({ title, body }) => (
            <section key={title}>
              <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base leading-relaxed">
                {body}
              </p>
            </section>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-12">
          This policy applies to both the web app and the browser extension.
          If it ever changes, the change will be visible on this page before
          it takes effect.
        </p>
      </div>
    </main>
  );
}
