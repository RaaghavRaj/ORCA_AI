import {
  MaritimeBoundary,
  MarineProtectedArea,
  PotentialFishingZone,
  CycloneData,
  MarineHazardAlert,
  VesselPosition,
  WaypointRoute,
  SatelliteLayerData,
  DataSourceCitation
} from '@/types/marine';

export const MARITIME_BOUNDARIES: MaritimeBoundary[] = [
  {
    id: 'imbl-palk-strait',
    name: 'India - Sri Lanka IMBL (Palk Strait & Gulf of Mannar)',
    countryA: 'India',
    countryB: 'Sri Lanka',
    region: 'Palk Bay / Gulf of Mannar',
    coordinates: [
      [10.0833, 79.8667],
      [9.9667, 79.7833],
      [9.8333, 79.6167],
      [9.5167, 79.5333],
      [9.3500, 79.3833],
      [9.1000, 79.4333],
      [9.0000, 79.5333],
      [8.6667, 79.3333],
      [8.3667, 79.1667],
      [8.0000, 79.0000]
    ],
    bufferDistanceNm: 5.0,
    treatyAgreement: '1974 & 1976 Indo-Sri Lankan Maritime Agreements (Katchatheevu Accord)',
    riskNotice: 'CRITICAL: Crossing this line results in immediate interception by Sri Lankan Navy under fisheries jurisdiction laws. Maintain minimum 5 NM clearance.'
  },
  {
    id: 'imbl-sir-creek',
    name: 'India - Pakistan Maritime Boundary (Sir Creek / Arabian Sea)',
    countryA: 'India',
    countryB: 'Pakistan',
    region: 'Rann of Kutch / Gujarat',
    coordinates: [
      [23.6333, 68.0333],
      [23.5000, 67.8000],
      [23.2500, 67.5000],
      [22.8000, 67.0000],
      [22.2000, 66.5000],
      [21.5000, 65.8000]
    ],
    bufferDistanceNm: 8.0,
    treatyAgreement: 'UNCLOS EEZ Delimitation Line (Contested Border Zone)',
    riskNotice: 'SEVERE RISK: High security restricted sector. Apprehension by Pakistan Maritime Security Agency (PMSA) occurs if straying across.'
  },
  {
    id: 'imbl-swatch-no-ground',
    name: 'India - Bangladesh Maritime Boundary (Bay of Bengal)',
    countryA: 'India',
    countryB: 'Bangladesh',
    region: 'Swatch of No Ground / Sundarbans Offshore',
    coordinates: [
      [21.6433, 89.1558],
      [21.2000, 89.2000],
      [20.5000, 89.2500],
      [19.5000, 89.3333],
      [18.0000, 89.5000]
    ],
    bufferDistanceNm: 5.0,
    treatyAgreement: '2014 UN Permanent Court of Arbitration (PCA) Award',
    riskNotice: 'Enforced EEZ border. Shared ecologically sensitive deep-sea canyon.'
  }
];

