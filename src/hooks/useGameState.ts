import { useState, useCallback, useEffect } from 'react';
import { Enemy, Player, Shadow, ExtractionState, Upgrades, Rank, ExtractionMode, CodexEntry, Achievement } from '../types/game';

const INITIAL_PLAYER: Player = {
  level: 1,
  exp: 0,
  maxExp: 100,
  mana: 0,
  dpc: 10,
  dps: 0,
  prestigePoints: 0,
  rebirths: 0,
};

const INITIAL_UPGRADES: Upgrades = {
  extractionChance: 0,
  criticalChance: 0,
  criticalMultiplier: 0,
  prestigeMultiplier: 1.0,
};

const INITIAL_ARMY: Shadow[] = [];

const INITIAL_EXTRACTION: ExtractionState = {
  active: false,
  attempts: 3,
  timeLeft: 10,
};

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'kills_10', title: 'Novice Hunter', description: 'Kill 10 enemies', requirement: 10, current: 0, completed: false, rewardType: 'mana', rewardAmount: 500 },
  { id: 'extract_5', title: 'Necromancer', description: 'Successfully extract 5 shadows', requirement: 5, current: 0, completed: false, rewardType: 'prestige', rewardAmount: 1 },
  { id: 'level_10', title: 'Ascension', description: 'Reach level 10', requirement: 10, current: 1, completed: false, rewardType: 'mana', rewardAmount: 2000 },
];

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
  if (rank === 'elite') multiplier = 5; 
  if (rank === 'boss') multiplier = 25; 

  const maxHp = (200 + playerLevel * 100 + Math.pow(playerLevel, 2.5)) * multiplier;
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: monster.name,
    level: playerLevel + (rank === 'boss' ? 5 : rank === 'elite' ? 2 : 0),
    rank,
    hp: Math.floor(maxHp),
    maxHp: Math.floor(maxHp),
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
  const [codex, setCodex] = useState<CodexEntry[]>(() => {
    const saved = localStorage.getItem('shadow_codex');
    return saved ? JSON.parse(saved) : [];
  });
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('shadow_achievements');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  // Throttled Persistence
  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem('shadow_player', JSON.stringify(player));
      localStorage.setItem('shadow_upgrades', JSON.stringify(upgrades));
      localStorage.setItem('shadow_army', JSON.stringify(army));
      localStorage.setItem('shadow_extraction_mode', extractionMode);
      localStorage.setItem('shadow_codex', JSON.stringify(codex));
      localStorage.setItem('shadow_achievements', JSON.stringify(achievements));
    }, 2000);

    return () => clearInterval(saveInterval);
  }, [player, upgrades, army, extractionMode, codex, achievements]);

  const codexDpsBonus = codex.reduce((acc, entry) => acc + (entry.count * 0.01), 1);
  const totalDps = army.reduce((acc, shadow) => acc + shadow.dps, 0) * upgrades.prestigeMultiplier * codexDpsBonus;

  const updateAchievement = useCallback((id: string, amount: number, absolute = false) => {
    setAchievements(prev => prev.map(ach => {
      if (ach.id === id && !ach.completed) {
        const nextCurrent = absolute ? amount : ach.current + amount;
        const completed = nextCurrent >= ach.requirement;
        if (completed) {
          if (ach.rewardType === 'mana') setPlayer(p => ({ ...p, mana: p.mana + ach.rewardAmount }));
          else if (ach.rewardType === 'prestige') setPlayer(p => ({ ...p, prestigePoints: p.prestigePoints + ach.rewardAmount }));
        }
        return { ...ach, current: nextCurrent, completed };
      }
      return ach;
    }));
  }, []);

  const addShadow = useCallback((shadow: Shadow) => {
    setArmy(prev => [...prev, shadow]);
    updateAchievement('extract_5', 1);
  }, [updateAchievement]);

  const attemptExtraction = useCallback((target?: Enemy) => {
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
        if (nextAttempts <= 0) return { ...INITIAL_EXTRACTION, active: false };
        return { ...prev, attempts: nextAttempts };
      });
      return false;
    }
  }, [extraction.targetEnemy, addShadow, upgrades.extractionChance]);

  const attack = useCallback((amount: number = player.dpc): { damage: number; isCrit: boolean } | void => {
    if (extraction.active) return;
    const isCrit = Math.random() < (0.1 + upgrades.criticalChance);
    const finalDamage = (isCrit ? Math.floor(amount * (2.0 + upgrades.criticalMultiplier)) : amount) * upgrades.prestigeMultiplier;

    setEnemy(prev => {
      if (prev.hp <= 0) return prev;
      const newHp = Math.max(0, prev.hp - finalDamage);
      if (newHp === 0) {
        // Update Codex
        setCodex(current => {
          const existing = current.find(e => e.name === prev.name);
          if (existing) return current.map(e => e.name === prev.name ? { ...e, count: e.count + 1 } : e);
          return [...current, { name: prev.name, count: 1, rank: prev.rank, unlocked: true }];
        });
        updateAchievement('kills_10', 1);

        if (prev.rank !== 'normal') {
          if (extractionMode === 'manual') setExtraction({ active: true, attempts: 3, timeLeft: 10, targetEnemy: { ...prev, hp: 0 } });
          else if (extractionMode === 'auto') {
            const autoSuccess = Math.random() < (0.1 + upgrades.extractionChance);
            if (autoSuccess) addShadow({ id: Math.random().toString(36).substr(2, 9), name: `Shadow ${prev.name}`, rank: prev.rank, dps: prev.level * 5 });
          }
        }
        
        setPlayer(p => {
          const expGain = (prev.level * 20) * (prev.rank === 'boss' ? 5 : prev.rank === 'elite' ? 2 : 1);
          let newExp = p.exp + expGain;
          let newLevel = p.level;
          let newMaxExp = p.maxExp;
          let newDpc = p.dpc;
          const manaGain = prev.level * 10;
          if (newExp >= p.maxExp) {
            newLevel += 1;
            newExp = newExp - p.maxExp;
            newMaxExp = newLevel * 100;
            newDpc = newLevel * 10;
            updateAchievement('level_10', newLevel, true);
          }
          return { ...p, level: newLevel, exp: newExp, maxExp: newMaxExp, dpc: newDpc, mana: p.mana + manaGain };
        });
        return { ...prev, hp: 0 };
      }
      return { ...prev, hp: newHp };
    });
    return { damage: finalDamage, isCrit };
  }, [player.dpc, extraction.active, upgrades.criticalChance, upgrades.criticalMultiplier, upgrades.prestigeMultiplier, extractionMode, upgrades.extractionChance, addShadow, updateAchievement]);

  const rebirth = useCallback(() => {
    if (player.level < 10) return;
    const gainedPoints = Math.floor(player.level / 10);
    setPlayer(p => ({
      ...INITIAL_PLAYER,
      prestigePoints: p.prestigePoints + gainedPoints,
      rebirths: p.rebirths + 1,
    }));
    setUpgrades(u => ({
      ...INITIAL_UPGRADES,
      prestigeMultiplier: 1.0 + ((player.prestigePoints + gainedPoints) * 0.1)
    }));
    setArmy(INITIAL_ARMY);
    setEnemy(createEnemy(1));
  }, [player.level, player.prestigePoints]);

  useEffect(() => {
    if (!extraction.active) return;
    const timer = setInterval(() => {
      setExtraction(prev => {
        if (prev.timeLeft <= 1) { clearInterval(timer); return { ...INITIAL_EXTRACTION, active: false }; }
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
      return [...others, { id: Math.random().toString(36).substr(2, 9), name, rank: nextRank, dps: identical[0].dps * 2.5 }];
    });
  }, []);

  useEffect(() => {
    if (!extraction.active && enemy.hp === 0) setEnemy(createEnemy(player.level));
  }, [extraction.active, enemy.hp, player.level]);

  useEffect(() => {
    if (totalDps <= 0) return;
    const interval = setInterval(() => attack(totalDps / 10), 100);
    return () => clearInterval(interval);
  }, [totalDps, attack]);

  return { 
    player, enemy, army, extraction, extractionMode, upgrades, codex, achievements,
    setExtractionMode, attack, addShadow, attemptExtraction, buyUpgrade, mergeShadows, totalDps, rebirth
  };
};
