// src/hooks/useGameState.ts
import { useState, useCallback } from 'react';
import { Enemy, Player } from '../types/game';

const INITIAL_PLAYER: Player = {
  level: 1,
  exp: 0,
  maxExp: 100,
  dpc: 10,
  dps: 0,
};

const createEnemy = (level: number): Enemy => ({
  id: Math.random().toString(36).substr(2, 9),
  name: 'Shadow Soldier',
  level,
  rank: 'normal',
  hp: level * 50,
  maxHp: level * 50,
});

export const useGameState = () => {
  const [player, setPlayer] = useState<Player>(INITIAL_PLAYER);
  const [enemy, setEnemy] = useState<Enemy>(createEnemy(1));

  const attack = useCallback(() => {
    setEnemy(prev => {
      const newHp = Math.max(0, prev.hp - player.dpc);
      if (newHp === 0) {
        // Monster killed logic
        setPlayer(p => ({ ...p, exp: p.exp + 20 }));
        return createEnemy(player.level);
      }
      return { ...prev, hp: newHp };
    });
  }, [player.dpc, player.level]);

  return { player, enemy, attack };
};