export const MARINE_PROTECTED_AREAS: MarineProtectedArea[] = [
  {
    id: 'mpa-gulf-of-mannar',
    name: 'Gulf of Mannar Marine National Park & Biosphere Reserve',
    type: 'Biosphere Reserve',
    coordinates: [
      [9.25, 79.15],
      [9.28, 79.32],
      [9.15, 79.40],
      [8.85, 78.85],
      [8.75, 78.45],
      [8.82, 78.20],
      [9.05, 78.60]
    ],
    areaSqKm: 560,
    restrictions: [
      'Strict ban on commercial bottom trawling and pair-trawling',
      'No dynamite, blast, or cyanide fishing',
      'Protection of coral reefs, sea cows (Dugong), and endangered marine turtles',
      'Artisanal sustainable handline fishing allowed in designated peripheral zones only'
    ],
    seasonalClosure: 'April 15 to June 14 (Annual Fishery Trawling Ban)',
    penalties: 'Wildlife Protection Act 1972 Schedule I violations: Vessel impoundment & up to 7 years imprisonment.'
  },
  {
    id: 'mpa-gahirmatha',
    name: 'Gahirmatha Marine Sanctuary',
    type: 'Turtle Nesting Zone',
    coordinates: [
      [20.80, 86.90],
      [20.85, 87.15],
      [20.65, 87.25],
      [20.45, 87.05],
      [20.55, 86.85]
    ],
    areaSqKm: 1435,
    restrictions: [
      'Mass Olive Ridley sea turtle mass nesting rookery (Arribada)',
      'Total ban on all mechanized fishing within 20 km of shoreline from Nov 1 to May 31',
      'Compulsory Turtle Excluder Devices (TED) in non-prohibited seasons'
    ],
    seasonalClosure: 'November 1 to May 31',
    penalties: 'Forest Department seizure of boat, nets, and penal prosecution.'
  },
  {
    id: 'mpa-sundarbans',
    name: 'Sundarbans Marine Biosphere & Core Estuary',
    type: 'Marine National Park',
    coordinates: [
      [21.85, 88.60],
      [21.90, 89.05],
      [21.55, 89.10],
      [21.45, 88.65]
    ],
    areaSqKm: 2585,
    restrictions: [
      'UNESCO World Heritage Mangrove Habitat',
      'Prohibited unauthorized motorized trawler entry in core sanctuary creek channels',
      'Protection of Gangetic Dolphins and estuarine crocodiles'
    ],
    penalties: 'Strict forest-guard interdiction.'
  }
];

export const SATELLITE_LAYERS: SatelliteLayerData[] = [
  {
    id: 'layer-sst',
    name: 'Sea Surface Temperature (SST)',
    type: 'sst',
    provider: 'NASA MODIS / NOAA AVHRR / INCOIS GHRSST',
    resolution: '1 km Multi-Satellite High Resolution L4',
    lastUpdated: 'Today at 04:30 IST (Pass NOAA-20)',
    description: 'Thermal front gradients showing coastal upwelling and optimal pelagic tuna feeding temperatures (28.2°C - 30.5°C).',
    legend: {
      unit: '°C',
      min: 24.0,
      max: 32.0,
      gradient: ['#0000ff', '#00ffff', '#00ff00', '#ffff00', '#ff0000'],
      labels: ['24°C', '26°C', '28°C', '30°C', '32°C']
    }
  },
  {
    id: 'layer-chlorophyll',
    name: 'Chlorophyll-a & Potential Fishing Zones (PFZ)',
    type: 'chlorophyll',
    provider: 'ISRO Oceansat-3 (OCM-3) / Sentinel-3 OLCI / INCOIS',
    resolution: '360 m Bio-Optical Oceanic Grid',
    lastUpdated: 'Today at 06:15 IST (Oceansat-3 Daily Composite)',
    description: 'Concentration of phytoplankton indicative of fish foraging grounds, sardine shoals, and mackerel aggregations.',
    legend: {
      unit: 'mg/m³',
      min: 0.1,
      max: 3.5,
      gradient: ['#0d0887', '#6a00a8', '#b12a90', '#e16462', '#fca636', '#f0f921'],
      labels: ['0.1 (Oligotrophic)', '0.5', '1.2 (PFZ Peak)', '2.5', '>3.5 (Eutrophic/Bloom)']
    }
  },
  {
    id: 'layer-sar-wind',
    name: 'Sentinel-1 SAR Surface Winds & Sea Roughness',
    type: 'sar_wind',
    provider: 'ESA Copernicus Sentinel-1 C-Band Synthetic Aperture Radar',
    resolution: '10 m Surface Wave Roughness Roughness Vector',
    lastUpdated: 'Today at 05:45 IST (Pass S1A-2026-10-05)',
    description: 'All-weather, cloud-penetrating oceanic radar backscatter measuring surface capillary wave friction and wind stress.',
    legend: {
      unit: 'Knots / Beaufort',
      min: 5,
      max: 55,
      gradient: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#7f1d1d'],
      labels: ['Calm (5 kt)', 'Gentle (15 kt)', 'Moderate (25 kt)', 'Gale (40 kt)', 'Storm (55+ kt)']
    }
  },
  {
    id: 'layer-insat-cloud',
    name: 'INSAT-3D/3DR Multispectral Cloud Motion & Rain',
    type: 'insat_cloud',
    provider: 'ISRO MOSDAC / IMD Satellite Division',
    resolution: '4 km Geostationary Thermal & Water Vapour',
    lastUpdated: 'Real-time (Updated every 15 min)',
    description: 'Deep convective convective cloud clusters, squall lines, and rapid lightning precipitating cells over oceanic waters.',
    legend: {
      unit: 'Cloud Top Temp (°C)',
      min: -80,
      max: 20,
      gradient: ['#4c0070', '#8800bb', '#0055ff', '#00ffc4', '#ffffff'],
      labels: ['-80°C (Deep Convection)', '-50°C', '-20°C', '0°C', '20°C (Clear)']
    }
  }
];

