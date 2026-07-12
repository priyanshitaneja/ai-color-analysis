import { BrowserRouter, HashRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AppRoutes } from './AppRoutes';

const isExtension = import.meta.env.VITE_BUILD_TARGET === 'extension';
const Router = isExtension ? HashRouter : BrowserRouter;

function App() {
  return (
    <Router>
      <AppRoutes />
      {!isExtension && <Analytics />}
    </Router>
  );
}

export default App;
