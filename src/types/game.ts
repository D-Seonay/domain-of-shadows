// src/types/game.ts
export type Rank = 'normal' | 'elite' | 'knight' | 'general' | 'monarch' | 'boss';

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
}

export interface Upgrades {
  extractionChance: number; // base 0.4 + this
  criticalChance: number; // base 0.1 + this
  criticalMultiplier: number; // base 2.0 + this
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
  upgrades: Upgrades;
}