export const ACTIVE_CYCLONE_VARUNA: CycloneData = {
  name: 'Cyclone VARUNA',
  category: 'Very Severe Cyclonic Storm (VSCS)',
  center: [15.4, 86.8],
  currentPressureHpa: 968,
  maxSustainedWindsKmph: 145,
  directionSpeed: 'North-Northwestward at 16 km/h',
  pastTrack: [
    [11.2, 89.5],
    [12.5, 88.8],
    [13.8, 87.9],
    [14.6, 87.2],
    [15.4, 86.8]
  ],
  forecastTrack: [
    { coordinates: [16.2, 86.2], time: '+6h (12:00 IST)', intensity: 'VSCS (140-150 kmph)', windKmph: 145 },
    { coordinates: [17.1, 85.5], time: '+12h (18:00 IST)', intensity: 'VSCS (135-145 kmph)', windKmph: 140 },
    { coordinates: [18.0, 84.9], time: '+24h (Tomorrow 06:00)', intensity: 'Severe Cyclonic Storm', windKmph: 120 },
    { coordinates: [18.9, 84.4], time: '+36h (Tomorrow 18:00 Landfall)', intensity: 'Gopalpur-Kalingapatnam Coast', windKmph: 105 }
  ],
  coneOfUncertainty: [
    [15.4, 86.8],
    [16.8, 88.0],
    [18.5, 87.5],
    [20.0, 86.2],
    [19.2, 83.5],
    [17.8, 83.8],
    [16.4, 84.8]
  ],
  landfallProjection: {
    location: 'Between Kalingapatnam (Andhra Pradesh) and Gopalpur (Odisha)',
    estimatedTime: 'Tomorrow afternoon at ~16:30 IST'
  },
  fishermenWarningNotice: 'IMD RED ALERT: Fishermen are strictly advised not to venture into deep sea or coastal waters of Central and North Bay of Bengal. Those currently out at sea are strongly advised to return to nearest safe harbor immediately.'
};

export const POTENTIAL_FISHING_ZONES: PotentialFishingZone[] = [
  {
    id: 'pfz-rameshwaram',
    name: 'Palk Bay - Dhanushkodi Shelf PFZ Hotspot',
    center: [9.32, 79.42],
    radiusKm: 18,
    depthMeters: 14,
    sstGradient: '28.6°C to 27.2°C (Strong Thermal Front)',
    chlorophyllConcentration: '1.92 mg/m³',
    targetSpecies: ['Indian Mackerel (Rastrelliger)', 'Lesser Sardines', 'Squid', 'Silver Pomfret'],
    validUntil: 'Tomorrow 18:00 IST',
    confidenceScore: 92
  },
  {
    id: 'pfz-kochi',
    name: 'Kochi Offshore Continental Shelf PFZ',
    center: [9.85, 75.80],
    radiusKm: 28,
    depthMeters: 45,
    sstGradient: '29.1°C to 28.0°C (Coastal Upwelling Eddy)',
    chlorophyllConcentration: '2.10 mg/m³',
    targetSpecies: ['Yellowfin Tuna', 'Ribbonfish', 'Anchovies', 'Seer Fish'],
    validUntil: 'Valid for next 36 hours',
    confidenceScore: 89
  },
  {
    id: 'pfz-veraval',
    name: 'Veraval - Porbandar Saurashtra PFZ Trench',
    center: [20.75, 69.80],
    radiusKm: 35,
    depthMeters: 62,
    sstGradient: '27.8°C to 26.5°C',
    chlorophyllConcentration: '1.65 mg/m³',
    targetSpecies: ['Croakers', 'Threadfin Bream', 'Squid', 'Cuttlefish'],
    validUntil: 'Valid for next 48 hours',
    confidenceScore: 86
  },
  {
    id: 'pfz-vizag',
    name: 'Visakhapatnam - Kakinada Deep Front PFZ',
    center: [17.40, 83.60],
    radiusKm: 25,
    depthMeters: 75,
    sstGradient: '28.9°C to 27.5°C (Front obscured by approaching cyclone)',
    chlorophyllConcentration: '1.40 mg/m³',
    targetSpecies: ['Skipjack Tuna', 'Marlin'],
    validUntil: 'RESTRICTED / NOT RECOMMENDED DUE TO WEATHER',
    confidenceScore: 45
  }
];

