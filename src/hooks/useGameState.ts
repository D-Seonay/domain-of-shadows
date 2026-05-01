import { useState, useCallback, useEffect } from 'react';
import { Enemy, Player, Shadow, ExtractionState } from '../types/game';

const INITIAL_PLAYER: Player = {
  level: 1,
  exp: 0,
  maxExp: 100,
  dpc: 10,
  dps: 0,
};

const INITIAL_ARMY: Shadow[] = [];

const INITIAL_EXTRACTION: ExtractionState = {
  active: false,
  attempts: 3,
  timeLeft: 10,
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
  const [army, setArmy] = useState<Shadow[]>(INITIAL_ARMY);
  const [extraction, setExtraction] = useState<ExtractionState>(INITIAL_EXTRACTION);

  const totalDps = army.reduce((acc, shadow) => acc + shadow.dps, 0);

  const addShadow = useCallback((shadow: Shadow) => {
    setArmy(prev => [...prev, shadow]);
  }, []);

  const attack = useCallback((amount: number = player.dpc) => {
    if (extraction.active) return; // Prevent attacking during extraction

    setEnemy(prev => {
      const newHp = Math.max(0, prev.hp - amount);
      if (newHp === 0) {
        setExtraction({ active: true, attempts: 3, timeLeft: 10, targetEnemy: { ...prev, hp: 0 } });
        return { ...prev, hp: 0 }; // Keep the dead enemy displayed during extraction
      }
      return { ...prev, hp: newHp };
    });
  }, [player.dpc, extraction.active]);

  // Extraction Timer
  useEffect(() => {
    if (!extraction.active) return;
    const timer = setInterval(() => {
      setExtraction(prev => {
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          // Auto-fail if time runs out
          setEnemy(createEnemy(player.level));
          return INITIAL_EXTRACTION;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [extraction.active, player.level]);

  const attemptExtraction = (success: boolean) => {
    if (success) {
      addShadow({
        id: Math.random().toString(),
        name: `Shadow ${extraction.targetEnemy?.name || 'Soldier'}`,
        rank: extraction.targetEnemy?.rank || 'normal',
        dps: (extraction.targetEnemy?.level || 1) * 5
      });
      setExtraction(INITIAL_EXTRACTION);
      setEnemy(createEnemy(player.level));
      setPlayer(p => ({ ...p, exp: p.exp + 50 }));
    } else {
      setExtraction(prev => {
        const nextAttempts = prev.attempts - 1;
        if (nextAttempts <= 0) {
          setEnemy(createEnemy(player.level));
          return INITIAL_EXTRACTION;
        }
        return { ...prev, attempts: nextAttempts };
      });
    }
  };

  // Passive DPS tick
  useEffect(() => {
    if (totalDps <= 0) return;
    const interval = setInterval(() => {
      attack(totalDps / 10); // Tick every 100ms
    }, 100);
    return () => clearInterval(interval);
  }, [totalDps, attack]);

  return { 
    player, enemy, army, extraction, 
    attack, addShadow, attemptExtraction, totalDps 
  };
};
