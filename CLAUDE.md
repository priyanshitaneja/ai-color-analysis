# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # Full build: tsc → vite client → vite SSR → static generation
npm run lint       # ESLint (flat config)
npm run preview    # Preview production build
```

The build pipeline runs four steps sequentially: TypeScript compilation, client-side Vite build, SSR build (`src/entry-server.tsx` → `dist/server/`), and static HTML pre-rendering via `scripts/generate-static.mjs` (13 routes: home + 12 season pages).

## Tech Stack

React 19, TypeScript (strict mode), Vite 7, Tailwind CSS 4, Framer Motion, MediaPipe FaceMesh, html2canvas. ESM throughout (`"type": "module"`).

## Architecture

This is a personal color analysis web app that uses the device camera and MediaPipe FaceMesh to detect a user's skin, eye, and hair colors, then classifies them into one of 12 seasonal color palettes. All image processing runs client-side (no backend).

### Core Flow

```
LandingPage → /analyze (WizardPage) → /results (ResultsPage)
```

**WizardPage** drives a three-step wizard managed by `useWizardState` hook:
1. **capture** — `CameraCapture` streams video with real-time validation checks (face centered, good lighting, eyes open, etc.)
2. **processing** — `AnalysisProcessing` runs the color analysis pipeline
3. **confirm** — `FeatureConfirm` lets user review detected colors before navigating to results

Results are passed to `/results` via React Router `location.state`.

### Analysis Pipeline (`src/analysis/`)

The analysis modules form a sequential pipeline:

1. **faceDetection.ts** — Singleton MediaPipe FaceMesh instance (468 landmarks + iris refinement). Defines landmark indices for skin regions, iris, eye contours, and face boundaries.
2. **colorSampling.ts** — Samples RGB from canvas regions: skin (3 face regions averaged), eyes (iris centers), hair (7 regions above forehead). Includes `rgbToHSL` conversion.
3. **colorClassification.ts** — Classifies each feature along three dimensions: value (light/dark by L>50), chroma (bright/muted by S>45), hue (warm/cool by R-G-B ratios). Separately classifies skin undertone (warm/cool/neutral).
4. **seasonDetermination.ts** — Scores 6 characteristics across all features, finds dominant+secondary traits, maps the combination to one of 12 season IDs.
5. **realtimeValidation.ts** — Validates live video frames for 7 conditions (face detected, centered, right distance, eyes visible, face straight, good lighting, even lighting).

### SSR & Static Generation

- `src/entry-server.tsx` — Server-side render entry point
- `scripts/generate-static.mjs` — Pre-renders all 13 routes to static HTML, generates `sitemap.xml` and `robots.txt`, injects per-route meta/OG tags
- `/analyze` and `/results` are excluded from static generation and robots.txt (they require camera access)

### Routing (`src/AppRoutes.tsx`)

- `/` — LandingPage (static import)
- `/seasons/:seasonId` — SeasonPage (static import, 12 season variants)
- `/analyze` — WizardPage (lazy loaded)
- `/results` — ResultsPage (lazy loaded)

### State Management

No external state library. Local React state + custom hooks (`useWizardState`, `usePhotoAnalysis`). Inter-page data passed via React Router navigation state.

### Code Splitting

Vite manual chunks configured for: `framer-motion`, `@mediapipe`, `html2canvas`. Wizard and Results pages are lazy-loaded.

## Key Types (`src/types/index.ts`)

- `SeasonId` — Union of 12 season string literals (e.g. `'light-spring'`, `'dark-winter'`)
- `SeasonData` — Complete season definition: palette (30 `NamedColor`s), wow colors (4), descriptions, jewellery recommendation
- `ColorProfile` — Detected skin/eyes/hair `DetectedFeature`s + undertone
- `ColorTraits` — `{ value: 'light'|'dark', chroma: 'muted'|'bright', hue: 'warm'|'cool' }`
- `ValidationState` — 7 boolean checks for real-time capture validation

## Styling

Tailwind CSS 4 with custom `@theme` variables in `src/index.css`. Glass morphism utilities (`.glass`), squircle shapes, dark mode via `prefers-color-scheme`. Animations respect `prefers-reduced-motion`.

## Season Data (`src/data/seasons.ts`)

Large file (~27KB) containing all 12 season definitions with 30-color palettes, wow colors, descriptions, and typical feature data. This is the single source of truth for season display content.