export const HAZARD_ALERTS: MarineHazardAlert[] = [
  {
    id: 'alert-cyclone-varuna',
    category: 'Cyclone',
    severity: 'critical',
    headline: 'Very Severe Cyclonic Storm VARUNA over Westcentral Bay of Bengal',
    coastalRegions: ['North Andhra Pradesh Coast', 'Odisha Coast', 'South Bengal Coast'],
    issuedAt: 'Today 06:00 IST',
    validThrough: 'Next 48 Hours',
    issuer: 'IMD',
    details: 'Gale wind speed reaching 130-145 kmph gusting to 160 kmph over Westcentral Bay. Phenomenal sea conditions with wave heights exceeding 7.0 - 9.5 meters.',
    instructions: [
      'Total suspension of fishing operations in North and Central Bay of Bengal.',
      'Vessels at sea in coordinates north of 14°N must return to closest harbor immediately.',
      'Small craft and mechanized boats must remain securely moored inside sheltered basins.'
    ],
    portSignal: 9 // Great Danger Signal
  },
  {
    id: 'alert-kallakkadal-kerala',
    category: 'Swell Surge',
    severity: 'high',
    headline: 'INCOIS High Wave & Kallakkadal (Swell Surge) Alert for SW Coast',
    coastalRegions: ['Kerala (Kollam, Alappuzha, Kochi, Kannur)', 'South Tamil Nadu (Kanyakumari, Thoothukudi)'],
    issuedAt: 'Today 07:30 IST',
    validThrough: 'Valid till Tomorrow 23:30 IST',
    issuer: 'INCOIS',
    details: 'High swell waves in the range of 3.2 to 4.1 meters forecasted along Kerala and South Tamil Nadu coastlines. Surging seawater can inundate low-lying coastal areas during high tide windows.',
    instructions: [
      'Small boats, motorized catamarans, and country crafts advised to avoid venturing near surf zones.',
      'Do not anchor boats close to shoreline; maintain tethered distance in designated jetties.',
      'Be alert during high tide cycles (11:20 IST and 23:45 IST).'
    ]
  },
  {
    id: 'alert-lightning-bengal',
    category: 'Lightning',
    severity: 'moderate',
    headline: 'Intense Lightning & Squall Alert over Gulf of Mannar & Palk Bay',
    coastalRegions: ['Rameswaram', 'Mandapam', 'Keelakarai', 'Pamban'],
    issuedAt: 'Today 08:15 IST',
    validThrough: 'Valid for next 12 hours',
    issuer: 'IMD',
    details: 'Scattered cumulonimbus convective clouds generating surface wind squalls up to 30-35 knots and frequent cloud-to-water lightning strikes.',
    instructions: [
      'Lower metal fishing antennae, outriggers, and masts while lightning activity is visible.',
      'Avoid open boat deck positions and seek shelter inside cabin enclosure.'
    ]
  }
];

