import React from 'react';
import { CryptTarget, Captain, BotSettings } from '../types';
import { Crosshair, MapPin, Zap, Shield, Sparkles, Navigation } from 'lucide-react';

interface RadarMapProps {
  crypts: CryptTarget[];
  captains: Captain[];
  settings: BotSettings;
  onSelectCrypt?: (crypt: CryptTarget) => void;
  selectedCryptId?: string;
  isScanning?: boolean;
}

export const RadarMap: React.FC<RadarMapProps> = ({
  crypts,
  captains,
  settings,
  onSelectCrypt,
  selectedCryptId,
  isScanning = false,
}) => {
  const homeX = settings.homeCoords.x;
  const homeY = settings.homeCoords.y;
  const maxRadius = settings.maxSearchRadiusKm || 60;

  // Transform world coordinates (X, Y) relative to home city into SVG percentage coordinates
  const getSvgCoords = (targetX: number, targetY: number) => {
    const deltaX = targetX - homeX;
    const deltaY = targetY - homeY;
    // Map radius to canvas percentage (center is 50%, 50%)
    const scaleFactor = 40 / maxRadius; // 40% radius bounds
    const svgX = 50 + deltaX * scaleFactor;
    const svgY = 50 + deltaY * scaleFactor;
    return {
      x: Math.max(8, Math.min(92, svgX)),
      y: Math.max(8, Math.min(92, svgY)),
    };
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary':
        return { bg: 'bg-amber-500', border: 'border-amber-400', text: 'text-amber-300', fill: '#f59e0b', stroke: '#fbbf24' };
      case 'Epic':
        return { bg: 'bg-purple-500', border: 'border-purple-400', text: 'text-purple-300', fill: '#a855f7', stroke: '#c084fc' };
      case 'Rare':
        return { bg: 'bg-blue-500', border: 'border-blue-400', text: 'text-blue-300', fill: '#3b82f6', stroke: '#60a5fa' };
      default:
        return { bg: 'bg-emerald-500', border: 'border-emerald-400', text: 'text-emerald-300', fill: '#10b981', stroke: '#34d399' };
    }
  };

  return (
    <div className="bg-[#0F1116] border border-zinc-800 rounded-lg p-5 shadow-lg relative overflow-hidden flex flex-col">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-zinc-900 text-red-500 border border-zinc-800">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                Tactical Kingdom Radar
              </h3>
              {isScanning && (
                <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/80 animate-pulse">
                  Watchtower Scanning...
                </span>
              )}
            </div>
            <p className="text-[11px] font-mono uppercase text-zinc-500">
              SECTOR: K#{settings.homeCoords.k} | ORIGIN: ({homeX}, {homeY}) | RADIUS: {maxRadius} KM
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono uppercase bg-zinc-900/90 px-3 py-1.5 rounded border border-zinc-800">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Legendary
          </span>
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span> Epic
          </span>
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Rare
          </span>
        </div>
      </div>

      {/* Radar Map Canvas Container */}
      <div className="relative w-full aspect-[16/10] bg-[#0B0C0E] rounded-lg border border-zinc-800 overflow-hidden flex items-center justify-center">
        {/* Tactical Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4%_4%] opacity-20" />
        
        {/* Radar Range Rings */}
        <div className="absolute w-[25%] h-[25%] rounded-full border border-zinc-800 pointer-events-none" />
        <div className="absolute w-[50%] h-[50%] rounded-full border border-zinc-800 pointer-events-none" />
        <div className="absolute w-[75%] h-[75%] rounded-full border border-zinc-800/80 pointer-events-none" />
        <div className="absolute w-[95%] h-[95%] rounded-full border border-red-900/40 pointer-events-none" />

        {/* Crosshair Axes */}
        <div className="absolute w-full h-px bg-zinc-800 pointer-events-none" />
        <div className="absolute h-full w-px bg-zinc-800 pointer-events-none" />

        {/* Scanning Sweep Effect */}
        {isScanning && (
          <div className="absolute inset-0 origin-center animate-[spin_4s_linear_infinite] pointer-events-none">
            <div className="w-1/2 h-1/2 bg-gradient-to-br from-red-600/20 via-red-600/5 to-transparent rounded-tl-full" />
          </div>
        )}

        {/* SVG March Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {captains.map((cap) => {
            if ((cap.status === 'marching' || cap.status === 'exploring') && cap.targetCrypt) {
              const targetCoords = getSvgCoords(cap.targetCrypt.coords.x, cap.targetCrypt.coords.y);
              return (
                <g key={`march-${cap.id}`}>
                  {/* Dotted path */}
                  <line
                    x1="50%"
                    y1="50%"
                    x2={`${targetCoords.x}%`}
                    y2={`${targetCoords.y}%`}
                    stroke="#dc2626"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="animate-[dash_1s_linear_infinite]"
                  />
                  {/* Animated dot marching */}
                  <circle
                    cx={`${50 + (targetCoords.x - 50) * (1 - (cap.marchTimeRemaining / (cap.marchTimeTotal || 1)))}%`}
                    cy={`${50 + (targetCoords.y - 50) * (1 - (cap.marchTimeRemaining / (cap.marchTimeTotal || 1)))}%`}
                    r="4"
                    fill="#ef4444"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                </g>
              );
            }
            return null;
          })}
        </svg>

        {/* Home Player City Node (Center) */}
        <div 
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
          style={{ left: '50%', top: '50%' }}
        >
          <div className="relative">
            <div className="w-8 h-8 rounded bg-red-600 border-2 border-white flex items-center justify-center text-sm shadow-lg shadow-red-600/40">
              🏰
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border border-zinc-900 animate-pulse" />
          </div>
          <span className="text-[9px] font-mono font-bold uppercase text-white bg-zinc-900 px-2 py-0.5 rounded mt-1 border border-zinc-700 whitespace-nowrap shadow">
            CITY ({homeX}, {homeY})
          </span>
        </div>

        {/* Crypt Targets on Map */}
        {crypts.map((crypt) => {
          const pos = getSvgCoords(crypt.coords.x, crypt.coords.y);
          const rarityStyle = getRarityColor(crypt.rarity);
          const isSelected = selectedCryptId === crypt.id;
          const assignedCaptain = captains.find(c => c.targetCrypt?.id === crypt.id);

          return (
            <div
              key={crypt.id}
              onClick={() => onSelectCrypt && onSelectCrypt(crypt)}
              className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 ${
                isSelected ? 'scale-125 ring-2 ring-red-500 rounded-full' : ''
              }`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              title={`Lv.${crypt.level} ${crypt.rarity} Crypt (${crypt.coords.x}, ${crypt.coords.y}) - ${crypt.distanceKm}km`}
            >
              <div className="relative flex flex-col items-center">
                {/* Crypt Icon Pin */}
                <div
                  className={`w-7 h-7 rounded flex items-center justify-center text-xs border-2 shadow-md ${rarityStyle.bg} ${rarityStyle.border} text-white font-black`}
                >
                  💀
                </div>

                {/* Level Badge */}
                <span className={`text-[9px] font-mono font-black px-1 rounded-sm bg-zinc-950 text-white border ${rarityStyle.border} -mt-1 shadow whitespace-nowrap`}>
                  Lv.{crypt.level}
                </span>

                {/* Captain active indicator */}
                {assignedCaptain && (
                  <span className="text-[9px] px-1 bg-red-600 text-white font-bold uppercase rounded mt-0.5 animate-bounce">
                    {assignedCaptain.name}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Distance Range Marker Tag */}
        <div className="absolute bottom-2 left-2 text-[10px] text-zinc-500 bg-zinc-900/90 px-2 py-0.5 rounded border border-zinc-800 font-mono uppercase">
          RADAR SCALE: ~{maxRadius}KM
        </div>

        {/* Live Detected Crypt Count */}
        <div className="absolute top-2 right-2 text-[10px] text-zinc-300 bg-zinc-900/90 px-2.5 py-1 rounded border border-zinc-800 flex items-center gap-2 font-mono uppercase">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-bold text-green-400">{crypts.length} CRYPTS IN SECTOR</span>
        </div>
      </div>
    </div>
  );
};
