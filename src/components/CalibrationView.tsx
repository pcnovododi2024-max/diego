import React, { useState } from 'react';
import { ScreenCoordinate } from '../types';
import { 
  Crosshair, 
  RotateCcw, 
  Check, 
  Move, 
  Info, 
  Sliders, 
  Play, 
  Monitor, 
  ChevronRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { CALIBRATED_COORDINATES_1360x768 } from '../data/calibration1360';
import { soundManager } from '../utils/audio';

interface CalibrationViewProps {
  coordinates: ScreenCoordinate[];
  onUpdateCoordinate: (id: string, newX: number, newY: number) => void;
  onResetCoordinates: () => void;
}

export const CalibrationView: React.FC<CalibrationViewProps> = ({
  coordinates,
  onUpdateCoordinate,
  onResetCoordinates,
}) => {
  const [selectedCoordId, setSelectedCoordId] = useState<string>('watchtower_btn');
  const [testClickEffect, setTestClickEffect] = useState<{ x: number; y: number } | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const selectedCoord = coordinates.find(c => c.id === selectedCoordId) || coordinates[0];

  const handleTestClick = (coord: ScreenCoordinate) => {
    soundManager.playMarchSend();
    // Calculate relative percentage on 1360 x 768 canvas
    const pctX = (coord.x / 1360) * 100;
    const pctY = (coord.y / 768) * 100;
    setTestClickEffect({ x: pctX, y: pctY });
    setTimeout(() => {
      setTestClickEffect(null);
    }, 1200);
  };

  const handleAdjust = (deltaX: number, deltaY: number) => {
    if (!selectedCoord) return;
    const nextX = Math.max(0, Math.min(1360, selectedCoord.x + deltaX));
    const nextY = Math.max(0, Math.min(768, selectedCoord.y + deltaY));
    onUpdateCoordinate(selectedCoord.id, nextX, nextY);
  };

  const filteredCoordinates = filterCategory === 'all'
    ? coordinates
    : coordinates.filter(c => c.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-[#0F1116] border border-zinc-800 rounded-lg p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-red-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            <Crosshair className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
              1360 × 768 Native Screen Pixel Calibrator
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-bold uppercase">
                100% Calibrated
              </span>
            </h2>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Calibrated matrix for 1360x768 resolution. Every button and slot offset is mapped with absolute pixel targets.
            </p>
          </div>
        </div>

        <button
          onClick={onResetCoordinates}
          className="flex items-center gap-2 px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-800 text-xs font-black uppercase tracking-wider text-zinc-300 border border-zinc-800 transition active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Main Grid: Interactive Canvas & Parameter Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 1360x768 Game Screen Interactive Viewport */}
        <div className="lg:col-span-8 bg-[#0F1116] border border-zinc-800 rounded-lg p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-black text-white uppercase tracking-tight">
                Visual Total Battle 1360×768 Viewport Matrix
              </h3>
            </div>
            <div className="text-[11px] text-zinc-500 font-mono uppercase font-bold">
              BOUNDS: 1360px × 768px (16:9)
            </div>
          </div>

          {/* Interactive Screen Simulation Canvas */}
          <div 
            className="relative w-full aspect-[1360/768] bg-[#0A0B0D] rounded border border-zinc-800 overflow-hidden shadow-2xl select-none"
            id="viewport-canvas-1360"
          >
            {/* Total Battle Mock Interface Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B0D] via-[#0F1116] to-[#0A0B0D] opacity-90" />
            
            {/* Mock Top Resource Bar */}
            <div className="absolute top-0 left-0 right-0 h-[8%] bg-[#0D0F12] border-b border-zinc-800 flex items-center justify-between px-3 text-[10px] text-zinc-400 pointer-events-none font-mono uppercase">
              <span className="font-bold text-white">TOTAL BATTLE // 1360×768 STABLE</span>
              <div className="flex items-center gap-3 text-zinc-400 font-bold">
                <span>🌾 FOOD: 2.4M</span>
                <span>🪵 WOOD: 1.8M</span>
                <span>⛏️ IRON: 950K</span>
                <span className="text-yellow-500">🪙 GOLD: 45K</span>
              </div>
            </div>

            {/* Mock Watchtower Dialog Box */}
            <div className="absolute top-[18%] left-[28%] w-[44%] h-[68%] rounded bg-[#0D0F12] border border-zinc-800 shadow-2xl p-2.5 pointer-events-none flex flex-col">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-1 mb-1">
                <span className="text-[10px] font-black uppercase text-red-400">Watchtower Exploration</span>
                <span className="text-[9px] text-zinc-500 font-mono uppercase">1360x768 MODE</span>
              </div>
              <div className="flex gap-2 text-[9px] font-mono uppercase text-zinc-500 border-b border-zinc-800 pb-1 mb-2">
                <span className="text-white font-bold">Crypts</span>
                <span>Monsters</span>
                <span>Citadels</span>
                <span>Mines</span>
              </div>
              <div className="flex-1 flex flex-col justify-around text-[9px] font-mono uppercase text-zinc-400 px-1">
                <div className="flex justify-between items-center bg-[#0A0B0D] p-1 rounded border border-zinc-800">
                  <span>CRYPT LEVEL: 1 - 35</span>
                  <span className="text-red-400 font-bold">RARE FILTER: ACTIVE</span>
                </div>
                <div className="bg-[#0A0B0D] p-1.5 rounded border border-zinc-800 text-zinc-300">
                  <div className="text-[9px] font-bold text-green-400">DETECTED: LV.25 EPIC CRYPT</div>
                  <div className="text-[8px] text-zinc-500">COORDS: (532, 795) • 24.5KM</div>
                </div>
                <div className="flex justify-between items-center text-[9px]">
                  <span>CAPTAIN DISPATCH</span>
                  <span className="text-green-400 font-bold">READY</span>
                </div>
              </div>
            </div>

            {/* Test Click Ripple Animation */}
            {testClickEffect && (
              <div
                className="absolute z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{ left: `${testClickEffect.x}%`, top: `${testClickEffect.y}%` }}
              >
                <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 border border-white"></span>
              </div>
            )}

            {/* Render Calibrated Pin Markers on Screen */}
            {coordinates.map((coord, idx) => {
              const pctX = (coord.x / 1360) * 100;
              const pctY = (coord.y / 768) * 100;
              const isSelected = selectedCoordId === coord.id;

              return (
                <div
                  key={coord.id}
                  onClick={() => {
                    setSelectedCoordId(coord.id);
                    handleTestClick(coord);
                  }}
                  className={`absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                    isSelected ? 'scale-125 z-40' : 'hover:scale-110 opacity-85 hover:opacity-100'
                  }`}
                  style={{ left: `${pctX}%`, top: `${pctY}%` }}
                  title={`${coord.name} [X: ${coord.x}, Y: ${coord.y}]`}
                >
                  <div className="relative flex flex-col items-center group">
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center text-[9px] font-mono font-black text-white shadow-lg border ${
                        isSelected
                          ? 'ring-2 ring-red-500 border-white bg-red-600 scale-110 shadow-[0_0_12px_rgba(220,38,38,0.6)]'
                          : 'border-zinc-800 bg-zinc-900'
                      }`}
                      style={{ backgroundColor: isSelected ? '#dc2626' : coord.color }}
                    >
                      {idx + 1}
                    </div>
                    {isSelected && (
                      <span className="absolute -bottom-5 bg-zinc-900 text-red-400 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border border-zinc-700 whitespace-nowrap shadow-md">
                        {coord.x}, {coord.y}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-zinc-500 font-mono">
            <span>Click any target pin on the viewport to inspect or test click.</span>
            <span className="text-zinc-400 font-bold">ASPECT: 16:9 (1360×768)</span>
          </div>
        </div>

        {/* Right Column: Coordinate Editor & Fine Tuning Controls */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Pin Editor Card */}
          {selectedCoord && (
            <div className="bg-[#0F1116] border border-zinc-800 rounded-lg p-5 shadow-xl flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: selectedCoord.color }}
                  />
                  <h4 className="text-sm font-black text-white uppercase">{selectedCoord.name}</h4>
                </div>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 uppercase border border-zinc-800">
                  {selectedCoord.category}
                </span>
              </div>

              <p className="text-xs text-zinc-400 font-sans leading-relaxed">{selectedCoord.description}</p>

              {/* Exact Numerical Inputs */}
              <div className="grid grid-cols-2 gap-3 bg-[#0A0B0D] p-3 rounded border border-zinc-800">
                <div>
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400 flex items-center justify-between">
                    <span>X Coord</span>
                    <span className="text-[9px] text-zinc-600 font-mono">0-1360</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1360"
                    value={selectedCoord.x}
                    onChange={(e) => onUpdateCoordinate(selectedCoord.id, parseInt(e.target.value) || 0, selectedCoord.y)}
                    className="w-full bg-zinc-900 text-white font-mono font-bold text-sm px-2.5 py-2 rounded border border-zinc-700 mt-1 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400 flex items-center justify-between">
                    <span>Y Coord</span>
                    <span className="text-[9px] text-zinc-600 font-mono">0-768</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="768"
                    value={selectedCoord.y}
                    onChange={(e) => onUpdateCoordinate(selectedCoord.id, selectedCoord.x, parseInt(e.target.value) || 0)}
                    className="w-full bg-zinc-900 text-white font-mono font-bold text-sm px-2.5 py-2 rounded border border-zinc-700 mt-1 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* D-Pad Fine Tuning Offsets */}
              <div>
                <div className="text-[10px] font-mono uppercase font-bold text-zinc-500 mb-2 flex items-center gap-1">
                  <Move className="w-3.5 h-3.5 text-zinc-400" />
                  Nudge Pixel Offset (±2px)
                </div>
                <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto">
                  <div />
                  <button
                    onClick={() => handleAdjust(0, -2)}
                    className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 text-xs font-bold transition active:scale-95"
                    title="Nudge Up 2px"
                  >
                    ▲
                  </button>
                  <div />
                  <button
                    onClick={() => handleAdjust(-2, 0)}
                    className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 text-xs font-bold transition active:scale-95"
                    title="Nudge Left 2px"
                  >
                    ◀
                  </button>
                  <button
                    onClick={() => handleTestClick(selectedCoord)}
                    className="p-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-black transition active:scale-95 flex items-center justify-center shadow-[0_0_10px_rgba(220,38,38,0.3)]"
                    title="Test Click on Target"
                  >
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                  <button
                    onClick={() => handleAdjust(2, 0)}
                    className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 text-xs font-bold transition active:scale-95"
                    title="Nudge Right 2px"
                  >
                    ▶
                  </button>
                  <div />
                  <button
                    onClick={() => handleAdjust(0, 2)}
                    className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 text-xs font-bold transition active:scale-95"
                    title="Nudge Down 2px"
                  >
                    ▼
                  </button>
                  <div />
                </div>
              </div>

              {/* Test Click Button */}
              <button
                onClick={() => handleTestClick(selectedCoord)}
                className="w-full py-2.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-zinc-700 shadow transition"
              >
                <Crosshair className="w-4 h-4 text-red-500" />
                <span>Simulate Target Click</span>
              </button>
            </div>
          )}

          {/* Coordinate List Overview */}
          <div className="bg-[#0F1116] border border-zinc-800 rounded-lg p-4 shadow-xl max-h-[290px] overflow-y-auto space-y-1.5">
            <div className="text-xs font-black uppercase text-zinc-300 mb-2 px-1 flex items-center justify-between">
              <span>All Click Targets ({coordinates.length})</span>
            </div>

            {coordinates.map((coord, idx) => {
              const isSelected = selectedCoordId === coord.id;
              return (
                <button
                  key={coord.id}
                  onClick={() => {
                    setSelectedCoordId(coord.id);
                    handleTestClick(coord);
                  }}
                  className={`w-full text-left p-2 rounded text-xs flex items-center justify-between border transition ${
                    isSelected
                      ? 'bg-red-950/40 border-red-800 text-white'
                      : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-4 h-4 rounded flex items-center justify-center text-[9px] font-mono font-bold text-white shrink-0"
                      style={{ backgroundColor: coord.color }}
                    >
                      {idx + 1}
                    </span>
                    <span className="truncate uppercase font-bold text-[11px]">{coord.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500 shrink-0 ml-2">
                    ({coord.x}, {coord.y})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
