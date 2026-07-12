/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  localStorageStore,
  chromeStorageStore,
  toSavedAnalysis,
  type SavedAnalysis,
} from './resultStore';
import type { ColorProfile } from '../types';

const analysis: SavedAnalysis = {
  version: 1,
  seasonId: 'warm-autumn',
  undertone: 'warm',
  skinHex: '#c8a482',
  eyeHex: '#5a4632',
  hairHex: '#3a2e22',
  savedAt: 1_700_000_000_000,
};

describe('localStorageStore', () => {
  beforeEach(() => localStorage.clear());

  it('round-trips a saved analysis', async () => {
    await localStorageStore.save(analysis);
    expect(await localStorageStore.load()).toEqual(analysis);
  });

  it('returns null when nothing is saved', async () => {
    expect(await localStorageStore.load()).toBeNull();
  });

  it('tolerates corrupt JSON', async () => {
    localStorage.setItem('color-analysis:result', '{not json');
    expect(await localStorageStore.load()).toBeNull();
  });

  it('rejects payloads with an unknown shape', async () => {
    localStorage.setItem('color-analysis:result', JSON.stringify({ version: 99 }));
    expect(await localStorageStore.load()).toBeNull();
  });

  it('clears the saved analysis', async () => {
    await localStorageStore.save(analysis);
    await localStorageStore.clear();
    expect(await localStorageStore.load()).toBeNull();
  });
});

describe('chromeStorageStore', () => {
  const get = vi.fn();
  const set = vi.fn();
  const remove = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('chrome', { storage: { local: { get, set, remove } } });
    get.mockReset();
    set.mockReset();
    remove.mockReset();
  });

  afterEach(() => vi.unstubAllGlobals());

  it('saves under the analysisResult key', async () => {
    await chromeStorageStore.save(analysis);
    expect(set).toHaveBeenCalledWith({ analysisResult: analysis });
  });

  it('loads a saved analysis', async () => {
    get.mockResolvedValue({ analysisResult: analysis });
    expect(await chromeStorageStore.load()).toEqual(analysis);
    expect(get).toHaveBeenCalledWith('analysisResult');
  });

  it('returns null when storage is empty', async () => {
    get.mockResolvedValue({});
    expect(await chromeStorageStore.load()).toBeNull();
  });

  it('removes on clear', async () => {
    await chromeStorageStore.clear();
    expect(remove).toHaveBeenCalledWith('analysisResult');
  });
});

describe('toSavedAnalysis', () => {
  it('flattens a profile into the persisted shape', () => {
    const feature = (hex: string) => ({
      rgb: [0, 0, 0] as [number, number, number],
      hex,
      classification: { value: 'dark', chroma: 'muted', hue: 'warm' } as const,
    });
    const profile: ColorProfile = {
      skin: feature('#c8a482'),
      eyes: feature('#5a4632'),
      hair: feature('#3a2e22'),
      undertone: 'warm',
    };
    const saved = toSavedAnalysis(profile, 'warm-autumn');
    expect(saved).toMatchObject({
      version: 1,
      seasonId: 'warm-autumn',
      undertone: 'warm',
      skinHex: '#c8a482',
      eyeHex: '#5a4632',
      hairHex: '#3a2e22',
    });
    expect(saved.savedAt).toBeTypeOf('number');
  });
});
