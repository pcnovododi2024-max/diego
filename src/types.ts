export type ResolutionKey = '1360x768' | '1366x768' | '1920x1080' | 'custom';

export interface ScreenCoordinate {
  id: string;
  name: string;
  category: 'watchtower' | 'search' | 'captain' | 'march' | 'stamina' | 'navigation';
  x: number;
  y: number;
  description: string;
  color: string;
}

export type CaptainStatus = 'idle' | 'marching' | 'exploring' | 'returning' | 'resting';

export interface Captain {
  id: string;
  name: string;
  title: string;
  avatar: string;
  level: number;
  currentStamina: number;
  maxStamina: number;
  status: CaptainStatus;
  marchTimeTotal: number; // in seconds
  marchTimeRemaining: number; // in seconds
  targetCrypt?: CryptTarget;
  totalCryptsExplored: number;
  speedMultiplier: number;
  staminaCostPerCrypt: number;
  rarity: 'epic' | 'legendary' | 'rare';
}

export type CryptRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface CryptTarget {
  id: string;
  level: number;
  rarity: CryptRarity;
  coords: { x: number; y: number; k: number };
  distanceKm: number;
  estimatedRewards: {
    valor: number;
    tar: number;
    gold: number;
    silver: number;
    speedupsMin: number;
    chestTier: string;
  };
  status: 'detected' | 'marching' | 'exploring' | 'cleared' | 'skipped';
}

export interface BotSettings {
  resolution: ResolutionKey;
  customWidth: number;
  customHeight: number;
  activeCaptainIds: string[];
  minCryptLevel: number;
  maxCryptLevel: number;
  rarities: {
    common: boolean;
    rare: boolean;
    epic: boolean;
    legendary: boolean;
  };
  maxSearchRadiusKm: number;
  autoStaminaPotion: boolean;
  potionSize: '50' | '100' | '500' | 'smart';
  minStaminaReserve: number;
  useSpeedupsIfMarchOverMins: number; // 0 = never
  humanizeDelays: boolean;
  delayMinMs: number;
  delayMaxMs: number;
  soundAlerts: boolean;
  autoRestartLoop: boolean;
  homeCoords: { x: number; y: number; k: number };
  targetResourcePriority: 'balanced' | 'valor' | 'tar' | 'chests' | 'speedups';
}

export interface BotLog {
  id: string;
  timestamp: string;
  type: 'info' | 'action' | 'loot' | 'warning' | 'error';
  message: string;
  captainName?: string;
  cryptInfo?: string;
  loot?: {
    valor?: number;
    tar?: number;
    gold?: number;
    speedupMins?: number;
    chest?: string;
  };
}

export interface SessionStats {
  totalExplored: number;
  totalValor: number;
  totalTar: number;
  totalGold: number;
  totalSilver: number;
  totalSpeedupsMin: number;
  totalPotionsUsed: number;
  rareChests: number;
  epicChests: number;
  runtimeSeconds: number;
}
