import React, { useState } from 'react';
import { VesselPosition, SOSDispatchAlert } from '@/types/marine';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertOctagon,
  Radio,
  LifeBuoy,
  PhoneCall,
  CheckCircle2,
  Clock,
  Anchor,
  Send,
  X
} from 'lucide-react';

interface SOSDistressModalProps {
  isOpen: boolean;
  onClose: () => void;
  vessel: VesselPosition;
}

export const SOSDistressModal: React.FC<SOSDistressModalProps> = ({
  isOpen,
  onClose,
  vessel
}) => {
  const [emergencyType, setEmergencyType] = useState<SOSDispatchAlert['emergencyType']>('Engine Failure');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [broadcastActive, setBroadcastActive] = useState(false);

  if (!isOpen) return null;

  const handleBroadcastSOS = () => {
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      setBroadcastActive(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-rose-600 rounded-xl shadow-2xl overflow-hidden text-xs">
        {/* Modal Header */}
        <div className="bg-rose-950/90 border-b border-rose-600 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-400 animate-ping" />
            <div>
              <h3 className="font-bold text-white text-sm tracking-wide">
                MARITIME SOS DISTRESS BROADCAST
              </h3>
              <p className="text-[10px] text-rose-300 font-mono">
                Indian Coast Guard Distress System (MRCC Chennai / Kochi)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-3.5">
          {/* Vessel Coordinates & Telemetry */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Vessel Name:</span>
              <span className="font-bold text-white">{vessel.vesselName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Distress Coordinates:</span>
              <span className="font-bold text-rose-400">{vessel.currentCoords[0]}° N, {vessel.currentCoords[1]}° E</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Crew on Board:</span>
              <span className="text-slate-200">{vessel.crewCount} Personnel</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Emergency Channel:</span>
              <span className="text-amber-400">VHF Marine Ch 16 / DSC 2187.5 kHz</span>
            </div>
          </div>

          {!broadcastActive ? (
            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-xs">
                  Declare Nature of Distress:
                </label>
                <select
                  value={emergencyType}
                  onChange={e => setEmergencyType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  <option value="Engine Failure">Engine Failure / Dead in Water</option>
                  <option value="Severe Weather Capsizing">Severe Weather Rough Sea Capsizing</option>
                  <option value="Vessel Influx/Sinking">Hull Breach / Rapid Water Influx</option>
                  <option value="Man Overboard">Man Overboard (MOB)</option>
                  <option value="Medical Emergency">Severe Crew Medical Emergency</option>
                </select>
              </div>

              <div className="p-2.5 rounded bg-amber-950/40 border border-amber-800/80 text-[11px] text-amber-200 leading-tight">
                <strong>Attention:</strong> Activating this transmits instant digital distress alerts directly to the Indian Coast Guard Maritime Rescue Coordination Centre (MRCC) and all vessels within 25 NM radius.
              </div>

              <Button
                onClick={handleBroadcastSOS}
                disabled={isTransmitting}
                className="w-full h-11 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-900/50"
              >
                {isTransmitting ? (
                  <>
                    <Radio className="w-4 h-4 animate-spin" />
                    Transmitting Digital Distress Relay...
                  </>
                ) : (
                  <>
                    <LifeBuoy className="w-4 h-4" />
                    Transmit Instant Emergency SOS
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-600 text-emerald-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold text-white text-xs">
                    EMERGENCY DISTRESS BEACON ACKNOWLEDGED
                  </div>
                  <div className="text-[11px] text-emerald-300">
                    MRCC Coast Guard Station Mandapam / Chennai has registered distress event #ICG-2026-9012.
                  </div>
                </div>
              </div>

              {/* Nearest Responders Dispatch Ranking */}
              <div className="space-y-1.5">
                <div className="font-semibold text-slate-300 text-[11px]">
                  Nearest Rescue Assets Dispatched:
                </div>
                <div className="space-y-1.5 font-mono text-[10px]">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sky-400">ICG Interceptor Cutter C-438</div>
                      <div className="text-slate-400">Call Sign: ICG-MANDAPAM-ALPHA</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-bold">ETA: ~18 mins</div>
                      <div className="text-slate-400">Distance: 6.4 NM</div>
                    </div>
                  </div>

                  <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sky-400">Sister Trawler SAGAR MUTHU (IND-TN-09-MM-3104)</div>
                      <div className="text-slate-400">VHF Marine Ch 16 Connected</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-bold">ETA: ~14 mins</div>
                      <div className="text-slate-400">Distance: 3.1 NM</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Coast Guard MRCC Phone Helpline */}
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-bold text-white text-[11px]">Coast Guard Emergency Hotline:</div>
                    <div className="text-slate-400 text-[10px]">Toll-Free Search & Rescue: 1554</div>
                  </div>
                </div>
                <Badge variant="outline" className="bg-emerald-950 text-emerald-300 border-emerald-700">
                  MRCC 24x7
                </Badge>
              </div>

              <Button
                variant="outline"
                onClick={onClose}
                className="w-full h-8 text-xs border-slate-700 text-slate-300 hover:text-white"
              >
                Close Emergency Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
