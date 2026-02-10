export type SeasonId =
  | 'light-spring' | 'bright-spring' | 'warm-spring'
  | 'light-summer' | 'muted-summer' | 'cool-summer'
  | 'dark-autumn' | 'muted-autumn' | 'warm-autumn'
  | 'dark-winter' | 'bright-winter' | 'cool-winter';

export interface SeasonData {
  id: SeasonId;
  name: string;
  dominant: string;
  secondary: string;
  formula: string;
  description: string;
  skinDescription: string;
  typicalHairColors: string[];
  typicalEyeColors: string[];
  jewellery: 'gold' | 'silver' | 'both';
  dimensions: { hue: number; value: number; chroma: number };
  palette: NamedColor[];
  wowColors: NamedColor[];
  paletteDescription: string;
}

export interface NamedColor {
  name: string;
  hex: string;
}

export interface ColorTraits {
  value: 'light' | 'dark';
  chroma: 'muted' | 'bright';
  hue: 'warm' | 'cool';
}

export interface DetectedFeature {
  rgb: [number, number, number];
  hex: string;
  classification: ColorTraits;
}

export interface ColorProfile {
  skin: DetectedFeature;
  eyes: DetectedFeature;
  hair: DetectedFeature;
  undertone: 'warm' | 'cool' | 'neutral';
}

export interface ValidationState {
  faceDetected: boolean;
  faceCentered: boolean;
  rightDistance: boolean;
  eyesVisible: boolean;
  faceStraight: boolean;
  goodLighting: boolean;
  evenLighting: boolean;
}

export type WizardStep = 'capture' | 'processing' | 'confirm';

export interface ColorEmotion {
  color: string;
  hex: string;
  emotions: string[];
}