export const MONITORED_VESSELS: VesselPosition[] = [
  {
    id: 'vessel-tn-4421',
    vesselName: 'SAGAR BALAJI (IND-TN-09-MM-4421)',
    vesselType: 'Mechanized Trawler',
    registrationNo: 'IND-TN-09-MM-4421',
    currentCoords: [9.362, 79.435], // Very close to Sri Lanka IMBL in Palk Strait
    headingDegrees: 78, // Heading East towards boundary!
    speedKnots: 8.4,
    portOfOrigin: 'Rameswaram Fishing Jetty',
    crewCount: 6,
    fuelCapacityRemainingPct: 68,
    proximityToBoundary: {
      boundaryName: 'India-Sri Lanka IMBL',
      distanceNm: 2.8, // Inside 5 NM warning buffer!
      status: 'caution',
      safeReturnBearingDegrees: 255 // Bearing back to Rameswaram / Mandapam
    },
    proximityToMPA: {
      mpaName: 'Gulf of Mannar Biosphere Reserve (Buffer Perimeter)',
      distanceNm: 6.2,
      inside: false
    },
    activeHazardsNearby: ['Lightning Squall over Palk Strait', 'IMBL 2.8 NM Proximity Warning']
  },
  {
    id: 'vessel-kl-1102',
    vesselName: 'SEA KING KOCHI (IND-KL-07-MC-1102)',
    vesselType: 'Motorized Craft',
    registrationNo: 'IND-KL-07-MC-1102',
    currentCoords: [9.912, 75.920],
    headingDegrees: 260,
    speedKnots: 6.2,
    portOfOrigin: 'Kochi Thoppumpady Harbor',
    crewCount: 4,
    fuelCapacityRemainingPct: 82,
    proximityToBoundary: {
      boundaryName: 'EEZ Outer Limit',
      distanceNm: 142.0,
      status: 'safe',
      safeReturnBearingDegrees: 80
    },
    activeHazardsNearby: ['INCOIS 3.6m Swell Surge Warning']
  },
  {
    id: 'vessel-gj-8840',
    vesselName: 'DWARKADHISH (IND-GJ-04-MM-8840)',
    vesselType: 'Mechanized Trawler',
    registrationNo: 'IND-GJ-04-MM-8840',
    currentCoords: [22.450, 68.100],
    headingDegrees: 310,
    speedKnots: 7.5,
    portOfOrigin: 'Porbandar Fisheries Port',
    crewCount: 8,
    fuelCapacityRemainingPct: 75,
    proximityToBoundary: {
      boundaryName: 'India-Pakistan Maritime Boundary (Sir Creek sector)',
      distanceNm: 14.5,
      status: 'safe',
      safeReturnBearingDegrees: 130
    },
    activeHazardsNearby: ['Moderate sea roughness (Beaufort Scale 4)']
  }
];

export const PRECOMPUTED_ROUTES: WaypointRoute[] = [
  {
    id: 'route-chennai-portblair',
    routeName: 'Chennai to Port Blair (Cyclone Avoidance Routing)',
    startPort: 'Chennai Port',
    destination: 'Port Blair (Andaman)',
    waypoints: [
      [13.0827, 80.2707], // Chennai
      [11.5000, 82.5000], // Steer South-East to bypass Cyclone Varuna cone
      [10.2000, 86.0000], // Southern deep water corridor
      [10.8000, 89.5000], // Ascending to Ten Degree Channel
      [11.6234, 92.7265]  // Port Blair
    ],
    totalDistanceNm: 865,
    estimatedDurationHours: 68,
    fuelConsumptionLiters: 4800,
    safetyScore: 94,
    hazardClearanceNm: 220, // 220 NM away from Cyclone Varuna core
    weatherRating: 'Favorable',
    advisoryRemarks: 'Autonomous Agent rerouted vessel 140 NM south of the standard rhumb-line, completely clear of the 50 kt gale radius of Cyclone Varuna.',
    alternativeType: 'optimal_safety'
  },
  {
    id: 'route-rameshwaram-pfz',
    routeName: 'Rameswaram to Dhanushkodi Safe PFZ Circuit',
    startPort: 'Rameswaram Jetty',
    destination: 'Dhanushkodi Outer PFZ (Return to Port)',
    waypoints: [
      [9.2880, 79.3129], // Rameswaram
      [9.2400, 79.4200], // South-east along Indian territorial waters
      [9.2700, 79.4500], // Dhanushkodi PFZ Hotspot (keeping 4.5 NM west of IMBL)
      [9.2200, 79.3600], // Safe turning point
      [9.2880, 79.3129]  // Return to Rameswaram
    ],
    totalDistanceNm: 36,
    estimatedDurationHours: 4.5,
    fuelConsumptionLiters: 110,
    safetyScore: 88,
    hazardClearanceNm: 4.5, // Strictly maintains clearance from Sri Lanka IMBL
    weatherRating: 'Favorable',
    advisoryRemarks: 'Geofence buffer strictly enforced. Recommended speed 7.5 knots. High probability of sardine shoals without crossing international boundary.',
    alternativeType: 'optimal_safety'
  },
  {
    id: 'route-kochi-kavaratti',
    routeName: 'Kochi to Kavaratti Island (Swell Mitigated Route)',
    startPort: 'Kochi Harbor',
    destination: 'Kavaratti (Lakshadweep)',
    waypoints: [
      [9.9656, 76.2421], // Kochi
      [10.1500, 75.0000], // North-westerly departure to avoid southern shoals
      [10.4000, 73.8000], // Intermediate oceanic waypoint
      [10.5667, 72.6333]  // Kavaratti
    ],
    totalDistanceNm: 218,
    estimatedDurationHours: 18,
    fuelConsumptionLiters: 920,
    safetyScore: 82,
    hazardClearanceNm: 35,
    weatherRating: 'Moderate Risk',
    advisoryRemarks: 'Navigators advised of 3.2m swell waves. Optimal departure window between 05:00 and 09:00 during slack tidal current.',
    alternativeType: 'optimal_safety'
  }
];

