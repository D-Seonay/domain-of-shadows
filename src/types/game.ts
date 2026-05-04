// src/types/game.ts
export type Rank = 'normal' | 'elite' | 'knight' | 'general' | 'monarch' | 'boss';
export type ExtractionMode = 'manual' | 'auto' | 'none';
export type ShadowClass = 'infantry' | 'tank' | 'mage' | 'assassin';
export type BiomeType = 'frost' | 'fire' | 'void' | 'shadow';

export interface Biome {
  type: BiomeType;
  name: string;
  color: string; // Tailwind hex or class
  monsters: string[];
  modifier?: {
    type: 'dps_reduction' | 'cd_increase' | 'mana_boost';
    value: number;
  };
}

export type PortalRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface PortalAffix {
  name: string;
  description: string;
  effect: (stats: any) => any;
}

export interface Portal {
  id: string;
  rank: PortalRank;
  name: string;
  type: string;
  biome: Biome;
  difficulty: number;
  bossName: string;
  instability: number; // current time
  maxInstability: number; // initial time
  affixes: PortalAffix[];
  cleared: boolean;
  position: { x: number; y: number }; // normalized 0-1 for radar
}

export interface Shadow {
  id: string;
  name: string;
  rank: Rank;
  dps: number;
  class: ShadowClass;
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  rank: Rank;
  hp: number;
  maxHp: number;
}

export interface DungeonState {
  currentFloor: number;
  enemiesDefeated: number;
  enemiesPerFloor: number;
}

export interface Player {
  level: number;
  exp: number;
  maxExp: number;
  mana: number;
  dpc: number;
  dps: number;
  prestigePoints: number;
  rebirths: number;
}

export interface Upgrades {
  extractionChance: number;
  criticalChance: number;
  criticalMultiplier: number;
  prestigeMultiplier: number;
}

export interface CodexEntry {
  name: string;
  count: number;
  rank: Rank;
  unlocked: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  requirement: number;
  current: number;
  completed: boolean;
  rewardType: 'mana' | 'prestige';
  rewardAmount: number;
}

export interface ExtractionState {
  active: boolean;
  attempts: number;
  timeLeft: number;
  targetEnemy?: Enemy;
}

export interface GameState {
  player: Player;
  enemy: Enemy;
  army: Shadow[];
  extraction: ExtractionState;
  extractionMode: ExtractionMode;
  gameMode: 'idle' | 'radar' | 'raid';
  upgrades: Upgrades;
  codex: CodexEntry[];
  achievements: Achievement[];
  dungeon: DungeonState;
  activePortal: Portal | null;
  availablePortals: Portal[];
}
