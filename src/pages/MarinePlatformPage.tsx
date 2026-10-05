import React, { useState, useEffect } from 'react';
import { MarineMap } from '@/components/marine/MarineMap';
import { ConversationalAgentPanel } from '@/components/marine/ConversationalAgentPanel';
import { SafetyAndGeofencingDashboard } from '@/components/marine/SafetyAndGeofencingDashboard';
import { RouteOptimizerPanel } from '@/components/marine/RouteOptimizerPanel';
import { SOSDistressModal } from '@/components/marine/SOSDistressModal';
import { MapSettingsDialog, BasemapProvider } from '@/components/marine/MapSettingsDialog';
import {
  MONITORED_VESSELS,
  PRECOMPUTED_ROUTES,
  DATA_CITATIONS,
  ACTIVE_CYCLONE_VARUNA
} from '@/services/marineData';
import { LanguageCode, AgentExecutionTrace } from '@/types/marine';
import { UI_TRANSLATIONS } from '@/services/languageService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Compass,
  LifeBuoy,
  ShieldAlert,
  AlertTriangle,
  Bot,
  MapPin,
  Satellite,
  Navigation,
  Wind,
  Layers,
  Database,
  Radio,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const MarinePlatformPage: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [selectedVesselId, setSelectedVesselId] = useState<string>('vessel-tn-4421');
  const [activeRouteId, setActiveRouteId] = useState<string>('route-chennai-portblair');
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);
  const [isMapSettingsOpen, setIsMapSettingsOpen] = useState<boolean>(false);
  const [latestTrace, setLatestTrace] = useState<AgentExecutionTrace | null>(null);
  
  // Basemap & Carto API Key with localStorage persistence
  // Default to 'esri-ocean' (clean, watermark-free) if no valid CARTO key is registered
  const [cartoApiKey, setCartoApiKey] = useState<string>(() => {
    return localStorage.getItem('sagarai_carto_api_key') || '';
  });
  
  const [basemapProvider, setBasemapProvider] = useState<BasemapProvider>(() => {
    const saved = localStorage.getItem('sagarai_basemap_provider') as BasemapProvider;
    const savedKey = localStorage.getItem('sagarai_carto_api_key') || '';
    // If user previously had carto-dark but no valid key, reset to esri-ocean so watermark NEVER shows
    if (saved === 'carto-dark' && !savedKey.trim()) {
      localStorage.setItem('sagarai_basemap_provider', 'esri-ocean');
      return 'esri-ocean';
    }
    return saved || 'esri-ocean';
  });

  const [mobileTab, setMobileTab] = useState<'map' | 'chat' | 'operations'>('map');
  const [rightOpsTab, setRightOpsTab] = useState<'safety' | 'routing' | 'agents' | 'citations'>('safety');

  const selectedVessel =
    MONITORED_VESSELS.find(v => v.id === selectedVesselId) || MONITORED_VESSELS[0];

  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;

  // Persist basemap settings
  const handleBasemapChange = (provider: BasemapProvider) => {
    setBasemapProvider(provider);
    localStorage.setItem('sagarai_basemap_provider', provider);
  };

  const handleCartoApiKeyChange = (key: string) => {
    setCartoApiKey(key);
    localStorage.setItem('sagarai_carto_api_key', key);
    if (key.trim()) {
      handleBasemapChange('carto-dark');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground select-none">
      {/* 1. Tactical Command Header */}
      <header className="h-12 shrink-0 border-b border-border bg-slate-950/95 px-3 sm:px-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-7 h-7 rounded bg-primary/20 border border-primary/50 text-primary">
            <Compass className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: '30s' }} />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-heading text-white tracking-tight">
              SagarAI
            </span>
            <Badge variant="outline" className="text-[9px] bg-sky-950/80 text-sky-400 border-sky-800 font-mono py-0">
              Marine Command Terminal
            </Badge>
          </div>
        </div>

        {/* Center Live Satellite & Agency Telemetry Ticker (Desktop) */}
        <div className="hidden xl:flex items-center gap-3 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-3 py-1 rounded border border-slate-800">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ISRO Oceansat-3 (SST/PFZ)
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-sky-400">IMD RSMC Cyclone Track</span>
          <span className="text-slate-700">|</span>
          <span className="text-amber-400">INCOIS Swell Alert</span>
          <span className="text-slate-700">|</span>
          <span className="text-rose-400">IMBL 5NM Buffer Active</span>
        </div>

        {/* Right Actions: Basemap Setting, SOS Distress Trigger */}
        <div className="flex items-center gap-2">
          {/* Basemap Settings Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsMapSettingsOpen(true)}
            className="h-7 px-2 text-[11px] border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 flex items-center gap-1.5"
            title="Configure Map Tiles & Carto API Key"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Basemap:</span>
            <span className="font-mono text-emerald-400 text-[10px] uppercase">
              {basemapProvider === 'esri-ocean' ? 'Esri Ocean' : basemapProvider === 'carto-dark' ? 'CARTO' : basemapProvider === 'esri-satellite' ? 'Satellite' : 'Nautical'}
            </span>
          </Button>

          {/* Emergency SOS Distress Button */}
          <Button
            size="sm"
            onClick={() => setIsSOSOpen(true)}
            className="h-7 px-2.5 text-[11px] bg-rose-600 hover:bg-rose-700 text-white font-bold tracking-wider shadow-md shadow-rose-950 flex items-center gap-1.5"
          >
            <LifeBuoy className="w-3.5 h-3.5 animate-bounce" />
            <span>{t.sosTrigger}</span>
          </Button>
        </div>
      </header>

      {/* Critical Hazard Alert Bar */}
      <div className="h-6 shrink-0 px-3 bg-red-950/60 border-b border-red-900/50 flex items-center gap-2 text-[10px] text-red-200 overflow-x-auto whitespace-nowrap">
        <span className="flex items-center gap-1 font-bold text-red-400 shrink-0 uppercase tracking-wide">
          <AlertTriangle className="w-3 h-3 text-red-400 animate-pulse" /> ADVISORY:
        </span>
        <span className="font-mono text-slate-300">
          Cyclone VARUNA (145 km/h) over Westcentral Bay • INCOIS 3.8m Swell Surge on Kerala Coast • Monitored Trawler IND-TN-09-MM-4421 is 2.8 NM from Sri Lanka IMBL (Safe Return Vector 255° WSW)
        </span>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden flex items-center bg-slate-900 border-b border-border text-xs shrink-0">
        <button
          onClick={() => setMobileTab('map')}
          className={`flex-1 py-1.5 text-center font-medium ${
            mobileTab === 'map' ? 'bg-primary text-white' : 'text-slate-400'
          }`}
        >
          GIS Command Map
        </button>
        <button
          onClick={() => setMobileTab('chat')}
          className={`flex-1 py-1.5 text-center font-medium ${
            mobileTab === 'chat' ? 'bg-primary text-white' : 'text-slate-400'
          }`}
        >
          AI Agent Chat
        </button>
        <button
          onClick={() => setMobileTab('operations')}
          className={`flex-1 py-1.5 text-center font-medium ${
            mobileTab === 'operations' ? 'bg-primary text-white' : 'text-slate-400'
          }`}
        >
          Safety & Ops
        </button>
      </div>

      {/* 2. Main 3-Column Tactical Workspace (Zero Overlap, Smooth Independent Scrolling) */}
      <div className="flex-1 min-h-0 w-full p-2 grid grid-cols-1 md:grid-cols-12 gap-2 overflow-hidden">
        {/* Left Column (4 cols on desktop, 3 cols on xl): Conversational Intelligence & 8-Agent Trace */}
        <section
          className={`md:col-span-4 xl:col-span-3 flex flex-col min-h-0 h-full ${
            mobileTab !== 'chat' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <ConversationalAgentPanel
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
            onTraceGenerated={setLatestTrace}
            onOpenMapSettings={() => setIsMapSettingsOpen(true)}
          />
        </section>

        {/* Center Column (5 cols on desktop, 6 cols on xl): Dedicated Full-Height GIS Ocean Command Map */}
        <section
          className={`md:col-span-5 xl:col-span-6 flex flex-col min-h-0 h-full ${
            mobileTab !== 'map' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <MarineMap
            selectedVesselId={selectedVesselId}
            activeRouteId={activeRouteId}
            basemapProvider={basemapProvider}
            cartoApiKey={cartoApiKey}
            onBasemapChange={handleBasemapChange}
            onOpenSettings={() => setIsMapSettingsOpen(true)}
            onSelectVessel={setSelectedVesselId}
          />
        </section>

        {/* Right Column (3 cols on desktop, 3 cols on xl): Tactical Operations Console (Safety, Geofence, Routes, Citations) */}
        <section
          className={`md:col-span-3 xl:col-span-3 flex flex-col min-h-0 h-full bg-slate-900 border border-border rounded-lg overflow-hidden shadow-xl ${
            mobileTab !== 'operations' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Operations Tab Header */}
          <div className="shrink-0 p-1.5 bg-slate-950 border-b border-border">
            <div className="grid grid-cols-3 gap-1 text-[11px]">
              <button
                onClick={() => setRightOpsTab('safety')}
                className={`py-1 rounded font-medium transition-all ${
                  rightOpsTab === 'safety'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                Safety & IMBL
              </button>
              <button
                onClick={() => setRightOpsTab('routing')}
                className={`py-1 rounded font-medium transition-all ${
                  rightOpsTab === 'routing'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                Weather Route
              </button>
              <button
                onClick={() => setRightOpsTab('agents')}
                className={`py-1 rounded font-medium transition-all ${
                  rightOpsTab === 'agents'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                8 Agents & EO
              </button>
            </div>
          </div>

          {/* Operations Scrollable Body */}
          <div className="flex-1 min-h-0 overflow-y-auto p-2.5 space-y-3">
            {rightOpsTab === 'safety' && (
              <SafetyAndGeofencingDashboard
                currentLanguage={currentLanguage}
                selectedVessel={selectedVessel}
                onOpenSOS={() => setIsSOSOpen(true)}
              />
            )}

            {rightOpsTab === 'routing' && (
              <RouteOptimizerPanel
                activeRouteId={activeRouteId}
                onSelectRoute={setActiveRouteId}
              />
            )}

            {rightOpsTab === 'agents' && (
              <div className="space-y-3 text-xs">
                {/* 8 Autonomous Specialized Agents List */}
                <div className="p-3 rounded-lg border border-border bg-slate-950 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-primary" /> Multi-Agent AI Core
                    </span>
                    <Badge variant="outline" className="text-[9px] bg-emerald-950 text-emerald-400 border-emerald-800 font-mono">
                      8 Agents Active
                    </Badge>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <div className="font-bold text-sky-400">1. Orchestrator & Planner</div>
                      <div className="text-[10px] text-slate-400">Task decomposition & dependency routing</div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <div className="font-bold text-sky-400">2. Earth Observation Discovery</div>
                      <div className="text-[10px] text-slate-400">Oceansat-3 SST fronts & Chlorophyll PFZ</div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <div className="font-bold text-sky-400">3. Weather & Cyclone Intelligence</div>
                      <div className="text-[10px] text-slate-400">IMD RSMC bulletin & Cyclone Varuna cone</div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <div className="font-bold text-sky-400">4. Ocean Analytics & PFZ</div>
                      <div className="text-[10px] text-slate-400">Wave height, swell surges & pelagic fish fit</div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <div className="font-bold text-rose-400">5. Geofencing & Boundary Reasoner</div>
                      <div className="text-[10px] text-slate-400">IMBL buffer calculation & safe return vectors</div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <div className="font-bold text-amber-400">6. Risk Assessment & Safety Index</div>
                      <div className="text-[10px] text-slate-400">0-100 composite index for vessel class</div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <div className="font-bold text-indigo-400">7. Route Optimization & Navigation</div>
                      <div className="text-[10px] text-slate-400">Cyclone-avoiding multi-waypoint courses</div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <div className="font-bold text-emerald-400">8. Explainable Advisory & Multilingual</div>
                      <div className="text-[10px] text-slate-400">9 Indian regional languages with TTS audio</div>
                    </div>
                  </div>
                </div>

                {/* Authoritative Satellite Citations */}
                <div className="p-3 rounded-lg border border-border bg-slate-950 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-primary" /> Verified EO Citations
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">Real-time Sync</span>
                  </div>
                  <div className="space-y-1.5">
                    {DATA_CITATIONS.map(c => (
                      <div key={c.id} className="p-1.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sky-400">{c.source}</span>
                          <span className="text-emerald-400">{c.reliabilityScore}%</span>
                        </div>
                        <div className="text-slate-300 font-sans text-[11px]">{c.dataset}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Modals: Map Settings / Carto API Key & SOS Distress */}
      <MapSettingsDialog
        isOpen={isMapSettingsOpen}
        onClose={() => setIsMapSettingsOpen(false)}
        currentBasemap={basemapProvider}
        onBasemapChange={handleBasemapChange}
        cartoApiKey={cartoApiKey}
        onCartoApiKeyChange={handleCartoApiKeyChange}
      />

      <SOSDistressModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        vessel={selectedVessel}
      />
    </div>
  );
};

export default MarinePlatformPage;
