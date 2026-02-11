import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { SeasonPage } from './pages/SeasonPage';

const WizardPage = lazy(() =>
  import('./pages/WizardPage').then((m) => ({ default: m.WizardPage }))
);
const ResultsPage = lazy(() =>
  import('./pages/ResultsPage').then((m) => ({ default: m.ResultsPage }))
);

export function AppRoutes() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div id="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/seasons/:seasonId" element={<SeasonPage />} />
          <Route
            path="/analyze"
            element={
              <Suspense>
                <WizardPage />
              </Suspense>
            }
          />
          <Route
            path="/results"
            element={
              <Suspense>
                <ResultsPage />
              </Suspense>
            }
          />
        </Routes>
      </div>
    </>
  );
}
