// src/types/game.ts
export type Rank = 'normal' | 'elite' | 'knight' | 'general' | 'monarch';

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
  dpc: number; // Damage Per Click
  dps: number; // Damage Per Second
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
}
