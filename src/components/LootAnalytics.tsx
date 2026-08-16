import React from 'react';
import { SessionStats, BotSettings } from '../types';
import { 
  BarChart3, 
  Sparkles, 
  Flame, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Award, 
  TrendingUp,
  Package,
  Layers
} from 'lucide-react';

interface LootAnalyticsProps {
  stats: SessionStats;
  settings: BotSettings;
}

export const LootAnalytics: React.FC<LootAnalyticsProps> = ({ stats, settings }) => {
  const runtimeHours = Math.max(0.01, stats.runtimeSeconds / 3600);
  const cryptsPerHour = Math.round((stats.totalExplored / runtimeHours) * 10) / 10;
  const valorPerHour = Math.round(stats.totalValor / runtimeHours);
  const tarPerHour = Math.round(stats.totalTar / runtimeHours);
  const speedupHours = Math.round((stats.totalSpeedupsMin / 60) * 10) / 10;

  const statCards = [
    {
      label: 'Crypts Explored',
      value: stats.totalExplored.toLocaleString(),
      subvalue: `${cryptsPerHour} / HOUR`,
      icon: Layers,
      color: 'text-white',
      bg: 'bg-zinc-900/90 border-zinc-700',
    },
    {
      label: 'Valor Points',
      value: stats.totalValor.toLocaleString(),
      subvalue: `~${valorPerHour.toLocaleString()} / HR`,
      icon: Award,
      color: 'text-purple-400',
      bg: 'bg-zinc-900/90 border-zinc-700',
    },
    {
      label: 'Tar Harvested',
      value: stats.totalTar.toLocaleString(),
      subvalue: `~${tarPerHour.toLocaleString()} / HR`,
      icon: Flame,
      color: 'text-green-400',
      bg: 'bg-zinc-900/90 border-zinc-700',
    },
    {
      label: 'Speedup Time',
      value: `${speedupHours} Hours`,
      subvalue: `${stats.totalSpeedupsMin} MIN TOTAL`,
      icon: Clock,
      color: 'text-blue-400',
      bg: 'bg-zinc-900/90 border-zinc-700',
    },
    {
      label: 'Epic & Rare Chests',
      value: (stats.epicChests + stats.rareChests).toString(),
      subvalue: `${stats.epicChests} EPIC, ${stats.rareChests} RARE`,
      icon: Package,
      color: 'text-yellow-400',
      bg: 'bg-zinc-900/90 border-zinc-700',
    },
    {
      label: 'Energy Potions',
      value: stats.totalPotionsUsed.toString(),
      subvalue: `AUTO MANAGED`,
      icon: Zap,
      color: 'text-red-400',
      bg: 'bg-zinc-900/90 border-zinc-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0F1116] border border-zinc-800 rounded-lg p-5 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-red-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-tight">
              Crypt Loot Yield & ROI Analytics
            </h2>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Live telemetry tracking Valor points, Tar, Speedups, and Epic Gift Chest drops.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`rounded-lg p-4 border ${card.bg} flex flex-col justify-between shadow-md`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-zinc-400 font-mono uppercase font-bold">{card.label}</span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div>
                <div className={`text-xl font-black font-mono tracking-tight ${card.color}`}>
                  {card.value}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono font-bold uppercase mt-1">
                  {card.subvalue}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Breakdown Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estimated 24h Projections */}
        <div className="bg-[#0F1116] border border-zinc-800 rounded-lg p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <TrendingUp className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-black text-white uppercase tracking-tight">24-Hour Continuous Yield Forecast</h3>
          </div>

          <div className="space-y-3 font-mono">
            <div className="bg-[#0A0B0D] p-3.5 rounded border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-zinc-400 uppercase">Projected Daily Valor</div>
                <div className="text-base font-black text-purple-400">
                  {Math.round(valorPerHour * 24).toLocaleString()} VP
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-zinc-500 uppercase">Captains</div>
                <div className="text-xs font-bold text-white uppercase">{settings.activeCaptainIds.length} ACTIVE</div>
              </div>
            </div>

            <div className="bg-[#0A0B0D] p-3.5 rounded border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-zinc-400 uppercase">Projected Daily Tar</div>
                <div className="text-base font-black text-green-400">
                  {Math.round(tarPerHour * 24).toLocaleString()} TAR
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-zinc-500 uppercase">Target Range</div>
                <div className="text-xs font-bold text-red-400">LV.{settings.minCryptLevel} - LV.{settings.maxCryptLevel}</div>
              </div>
            </div>

            <div className="bg-[#0A0B0D] p-3.5 rounded border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-zinc-400 uppercase">Projected Speedups</div>
                <div className="text-base font-black text-blue-400">
                  {Math.round(speedupHours * 24)} HOURS
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-zinc-500 uppercase">Auto Refill</div>
                <div className="text-xs font-bold text-white uppercase">
                  {settings.autoStaminaPotion ? 'ENABLED' : 'DISABLED'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chest & Resource Priority Breakdown */}
        <div className="bg-[#0F1116] border border-zinc-800 rounded-lg p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Package className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-black text-white uppercase tracking-tight">Chest Drop Tiers & Materials</h3>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="bg-[#0A0B0D] p-3 rounded border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded bg-yellow-400" />
                <span className="font-bold text-zinc-200 uppercase text-[11px]">Celestial & Divine Titan Chests</span>
              </div>
              <span className="text-yellow-400 font-black">{stats.epicChests}</span>
            </div>

            <div className="bg-[#0A0B0D] p-3 rounded border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded bg-purple-400" />
                <span className="font-bold text-zinc-200 uppercase text-[11px]">Dragon Hunter Epic Chests</span>
              </div>
              <span className="text-purple-400 font-black">{Math.round(stats.epicChests * 1.5)}</span>
            </div>

            <div className="bg-[#0A0B0D] p-3 rounded border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded bg-blue-400" />
                <span className="font-bold text-zinc-200 uppercase text-[11px]">Shadow Stalker Rare Chests</span>
              </div>
              <span className="text-blue-400 font-black">{stats.rareChests}</span>
            </div>

            <div className="bg-[#0A0B0D] p-3 rounded border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded bg-green-400" />
                <span className="font-bold text-zinc-200 uppercase text-[11px]">Ancient Artifact Fragments</span>
              </div>
              <span className="text-green-400 font-black">{stats.totalExplored * 3}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
