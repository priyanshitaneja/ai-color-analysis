import { BrowserRouter, HashRouter } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';

const Router =
  import.meta.env.VITE_BUILD_TARGET === 'extension' ? HashRouter : BrowserRouter;

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
