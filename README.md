Sagar AI aka ORCA

Marine Ecosystem Reasoning with Collaborative Agents

Sagar AI aka ORCA is a responsive marine-intelligence platform designed for the CodeCrafters Smart India Hackathon 2026 submission. It combines satellite imagery, ocean-signal exploration, evidence-aware reasoning and agent-style orchestration into a single command centre for understanding marine conditions across India and the wider ocean.

Live demo: sagarai-kappa.vercel.app


Sagar means ocean in several Indian languages. ORCA represents the system's collaborative, intelligent and dependable marine co-pilot.

What the prototype demonstrates

•
Interactive world map with NASA GIBS satellite imagery

•
Marine signal layers for SST, chlorophyll, wind, waves, currents, PFZ candidates and hazards

•
Region-based exploration across Indian and global ocean zones

•
Ranked signal cards and a detail inspector for selected observations

•
Question-specific marine copilot answers instead of one generic response

•
Evidence and provenance drawer showing signal source, timestamp, dataset and freshness

•
Deterministic demo corpus with hundreds of synthetic records for reliable presentations

•
Optional server-side OpenAI-compatible copilot integration

•
Optional adapters for INCOIS, MOSDAC, Bhuvan/NRSC and NOAA/NCEI services

•
Responsive interface for desktop, tablet and mobile screens

•
PWA-ready structure and Vercel-compatible Next.js deployment

Product vision

Sagar AI aka ORCA is intended to help fishers, coastal communities, marine researchers, disaster-response teams and public authorities make faster, more explainable decisions from complex ocean data.

The long-term workflow is:

Plain Text


Satellite and ocean feeds
        ↓
Secure provider adapters
        ↓
Normalised marine observations
        ↓
Signal correlation and ranking
        ↓
Collaborative reasoning agents
        ↓
Evidence-backed marine guidance



The current prototype keeps the demo experience reliable and honest. Synthetic observations are clearly labelled as demo data; the application does not pretend that mock values are live satellite measurements.

Technology stack

Layer
Technology
Frontend
React 19, Next.js 15 App Router, TypeScript
Interaction
Client-side React state, Lucide icons, responsive CSS
Mapping
Leaflet with NASA GIBS satellite imagery tiles
Validation
Zod request validation, TypeScript checks, ESLint
Backend
Next.js server routes with same-origin APIs
Data model
Typed marine observations, evidence and agent-trace contracts
AI
Optional server-side OpenAI-compatible copilot with deterministic fallback
Deployment
Vercel-compatible Next.js deployment and Manus WebDev container contract
Package manager
pnpm 11




Project structure

Plain Text


app/
├── api/
│   ├── chat/              # Marine copilot endpoint
│   ├── health/            # Unauthenticated deployment health check
│   ├── noaa/datasets/     # Optional NOAA/NCEI adapter health route
│   └── ocean-data/        # Ocean-data aggregation endpoint
├── components/
│   └── SatelliteMap.tsx   # Client-only Leaflet satellite map
├── globals.css            # ORCA visual system and responsive layout
├── layout.tsx             # Metadata and application shell
└── page.tsx               # Interactive marine command centre

lib/
├── data.ts                # Live adapters and demo-data orchestration
├── demo-corpus.ts         # Deterministic 300+ observation demo corpus
├── noaa.ts                # Server-only NOAA/NCEI client
├── openai.ts              # Optional server-only AI adapter
└── types.ts               # Shared domain and API types

public/
├── manifest.webmanifest   # Installable web-app metadata
└── manus-routes.json      # WebDev route manifest

Dockerfile                 # Standalone Next.js production image
.env.example               # Safe environment-variable template
DEPLOYMENT.md              # Vercel and Manus deployment notes
SECURITY_AUDIT_2026-10-02.md



Run locally

Requirements

•
Node.js 22 or later

•
pnpm 11 or later

•
Internet access for NASA GIBS map tiles

Setup

Bash


git clone <your-repository-url>
cd orcaai
pnpm install
cp .env.example .env.local



For a reliable SIH demo, keep this in .env.local:

Plain Text


ORCA_DATA_MODE=demo



Start the development server:

Bash


pnpm dev



Open http://localhost:3000.

Validate the project

Run the standard checks before a demo or deployment:

Bash


pnpm typecheck
pnpm lint
pnpm build



Check the application health endpoint:

Bash


curl http://localhost:3000/api/health



Expected response:

JSON


{
  "ok": true,
  "service": "orca-ocean-signals"
}



Environment variables

Copy .env.example to .env.local. Keep all credentials server-side and never commit .env.local.

Variable
Required
Purpose
ORCA_DATA_MODE
Demo: yes
Use demo for the presentation corpus; use live only after provider responses are verified.
INCOIS_ERDDAP_BASE_URL
Optional
Official INCOIS ERDDAP endpoint or an approved server-side proxy.
MOSDAC_USERNAME
Optional
Approved MOSDAC server-side access.
MOSDAC_PASSWORD
Optional
Approved MOSDAC server-side access.
BHUVAN_WMS_BASE_URL
Optional
Approved Bhuvan/NRSC map-service endpoint.
NOAA_NCEI_API_TOKEN
Optional
Server-only NOAA/NCEI credential for approved products.
OPENAI_API_KEY
Optional
Server-only AI copilot credential.
OPENAI_API_BASE
Optional
OpenAI-compatible API base URL.
OPENAI_MODEL
Optional
Model name, for example gpt-4o-mini.