export const DATA_CITATIONS: DataSourceCitation[] = [
  {
    id: 'cit-incois-pfz',
    source: 'INCOIS',
    dataset: 'Potential Fishing Zone (PFZ) Advisory Bulletin & Ocean State Forecast (OSF)',
    timestamp: 'Today at 06:00 IST',
    reliabilityScore: 98,
    description: 'Indian National Centre for Ocean Information Services (Ministry of Earth Sciences, Govt. of India). Integrated thermal infrared and ocean color forecasting.',
    parameters: ['SST Fronts', 'Chlorophyll-a', 'Swell Height', 'Current Velocity']
  },
  {
    id: 'cit-imd-cyclone',
    source: 'IMD',
    dataset: 'National Cyclone Warning Center (RSMC New Delhi) Tropical Cyclone Advisory',
    timestamp: 'Today at 08:00 IST (Bulletin No. 14)',
    reliabilityScore: 99,
    description: 'India Meteorological Department authoritative cyclone track, intensity estimations, and coastal distress signals.',
    parameters: ['Central Pressure', 'Max Sustained Winds', 'Track Uncertainty Cone', 'Port Warning Signals']
  },
  {
    id: 'cit-copernicus-sentinel',
    source: 'Copernicus Sentinel',
    dataset: 'Sentinel-1 SAR Ocean Surface Wind & Sentinel-3 OLCI Ocean Colour',
    timestamp: 'Today at 05:45 IST',
    reliabilityScore: 95,
    description: 'European Space Agency Copernicus Earth Observation satellite constellation C-band SAR radar imagery for surface roughness calibration.',
    parameters: ['Radar Cross-Section', 'Wind Vectors', 'Surface Roughness', 'Ocean Colour']
  },
  {
    id: 'cit-nasa-noaa',
    source: 'NASA/NOAA',
    dataset: 'GHRSST Level 4 Global Ultra-High Resolution Sea Surface Temperature',
    timestamp: 'Today at 04:30 IST',
    reliabilityScore: 96,
    description: 'Group for High Resolution Sea Surface Temperature blending microwave and infrared satellite radiometer observations.',
    parameters: ['SST Multi-sensor Blended', 'Anomaly Degrees C', 'Thermal Gradients']
  },
  {
    id: 'cit-isro-mosdac',
    source: 'ISRO MOSDAC',
    dataset: 'INSAT-3D/3DR Rapid Convective Rainfall & Cloud Motion Vectors',
    timestamp: 'Today at 08:30 IST',
    reliabilityScore: 97,
    description: 'Meteorological & Oceanographic Satellite Data Archival Centre, Space Applications Centre (ISRO). Real-time geostationary lightning/precipitation.',
    parameters: ['Hydro-Estimator Rain Rate', 'Cloud Top Temperature', 'Tropospheric Winds']
  }
];
