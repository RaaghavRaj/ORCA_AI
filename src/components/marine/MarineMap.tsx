import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  ACTIVE_CYCLONE_VARUNA,
  MARITIME_BOUNDARIES,
  MARINE_PROTECTED_AREAS,
  POTENTIAL_FISHING_ZONES,
  MONITORED_VESSELS,
  PRECOMPUTED_ROUTES
} from '@/services/marineData';
import { BasemapProvider } from './MapSettingsDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Layers,
  Compass,
  AlertTriangle,
  Fish,
  Wind,
  ShieldAlert,
  Navigation,
  Settings,
  ChevronRight,
  Maximize2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface MarineMapProps {
  selectedVesselId?: string;
  focusRegion?: string;
  activeRouteId?: string;
  basemapProvider?: BasemapProvider;
  cartoApiKey?: string;
  onBasemapChange?: (provider: BasemapProvider) => void;
  onOpenSettings?: () => void;
  onSelectVessel?: (vesselId: string) => void;
  onMapInspect?: (info: { lat: number; lng: number; depth: string; sst: string; hazard: string }) => void;
}

export const MarineMap: React.FC<MarineMapProps> = ({
  selectedVesselId = 'vessel-tn-4421',
  activeRouteId,
  basemapProvider = 'esri-ocean',
  cartoApiKey = '',
  onBasemapChange,
  onOpenSettings,
  onSelectVessel,
  onMapInspect
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayersRef = useRef<{ base?: L.TileLayer; labels?: L.TileLayer }>({});

  // Layer toggles
  const [showSST, setShowSST] = useState(true);
  const [showPFZ, setShowPFZ] = useState(true);
  const [showCyclone, setShowCyclone] = useState(true);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showMPAs, setShowMPAs] = useState(true);
  const [showVessels, setShowVessels] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showLayersMenu, setShowLayersMenu] = useState(false);
  const [inspectedPoint, setInspectedPoint] = useState<{
    lat: number;
    lng: number;
    depth: string;
    sst: string;
    hazard: string;
  } | null>(null);

  // Layer group refs
  const layerGroupsRef = useRef<{
    sst?: L.LayerGroup;
    pfz?: L.LayerGroup;
    cyclone?: L.LayerGroup;
    boundaries?: L.LayerGroup;
    mpas?: L.LayerGroup;
    vessels?: L.LayerGroup;
    routes?: L.LayerGroup;
  }>({});

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [13.5, 82.0],
      zoom: 5,
      minZoom: 4,
      maxZoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    // Custom tactical zoom control on bottom left
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    // Initialize layer groups
    const sstGroup = L.layerGroup().addTo(map);
    const pfzGroup = L.layerGroup().addTo(map);
    const cycloneGroup = L.layerGroup().addTo(map);
    const boundariesGroup = L.layerGroup().addTo(map);
    const mpasGroup = L.layerGroup().addTo(map);
    const vesselsGroup = L.layerGroup().addTo(map);
    const routesGroup = L.layerGroup().addTo(map);

    layerGroupsRef.current = {
      sst: sstGroup,
      pfz: pfzGroup,
      cyclone: cycloneGroup,
      boundaries: boundariesGroup,
      mpas: mpasGroup,
      vessels: vesselsGroup,
      routes: routesGroup
    };

    mapInstanceRef.current = map;

    // Map click telemetry inspection
    map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = parseFloat(e.latlng.lat.toFixed(4));
      const lng = parseFloat(e.latlng.lng.toFixed(4));
      
      const depthVal = lat > 18 ? '24 - 45 m (Continental Shelf)' : lat < 10 ? '12 - 28 m (Palk Shallow)' : '240 - 1800 m (Deep Basin)';
      const sstVal = (28.2 + (Math.sin(lat * 0.1) * 0.8)).toFixed(1) + '°C';
      const isNearCyclone = Math.hypot(lat - ACTIVE_CYCLONE_VARUNA.center[0], lng - ACTIVE_CYCLONE_VARUNA.center[1]) < 3.5;
      const hazardVal = isNearCyclone ? 'SEVERE: High Gale Risk (Cyclone Varuna)' : lat < 10 && lng > 79.2 ? 'CAUTION: IMBL Buffer Zone' : 'NORMAL: Sea State 2-3 (Calm)';

      const pointData = { lat, lng, depth: depthVal, sst: sstVal, hazard: hazardVal };
      setInspectedPoint(pointData);
      onMapInspect?.(pointData);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Tile Layer based on basemapProvider and cartoApiKey
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing basemap layers
    if (baseTileLayersRef.current.base) {
      map.removeLayer(baseTileLayersRef.current.base);
    }
    if (baseTileLayersRef.current.labels) {
      map.removeLayer(baseTileLayersRef.current.labels);
    }

    let baseLayer: L.TileLayer;
    let labelLayer: L.TileLayer | undefined;

    if (basemapProvider === 'esri-satellite') {
      // Esri World Imagery (High-res satellite)
      baseLayer = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        attribution: 'Esri, Maxar, Earthstar'
      });
      labelLayer = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        opacity: 0.85
      });
    } else if (basemapProvider === 'osm-dark') {
      // OpenStreetMap with clean dark tactical filter - 100% free, zero watermarks
      baseLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        className: 'nautical-dark-filter'
      });
    } else if (basemapProvider === 'carto-dark' && cartoApiKey.trim()) {
      // Authenticated Carto Basemap with user-supplied API key
      const keyParam = cartoApiKey.trim();
      baseLayer = L.tileLayer(`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?api_key=${encodeURIComponent(keyParam)}`, {
        maxZoom: 19,
        subdomains: 'abcd'
      });
    } else {
      // Default: Esri Ocean Bathymetry (Watermark-free, nautical depths & trenches)
      baseLayer = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 13,
        className: 'nautical-ocean-tiles'
      });
      labelLayer = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 13,
        opacity: 0.9
      });
    }

    baseLayer.addTo(map);
    if (labelLayer) {
      labelLayer.addTo(map);
    }

    baseTileLayersRef.current = { base: baseLayer, labels: labelLayer };
  }, [basemapProvider, cartoApiKey]);

  // Update Geospatial Vectors & Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const {
      sst: sstGroup,
      pfz: pfzGroup,
      cyclone: cycloneGroup,
      boundaries: boundariesGroup,
      mpas: mpasGroup,
      vessels: vesselsGroup,
      routes: routesGroup
    } = layerGroupsRef.current;

    // 1. SST Thermal Fronts
    if (sstGroup) {
      sstGroup.clearLayers();
      if (showSST) {
        const sstPoints: [number, number, number, string][] = [
          [9.3, 79.4, 28.6, '#0ea5e9'],
          [9.8, 75.8, 29.2, '#0284c7'],
          [13.2, 80.5, 29.0, '#0284c7'],
          [15.4, 86.8, 30.5, '#ef4444'],
          [17.5, 83.6, 28.8, '#0ea5e9'],
          [20.8, 69.8, 27.8, '#10b981'],
          [22.4, 68.2, 27.4, '#10b981']
        ];

        sstPoints.forEach(([lat, lng, temp, color]) => {
          L.circle([lat, lng], {
            radius: 80000,
            fillColor: color,
            fillOpacity: 0.16,
            color: color,
            weight: 1,
            dashArray: '4, 4'
          }).bindPopup(`
            <div class="p-2 text-xs font-mono">
              <div class="font-bold text-sky-400">GHRSST L4 Thermal Gradient</div>
              <div>Coordinates: ${lat}°N, ${lng}°E</div>
              <div>Surface Temp: <span class="text-emerald-400 font-bold">${temp}°C</span></div>
              <div class="text-[10px] text-slate-400">Sensor: NOAA-20 VIIRS / INCOIS</div>
            </div>
          `).addTo(sstGroup);
        });
      }
    }

    // 2. PFZ Potential Fishing Zones
    if (pfzGroup) {
      pfzGroup.clearLayers();
      if (showPFZ) {
        POTENTIAL_FISHING_ZONES.forEach(pfz => {
          const circle = L.circle(pfz.center, {
            radius: pfz.radiusKm * 1000,
            fillColor: '#10b981',
            fillOpacity: 0.22,
            color: '#10b981',
            weight: 2
          });

          const fishIcon = L.divIcon({
            className: 'custom-pfz-marker',
            html: `
              <div class="flex items-center justify-center w-6 h-6 bg-emerald-950/90 border border-emerald-400 rounded-full text-emerald-400 shadow-md shadow-emerald-500/20">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6s-7.56-2.54-8.5-6Z"/>
                  <path d="M18 12v.5"/>
                  <path d="M16 17.93a9.77 9.77 0 0 1 0-11.86"/>
                  <path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .5 6.5-1.5 1.5-1.5 5-.5 6.5 2.85-.47 4.27-2.5 4.27-5.17Z"/>
                </svg>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          const marker = L.marker(pfz.center, { icon: fishIcon });
          marker.bindPopup(`
            <div class="p-2.5 text-xs min-w-[200px] space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-bold text-emerald-400">${pfz.name}</span>
                <span class="px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-mono text-[9px]">${pfz.confidenceScore}% Fit</span>
              </div>
              <div class="text-[11px] text-slate-300">Target Species: <span class="font-semibold text-white">${pfz.targetSpecies.join(', ')}</span></div>
              <div class="text-[10px] text-slate-400">Chlorophyll: ${pfz.chlorophyllConcentration}</div>
              <div class="text-[9px] text-emerald-400 border-t border-slate-700 pt-1 font-mono">Issued by INCOIS Advisory Bulletin</div>
            </div>
          `);

          circle.addTo(pfzGroup);
          marker.addTo(pfzGroup);
        });
      }
    }

    // 3. Cyclone Varuna
    if (cycloneGroup) {
      cycloneGroup.clearLayers();
      if (showCyclone) {
        L.polygon(ACTIVE_CYCLONE_VARUNA.coneOfUncertainty, {
          fillColor: '#ef4444',
          fillOpacity: 0.18,
          color: '#ef4444',
          weight: 1.5,
          dashArray: '5, 5'
        }).addTo(cycloneGroup);

        L.polyline(ACTIVE_CYCLONE_VARUNA.pastTrack, {
          color: '#f97316',
          weight: 2.5,
          opacity: 0.8
        }).addTo(cycloneGroup);

        const forecastCoords = [
          ACTIVE_CYCLONE_VARUNA.center,
          ...ACTIVE_CYCLONE_VARUNA.forecastTrack.map(f => f.coordinates)
        ];
        L.polyline(forecastCoords, {
          color: '#ef4444',
          weight: 2.5,
          dashArray: '4, 6'
        }).addTo(cycloneGroup);

        const eyeIcon = L.divIcon({
          className: 'custom-cyclone-eye',
          html: `
            <div class="relative flex items-center justify-center w-10 h-10">
              <div class="absolute inset-0 rounded-full border border-red-500/80 animate-ping"></div>
              <div class="w-8 h-8 rounded-full bg-red-950/90 border border-red-500 flex items-center justify-center text-red-400 font-bold shadow-md shadow-red-600/40">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin" style="animation-duration: 5s;">
                  <path d="M12 2v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="M2 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="M12 22v-4"/><path d="m19.07 19.07-2.83-2.83"/><path d="M22 12h-4"/><path d="m19.07 4.93-2.83 2.83"/>
                </svg>
              </div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        L.marker(ACTIVE_CYCLONE_VARUNA.center, { icon: eyeIcon })
          .bindPopup(`
            <div class="p-2.5 text-xs space-y-1.5 min-w-[210px]">
              <div class="flex items-center justify-between border-b border-red-500/40 pb-1">
                <span class="font-bold text-red-400 text-xs">${ACTIVE_CYCLONE_VARUNA.name}</span>
                <span class="px-1 py-0.5 bg-red-900/70 text-red-200 text-[9px] rounded font-mono">VSCS</span>
              </div>
              <div class="space-y-0.5 font-mono text-[10px]">
                <div>Winds: <span class="text-amber-400 font-bold">${ACTIVE_CYCLONE_VARUNA.maxSustainedWindsKmph} km/h</span></div>
                <div>Pressure: <span class="text-sky-300">${ACTIVE_CYCLONE_VARUNA.currentPressureHpa} hPa</span></div>
                <div>Movement: ${ACTIVE_CYCLONE_VARUNA.directionSpeed}</div>
              </div>
              <div class="text-[9px] text-red-300 bg-red-950/60 p-1.5 rounded border border-red-800">
                ${ACTIVE_CYCLONE_VARUNA.fishermenWarningNotice}
              </div>
            </div>
          `)
          .addTo(cycloneGroup);
      }
    }

    // 4. IMBL Boundaries
    if (boundariesGroup) {
      boundariesGroup.clearLayers();
      if (showBoundaries) {
        MARITIME_BOUNDARIES.forEach(boundary => {
          L.polyline(boundary.coordinates, {
            color: '#f43f5e',
            weight: 2.5,
            dashArray: '6, 5',
            opacity: 0.9
          }).bindPopup(`
            <div class="p-2 text-xs space-y-0.5">
              <div class="font-bold text-rose-400">${boundary.name}</div>
              <div class="text-[10px] text-slate-300">${boundary.treatyAgreement}</div>
              <div class="text-[9px] text-rose-300 font-mono">${boundary.riskNotice}</div>
            </div>
          `).addTo(boundariesGroup);

          // 5 NM buffer zone
          L.polyline(boundary.coordinates, {
            color: '#f59e0b',
            weight: 10,
            opacity: 0.15
          }).addTo(boundariesGroup);
        });
      }
    }

    // 5. MPAs
    if (mpasGroup) {
      mpasGroup.clearLayers();
      if (showMPAs) {
        MARINE_PROTECTED_AREAS.forEach(mpa => {
          L.polygon(mpa.coordinates, {
            fillColor: '#38bdf8',
            fillOpacity: 0.14,
            color: '#38bdf8',
            weight: 1.5,
            dashArray: '4, 4'
          }).bindPopup(`
            <div class="p-2 text-xs space-y-1 min-w-[190px]">
              <div class="font-bold text-sky-400">${mpa.name}</div>
              <div class="text-[10px] text-amber-300">${mpa.type}</div>
              <div class="text-[9px] text-slate-300">${mpa.restrictions[0]}</div>
            </div>
          `).addTo(mpasGroup);
        });
      }
    }

    // 6. Monitored Vessels
    if (vesselsGroup) {
      vesselsGroup.clearLayers();
      if (showVessels) {
        MONITORED_VESSELS.forEach(vessel => {
          const isSelected = vessel.id === selectedVesselId;
          const isCaution = vessel.proximityToBoundary?.status === 'caution';

          const vesselIcon = L.divIcon({
            className: 'custom-vessel-marker',
            html: `
              <div class="relative flex items-center justify-center">
                ${isCaution ? '<div class="absolute -inset-1.5 rounded-full border border-rose-500 animate-ping"></div>' : ''}
                <div class="w-7 h-7 rounded-full ${isSelected ? 'bg-sky-500 text-white ring-2 ring-white' : isCaution ? 'bg-rose-600 text-white' : 'bg-slate-800 text-sky-400 border border-slate-600'} flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="transform: rotate(${vessel.headingDegrees}deg);">
                    <path d="M12 2L4 20l8-4 8 4L12 2z"/>
                  </svg>
                </div>
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });

          const marker = L.marker(vessel.currentCoords, { icon: vesselIcon });

          marker.on('click', () => {
            onSelectVessel?.(vessel.id);
          });

          marker.bindPopup(`
            <div class="p-2.5 text-xs space-y-1.5 min-w-[210px]">
              <div class="flex items-center justify-between border-b border-slate-700 pb-1">
                <span class="font-bold ${isCaution ? 'text-rose-400' : 'text-sky-400'}">${vessel.vesselName}</span>
                <span class="text-[10px] font-mono text-slate-400">${vessel.speedKnots} kn</span>
              </div>
              <div class="space-y-0.5 font-mono text-[10px] text-slate-300">
                <div>Port: ${vessel.portOfOrigin} | Crew: ${vessel.crewCount}</div>
                <div>Heading: ${vessel.headingDegrees}° | Fuel: ${vessel.fuelCapacityRemainingPct}%</div>
              </div>
              ${vessel.proximityToBoundary ? `
                <div class="p-1.5 rounded ${vessel.proximityToBoundary.status === 'caution' ? 'bg-rose-950/80 border border-rose-600 text-rose-200' : 'bg-slate-800 text-slate-300'} text-[9px]">
                  <div class="font-bold">
                    ${vessel.proximityToBoundary.distanceNm} NM to ${vessel.proximityToBoundary.boundaryName}
                  </div>
                  <div class="mt-0.5 font-mono text-emerald-300 font-semibold">
                    Safe Return Vector: Bearing ${vessel.proximityToBoundary.safeReturnBearingDegrees}° (Turn West)
                  </div>
                </div>
              ` : ''}
            </div>
          `);

          marker.addTo(vesselsGroup);

          // Render Safe Return Vector line
          if (vessel.proximityToBoundary?.status === 'caution') {
            const origin = vessel.currentCoords;
            const bearingRad = (vessel.proximityToBoundary.safeReturnBearingDegrees * Math.PI) / 180;
            const destLat = origin[0] + 0.12 * Math.cos(bearingRad);
            const destLng = origin[1] + 0.12 * Math.sin(bearingRad);

            L.polyline([origin, [destLat, destLng]], {
              color: '#10b981',
              weight: 2.5,
              dashArray: '4, 4'
            }).addTo(vesselsGroup);

            L.circleMarker([destLat, destLng], {
              radius: 4,
              fillColor: '#10b981',
              color: '#ffffff',
              weight: 1
            }).bindTooltip('Safe Return Port Vector (Mandapam)', {
              permanent: true,
              direction: 'left',
              className: 'bg-emerald-950 text-emerald-300 text-[9px] px-1 py-0.5 border border-emerald-500'
            }).addTo(vesselsGroup);
          }
        });
      }
    }

    // 7. Navigation Routes
    if (routesGroup) {
      routesGroup.clearLayers();
      if (showRoutes) {
        PRECOMPUTED_ROUTES.forEach(route => {
          const isCurrentActive = route.id === activeRouteId;
          const color = route.alternativeType === 'optimal_safety' ? '#0ea5e9' : '#10b981';

          L.polyline(route.waypoints, {
            color: isCurrentActive ? '#38bdf8' : color,
            weight: isCurrentActive ? 3.5 : 2,
            opacity: isCurrentActive ? 1 : 0.65,
            dashArray: isCurrentActive ? undefined : '5, 4'
          }).bindPopup(`
            <div class="p-2 text-xs space-y-1">
              <div class="font-bold text-sky-400">${route.routeName}</div>
              <div class="text-[10px] text-slate-300">Distance: ${route.totalDistanceNm} NM (~${route.estimatedDurationHours} hrs)</div>
              <div class="text-[10px] text-emerald-400 font-mono">Safety Score: ${route.safetyScore}/100</div>
            </div>
          `).addTo(routesGroup);
        });
      }
    }
  }, [
    showSST,
    showPFZ,
    showCyclone,
    showBoundaries,
    showMPAs,
    showVessels,
    showRoutes,
    selectedVesselId,
    activeRouteId
  ]);

  const handleFlyTo = (coords: [number, number], zoom: number) => {
    mapInstanceRef.current?.flyTo(coords, zoom, { duration: 1.2 });
  };

  return (
    <div className="relative w-full h-full min-h-[460px] flex flex-col bg-slate-950 border border-slate-800 rounded-lg overflow-hidden shadow-xl">
      {/* Top Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 px-3 py-1.5 bg-slate-900/95 backdrop-blur border-b border-slate-800 z-10 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 font-mono text-slate-300">
            <Compass className="w-3.5 h-3.5 text-primary animate-spin" style={{ animationDuration: '25s' }} />
            <span className="font-semibold text-white text-xs">Ocean GIS Command</span>
          </div>

          <Badge variant="outline" className="text-[9px] bg-slate-950 text-slate-300 border-slate-700 font-mono hidden sm:inline-flex">
            {basemapProvider === 'esri-ocean'
              ? 'Esri Ocean (Watermark-Free)'
              : basemapProvider === 'esri-satellite'
              ? 'Esri Satellite'
              : basemapProvider === 'carto-dark'
              ? (cartoApiKey ? '🟢 CARTO Dark Matter (Key Active)' : 'CARTO Dark Matter')
              : 'Nautical Dark'}
          </Badge>
        </div>

        {/* Quick Basemap Switcher & Settings Trigger */}
        <div className="flex items-center gap-1">
          {/* 1-Click Basemap Toggle Pills */}
          <div className="flex items-center gap-0.5 bg-slate-950/80 p-0.5 rounded border border-slate-800 text-[10px]">
            <button
              type="button"
              onClick={() => onBasemapChange?.('esri-ocean')}
              className={`px-1.5 py-0.5 rounded font-mono transition-all ${
                basemapProvider === 'esri-ocean'
                  ? 'bg-primary text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Esri Ocean Bathymetry (Watermark-Free)"
            >
              Ocean
            </button>
            <button
              type="button"
              onClick={() => onBasemapChange?.('osm-dark')}
              className={`px-1.5 py-0.5 rounded font-mono transition-all ${
                basemapProvider === 'osm-dark'
                  ? 'bg-primary text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tactical Dark Canvas"
            >
              Dark
            </button>
            <button
              type="button"
              onClick={() => onBasemapChange?.('esri-satellite')}
              className={`px-1.5 py-0.5 rounded font-mono transition-all ${
                basemapProvider === 'esri-satellite'
                  ? 'bg-primary text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Satellite Photo HD"
            >
              Satellite
            </button>
            <button
              type="button"
              onClick={() => {
                if (cartoApiKey.trim()) {
                  onBasemapChange?.('carto-dark');
                } else {
                  onOpenSettings?.();
                }
              }}
              className={`px-1.5 py-0.5 rounded font-mono transition-all ${
                basemapProvider === 'carto-dark'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-amber-400/80 hover:text-amber-300'
              }`}
              title={cartoApiKey.trim() ? 'CARTO Dark (Active)' : 'CARTO (Needs Key - Click to set)'}
            >
              CARTO
            </button>
          </div>

          {/* Basemap & Carto API Key Button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={onOpenSettings}
            className="h-6 px-2 text-[10px] border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center gap-1"
          >
            <Settings className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Settings</span>
          </Button>

          {/* Toggle Layers Button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowLayersMenu(prev => !prev)}
            className={`h-6 px-2 text-[10px] ${showLayersMenu ? 'bg-primary text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Layers className="w-3 h-3 mr-1" />
            <span>Layers</span>
          </Button>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="relative flex-1 w-full h-full min-h-[380px]">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

        {/* Floating Layer Selector Dropdown */}
        {showLayersMenu && (
          <div className="absolute top-2 right-2 z-[1000] bg-slate-900/95 backdrop-blur border border-slate-700 rounded-md p-2.5 shadow-2xl text-xs w-52 space-y-1.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-1 border-b border-slate-700 font-semibold text-slate-200">
              <span className="flex items-center gap-1 text-xs">
                <Layers className="w-3.5 h-3.5 text-primary" />
                Active Marine Layers
              </span>
              <button
                onClick={() => setShowLayersMenu(false)}
                className="text-slate-400 hover:text-white px-1"
              >
                ✕
              </button>
            </div>

            <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer py-0.5">
              <span className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                SST Thermal Gradients
              </span>
              <input
                type="checkbox"
                checked={showSST}
                onChange={e => setShowSST(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-primary"
              />
            </label>

            <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer py-0.5">
              <span className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Fishing Zones (PFZ)
              </span>
              <input
                type="checkbox"
                checked={showPFZ}
                onChange={e => setShowPFZ(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-primary"
              />
            </label>

            <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer py-0.5">
              <span className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Cyclone Varuna Cone
              </span>
              <input
                type="checkbox"
                checked={showCyclone}
                onChange={e => setShowCyclone(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-primary"
              />
            </label>

            <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer py-0.5">
              <span className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                IMBL Boundaries (5NM)
              </span>
              <input
                type="checkbox"
                checked={showBoundaries}
                onChange={e => setShowBoundaries(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-primary"
              />
            </label>

            <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer py-0.5">
              <span className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                Marine Protected (MPA)
              </span>
              <input
                type="checkbox"
                checked={showMPAs}
                onChange={e => setShowMPAs(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-primary"
              />
            </label>

            <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer py-0.5">
              <span className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Monitored Vessels (AIS)
              </span>
              <input
                type="checkbox"
                checked={showVessels}
                onChange={e => setShowVessels(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-primary"
              />
            </label>

            <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer py-0.5">
              <span className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                Weather Routes
              </span>
              <input
                type="checkbox"
                checked={showRoutes}
                onChange={e => setShowRoutes(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-primary"
              />
            </label>
          </div>
        )}

        {/* Floating Ocean Telemetry Inspector on Click */}
        {inspectedPoint && (
          <div className="absolute top-3 left-3 z-[1000] bg-slate-900/95 backdrop-blur border border-slate-700 rounded-md p-2.5 shadow-xl max-w-xs text-xs space-y-1">
            <div className="flex items-center justify-between border-b border-slate-700 pb-1">
              <span className="font-bold text-sky-400 flex items-center gap-1 text-xs">
                <Navigation className="w-3.5 h-3.5" /> Point Coordinates
              </span>
              <button
                onClick={() => setInspectedPoint(null)}
                className="text-slate-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>
            <div className="font-mono text-[10px] text-slate-300 space-y-0.5">
              <div>Lat/Lng: {inspectedPoint.lat}°N, {inspectedPoint.lng}°E</div>
              <div>Bathymetry: {inspectedPoint.depth}</div>
              <div>SST: <span className="text-emerald-400 font-bold">{inspectedPoint.sst}</span></div>
              <div className="text-[10px] text-amber-300">{inspectedPoint.hazard}</div>
            </div>
          </div>
        )}

        {/* Map Legend Overlay in bottom right */}
        <div className="absolute bottom-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur border border-slate-800 rounded px-2.5 py-1.5 text-[9px] text-slate-300 shadow-lg space-y-0.5">
          <div className="font-bold text-slate-200">Map Indicators</div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-0.5 bg-rose-500 border-dashed border-t"></span>
            <span>IMBL Boundary</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500/30 border border-emerald-400"></span>
            <span>PFZ Fish Zone</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-0.5 bg-emerald-400"></span>
            <span>Safe Return Vector (255°)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
