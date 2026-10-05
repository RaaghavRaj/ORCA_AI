import React from 'react';
import {
  HAZARD_ALERTS,
  MONITORED_VESSELS,
  ACTIVE_CYCLONE_VARUNA,
  POTENTIAL_FISHING_ZONES
} from '@/services/marineData';
import { VesselPosition, LanguageCode } from '@/types/marine';
import { UI_TRANSLATIONS } from '@/services/languageService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShieldAlert,
  AlertTriangle,
  Compass,
  Anchor,
  Wind,
  Waves,
  Zap,
  Radio,
  ArrowUpRight,
  Fish,
  CheckCircle,
  Navigation
} from 'lucide-react';

interface SafetyAndGeofencingDashboardProps {
  currentLanguage: LanguageCode;
  selectedVessel: VesselPosition;
  onOpenSOS: () => void;
  onFlyToRegion?: (coords: [number, number], zoom: number) => void;
}

export const SafetyAndGeofencingDashboard: React.FC<SafetyAndGeofencingDashboardProps> = ({
  currentLanguage,
  selectedVessel,
  onOpenSOS,
  onFlyToRegion
}) => {
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;

  const isBoundaryWarning = selectedVessel.proximityToBoundary?.status === 'caution';

  return (
    <div className="space-y-4 text-xs">
      {/* 1. Critical Geofencing & Boundary Proximity Monitor Card */}
      <div className={`p-3.5 rounded-lg border ${isBoundaryWarning ? 'bg-rose-950/40 border-rose-600/80' : 'bg-slate-900 border-border'} shadow-lg space-y-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isBoundaryWarning ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`}></span>
            <span className="font-bold text-sm text-white">
              {t.geofenceStatus}
            </span>
          </div>
          <Badge
            variant="outline"
            className={`font-mono text-[10px] uppercase ${
              isBoundaryWarning
                ? 'bg-rose-900/80 text-rose-300 border-rose-500 animate-pulse'
                : 'bg-emerald-950 text-emerald-400 border-emerald-800'
            }`}
          >
            {isBoundaryWarning ? 'PROXIMITY WARNING' : 'BOUNDARY SAFE'}
          </Badge>
        </div>

        {/* Monitored Vessel Live Boundary Stats */}
        <div className="bg-slate-950/70 rounded-md p-3 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <Anchor className="w-3.5 h-3.5 text-primary" />
              <span>{selectedVessel.vesselName}</span>
            </div>
            <span className="font-mono text-[11px] text-slate-400">
              Reg: {selectedVessel.registrationNo}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
            <div>
              <span className="text-slate-500">Current Position:</span>{' '}
              <span className="text-sky-400">{selectedVessel.currentCoords[0]}°N, {selectedVessel.currentCoords[1]}°E</span>
            </div>
            <div>
              <span className="text-slate-500">Speed / Heading:</span>{' '}
              <span>{selectedVessel.speedKnots} kn @ {selectedVessel.headingDegrees}°</span>
            </div>
          </div>

          {selectedVessel.proximityToBoundary && (
            <div className="p-2 rounded bg-rose-950/60 border border-rose-700/80 text-rose-200 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Distance to {selectedVessel.proximityToBoundary.boundaryName}:
                </span>
                <span className="text-sm font-mono text-rose-300">
                  {selectedVessel.proximityToBoundary.distanceNm} Nautical Miles
                </span>
              </div>
              <p className="text-[10px] text-rose-300/90 leading-tight">
                Vessel is within the 5.0 NM precautionary buffer zone. Approaching international boundary line.
              </p>

              {/* Actionable Safe Return Vector */}
              <div className="mt-2 pt-1.5 border-t border-rose-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white text-[11px]">
                    {t.safeHeading}:
                  </span>
                </div>
                <div className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-600 flex items-center gap-1">
                  <span>Bearing {selectedVessel.proximityToBoundary.safeReturnBearingDegrees}° (WSW towards Mandapam)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Active Marine Hazard Advisories */}
      <div className="p-3.5 rounded-lg border border-border bg-slate-900 space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div className="flex items-center gap-1.5 font-bold text-sm text-white">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{t.hazardAlerts}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Authoritative: INCOIS / IMD RSMC
          </span>
        </div>

        <div className="space-y-2.5">
          {HAZARD_ALERTS.map(alert => (
            <div
              key={alert.id}
              className={`p-2.5 rounded-md border text-xs space-y-1.5 ${
                alert.severity === 'critical'
                  ? 'bg-red-950/50 border-red-800 text-red-200'
                  : alert.severity === 'high'
                  ? 'bg-amber-950/50 border-amber-800 text-amber-200'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold">
                  {alert.category === 'Cyclone' ? (
                    <Wind className="w-3.5 h-3.5 text-red-400" />
                  ) : alert.category === 'Swell Surge' ? (
                    <Waves className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  )}
                  <span>{alert.headline}</span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[9px] uppercase font-mono ${
                    alert.severity === 'critical'
                      ? 'bg-red-900 text-red-100 border-red-600'
                      : 'bg-amber-900 text-amber-100 border-amber-600'
                  }`}
                >
                  {alert.issuer} • {alert.severity}
                </Badge>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                {alert.details}
              </p>

              <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                <span className="font-semibold text-slate-300">Action:</span> {alert.instructions[0]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Potential Fishing Zone (PFZ) Live Ocean State */}
      <div className="p-3.5 rounded-lg border border-border bg-slate-900 space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div className="flex items-center gap-1.5 font-bold text-sm text-white">
            <Fish className="w-4 h-4 text-emerald-400" />
            <span>{t.pfzTitle}</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">
            ISRO Oceansat-3 Composite
          </span>
        </div>

        <div className="space-y-2">
          {POTENTIAL_FISHING_ZONES.slice(0, 2).map(pfz => (
            <div
              key={pfz.id}
              className="p-2 rounded bg-slate-950 border border-slate-800 text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400">{pfz.name}</span>
                <span className="font-mono text-[10px] text-slate-400">Depth: {pfz.depthMeters}m</span>
              </div>
              <div className="text-[11px] text-slate-300">
                Species: <span className="text-white font-medium">{pfz.targetSpecies.join(', ')}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800">
                <span>{pfz.sstGradient}</span>
                <span className="text-emerald-400 font-bold">{pfz.confidenceScore}% Yield Probability</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
