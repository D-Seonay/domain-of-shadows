// src/types/game.ts
export type Rank = 'normal' | 'elite' | 'knight' | 'general' | 'monarch' | 'boss';
export type ExtractionMode = 'manual' | 'auto' | 'none';

export interface Shadow {
  id: string;
  name: string;
  rank: Rank;
  dps: number;
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  rank: Rank;
  hp: number;
  maxHp: number;
}

export interface Player {
  level: number;
  exp: number;
  maxExp: number;
  mana: number;
  dpc: number; // Damage Per Click
  dps: number; // Damage Per Second
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
  upgrades: Upgrades;
  codex: CodexEntry[];
  achievements: Achievement[];
}
