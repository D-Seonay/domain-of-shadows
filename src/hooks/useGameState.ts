// src/hooks/useGameState.ts
import { useState, useCallback, useEffect } from 'react';
import { Enemy, Player, Shadow } from '../types/game';

const INITIAL_PLAYER: Player = {
  level: 1,
  exp: 0,
  maxExp: 100,
  dpc: 10,
  dps: 0,
};

const INITIAL_ARMY: Shadow[] = [];

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
  const [army, setArmy] = useState<Shadow[]>(INITIAL_ARMY);

  const totalDps = army.reduce((acc, shadow) => acc + shadow.dps, 0);

  const attack = useCallback((amount: number = player.dpc) => {
    setEnemy(prev => {
      const newHp = Math.max(0, prev.hp - amount);
      if (newHp === 0) {
        setPlayer(p => ({ ...p, exp: p.exp + 20 }));
        return createEnemy(player.level);
      }
      return { ...prev, hp: newHp };
    });
  }, [player.dpc, player.level]);

  // Passive DPS tick
  useEffect(() => {
    if (totalDps <= 0) return;
    const interval = setInterval(() => {
      attack(totalDps / 10); // Tick every 100ms
    }, 100);
    return () => clearInterval(interval);
  }, [totalDps, attack]);

  const addShadow = (shadow: Shadow) => {
    setArmy(prev => [...prev, shadow]);
  };

  return { player, enemy, army, attack, addShadow, totalDps };
};
