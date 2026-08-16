import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  BotSettings, 
  Captain, 
  CryptTarget, 
  ScreenCoordinate, 
  BotLog, 
  SessionStats 
} from './types';
import { 
  CALIBRATED_COORDINATES_1360x768, 
  INITIAL_CAPTAINS, 
  INITIAL_CRYPT_TARGETS 
} from './data/calibration1360';
import { Header } from './components/Header';
import { RadarMap } from './components/RadarMap';
import { CaptainsOverview } from './components/CaptainsOverview';
import { CalibrationView } from './components/CalibrationView';
import { ConfigPanel } from './components/ConfigPanel';
import { MacroScriptsView } from './components/MacroScriptsView';
import { LootAnalytics } from './components/LootAnalytics';
import { LiveLogTerminal } from './components/LiveLogTerminal';
import { QuickGuideModal } from './components/QuickGuideModal';
import { soundManager } from './utils/audio';

export default function App() {
  // Application State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [selectedCryptId, setSelectedCryptId] = useState<string | undefined>(undefined);

  // Settings
  const [settings, setSettings] = useState<BotSettings>({
    resolution: '1360x768',
    customWidth: 1360,
    customHeight: 768,
    activeCaptainIds: ['aydae', 'carter', 'alexander', 'farhad'],
    minCryptLevel: 15,
    maxCryptLevel: 30,
    rarities: {
      common: false,
      rare: true,
      epic: true,
      legendary: true,
    },
    maxSearchRadiusKm: 65,
    autoStaminaPotion: true,
    potionSize: '100',
    minStaminaReserve: 15,
    useSpeedupsIfMarchOverMins: 0,
    humanizeDelays: true,
    delayMinMs: 250,
    delayMaxMs: 450,
    soundAlerts: true,
    autoRestartLoop: true,
    homeCoords: { x: 520, y: 780, k: 142 },
    targetResourcePriority: 'balanced',
  });

  // Coordinates
  const [coordinates, setCoordinates] = useState<ScreenCoordinate[]>(CALIBRATED_COORDINATES_1360x768);

  // Captains & Crypts
  const [captains, setCaptains] = useState<Captain[]>(INITIAL_CAPTAINS);
  const [crypts, setCrypts] = useState<CryptTarget[]>(INITIAL_CRYPT_TARGETS);

  // Logs & Statistics
  const [logs, setLogs] = useState<BotLog[]>([
    {
      id: 'log-init-1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'info',
      message: 'Crypt Rider Pro initialized for 1360x768 monitor resolution.',
    },
    {
      id: 'log-init-2',
      timestamp: new Date().toLocaleTimeString(),
      type: 'info',
      message: 'Watchtower radar calibrated. 4 Captains primed in rotation queue.',
    },
  ]);

  const [stats, setStats] = useState<SessionStats>({
    totalExplored: 24,
    totalValor: 148500,
    totalTar: 284000,
    totalGold: 48000,
    totalSilver: 310000,
    totalSpeedupsMin: 420,
    totalPotionsUsed: 3,
    rareChests: 14,
    epicChests: 8,
    runtimeSeconds: 3820,
  });

  const nextCaptainIndexRef = useRef<number>(0);

  // Add Log Helper
  const addLog = useCallback((type: BotLog['type'], message: string, extra?: Partial<BotLog>) => {
    const newLog: BotLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      ...extra,
    };
    setLogs(prev => [newLog, ...prev.slice(0, 150)]);
  }, []);

  // Update Settings
  const handleUpdateSettings = (newSettings: Partial<BotSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Update Single Coordinate
  const handleUpdateCoordinate = (id: string, newX: number, newY: number) => {
    setCoordinates(prev =>
      prev.map(c => (c.id === id ? { ...c, x: newX, y: newY } : c))
    );
  };

  // Reset Coordinates to 1360x768 defaults
  const handleResetCoordinates = () => {
    setCoordinates(CALIBRATED_COORDINATES_1360x768);
    addLog('info', 'Calibrated coordinates reset to native 1360x768 pixel defaults.');
  };

  // Manual / Auto Potion Refill
  const handleRefillStamina = (captainId: string) => {
    setCaptains(prev =>
      prev.map(c => {
        if (c.id === captainId) {
          const newStamina = Math.min(c.maxStamina, c.currentStamina + 100);
          return {
            ...c,
            currentStamina: newStamina,
            status: c.status === 'resting' ? 'idle' : c.status,
          };
        }
        return c;
      })
    );
    setStats(prev => ({ ...prev, totalPotionsUsed: prev.totalPotionsUsed + 1 }));
    soundManager.playPotionUse();
    const cap = captains.find(c => c.id === captainId);
    addLog('warning', `Used 100 Stamina Potion on Captain ${cap?.name || captainId}. Energy restored!`);
  };

  // Toggle Captain Active Squad
  const handleToggleCaptainActive = (captainId: string) => {
    const active = [...settings.activeCaptainIds];
    const idx = active.indexOf(captainId);
    if (idx > -1) {
      if (active.length > 1) {
        active.splice(idx, 1);
      }
    } else {
      active.push(captainId);
    }
    setSettings(prev => ({ ...prev, activeCaptainIds: active }));
  };

  // Toggle Run
  const handleToggleRun = () => {
    const nextState = !isRunning;
    setIsRunning(nextState);
    if (nextState) {
      soundManager.playMarchSend();
      addLog('info', '⚡ Crypt Rider automation loop STARTED (1360x768). Searching Watchtower...');
    } else {
      addLog('warning', '⏸️ Crypt Rider automation PAUSED by user.');
    }
  };

  // Generate a random dynamic crypt spawn matching filters
  const generateRandomCrypt = useCallback((): CryptTarget => {
    const minLvl = settings.minCryptLevel;
    const maxLvl = settings.maxCryptLevel;
    const level = Math.floor(Math.random() * (maxLvl - minLvl + 1)) + minLvl;
    
    // Pick rarity based on user filter
    const allowedRarities: CryptTarget['rarity'][] = [];
    if (settings.rarities.legendary) allowedRarities.push('Legendary');
    if (settings.rarities.epic) allowedRarities.push('Epic');
    if (settings.rarities.rare) allowedRarities.push('Rare');
    if (settings.rarities.common) allowedRarities.push('Common');

    const rarity = allowedRarities.length > 0 
      ? allowedRarities[Math.floor(Math.random() * allowedRarities.length)]
      : 'Rare';

    const radius = Math.floor(Math.random() * (settings.maxSearchRadiusKm - 10)) + 10;
    const angle = Math.random() * Math.PI * 2;
    const targetX = Math.round(settings.homeCoords.x + Math.cos(angle) * radius * 0.8);
    const targetY = Math.round(settings.homeCoords.y + Math.sin(angle) * radius * 0.8);

    const baseMultiplier = level * (rarity === 'Legendary' ? 4 : rarity === 'Epic' ? 2.5 : rarity === 'Rare' ? 1.5 : 1);

    return {
      id: `c-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      level,
      rarity,
      coords: { x: targetX, y: targetY, k: settings.homeCoords.k },
      distanceKm: radius,
      estimatedRewards: {
        valor: Math.round(350 * baseMultiplier),
        tar: Math.round(620 * baseMultiplier),
        gold: Math.round(120 * baseMultiplier),
        silver: Math.round(750 * baseMultiplier),
        speedupsMin: Math.round(5 * baseMultiplier * 0.4),
        chestTier: `${rarity} Crypt Explorer Chest`,
      },
      status: 'detected',
    };
  }, [settings]);

  // Main Simulated Automation Engine Loop (runs every second when active)
  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Increment session runtime if running
      if (isRunning) {
        setStats(prev => ({ ...prev, runtimeSeconds: prev.runtimeSeconds + 1 }));
      }

      // 2. Advance Captain March Timers
      setCaptains(prevCaptains =>
        prevCaptains.map(cap => {
          if (cap.status === 'marching' || cap.status === 'exploring') {
            const nextRemaining = cap.marchTimeRemaining - 1;
            if (nextRemaining <= 0) {
              // March Finished! Collect loot & clear crypt
              if (cap.targetCrypt) {
                const loot = cap.targetCrypt.estimatedRewards;
                setStats(s => ({
                  ...s,
                  totalExplored: s.totalExplored + 1,
                  totalValor: s.totalValor + loot.valor,
                  totalTar: s.totalTar + loot.tar,
                  totalGold: s.totalGold + loot.gold,
                  totalSilver: s.totalSilver + loot.silver,
                  totalSpeedupsMin: s.totalSpeedupsMin + loot.speedupsMin,
                  epicChests: s.epicChests + (cap.targetCrypt?.rarity === 'Epic' || cap.targetCrypt?.rarity === 'Legendary' ? 1 : 0),
                  rareChests: s.rareChests + (cap.targetCrypt?.rarity === 'Rare' ? 1 : 0),
                }));

                soundManager.playLootSuccess();
                addLog(
                  'loot',
                  `Captain ${cap.name} CLEARED Lv.${cap.targetCrypt.level} ${cap.targetCrypt.rarity} Crypt! Loot: +${loot.valor.toLocaleString()} Valor, +${loot.tar.toLocaleString()} Tar, +${loot.speedupsMin}m Speedups, 1x ${loot.chestTier}`,
                  {
                    captainName: cap.name,
                    cryptInfo: `Lv.${cap.targetCrypt.level} ${cap.targetCrypt.rarity}`,
                    loot: {
                      valor: loot.valor,
                      tar: loot.tar,
                      gold: loot.gold,
                      speedupMins: loot.speedupsMin,
                      chest: loot.chestTier,
                    },
                  }
                );

                // Remove cleared crypt from map
                setCrypts(cList => cList.filter(c => c.id !== cap.targetCrypt?.id));
              }

              return {
                ...cap,
                status: 'idle',
                marchTimeRemaining: 0,
                marchTimeTotal: 0,
                targetCrypt: undefined,
                totalCryptsExplored: cap.totalCryptsExplored + 1,
              };
            } else {
              return {
                ...cap,
                marchTimeRemaining: nextRemaining,
              };
            }
          }
          return cap;
        })
      );

      // 3. Dispatch Next Available Captain if Bot is Running
      if (isRunning) {
        // Find idle captain in active squad
        const activeIds = settings.activeCaptainIds;
        const availableCaptains = captains.filter(
          c => activeIds.includes(c.id) && c.status === 'idle'
        );

        if (availableCaptains.length > 0) {
          const nextCaptain = availableCaptains[0];

          // Check Stamina
          if (nextCaptain.currentStamina < nextCaptain.staminaCostPerCrypt) {
            if (settings.autoStaminaPotion) {
              handleRefillStamina(nextCaptain.id);
            } else {
              // Set captain to resting
              setCaptains(prev =>
                prev.map(c => (c.id === nextCaptain.id ? { ...c, status: 'resting' } : c))
              );
              addLog('warning', `Captain ${nextCaptain.name} has low stamina (${nextCaptain.currentStamina}). Auto-potions disabled.`);
              return;
            }
          }

          // Trigger Watchtower scan animation
          setIsScanning(true);
          setTimeout(() => setIsScanning(false), 800);

          // Get or create crypt target
          let target = crypts.find(c => c.status === 'detected');
          if (!target) {
            target = generateRandomCrypt();
            setCrypts(prev => [target!, ...prev.slice(0, 6)]);
          }

          // Calculate travel duration in seconds (distance / speed)
          const marchSeconds = Math.max(6, Math.round((target.distanceKm * 0.45) / nextCaptain.speedMultiplier));

          // Dispatch captain
          setCaptains(prev =>
            prev.map(c => {
              if (c.id === nextCaptain.id) {
                return {
                  ...c,
                  status: 'marching',
                  currentStamina: Math.max(0, c.currentStamina - c.staminaCostPerCrypt),
                  marchTimeTotal: marchSeconds,
                  marchTimeRemaining: marchSeconds,
                  targetCrypt: target,
                };
              }
              return c;
            })
          );

          // Mark crypt as in progress
          setCrypts(prev =>
            prev.map(c => (c.id === target!.id ? { ...c, status: 'marching' } : c))
          );

          soundManager.playMarchSend();
          addLog(
            'action',
            `Dispatched Captain ${nextCaptain.name} -> Lv.${target.level} ${target.rarity} Crypt (${target.coords.x}, ${target.coords.y}) [${target.distanceKm}km, ~${marchSeconds}s march]`
          );
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, captains, crypts, settings, addLog, generateRandomCrypt]);

  // Global Keyboard Hotkeys Listener: F10 (Start), F11 (Pause), F12 (Stop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F10') {
        e.preventDefault();
        setIsRunning(true);
        soundManager.playMarchSend();
        addLog('info', '⚡ Hotkey [F10] detected: Crypt Rider STARTED');
      } else if (e.key === 'F11') {
        e.preventDefault();
        setIsRunning(prev => !prev);
        addLog('info', '⏸️ Hotkey [F11] detected: Toggled pause');
      } else if (e.key === 'F12') {
        e.preventDefault();
        setIsRunning(false);
        addLog('warning', '🛑 Hotkey [F12] detected: Emergency STOP');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addLog]);

  // Format runtime
  const formatRuntime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-zinc-300 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top Header */}
      <Header
        isRunning={isRunning}
        onToggleRun={handleToggleRun}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeCaptainsCount={settings.activeCaptainIds.length}
        runtimeFormatted={formatRuntime(stats.runtimeSeconds)}
        onOpenGuide={() => setIsGuideOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = !soundEnabled;
          setSoundEnabled(next);
          soundManager.setEnabled(next);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Tab 1: Dashboard & Tactical Squad Radar */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Kingdom Radar & Crypt Pinpoint */}
              <div className="lg:col-span-7 space-y-6">
                <RadarMap
                  crypts={crypts}
                  captains={captains}
                  settings={settings}
                  onSelectCrypt={(c) => setSelectedCryptId(c.id)}
                  selectedCryptId={selectedCryptId}
                  isScanning={isScanning}
                />
              </div>

              {/* Right Column: Live Logs Terminal */}
              <div className="lg:col-span-5">
                <LiveLogTerminal
                  logs={logs}
                  onClearLogs={() => setLogs([])}
                />
              </div>
            </div>

            {/* Captains Squad Overview */}
            <CaptainsOverview
              captains={captains}
              settings={settings}
              onRefillStamina={handleRefillStamina}
              onToggleCaptainActive={handleToggleCaptainActive}
            />
          </div>
        )}

        {/* Tab 2: 1360x768 Dedicated Screen Pixel Calibrator */}
        {activeTab === 'calibration' && (
          <CalibrationView
            coordinates={coordinates}
            onUpdateCoordinate={handleUpdateCoordinate}
            onResetCoordinates={handleResetCoordinates}
          />
        )}

        {/* Tab 3: Crypt & Squad Configuration Filters */}
        {activeTab === 'config' && (
          <ConfigPanel
            settings={settings}
            captains={captains}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {/* Tab 4: Macro & Standalone Script Exporters */}
        {activeTab === 'scripts' && (
          <MacroScriptsView
            settings={settings}
            coordinates={coordinates}
          />
        )}

        {/* Tab 5: Loot Yield & ROI Analytics */}
        {activeTab === 'analytics' && (
          <LootAnalytics
            stats={stats}
            settings={settings}
          />
        )}
      </main>

      {/* Quick Setup Modal */}
      <QuickGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-800 bg-[#0A0B0D] py-3 text-xs text-zinc-600 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2 uppercase tracking-wider text-[11px]">
          <div>
            TOTAL BATTLE HELPER // <span className="text-zinc-400 font-bold">CRYPT RIDER ENGINE</span> (1360 × 768)
          </div>
          <div className="flex items-center gap-3">
            <span className="text-zinc-500">HOTKEYS:</span>
            <span className="text-red-400 font-bold">F10 (START)</span>
            <span>•</span>
            <span className="text-zinc-300 font-bold">F11 (PAUSE)</span>
            <span>•</span>
            <span className="text-zinc-400 font-bold">F12 (ABORT)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
