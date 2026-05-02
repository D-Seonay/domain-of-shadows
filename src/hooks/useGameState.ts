import { useState, useCallback, useEffect } from 'react';
import { Enemy, Player, Shadow, ExtractionState, Upgrades, Rank, ExtractionMode } from '../types/game';

const INITIAL_PLAYER: Player = {
  level: 1,
  exp: 0,
  maxExp: 100,
  mana: 0,
  dpc: 10,
  dps: 0,
};

const INITIAL_UPGRADES: Upgrades = {
  extractionChance: 0,
  criticalChance: 0,
  criticalMultiplier: 0,
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
  if (rank === 'elite') multiplier = 3;
  if (rank === 'boss') multiplier = 10;

  const maxHp = (playerLevel * 50 + (playerLevel ** 2) * 5) * multiplier;
  
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
  const [upgrades, setUpgrades] = useState<Upgrades>(() => {
    const saved = localStorage.getItem('shadow_upgrades');
    return saved ? JSON.parse(saved) : INITIAL_UPGRADES;
  });
  const [enemy, setEnemy] = useState<Enemy>(() => createEnemy(player?.level || 1));
  const [army, setArmy] = useState<Shadow[]>(() => {
    const saved = localStorage.getItem('shadow_army');
    return saved ? JSON.parse(saved) : INITIAL_ARMY;
  });
  const [extraction, setExtraction] = useState<ExtractionState>(INITIAL_EXTRACTION);
  const [extractionMode, setExtractionMode] = useState<ExtractionMode>(() => {
    const saved = localStorage.getItem('shadow_extraction_mode');
    return (saved as ExtractionMode) || 'manual';
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('shadow_player', JSON.stringify(player));
  }, [player]);

  useEffect(() => {
    localStorage.setItem('shadow_upgrades', JSON.stringify(upgrades));
  }, [upgrades]);

  useEffect(() => {
    localStorage.setItem('shadow_army', JSON.stringify(army));
  }, [army]);

  useEffect(() => {
    localStorage.setItem('shadow_extraction_mode', extractionMode);
  }, [extractionMode]);

  const totalDps = army.reduce((acc, shadow) => acc + shadow.dps, 0);

  const addShadow = useCallback((shadow: Shadow) => {
    setArmy(prev => [...prev, shadow]);
  }, []);

  const attemptExtraction = useCallback((target?: Enemy) => {
    // Lower base chance to 20%
    const success = Math.random() < (0.2 + upgrades.extractionChance);

    if (success) {
      const actualTarget = target || extraction.targetEnemy;
      addShadow({
        id: Math.random().toString(36).substr(2, 9),
        name: `Shadow ${actualTarget?.name || 'Soldier'}`,
        rank: actualTarget?.rank || 'normal',
        dps: (actualTarget?.level || 1) * 5
      });
      
      setExtraction(INITIAL_EXTRACTION);
      return true;
    } else {
      setExtraction(prev => {
        const nextAttempts = prev.attempts - 1;
        if (nextAttempts <= 0) {
          return { ...INITIAL_EXTRACTION, active: false };
        }
        return { ...prev, attempts: nextAttempts };
      });
      return false;
    }
  }, [extraction.targetEnemy, addShadow, upgrades.extractionChance]);

  const attack = useCallback((amount: number = player.dpc): { damage: number; isCrit: boolean } | void => {
    if (extraction.active) return; // Prevent attacking during extraction

    const isCrit = Math.random() < (0.1 + upgrades.criticalChance);
    const finalDamage = isCrit ? Math.floor(amount * (2.0 + upgrades.criticalMultiplier)) : amount;

    setEnemy(prev => {
      if (prev.hp <= 0) return prev;
      const newHp = Math.max(0, prev.hp - finalDamage);
      if (newHp === 0) {
        // Handle Extraction Logic based on Mode
        if (prev.rank !== 'normal') {
          if (extractionMode === 'manual') {
            setExtraction({ active: true, attempts: 3, timeLeft: 10, targetEnemy: { ...prev, hp: 0 } });
          } else if (extractionMode === 'auto') {
            // Auto-extract has much lower base chance (10%)
            const autoSuccess = Math.random() < (0.1 + upgrades.extractionChance);
            if (autoSuccess) {
              addShadow({
                id: Math.random().toString(36).substr(2, 9),
                name: `Shadow ${prev.name}`,
                rank: prev.rank,
                dps: prev.level * 5
              });
            }
          }
        }
        
        // Grant exp and mana on kill
        setPlayer(p => {
          let newExp = p.exp + 50;
          let newLevel = p.level;
          let newMaxExp = p.maxExp;
          let newDpc = p.dpc;
          const manaGain = prev.level * 10;

          if (newExp >= p.maxExp) {
            newLevel += 1;
            newExp = newExp - p.maxExp;
            newMaxExp = newLevel * 100;
            newDpc = newLevel * 10;
          }

          return { 
            ...p, 
            level: newLevel, 
            exp: newExp, 
            maxExp: newMaxExp, 
            dpc: newDpc,
            mana: p.mana + manaGain 
          };
        });

        return { ...prev, hp: 0 }; // Keep the dead enemy displayed during extraction (or for immediate respawn)
      }
      return { ...prev, hp: newHp };
    });

    return { damage: finalDamage, isCrit };
  }, [player.dpc, extraction.active, upgrades.criticalChance, upgrades.criticalMultiplier, extractionMode, upgrades.extractionChance, addShadow]);

  // Extraction Timer
  useEffect(() => {
    if (!extraction.active) return;
    const timer = setInterval(() => {
      setExtraction(prev => {
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          // Auto-fail if time runs out
          return { ...INITIAL_EXTRACTION, active: false };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [extraction.active]);

  const buyUpgrade = useCallback((type: keyof Upgrades, cost: number, increment: number) => {
    setPlayer(p => {
      if (p.mana >= cost) {
        setUpgrades(u => ({ ...u, [type]: u[type] + increment }));
        return { ...p, mana: p.mana - cost };
      }
      return p;
    });
  }, []);

  const mergeShadows = useCallback((name: string, currentRank: Rank) => {
    setArmy(prev => {
      const identical = prev.filter(s => s.name === name && s.rank === currentRank);
      if (identical.length < 3) return prev;

      const rankOrder: Rank[] = ['normal', 'elite', 'knight', 'general', 'monarch'];
      const nextRankIndex = rankOrder.indexOf(currentRank) + 1;
      if (nextRankIndex >= rankOrder.length) return prev;

      const nextRank = rankOrder[nextRankIndex];
      const others = prev.filter(s => !identical.slice(0, 3).includes(s));
      
      const mergedShadow: Shadow = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        rank: nextRank,
        dps: identical[0].dps * 2.5
      };

      return [...others, mergedShadow];
    });
  }, []);

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
    player, enemy, army, extraction, extractionMode, upgrades,
    setExtractionMode, attack, addShadow, attemptExtraction, buyUpgrade, mergeShadows, totalDps 
  };
};
