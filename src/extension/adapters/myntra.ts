import type { SiteAdapter } from './types';

// Selectors current as of Jul 2026; Myntra renders listings client-side,
// so breakage shows up as "no badges" — update here only.
export const myntra: SiteAdapter = {
  id: 'myntra',

  matches(url) {
    const host = url.hostname;
    return host === 'myntra.com' || host.endsWith('.myntra.com');
  },

  observeRoot(doc) {
    return (doc.querySelector('.results-base') as HTMLElement) ?? doc.body;
  },

  findProductCards(root) {
    return Array.from(root.querySelectorAll<HTMLElement>('li.product-base'));
  },

  getImage(card) {
    return card.querySelector('img');
  },

  getTitle(card) {
    // .product-product is the product name without the brand, keeping
    // brand names that happen to be color words out of title matching
    return card.querySelector('.product-product')?.textContent?.trim() ?? null;
  },

  getBadgeMount(card) {
    return card;
  },
};
