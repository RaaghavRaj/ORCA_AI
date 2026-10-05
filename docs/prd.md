# Requirements Document

## 1. Application Overview

### 1.1 Application Name
Marine Intelligence Platform

### 1.2 Application Description
An Agentic AI-powered marine decision support and geospatial intelligence web platform styled as a tactical Oceanographic Command Terminal. It leverages collaborative autonomous AI agents, satellite Earth Observation data, and maritime safety analytics to deliver multilingual conversational intelligence, proactive marine hazard alerts, geofencing monitoring, optimal route planning, and explainable marine advisories.

---

## 2. Users and Core Scenarios

### 2.1 Target Users
- Marine operators, coastal authorities, and fisheries organizations.
- Commercial and artisanal fishermen operating in coastal and deep-sea waters.
- Maritime safety coordinators and search-and-rescue personnel.

### 2.2 Core Scenarios
- Conversational query of oceanic and weather conditions in regional languages.
- Monitoring multi-agent reasoning, planning, and execution traces for decision auditing.
- Real-time visualization of satellite Earth Observation layers and oceanographic parameters on a watermark-free nautical basemap.
- Configuring custom map tile keys (Carto API key) or selecting alternative high-reliability nautical basemap sources.
- Proximity monitoring and geofence alerting near international boundaries and protected areas.
- Safe marine route calculation avoiding weather hazards, cyclone cones, and restricted zones.
- Triggering SOS emergency workflows with rescue coordination assistance.

---

## 3. Page Structure and Functional Specifications

### 3.1 Information Architecture

```
Marine Intelligence Platform (Oceanographic Command Terminal)
├── Top Navigation & Command Bar
│   ├── Platform Title & System Telemetry Status
│   ├── Language Selector (9 Indian Languages + English)
│   ├── Map Provider & API Key Settings Modal
│   └── SOS Distress Action
└── Unified Tactical Workspace (Full-Height Viewport Grid)
    ├── Left Panel: Conversational Intelligence & Agent Trace
    │   ├── Multilingual Conversational Chat (Audio & Text)
    │   └── Multi-Agent Execution & Confidence Trace View
    ├── Center Workspace: Interactive Geospatial Command Map (GIS)
    │   ├── Basemap Selector (Esri Ocean, World Imagery, Nautical Dark, Carto)
    │   ├── Earth Observation & Dynamic Marine Layer Controls
    │   ├── Boundary Geofencing & Simulated Vessel Position Overlay
    │   └── Map Navigation Controls
    └── Right Operations Panel (Tabbed)
        ├── Tab 1: Safety & Proactive Alerts Dashboard (Hazard Warnings, SOS Broadcast)
        ├── Tab 2: Geofencing & Boundary Monitor (Buffer Zones, Crossing Violations)
        └── Tab 3: Route Optimization & Advisory (Waypoint Planner, Explainable Report Export)
```

### 3.2 Page Functional Specifications

#### 3.2.1 Top Navigation & Command Bar
- **Platform Telemetry & Status**: Displays system operational status, active agents indicator, and time in UTC/Local time.
- **Language Selector**: Supports manual selection or automatic language detection for English, Hindi, Tamil, Telugu, Malayalam, Bengali, Gujarati, Marathi, and Kannada.
- **Map & API Key Settings Modal**:
  - Input field to configure, save, or clear custom Carto API key.
  - Basemap provider selection toggle between default non-watermarked providers (Esri Ocean, Esri World Imagery, OpenStreetMap Nautical Dark) and custom authenticated Carto basemaps.
  - Real-time connection status check for configured map keys.
- **Emergency SOS Quick Action**: Instant access button to launch the SOS distress workflow from any view.

#### 3.2.2 Conversational AI & Multi-Agent Trace Panel (Left Workspace)
- **Multilingual Conversational Interface**:
  - Multi-turn conversational chat with automatic input language detection.
  - Audio input and speech synthesis output for regional language queries.
  - Conversational context maintenance across multi-turn sessions.
- **Multi-Agent Collaboration Trace View**:
  - Displays visible collaboration steps among specialized agents: Orchestrator Agent, Marine EO Discovery Agent, Weather & Cyclone Intelligence Agent, Ocean Analytics Agent, Geospatial Reasoning & Geofencing Agent, Risk Assessment & Safety Agent, Route Optimization Agent, and Explainable Synthesis Agent.
  - Renders agent thought processes, tool invocation logs, intermediate observation data, and confidence scores per step.

#### 3.2.3 Interactive Geospatial Command Map (Center Workspace)
- **Basemap Engine & Watermark Elimination**:
  - Default rendering on reliable, watermark-free basemaps (Esri Ocean Basemap, Esri World Imagery, or dark nautical vector tile styles).
  - Support for authenticated Carto tile rendering when a valid user API key is provided.
  - Full-height, unclipped responsive map canvas with layer switching and zoom/pan controls.
- **Earth Observation & Dynamic Marine Layers**:
  - Earth Observation layers: Sea Surface Temperature (SST), Chlorophyll-a (Potential Fishing Zones - PFZ), Sea Surface Height / Altimetry, Sentinel-1 SAR Wind / Roughness, and INSAT-3D/3DR Cloud Motion & Precipitation.
  - Ocean Dynamics layers: Wave height/swell, ocean currents, tides, salinity, bathymetry, and cyclone trajectory with cone of uncertainty.
