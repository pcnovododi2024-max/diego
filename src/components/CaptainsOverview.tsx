import React from 'react';
import { Captain, BotSettings } from '../types';
import { Shield, Zap, Clock, Compass, PlusCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

interface CaptainsOverviewProps {
  captains: Captain[];
  settings: BotSettings;
  onRefillStamina: (captainId: string) => void;
  onToggleCaptainActive: (captainId: string) => void;
  onManualDispatch?: (captainId: string) => void;
}

export const CaptainsOverview: React.FC<CaptainsOverviewProps> = ({
  captains,
  settings,
  onRefillStamina,
  onToggleCaptainActive,
  onManualDispatch,
}) => {
  const getStatusBadge = (status: Captain['status']) => {
    switch (status) {
      case 'marching':
        return { label: 'MARCHING', bg: 'bg-red-950/80 text-red-400 border-red-800' };
      case 'exploring':
        return { label: 'EXPLORING CRYPT', bg: 'bg-green-950/80 text-green-400 border-green-800' };
      case 'returning':
        return { label: 'RETURNING', bg: 'bg-blue-950/80 text-blue-400 border-blue-800' };
      case 'resting':
        return { label: 'ENERGY DEPLETED', bg: 'bg-zinc-900 text-zinc-500 border-zinc-800' };
      default:
        return { label: 'READY (IDLE)', bg: 'bg-zinc-900 text-zinc-300 border-zinc-700' };
    }
  };

  const getRarityBadge = (rarity: Captain['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return 'text-yellow-400 bg-yellow-950/40 border-yellow-800/80';
      case 'epic':
        return 'text-purple-400 bg-purple-950/40 border-purple-800/80';
      default:
        return 'text-blue-400 bg-blue-950/40 border-blue-800/80';
    }
  };

  return (
    <div className="bg-[#0F1116] border border-zinc-800 rounded-lg p-5 shadow-lg flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-zinc-900 text-red-500 border border-zinc-800">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
              Captain Exploration Squad
              <span className="text-[10px] font-mono text-zinc-400 font-bold">
                [{settings.activeCaptainIds.length} / {captains.length} ACTIVE]
              </span>
            </h3>
            <p className="text-[11px] font-mono uppercase text-zinc-500">
              Auto-rotated in sequence by Watchtower dispatcher
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Captain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {captains.map((captain, idx) => {
          const isActive = settings.activeCaptainIds.includes(captain.id);
          const statusStyle = getStatusBadge(captain.status);
          const rarityStyle = getRarityBadge(captain.rarity);
          const staminaPercent = Math.round((captain.currentStamina / captain.maxStamina) * 100);
          const isMarching = captain.status === 'marching' || captain.status === 'exploring';
          const marchPercent = captain.marchTimeTotal > 0 
            ? Math.max(0, Math.min(100, Math.round(((captain.marchTimeTotal - captain.marchTimeRemaining) / captain.marchTimeTotal) * 100))) 
            : 0;

          return (
            <div
              key={captain.id}
              className={`rounded-lg p-4 border transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-zinc-900/90 border-zinc-700/90 shadow-md'
                  : 'bg-zinc-950/60 border-zinc-800/60 opacity-60'
              }`}
            >
              {/* Top Details */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#0A0B0D] border border-zinc-700 flex items-center justify-center text-xl shadow-inner relative">
                      {captain.avatar}
                      <span className="absolute -bottom-1 -right-1 text-[9px] font-mono font-bold px-1 bg-zinc-800 text-white rounded border border-zinc-700">
                        #{idx + 1}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-black text-white uppercase">{captain.name}</h4>
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase border ${rarityStyle}`}>
                          Lv.{captain.level}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">{captain.title} • {captain.speedMultiplier}x SPEED</p>
                    </div>
                  </div>

                  {/* Active Squad Checkbox */}
                  <button
                    onClick={() => onToggleCaptainActive(captain.id)}
                    title={isActive ? 'Disable Captain from automation loop' : 'Include Captain in automation loop'}
                    className={`px-2 py-1 rounded border text-[10px] font-mono font-bold uppercase flex items-center gap-1 transition ${
                      isActive
                        ? 'bg-red-600 text-white border-red-500 shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{isActive ? 'Active' : 'Standby'}</span>
                  </button>
                </div>

                {/* Status & Current Target */}
                <div className="flex items-center justify-between text-xs mb-3 font-mono">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusStyle.bg}`}>
                    {statusStyle.label}
                  </span>
                  {captain.targetCrypt ? (
                    <span className="text-[10px] text-red-400 font-mono font-bold truncate max-w-[140px] uppercase">
                      Lv.{captain.targetCrypt.level} {captain.targetCrypt.rarity} ({captain.targetCrypt.distanceKm}km)
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-500 uppercase">Awaiting Crypt</span>
                  )}
                </div>

                {/* March Timer Bar (if marching) */}
                {isMarching && (
                  <div className="mb-3 bg-[#0A0B0D] p-2.5 rounded border border-zinc-800">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase text-zinc-300 mb-1.5">
                      <span className="flex items-center gap-1.5 text-red-400 font-bold">
                        <Clock className="w-3 h-3 animate-spin" />
                        March Countdown
                      </span>
                      <span className="font-mono text-white font-black">{captain.marchTimeRemaining}s</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-600 transition-all duration-1000"
                        style={{ width: `${marchPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Stamina Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase mb-1">
                    <span className="flex items-center gap-1 text-zinc-400 font-bold">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      ENERGY ({captain.currentStamina}/{captain.maxStamina})
                    </span>
                    <span className={`font-mono font-black ${staminaPercent <= 20 ? 'text-red-400' : 'text-white'}`}>
                      {staminaPercent}%
                    </span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        staminaPercent <= 20
                          ? 'bg-red-600'
                          : staminaPercent <= 50
                          ? 'bg-yellow-600'
                          : 'bg-green-600'
                      }`}
                      style={{ width: `${staminaPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Quick Controls */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-[10px] font-mono uppercase">
                <span className="text-zinc-500">
                  RUNS: <strong className="text-white font-bold">{captain.totalCryptsExplored}</strong>
                </span>

                <button
                  onClick={() => onRefillStamina(captain.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold border border-zinc-700 transition"
                  title="Use 100 Stamina Potion"
                >
                  <PlusCircle className="w-3 h-3 text-red-400" />
                  <span>+100 POTION</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
