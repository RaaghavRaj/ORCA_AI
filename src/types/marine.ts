export type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'ml' | 'bn' | 'gu' | 'mr' | 'kn';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export type RiskLevel = 'low' | 'moderate' | 'high' | 'severe' | 'critical';

export interface AgentThought {
  id: string;
  agentId: string;
  agentName: string;
  timestamp: string;
  stage: 'planning' | 'discovery' | 'analysis' | 'geospatial' | 'risk' | 'routing' | 'synthesis';
  thought: string;
  toolCall?: {
    toolName: string;
    params: Record<string, unknown>;
    resultSummary: string;
  };
  confidence: number; // 0 - 100
  status: 'pending' | 'running' | 'completed' | 'warning';
}

export interface AgentExecutionTrace {
  queryId: string;
  userQuery: string;
  detectedLanguage: LanguageCode;
  plan: string[];
  thoughts: AgentThought[];
  citations: DataSourceCitation[];
  synthesisAdvisory: string;
  overallConfidence: number;
  safetyScore: number; // 0 - 100
  recommendedAction: 'proceed' | 'caution' | 'prohibited';
}

export interface DataSourceCitation {
  id: string;
  source: 'INCOIS' | 'IMD' | 'NASA/NOAA' | 'Copernicus Sentinel' | 'ISRO MOSDAC';
  dataset: string;
  timestamp: string;
  reliabilityScore: number;
  description: string;
  parameters: string[];
}

export interface SatelliteLayerData {
  id: string;
  name: string;
  type: 'sst' | 'chlorophyll' | 'sar_wind' | 'insat_cloud' | 'altimetry';
  provider: string;
  resolution: string;
  lastUpdated: string;
  description: string;
  legend: {
    unit: string;
    min: number;
    max: number;
    gradient: string[];
    labels: string[];
  };
}

export interface MarineDynamicLayer {
  id: string;
  name: string;
  type: 'wave' | 'current' | 'cyclone' | 'bathymetry' | 'tide';
  active: boolean;
  intensity: 'normal' | 'moderate' | 'high' | 'extreme';
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface MaritimeBoundary {
  id: string;
  name: string;
  countryA: string;
  countryB: string;
  region: string;
  coordinates: [number, number][]; // [lat, lng][]
  bufferDistanceNm: number; // nautical miles
  treatyAgreement: string;
  riskNotice: string;
}

export interface MarineProtectedArea {
  id: string;
  name: string;
  type: 'Biosphere Reserve' | 'Marine National Park' | 'Wildlife Sanctuary' | 'Turtle Nesting Zone';
  coordinates: [number, number][]; // Polygon coords
  areaSqKm: number;
  restrictions: string[];
  seasonalClosure?: string;
  penalties: string;
}

export interface PotentialFishingZone {
  id: string;
  name: string;
  center: [number, number];
  radiusKm: number;
  depthMeters: number;
  sstGradient: string; // e.g., "28.4°C - 27.1°C"
  chlorophyllConcentration: string; // "1.85 mg/m³"
  targetSpecies: string[];
  validUntil: string;
  confidenceScore: number;
}

export interface CycloneData {
  name: string;
  category: string; // "Very Severe Cyclonic Storm (VSCS)"
  center: [number, number];
  currentPressureHpa: number;
  maxSustainedWindsKmph: number;
  directionSpeed: string;
  pastTrack: [number, number][];
  forecastTrack: {
    coordinates: [number, number];
    time: string;
    intensity: string;
    windKmph: number;
  }[];
  coneOfUncertainty: [number, number][]; // Polygon
  landfallProjection: {
    location: string;
    estimatedTime: string;
  };
  fishermenWarningNotice: string;
}

export interface MarineHazardAlert {
  id: string;
  category: 'High Wave' | 'Cyclone' | 'Rough Sea' | 'Swell Surge' | 'Lightning' | 'Port Warning';
  severity: RiskLevel;
  headline: string;
  coastalRegions: string[];
  issuedAt: string;
  validThrough: string;
  issuer: 'INCOIS' | 'IMD' | 'Coast Guard';
  details: string;
  instructions: string[];
  portSignal?: number; // 1 to 11
}

export interface VesselPosition {
  id: string;
  vesselName: string;
  vesselType: 'Mechanized Trawler' | 'Motorized Craft' | 'Traditional Catamaran' | 'Patrol Cutter';
  registrationNo: string;
  currentCoords: [number, number];
  headingDegrees: number;
  speedKnots: number;
  portOfOrigin: string;
  crewCount: number;
  fuelCapacityRemainingPct: number;
  proximityToBoundary?: {
    boundaryName: string;
    distanceNm: number;
    status: 'safe' | 'caution' | 'critical';
    safeReturnBearingDegrees: number;
  };
  proximityToMPA?: {
    mpaName: string;
    distanceNm: number;
    inside: boolean;
  };
  activeHazardsNearby: string[];
}

export interface WaypointRoute {
  id: string;
  routeName: string;
  startPort: string;
  destination: string;
  waypoints: [number, number][];
  totalDistanceNm: number;
  estimatedDurationHours: number;
  fuelConsumptionLiters: number;
  safetyScore: number; // 0 - 100
  hazardClearanceNm: number;
  weatherRating: 'Favorable' | 'Moderate Risk' | 'Hazardous';
  advisoryRemarks: string;
  alternativeType: 'optimal_safety' | 'direct_fast' | 'eco_fuel';
}

export interface SOSDispatchAlert {
  id: string;
  vesselId: string;
  vesselName: string;
  coordinates: [number, number];
  timestamp: string;
  emergencyType: 'Man Overboard' | 'Engine Failure' | 'Vessel Influx/Sinking' | 'Medical Emergency' | 'Severe Weather Capsizing';
  distressBeaconFrequency: string;
  nearestRescueAssets: {
    name: string;
    type: 'Indian Coast Guard Cutter' | 'Coastal Marine Police Vessel' | 'Sister Fishing Trawler';
    distanceNm: number;
    etaMinutes: number;
    radioCallSign: string;
  }[];
  coastGuardStation: string;
  emergencyPhone: string;
  status: 'transmitting' | 'acknowledged' | 'dispatching';
}

export interface ConversationalMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  language: LanguageCode;
  text: string;
  timestamp: string;
  trace?: AgentExecutionTrace;
  audioGenerated?: boolean;
}
