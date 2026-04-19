# Fish Scan

`Fish Scan` is a portfolio-ready fullstack pet project that analyzes local weather conditions and turns them into practical fishing recommendations.

The app combines a rule-based fishing engine with AI-generated explanations, helping users understand:

- how strong the bite is likely to be,
- which fish species are worth targeting,
- which bait and tactics fit the current conditions,
- and why the forecast looks the way it does.

Built as a monorepo with `React + TypeScript` on the frontend and `Node.js + Express + TypeScript` on the backend.

## Core Features

- Search by city name or coordinates.
- Fetch current weather and hourly forecast from `Open-Meteo`.
- Evaluate fishing conditions using pressure, wind, cloud cover, precipitation, humidity, and time of day.
- Calculate an overall catch score and confidence level.
- Recommend fish species, bait, and tactics.
- Generate short AI explanations with the connected LLM provider.
- Switch interface language between English and Russian.
- Request AI explanations in the currently selected language.
- Save recent searches in local browser history.

## Tech Stack

### Frontend

- `React`
- `TypeScript`
- `Vite`
- `CSS`
- `Storybook`

### Backend

- `Node.js`
- `Express`
- `TypeScript`
- `Zod`
- `Undici`

### Data / AI

- `Open-Meteo` for weather and geocoding
- `GigaChat` for natural-language explanations

### Quality

- `Vitest`
- `Supertest`
- `ESLint`

## Monorepo Structure

```text
apps/
  web/                # React + Vite client
  api/                # Express API, weather integration, AI integration
packages/
  shared/             # shared types, DTOs, static fish data
  fishing-rules/      # rule-based fishing scoring engine
  config/             # shared TypeScript / ESLint config
```

## How It Works

`Fish Scan` uses a two-layer decision flow:

1. **Deterministic fishing analysis**
  The backend converts weather data into a structured input for the fishing rules engine.  
   The engine scores fish activity based on weather stability, pressure behavior, wind comfort, cloud cover, precipitation, and time-of-day bonuses.
2. **AI explanation layer**
  After the rule engine calculates the result, the configured AI provider produces a short explanation in the selected UI language.  
   The AI does not replace the score logic; it explains the already computed result.

This makes the product more reliable than a pure LLM demo while still feeling readable and user-friendly.

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Use `.env.example` as a reference.

Create:

- `apps/api/.env`
- `apps/web/.env`

Recommended values:

```env
# apps/api/.env
PORT=8787
AI_CREDENTIALS=
AI_ACCESS_TOKEN=
AI_SCOPE=GIGACHAT_API_PERS
AI_MODEL=GigaChat

# apps/web/.env
VITE_API_BASE_URL=http://localhost:8787
```

`AI_ACCESS_TOKEN` is optional if you use OAuth credentials instead.

### 3. Run the project

```bash
npm run dev
```

Default local URLs:

- frontend: [http://localhost:5173](http://localhost:5173)
- backend: [http://localhost:8787](http://localhost:8787)

## Available Scripts

```bash
npm run dev
npm run build
npm run test
npm run lint
npm run typecheck
```

Frontend-only:

```bash
npm run storybook -w @fish-scan/web
npm run build-storybook -w @fish-scan/web
```

## Quality Signals

- Unit tests for the fishing engine in `packages/fishing-rules`
- Integration tests for `POST /api/analyze` in `apps/api/tests`
- Shared typing across frontend and backend
- Storybook stories for key UI components
- Successful production builds for both `api` and `web`

## Portfolio Notes

This project demonstrates:

- a strong fullstack TypeScript workflow,
- domain-specific scoring logic,
- external API integration,
- AI-assisted UX without delegating core logic to the model,
- component-driven frontend structure,
- localization-aware UI behavior,
- and a repo that is presentable both technically and visually.

## Possible Next Steps

- add map-based location picking,
- support favorite fishing spots,
- add fish-specific filters in the UI,
- introduce trend charts for pressure and wind,
- add user accounts and saved forecasts,
- and expand localization to all domain dictionaries.

## Author

Designed and developed by `[is-hiro](https://github.com/is-hiro)`

# fish-scan
