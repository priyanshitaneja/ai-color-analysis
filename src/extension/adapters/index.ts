import { myntra } from './myntra';
import type { SiteAdapter } from './types';

export const adapters: SiteAdapter[] = [myntra];

export function findAdapter(url: URL): SiteAdapter | null {
  return adapters.find((adapter) => adapter.matches(url)) ?? null;
}
