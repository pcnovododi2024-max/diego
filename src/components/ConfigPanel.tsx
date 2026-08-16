import React from 'react';
import { BotSettings, Captain } from '../types';
import { 
  Sliders, 
  Shield, 
  Zap, 
  MapPin, 
  Clock, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Crosshair,
  Gem,
  Award
} from 'lucide-react';

interface ConfigPanelProps {
  settings: BotSettings;
  captains: Captain[];
  onUpdateSettings: (newSettings: Partial<BotSettings>) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  settings,
  captains,
  onUpdateSettings,
}) => {
  const levelPresets = [
    { label: 'Starter (1 - 10)', min: 1, max: 10 },
    { label: 'Core Farm (11 - 20)', min: 11, max: 20 },
    { label: 'Advanced (21 - 25)', min: 21, max: 25 },
    { label: 'Epic Raids (26 - 30)', min: 26, max: 30 },
    { label: 'Celestial (31 - 35+)', min: 31, max: 35 },
  ];

  const handleToggleCaptain = (captainId: string) => {
    const active = [...settings.activeCaptainIds];
    const index = active.indexOf(captainId);
    if (index > -1) {
      if (active.length > 1) {
        active.splice(index, 1);
      }
    } else {
      active.push(captainId);
    }
    onUpdateSettings({ activeCaptainIds: active });
  };

  return (
    <div className="space-y-6">
      {/* Top Title Banner */}
      <div className="bg-[#0F1116] border border-zinc-800 rounded-lg p-5 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-red-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-tight">
              Crypt Rider Strategy & Filter Rules
            </h2>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Configure Watchtower search queries, squad rotations, and anti-pattern humanization.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Crypt Target Filter Rules */}
        <div className="bg-[#0F1116] border border-zinc-800 rounded-lg p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Gem className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-black text-white uppercase tracking-tight">Level & Rarity Filters</h3>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-400 block mb-2">
              Quick Level Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {levelPresets.map((preset) => {
                const isSelected =
                  settings.minCryptLevel === preset.min && settings.maxCryptLevel === preset.max;
                return (
                  <button
                    key={preset.label}
                    onClick={() =>
                      onUpdateSettings({
                        minCryptLevel: preset.min,
                        maxCryptLevel: preset.max,
                      })
                    }
                    className={`px-2.5 py-2 rounded text-[11px] font-black uppercase tracking-wider border transition ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-500 shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manual Level Range Sliders */}
          <div className="bg-[#0A0B0D] p-3.5 rounded border border-zinc-800 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-zinc-400 uppercase text-[10px]">Min Crypt Level</span>
                <span className="text-white font-bold">Lv. {settings.minCryptLevel}</span>
              </div>
              <input
                type="range"
                min="1"
                max="35"
                value={settings.minCryptLevel}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  onUpdateSettings({
                    minCryptLevel: Math.min(val, settings.maxCryptLevel),
                  });
                }}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-zinc-400 uppercase text-[10px]">Max Crypt Level</span>
                <span className="text-white font-bold">Lv. {settings.maxCryptLevel}</span>
              </div>
              <input
                type="range"
                min="1"
                max="35"
                value={settings.maxCryptLevel}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  onUpdateSettings({
                    maxCryptLevel: Math.max(val, settings.minCryptLevel),
                  });
                }}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Rarity Checkboxes */}
          <div>
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-400 block mb-2">
              Allowed Crypt Rarities
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'legendary', label: 'Legendary', color: 'text-yellow-400 border-yellow-800/80 bg-yellow-950/40' },
                { key: 'epic', label: 'Epic', color: 'text-purple-400 border-purple-800/80 bg-purple-950/40' },
                { key: 'rare', label: 'Rare', color: 'text-blue-400 border-blue-800/80 bg-blue-950/40' },
                { key: 'common', label: 'Common', color: 'text-zinc-300 border-zinc-700 bg-zinc-900' },
              ].map((r) => {
                const isChecked = settings.rarities[r.key as keyof typeof settings.rarities];
                return (
                  <button
                    key={r.key}
                    onClick={() =>
                      onUpdateSettings({
                        rarities: {
                          ...settings.rarities,
                          [r.key]: !isChecked,
                        },
                      })
                    }
                    className={`p-2 rounded border text-xs font-bold uppercase flex items-center justify-between transition ${
                      isChecked
                        ? r.color
                        : 'bg-[#0A0B0D] text-zinc-600 border-zinc-800'
                    }`}
                  >
                    <span className="text-[11px]">{r.label}</span>
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center text-[9px] font-mono ${
                        isChecked ? 'bg-red-600 text-white font-bold' : 'bg-zinc-800'
                      }`}
                    >
                      {isChecked ? '✓' : ''}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Squad Captains & Rotation Rules */}
        <div className="bg-[#0F1116] border border-zinc-800 rounded-lg p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Shield className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-black text-white uppercase tracking-tight">Active Squad & Rotation</h3>
          </div>

          <p className="text-xs text-zinc-400 font-sans">
            Select which Captains the automation bot will cycle through in the march deployment modal.
          </p>

          <div className="space-y-2">
            {captains.map((cap, idx) => {
              const isSelected = settings.activeCaptainIds.includes(cap.id);
              return (
                <div
                  key={cap.id}
                  onClick={() => handleToggleCaptain(cap.id)}
                  className={`p-2.5 rounded border cursor-pointer flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-zinc-900 border-zinc-700 shadow'
                      : 'bg-[#0A0B0D] border-zinc-800 opacity-50 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{cap.avatar}</span>
                    <div>
                      <div className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                        <span>{cap.name}</span>
                        <span className="text-[9px] font-mono text-zinc-400">Lv.{cap.level}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono uppercase">
                        SLOT #{idx + 1} • {cap.speedMultiplier}x SPEED
                      </span>
                    </div>
                  </div>

                  <div
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-zinc-900 text-zinc-600 border-zinc-800'
                    }`}
                  >
                    {isSelected ? 'IN QUEUE' : 'OFF'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search Radius */}
          <div className="bg-[#0A0B0D] p-3.5 rounded border border-zinc-800">
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="text-zinc-400 uppercase text-[10px]">Max Radius (Distance)</span>
              <span className="text-white font-bold">{settings.maxSearchRadiusKm} KM</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={settings.maxSearchRadiusKm}
              onChange={(e) => onUpdateSettings({ maxSearchRadiusKm: parseInt(e.target.value) || 50 })}
              className="w-full accent-red-600 cursor-pointer"
            />
          </div>
        </div>

        {/* 3. Stamina, Anti-Detection & City Coordinates */}
        <div className="bg-[#0F1116] border border-zinc-800 rounded-lg p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Zap className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-black text-white uppercase tracking-tight">Stamina & Safety Delays</h3>
          </div>

          {/* Home Coordinates Input */}
          <div className="bg-[#0A0B0D] p-3.5 rounded border border-zinc-800 space-y-2">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              City Origin Coordinates
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[9px] font-mono uppercase text-zinc-500">Kingdom (K)</span>
                <input
                  type="number"
                  value={settings.homeCoords.k}
                  onChange={(e) =>
                    onUpdateSettings({
                      homeCoords: { ...settings.homeCoords, k: parseInt(e.target.value) || 1 },
                    })
                  }
                  className="w-full bg-zinc-900 text-white font-mono font-bold text-xs px-2 py-1 rounded border border-zinc-700 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase text-zinc-500">Coord X</span>
                <input
                  type="number"
                  value={settings.homeCoords.x}
                  onChange={(e) =>
                    onUpdateSettings({
                      homeCoords: { ...settings.homeCoords, x: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full bg-zinc-900 text-white font-mono font-bold text-xs px-2 py-1 rounded border border-zinc-700 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase text-zinc-500">Coord Y</span>
                <input
                  type="number"
                  value={settings.homeCoords.y}
                  onChange={(e) =>
                    onUpdateSettings({
                      homeCoords: { ...settings.homeCoords, y: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full bg-zinc-900 text-white font-mono font-bold text-xs px-2 py-1 rounded border border-zinc-700 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Auto Stamina Potion */}
          <div className="bg-[#0A0B0D] p-3.5 rounded border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-500" />
                Auto-Use Energy Potions
              </label>
              <input
                type="checkbox"
                checked={settings.autoStaminaPotion}
                onChange={(e) => onUpdateSettings({ autoStaminaPotion: e.target.checked })}
                className="w-4 h-4 accent-red-600 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-zinc-400 font-sans">
              When energy is below 15, automatically clicks the 100 Stamina Potion button to sustain the loop.
            </p>
          </div>

          {/* Humanized Anti-Pattern Delays */}
          <div className="bg-[#0A0B0D] p-3.5 rounded border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-red-500" />
                Anti-Detection Jitter
              </label>
              <input
                type="checkbox"
                checked={settings.humanizeDelays}
                onChange={(e) => onUpdateSettings({ humanizeDelays: e.target.checked })}
                className="w-4 h-4 accent-red-600 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-zinc-400 font-sans">
              Adds randomized ±2px coordinate variance and 150-450ms dynamic delay intervals between clicks to evade detection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
