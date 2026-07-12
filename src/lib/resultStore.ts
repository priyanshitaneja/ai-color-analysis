import type { ColorProfile, SeasonId } from '../types';

export interface SavedAnalysis {
  version: 1;
  seasonId: SeasonId;
  undertone: 'warm' | 'cool' | 'neutral';
  skinHex: string;
  eyeHex: string;
  hairHex: string;
  savedAt: number;
}

export interface ResultStore {
  save(analysis: SavedAnalysis): Promise<void>;
  load(): Promise<SavedAnalysis | null>;
  clear(): Promise<void>;
}

const LOCAL_STORAGE_KEY = 'color-analysis:result';
const CHROME_STORAGE_KEY = 'analysisResult';

interface ChromeStorageArea {
  get(key: string): Promise<Record<string, unknown>>;
  set(items: Record<string, unknown>): Promise<void>;
  remove(key: string): Promise<void>;
}

function getChromeStorage(): ChromeStorageArea | undefined {
  return (globalThis as { chrome?: { storage?: { local?: ChromeStorageArea } } })
    .chrome?.storage?.local;
}

function parseAnalysis(value: unknown): SavedAnalysis | null {
  if (
    typeof value === 'object' &&
    value !== null &&
    (value as SavedAnalysis).version === 1 &&
    typeof (value as SavedAnalysis).seasonId === 'string'
  ) {
    return value as SavedAnalysis;
  }
  return null;
}

export const localStorageStore: ResultStore = {
  async save(analysis) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(analysis));
  },
  async load() {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    try {
      return parseAnalysis(JSON.parse(raw));
    } catch {
      return null;
    }
  },
  async clear() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  },
};

export const chromeStorageStore: ResultStore = {
  async save(analysis) {
    await getChromeStorage()?.set({ [CHROME_STORAGE_KEY]: analysis });
  },
  async load() {
    const items = await getChromeStorage()?.get(CHROME_STORAGE_KEY);
    return parseAnalysis(items?.[CHROME_STORAGE_KEY]);
  },
  async clear() {
    await getChromeStorage()?.remove(CHROME_STORAGE_KEY);
  },
};

export const resultStore: ResultStore =
  import.meta.env.VITE_BUILD_TARGET === 'extension' && getChromeStorage()
    ? chromeStorageStore
    : localStorageStore;

export function toSavedAnalysis(
  profile: ColorProfile,
  seasonId: SeasonId
): SavedAnalysis {
  return {
    version: 1,
    seasonId,
    undertone: profile.undertone,
    skinHex: profile.skin.hex,
    eyeHex: profile.eyes.hex,
    hairHex: profile.hair.hex,
    savedAt: Date.now(),
  };
}
