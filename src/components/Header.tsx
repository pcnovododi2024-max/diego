import React from 'react';
import { 
  Play, 
  Pause, 
  Monitor, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Compass, 
  Sliders, 
  Crosshair, 
  FileCode, 
  BarChart3, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { BotSettings, ResolutionKey } from '../types';

interface HeaderProps {
  isRunning: boolean;
  onToggleRun: () => void;
  settings: BotSettings;
  onUpdateSettings: (newSettings: Partial<BotSettings>) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  activeCaptainsCount: number;
  runtimeFormatted: string;
  onOpenGuide: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isRunning,
  onToggleRun,
  settings,
  onUpdateSettings,
  activeTab,
  onSelectTab,
  activeCaptainsCount,
  runtimeFormatted,
  onOpenGuide,
  soundEnabled,
  onToggleSound,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Tactical Radar & Squad', icon: Compass },
    { id: 'calibration', label: '1360x768 Calibration', icon: Crosshair, badge: 'Target' },
    { id: 'config', label: 'Crypt & Squad Filters', icon: Sliders },
    { id: 'scripts', label: 'AHK / Python Exporter', icon: FileCode, badge: 'Macro' },
    { id: 'analytics', label: 'Loot & ROI Yield', icon: BarChart3 },
  ];

  return (
    <header className="bg-[#0F1116] border-b border-zinc-800 sticky top-0 z-40 shadow-xl">
      {/* Top Main Status Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-4">
          <div className="relative w-10 h-10 bg-red-600 rounded flex items-center justify-center font-black text-white text-xl shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            CR
            {isRunning && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-[#0F1116]"></span>
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white uppercase">
                Crypt Rider <span className="text-red-500 italic text-sm font-bold">v4.2.0 PRO</span>
              </h1>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
              Total Battle Strategic Optimizer
            </p>
          </div>
        </div>

        {/* Center: Resolution selector & stats */}
        <div className="hidden lg:flex items-center gap-4 font-mono text-[11px]">
          <div className="flex flex-col items-start bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-sans font-bold">Display Calibrated</span>
            <select
              value={settings.resolution}
              onChange={(e) => onUpdateSettings({ resolution: e.target.value as ResolutionKey })}
              className="bg-transparent text-red-400 font-mono font-bold outline-none cursor-pointer text-xs"
            >
              <option value="1360x768" className="bg-zinc-900 text-white">1360 × 768 (Native Calibrated)</option>
              <option value="1366x768" className="bg-zinc-900 text-white">1366 × 768 (Laptop Std)</option>
              <option value="1920x1080" className="bg-zinc-900 text-white">1920 × 1080 (FHD Scaled)</option>
              <option value="custom" className="bg-zinc-900 text-white">Custom Resolution</option>
            </select>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-zinc-500 uppercase tracking-wider text-[10px]">BOT STATUS</span>
            <span className={isRunning ? 'text-green-400 font-bold' : 'text-zinc-400 font-bold'}>
              {isRunning ? '● ACTIVE / OPTIMIZING' : '○ STANDBY'}
            </span>
          </div>

          <div className="w-px h-7 bg-zinc-800"></div>

          <div className="flex flex-col items-end">
            <span className="text-zinc-500 uppercase tracking-wider text-[10px]">SQUAD ROTATION</span>
            <span className="text-zinc-200 font-bold">{activeCaptainsCount} CAPTAINS ACTIVE</span>
          </div>

          <div className="w-px h-7 bg-zinc-800"></div>

          <div className="flex flex-col items-end">
            <span className="text-zinc-500 uppercase tracking-wider text-[10px]">UPTIME</span>
            <span className="text-zinc-300 font-bold">{runtimeFormatted}</span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Disable Audio Chimes' : 'Enable Audio Chimes'}
            className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-green-400" /> : <VolumeX className="w-4 h-4 text-zinc-600" />}
          </button>

          {/* Quick Guide */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-2 rounded bg-zinc-900 hover:bg-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-300 border border-zinc-800 transition"
          >
            <HelpCircle className="w-4 h-4 text-red-500" />
            <span className="hidden sm:inline">Guide</span>
          </button>

          {/* Master Start / Stop Button */}
          <button
            onClick={onToggleRun}
            className={`flex items-center gap-2 px-5 py-2.5 rounded font-black text-xs uppercase tracking-widest transition-transform active:scale-95 shadow-md ${
              isRunning
                ? 'bg-zinc-800 hover:bg-zinc-700 text-red-400 border border-red-500/40 shadow-[0_0_15px_rgba(220,38,38,0.2)]'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>HALT BOT</span>
                <span className="text-[9px] bg-red-950/80 text-red-300 px-1.5 py-0.5 rounded font-mono hidden sm:inline">F11</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>ENGAGE BOT</span>
                <span className="text-[9px] bg-black/40 text-zinc-200 px-1.5 py-0.5 rounded font-mono hidden sm:inline">F10</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto border-t border-zinc-800/80 scrollbar-none bg-[#0D0F12]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-wider whitespace-nowrap border-b-2 transition-all ${
                isActive
                  ? 'border-red-600 text-white bg-zinc-900/60'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-red-500' : 'text-zinc-500'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold ${
                  tab.badge === 'Target' 
                    ? 'bg-red-950 text-red-400 border border-red-800/60' 
                    : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