- **Geofencing & Boundary Visualization**:
  - International Maritime Boundary Line (IMBL) layer (e.g., Palk Strait / Gulf of Mannar India-Sri Lanka boundary, Sir Creek India-Pakistan boundary).
  - Marine Protected Areas (MPAs) & ecologically sensitive zones layer (e.g., Gulf of Mannar Biosphere, Gahirmatha Turtle Sanctuary, Sundarbans).
  - Simulated dynamic vessel tracking with buffer zone triggers, boundary crossing visual/auditory alerts, and safe return directional vectors.

#### 3.2.4 Tabbed Operations Panel (Right Workspace)
Modular tabbed interface preventing vertical clipping and layout overlaps:

- **Tab 1: Safety & Proactive Alerts Dashboard**:
  - Marine Hazard & Warning Center: Threshold-based alerts for high wave, severe sea state, lightning, and cyclone trajectories with risk levels (Low, Moderate, Severe, Critical).
  - SOS Distress Simulator: Coordinates broadcast generator, nearest rescue vessel locator, and Coast Guard dispatch summary.
- **Tab 2: Geofencing & Boundary Monitor**:
  - Dedicated inspection panel showing current vessel distance to nearest IMBL and MPA boundaries.
  - Real-time buffer status and list of active boundary violation events with calculated safe return heading vectors.
- **Tab 3: Route Optimization & Explainable Advisory**:
  - Waypoint Route Planner: Point-to-point and multi-waypoint navigation route generator avoiding hazard zones, cyclone cones, shallow reefs, and border buffer zones.
  - Route Metrics: Displays estimated fuel consumption, voyage duration, and composite safety risk scores.
  - Explainable Advisory & Report Export: Evidence-based advisory cards detailing agent rationale, authoritative data source citations (INCOIS, IMD, NASA/NOAA, Copernicus Sentinel), and exportable report summaries.

---

## 4. Business Rules and Core Logic

1. **Basemap Fallback and Authentication Rule**: By default, the map renders using watermark-free open nautical/ocean basemaps (e.g., Esri Ocean / Dark Nautical). If a user inputs a valid Carto API key in the settings modal, the system switches to Carto basemaps; if the key fails or is empty, the system falls back gracefully to default basemaps without displaying broken tiles or watermark errors.
2. **Terminal Layout Consistency Rule**: The interface enforces a full-height, modular command terminal layout where map, chat/agent trace, and operational tabs occupy discrete non-overlapping panels with internal scrolling.
3. **Language Processing Rule**: User inputs in any supported Indian regional language or English must trigger matching conversational responses and corresponding text-to-speech audio generation.
4. **Multi-Agent Orchestration Flow**: User queries are first evaluated by the Orchestrator/Planner Agent, decomposed into sub-tasks, routed to relevant domain agents, and aggregated by the Explainable Synthesis Agent before final output.
5. **Confidence Scoring Rule**: Every agent observation and synthetic advisory must calculate and display an explainable confidence metric between 0% and 100%.
6. **Geofence Proximity Alert Rule**: When a simulated or tracked vessel enters a 5-nautical-mile buffer zone from an IMBL or MPA, a warning status is triggered; crossing the boundary immediately triggers a critical visual and audio alert alongside a calculated safe return vector.
7. **Route Hazard Avoidance Rule**: Generated routes must automatically maintain minimum clearance distance from cyclone cone of uncertainty boundaries, shallow bathymetry limits, and maritime border buffer zones.
8. **Data Source Attribution Rule**: All analytical recommendations and safety advisories must explicitly list the backing authoritative data sources (INCOIS, IMD, NASA/NOAA, Copernicus Sentinel).

---

## 5. Exceptions and Boundary Cases

| Exception / Scenario | Trigger Condition | System Action |
| :--- | :--- | :--- |
| Invalid or Expired Carto API Key | User enters an invalid or expired API key in settings | Display validation error message in settings modal and automatically retain default watermark-free nautical basemap |
| Ambiguous / Undetected Language | Input text cannot be reliably mapped to supported languages | Fallback to English and prompt user to select a preferred language manually |
| Route Blocked by Widespread Hazards | All available navigational paths cross severe cyclone or border zones | Reject route generation, highlight unnavigable zones, and output a severe weather stay-in-port advisory |
| Zero Nearby Rescue Assets | SOS triggered in remote location with no active simulated rescue vessels | Display Coast Guard headquarters emergency radio broadcast contact information and beacon coordinates |
| Layer Data Conflict | Discrepancy between satellite observation and forecast model layers | Display both data readings with source citations and flag the advisory with a lowered confidence score |

---

## 6. Acceptance Criteria

1. The GIS map renders clean, high-contrast dark nautical / satellite basemap tiles by default without any 'API KEY REQUIRED' watermarks.
2. The user can open the Map Settings modal, input a custom Carto API key, and successfully switch basemap providers.
3. The workspace displays a clean, responsive Oceanographic Command Terminal layout where the map canvas, conversational agent panel, and right-hand tabbed operations panel operate without overlapping or vertical clipping.
4. The user can switch between Safety Alerts, Geofencing Monitor, and Route Optimization via tabbed operations on the right panel.
5. The user can submit natural language queries in supported regional languages and view step-by-step multi-agent execution traces with confidence scores.
6. The geofencing system detects proximity to IMBL and MPA boundaries and triggers visual alerts with return directional vectors.
7. The route planner generates hazard-avoiding waypoint routes displaying fuel, duration, and safety metrics with exportable reports.

---

## 7. Out of Scope for MVP

- Integration with physical onboard AIS transponders or hardware marine radar units.
- Commercial payment gateway for premium fishing zone data subscriptions.
- Satellite uplink hardware communications and direct marine VHF radio frequency transmission.
- User account billing and subscription management modules.