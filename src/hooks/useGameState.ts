import { useState, useCallback, useEffect } from 'react';
import { Enemy, Player, Shadow, ExtractionState, Rank } from '../types/game';

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

const MONSTERS: { name: string; ranks: Rank[] }[] = [
  { name: 'Shadow Soldier', ranks: ['normal'] },
  { name: 'Iron Knight', ranks: ['normal', 'elite'] },
  { name: 'Ice Elf', ranks: ['elite'] },
  { name: 'High Orc', ranks: ['elite', 'boss'] },
  { name: 'Cerberus', ranks: ['boss'] },
  { name: 'Blood Red Igris', ranks: ['boss'] },
];

const createEnemy = (playerLevel: number): Enemy => {
  const monster = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
  const rank = monster.ranks[Math.floor(Math.random() * monster.ranks.length)];
  
  let multiplier = 1;
  if (rank === 'elite') multiplier = 2;
  if (rank === 'boss') multiplier = 5;

  const maxHp = playerLevel * 50 * multiplier;
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: monster.name,
    level: playerLevel + (rank === 'boss' ? 2 : 0),
    rank,
    hp: maxHp,
    maxHp: maxHp,
  };
};

export const useGameState = () => {
  const [player, setPlayer] = useState<Player>(() => {
    const saved = localStorage.getItem('shadow_player');
    return saved ? JSON.parse(saved) : INITIAL_PLAYER;
  });
  const [enemy, setEnemy] = useState<Enemy>(() => createEnemy(player?.level || 1));
  const [army, setArmy] = useState<Shadow[]>(() => {
    const saved = localStorage.getItem('shadow_army');
    return saved ? JSON.parse(saved) : INITIAL_ARMY;
  });
  const [extraction, setExtraction] = useState<ExtractionState>(INITIAL_EXTRACTION);

  // Persistence
  useEffect(() => {
    localStorage.setItem('shadow_player', JSON.stringify(player));
  }, [player]);

  useEffect(() => {
    localStorage.setItem('shadow_army', JSON.stringify(army));
  }, [army]);

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
          return INITIAL_EXTRACTION;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [extraction.active, player.level]);

  const attemptExtraction = (success: boolean) => {
    if (success) {
      const target = extraction.targetEnemy;
      addShadow({
        id: Math.random().toString(),
        name: `Shadow ${target?.name || 'Soldier'}`,
        rank: target?.rank || 'normal',
        dps: (target?.level || 1) * 5
      });
      
      setPlayer(p => {
        let newExp = p.exp + 50;
        let newLevel = p.level;
        let newMaxExp = p.maxExp;
        let newDpc = p.dpc;

        if (newExp >= p.maxExp) {
          newLevel += 1;
          newExp = newExp - p.maxExp;
          newMaxExp = newLevel * 100;
          newDpc = newLevel * 10;
        }

        return { ...p, level: newLevel, exp: newExp, maxExp: newMaxExp, dpc: newDpc };
      });

      setExtraction(INITIAL_EXTRACTION);
    } else {
      setExtraction(prev => {
        const nextAttempts = prev.attempts - 1;
        if (nextAttempts <= 0) {
          return { ...INITIAL_EXTRACTION, active: false };
        }
        return { ...prev, attempts: nextAttempts };
      });
    }
  };

  // Respawn enemy when extraction ends or player levels up
  useEffect(() => {
    if (!extraction.active && enemy.hp === 0) {
      setEnemy(createEnemy(player.level));
    }
  }, [extraction.active, enemy.hp, player.level]);

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
