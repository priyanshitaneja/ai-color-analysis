import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { AppRoutes } from './AppRoutes';

export function render(url: string) {
  const html = renderToString(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>
  );
  return { html };
}
