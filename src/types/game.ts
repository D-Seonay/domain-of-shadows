// src/types/game.ts
export type Rank = 'normal' | 'elite' | 'boss';

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

export interface GameState {
  player: Player;
  enemy: Enemy;
}
