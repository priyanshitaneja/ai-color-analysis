import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { WizardPage } from './pages/WizardPage';
import { ResultsPage } from './pages/ResultsPage';

function App() {
  return (
    <BrowserRouter>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div id="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/analyze" element={<WizardPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
