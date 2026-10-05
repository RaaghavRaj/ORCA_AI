import React, { useState } from 'react';
import { PRECOMPUTED_ROUTES } from '@/services/marineData';
import { WaypointRoute } from '@/types/marine';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Navigation,
  Compass,
  ShieldCheck,
  Fuel,
  Clock,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Check
} from 'lucide-react';

interface RouteOptimizerPanelProps {
  activeRouteId: string;
  onSelectRoute: (routeId: string) => void;
}

export const RouteOptimizerPanel: React.FC<RouteOptimizerPanelProps> = ({
  activeRouteId,
  onSelectRoute
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cyclone' | 'boundary'>('all');

  return (
    <div className="p-3.5 rounded-lg border border-border bg-slate-900 text-xs space-y-3.5">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-primary" />
          <span className="font-bold text-white text-sm">
            Autonomous Route Optimization
          </span>
        </div>
        <Badge variant="outline" className="bg-sky-950 text-sky-400 border-sky-800 text-[10px] font-mono">
          Weather Routing AI
        </Badge>
      </div>

      <p className="text-[11px] text-slate-300 leading-relaxed">
        Agent calculates real-time maritime waypoints bypassing active cyclone cones, shallow reefs, high swell surges, and international boundary buffer zones.
      </p>

      {/* Available Weather-Optimized Routes */}
      <div className="space-y-2.5">
        {PRECOMPUTED_ROUTES.map(route => {
          const isActive = route.id === activeRouteId;
          return (
            <div
              key={route.id}
              onClick={() => onSelectRoute(route.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                isActive
                  ? 'bg-sky-950/60 border-sky-500 shadow-md shadow-sky-950/50'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <span>{route.routeName}</span>
                    {isActive && <Check className="w-3.5 h-3.5 text-sky-400" />}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <span>{route.startPort}</span>
                    <ArrowRight className="w-3 h-3" />
                    <span>{route.destination}</span>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={`font-mono text-[10px] ${
                    route.safetyScore >= 90
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border-amber-800'
                  }`}
                >
                  Safety: {route.safetyScore}/100
                </Badge>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-300">
                <div className="flex items-center gap-1">
                  <Compass className="w-3 h-3 text-slate-500" />
                  <span>{route.totalDistanceNm} NM</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>~{route.estimatedDurationHours} hrs</span>
                </div>
                <div className="flex items-center gap-1">
                  <Fuel className="w-3 h-3 text-slate-500" />
                  <span>{route.fuelConsumptionLiters} L</span>
                </div>
              </div>

              {/* Advisory note */}
              <div className="mt-2 text-[10px] text-slate-400 bg-slate-900/60 p-1.5 rounded border border-slate-800">
                <span className="font-semibold text-slate-300">Agent Rationale:</span> {route.advisoryRemarks}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