The copilot uses ORCA's deterministic question-specific fallback when no AI key is configured.

Security rules for credentials

Never use NEXT_PUBLIC_ for a private token. In particular, do not create:

Plain Text


NEXT_PUBLIC_OPENAI_API_KEY=...



Never paste production credentials into source code, README files, screenshots, chat messages or Git commits. Configure protected values through the hosting provider's encrypted environment-variable interface.

Data modes and provenance

Demo mode

Demo mode uses a deterministic corpus of 300+ synthetic marine observations shaped around public ocean-data schemas. It is intended for:

•
SIH presentations

•
UI development

•
Offline demonstrations

•
Automated checks

•
Reproducible judging and review

Demo values must not be represented as operational observations.

Live mode

Live mode is designed for approved provider integrations. Before using it operationally:

1.
Confirm provider registration and redistribution permissions.

2.
Configure the server-side endpoint or credential.

3.
Verify a real response in the deployment runtime.

4.
Confirm source timestamp and freshness.

5.
Keep fallback and stale-data labels visible.

6.
Never disable TLS verification to force a provider request to work.

See SOURCES.md, REALTIME_DATA_API_PLAN.md, INCOIS_DATA_STEP_BY_STEP.md and LIVE_INTEGRATION_STATUS.md for provider-specific notes.

API routes

Route
Method
Purpose
/api/health
GET
Deployment readiness check.
/api/ocean-data
GET
Returns normalised marine observations and provenance.
/api/chat
POST
Answers a validated marine question with evidence and agent trace.
/api/noaa/datasets
GET
Checks optional NOAA/NCEI server-side configuration.




Example copilot request:

Bash


curl -X POST http://localhost:3000/api/chat \
  -H 'content-type: application/json' \
  -d '{"query":"Where is the strongest PFZ candidate today?"}'



Deploy to Vercel

1.
Push this repository to GitHub, GitLab or Bitbucket.

2.
Open Vercel and select Add New Project.

3.
Import the repository.

4.
Keep the detected framework as Next.js.

5.
Use the default build settings.

6.
Add the required production variables, starting with:

Plain Text


ORCA_DATA_MODE=demo





7.
Add optional provider or AI variables only when their access is approved.

8.
Deploy the project.

9.
Open the deployed URL and verify /api/health, /api/ocean-data and the map.

10.
Check that the interface still labels demo, stale and live data correctly.

For detailed deployment notes, read DEPLOYMENT.md and REBUILD_INSTRUCTIONS.md.

Manus WebDev deployment

This repository also contains the container contract required by the bound Manus WebDev project:

•
Dockerfile builds Next.js in standalone mode.

•
The application listens on the platform-provided port.

•
/api/health is the unauthenticated readiness path.

•
The project configuration declares Dockerfile and /api/health in its deploy domain.

Do not publish a version until the source is committed and the required environment variables are configured through the secure hosting flow.

Security and production readiness

The project includes checks and documentation for:

•
Input validation

•
Safe API errors

•
Server-only credentials

•
Rate limiting for copilot requests

•
No debug-log or secret leakage

•
Explicit demo/live/stale labelling

•
Safe upstream failure handling

•
Mobile and responsive layouts

•
Health checks and deployment readiness

•
No payment, webhook or database feature enabled by default

Read SECURITY_AUDIT_2026-10-02.md and SECURITY_CHECKLIST.md before moving from prototype to production.

SIH 2026 positioning

Problem: Marine and coastal decisions are fragmented across satellite imagery, ocean indicators, advisories and difficult-to-interpret data services.

Solution: Sagar AI aka ORCA turns these signals into a visual, conversational and evidence-aware marine command centre.

Innovation: The system combines a global geospatial interface with typed data contracts, provenance, signal correlation and collaborative agent reasoning rather than returning an unexplained generic answer.

Responsible AI principle: ORCA distinguishes demo data from live data, preserves evidence, exposes freshness and keeps private credentials away from the browser.

Additional documentation

•
REBUILD_INSTRUCTIONS.md — feature tour, datasets, Vercel setup and SIH handoff

•
SOURCES.md — official data-source references and attribution notes

•
DEPLOYMENT.md — deployment architecture and publish contract

•
NOAA_NCEI_INTEGRATION.md — secure NOAA/NCEI integration

•
DEMO_MOCKING_GUIDE.md — safe synthetic-stream design

•
SECURITY_CHECKLIST.md — 15-point readiness checklist

•
SECURITY_AUDIT_2026-10-02.md — completed security audit

•
SIH2026_Presentation_Script.md — finals pitch script

•
SIH_SUBMISSION_CHECKLIST_OCT5.md — submission checklist

License and usage

This repository is a competition prototype. Review the license, attribution and redistribution terms of each external data provider before using ORCA with operational or commercial data.




Sagar AI aka ORCA
Marine ecosystem reasoning with collaborative agents.

