import type { ColorProfile, ColorTraits, SeasonId } from '../types';

type Characteristic = 'dark' | 'light' | 'muted' | 'bright' | 'warm' | 'cool';
type Dimension = 'value' | 'chroma' | 'hue';

const SEASON_MAP: Record<string, SeasonId> = {
  'dark+warm': 'dark-autumn',
  'dark+cool': 'dark-winter',
  'light+warm': 'light-spring',
  'light+cool': 'light-summer',
  'muted+warm': 'muted-autumn',
  'muted+cool': 'muted-summer',
  'bright+warm': 'bright-spring',
  'bright+cool': 'bright-winter',
  'warm+muted': 'warm-autumn',
  'warm+bright': 'warm-spring',
  'cool+muted': 'cool-summer',
  'cool+bright': 'cool-winter',
};

export function determineSeason(profile: ColorProfile): SeasonId {
  const { skin, eyes, hair } = profile;

  // Score each of the 6 characteristics across the 3 features
  const scores = scoreCharacteristics(
    skin.classification,
    eyes.classification,
    hair.classification
  );

  // Find the dominant characteristic (highest score)
  const dominant = findDominant(scores);

  // Determine secondary based on the rules
  const secondary = findSecondary(dominant, scores);

  const key = `${dominant}+${secondary}`;
  return SEASON_MAP[key] || 'light-spring'; // fallback
}

function scoreCharacteristics(
  skin: ColorTraits,
  eyes: ColorTraits,
  hair: ColorTraits
): Record<Characteristic, number> {
  const features = [skin, eyes, hair];

  const scores: Record<Characteristic, number> = {
    dark: 0,
    light: 0,
    muted: 0,
    bright: 0,
    warm: 0,
    cool: 0,
  };

  for (const feature of features) {
    scores[feature.value]++;
    scores[feature.chroma]++;
    scores[feature.hue]++;
  }

  return scores;
}

function getDimension(char: Characteristic): Dimension {
  if (char === 'dark' || char === 'light') return 'value';
  if (char === 'muted' || char === 'bright') return 'chroma';
  return 'hue';
}

function findDominant(scores: Record<Characteristic, number>): Characteristic {
  // The dominant is the characteristic that best describes the overall look
  // It's the one with the highest score (appears in most features)
  let maxScore = 0;
  let dominant: Characteristic = 'light';

  for (const [char, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      dominant = char as Characteristic;
    }
  }

  // If there's a tie, prefer value > chroma > hue (as per the cheat sheet priority)
  const tied = Object.entries(scores)
    .filter(([, s]) => s === maxScore)
    .map(([c]) => c as Characteristic);

  if (tied.length > 1) {
    const priority: Characteristic[] = ['dark', 'light', 'muted', 'bright', 'warm', 'cool'];
    for (const p of priority) {
      if (tied.includes(p)) return p;
    }
  }

  return dominant;
}

function findSecondary(
  dominant: Characteristic,
  scores: Record<Characteristic, number>
): Characteristic {
  const dominantDimension = getDimension(dominant);

  if (dominantDimension === 'value' || dominantDimension === 'chroma') {
    // Secondary comes from hue dimension
    return scores.warm >= scores.cool ? 'warm' : 'cool';
  } else {
    // Dominant is hue, secondary comes from chroma
    return scores.muted >= scores.bright ? 'muted' : 'bright';
  }
}
