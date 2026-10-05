# SagarAI — ORCA Marine Intelligence

## Agentic Oceanographic Command Terminal

**SagarAI / ORCA** is a Smart India Hackathon 2026 prototype for marine decision support. It combines a tactical geospatial dashboard, multilingual marine advisories, simulated vessel and boundary monitoring, route optimization, safety alerts and an explainable multi-agent execution trace.

**Live demo:** [sagarai-kappa.vercel.app](https://sagarai-kappa.vercel.app/)

> This repository is a prototype. The displayed marine observations, vessel positions and advisories should be treated as representative demo data unless a live provider connection is explicitly verified.

## What the prototype demonstrates

- Tactical oceanographic command-terminal interface
- Interactive nautical basemap with Ocean, Dark, Satellite and Carto options
- Multilingual query interface for English and Indian regional languages
- Conversational marine advisory panel with optional audio playback
- Eight-stage agent trace:
  1. Orchestrator and Mission Planner
  2. Marine Earth Observation Discovery
  3. Weather and Cyclone Intelligence
  4. Ocean Dynamics and Fisheries Analytics
  5. Geospatial Reasoning and Geofencing
  6. Maritime Risk Assessment and Safety
  7. Route Optimization and Navigation
  8. Explainable Synthesis and Regional Advisory
- Potential Fishing Zone and marine-hazard visualizations
- IMBL and protected-area proximity monitoring
- Vessel safety warnings and safe-return vectors
- Weather-aware route planning with waypoint and risk information
- SOS distress workflow prototype
- Exportable explainable advisory/report flow

## Primary demo scenario

The recommended demonstration follows a single operational story:

1. A vessel is shown near the India–Sri Lanka International Maritime Boundary Line.
2. The operator asks a fishing or safety question in a regional language.
3. ORCA combines marine, weather, fisheries and boundary signals.
4. The system identifies the risk and provides a safe-return heading.
5. The agent trace shows how the final advisory was assembled.

This keeps the demo focused on the outcome: **turning scattered marine signals into an actionable, explainable safety decision**.

## Technology stack

| Layer | Implementation |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Routing | React Router 7 |
| Styling | Tailwind CSS, custom dark nautical design system |
| UI components | Radix UI, custom components, Lucide React |
| Mapping | Leaflet and marine basemap tiles |
| Charts and visuals | Recharts, Leaflet overlays and custom telemetry UI |
| Interaction | React state, Web Speech API, responsive layout |
| Validation and tooling | TypeScript, Biome, Vitest, Playwright |
| Deployment | Static Vite build suitable for Vercel |

## Project structure

```text
.
├── public/
│   └── favicon.png
├── src/
│   ├── components/
│   │   ├── marine/
│   │   │   ├── ConversationalAgentPanel.tsx
│   │   │   ├── MarineMap.tsx
│   │   │   ├── MapSettingsDialog.tsx
│   │   │   ├── RouteOptimizerPanel.tsx
│   │   │   ├── SOSDistressModal.tsx
│   │   │   └── SafetyAndGeofencingDashboard.tsx
│   │   └── ui/                 # Reusable interface components
│   ├── contexts/               # Application context providers
│   ├── hooks/                  # Reusable React hooks
│   ├── pages/
│   │   └── MarinePlatformPage.tsx
│   ├── services/
│   │   ├── agentEngine.ts      # Agent orchestration and trace data
│   │   ├── languageService.ts   # Language and advisory support
│   │   └── marineData.ts        # Marine demo data and calculations
│   ├── types/                  # Marine and application types
│   ├── App.tsx
│   ├── main.tsx
│   └── routes.tsx
├── docs/
│   ├── DESIGN.md
│   └── prd.md
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig*.json
├── vite.config.ts
└── README.md
```

## Requirements

- Node.js 20 or later
- npm 10 or later
- Internet access for external map tiles and web fonts

## Run locally

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL printed by Vite, normally:

```text
http://localhost:5173
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Required package scripts

The repository's current `package.json` contains placeholder `dev` and `build` commands. For a normal Vite workflow, the scripts should be:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "tsgo -p tsconfig.check.json; npx biome lint; .rules/check.sh;npx tailwindcss -i ./src/index.css -o /dev/null 2>&1 | grep -E '^(CssSyntaxError|Error):.*' || true;.rules/testBuild.sh"
  }
}
```

Without this correction, Vercel will not run a Vite production build and will report that the `dist` directory is missing.

## Vercel deployment

Use these Vercel settings:

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Root Directory | Repository root, containing `package.json` and `index.html` |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node.js Version | 20.x or 22.x |

After deployment, verify that the site loads and that the browser console has no fatal errors. The application is a client-side Vite app; it does not expose the Next.js API routes described in the older documentation.

## Data and prototype boundaries

The application is designed around the following marine-intelligence concepts:

- Satellite and Earth Observation signals
- Sea-surface temperature and fisheries indicators
- Waves, swell, weather and cyclone conditions
- International maritime boundaries and buffer zones
- Vessel position, heading and safe-return vectors
- Hazard-aware route planning

Before operational use, replace representative values with approved, authenticated provider integrations and add clear source timestamps, freshness indicators and provider attribution. The prototype must not be presented as a real-time safety service without validating the underlying data feeds.

## Documentation

- [`docs/prd.md`](docs/prd.md) — product requirements, target users, scenarios and acceptance criteria
- [`docs/DESIGN.md`](docs/DESIGN.md) — visual system, typography, colors and interaction direction

## Security and responsible use

- Do not place private API keys in frontend source code or variables exposed to the browser.
- Treat map-provider keys as public or restricted according to the provider's policy.
- Do not use simulated vessel positions or synthetic advisories for real navigation decisions.
- Add authentication, authorization, server-side provider adapters, rate limiting and audit logging before connecting sensitive operational data.
- Preserve provider attribution and comply with licensing and redistribution terms.
- Keep emergency/SOS workflows clearly marked as prototype simulations until connected to an approved response organization.

## SIH 2026 positioning

**Problem:** Marine stakeholders must interpret fragmented satellite, ocean, weather, fisheries and boundary information under time pressure.

**Solution:** SagarAI / ORCA presents those signals in one multilingual geospatial command terminal and turns them into a concise, explainable advisory.

**Innovation:** The prototype combines geospatial reasoning, marine safety rules, route constraints and a visible multi-agent trace instead of returning an unexplained generic answer.

**Impact:** It is designed to help fishers, coastal authorities, maritime safety teams and disaster-response operators make faster and more understandable decisions.

## License and usage

This is a competition prototype. Review the license and attribution requirements of all external map, font, satellite and marine-data providers before public or operational use.
