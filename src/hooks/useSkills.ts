import { useState, useCallback } from 'react';
import { Player, Enemy } from '../types/game';

export const useSkills = (
  player: Player, 
  enemy: Enemy, 
  attack: (amount?: number) => { damage: number; isCrit: boolean } | void,
  cdIncrease: number = 0
) => {
  const [cooldowns, setCooldowns] = useState({
    q: 0,
    w: 0,
    e: 0,
  });

  const [activeBuffs, setActiveBuffs] = useState({
    w: false,
  });

  const triggerSkill = useCallback((skillKey: 'q' | 'w' | 'e') => {
    const now = Date.now();
    
    if (now < cooldowns[skillKey]) return;

    const cdMultiplier = 1 + cdIncrease;

    if (skillKey === 'q') {
      // Q: Shadow Strike - 5x DPC
      attack(player.dpc * 5);
      setCooldowns(prev => ({ ...prev, q: now + (5000 * cdMultiplier) }));
    } else if (skillKey === 'w') {
      // W: Dominator's Touch - Double DPC for 5s
      setActiveBuffs(prev => ({ ...prev, w: true }));
      setTimeout(() => setActiveBuffs(prev => ({ ...prev, w: false })), 5000);
      setCooldowns(prev => ({ ...prev, w: now + (20000 * cdMultiplier) }));
    } else if (skillKey === 'e') {
      // E: Monarch's Authority - Execute or Massive Damage
      if (enemy.rank !== 'boss') {
        attack(enemy.hp); // Execute
      } else {
        attack(player.dpc * 50); // Massive damage to boss
      }
      setCooldowns(prev => ({ ...prev, e: now + (45000 * cdMultiplier) }));
    }
  }, [cooldowns, player.dpc, enemy.rank, enemy.hp, attack, cdIncrease]);

  return { cooldowns, activeBuffs, triggerSkill };
};
