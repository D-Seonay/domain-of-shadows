import { useState, useCallback } from 'react';
import { Player, Enemy } from '../types/game';

export const useSkills = (
  player: Player, 
  enemy: Enemy, 
  attack: (amount?: number) => { damage: number; isCrit: boolean } | void
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

    if (skillKey === 'q') {
      // Q: Shadow Strike - 5x DPC
      attack(player.dpc * 5);
      setCooldowns(prev => ({ ...prev, q: now + 5000 }));
    } else if (skillKey === 'w') {
      // W: Dominator's Touch - Double DPC for 5s
      setActiveBuffs(prev => ({ ...prev, w: true }));
      setTimeout(() => setActiveBuffs(prev => ({ ...prev, w: false })), 5000);
      setCooldowns(prev => ({ ...prev, w: now + 20000 }));
    } else if (skillKey === 'e') {
      // E: Monarch's Authority - Execute or Massive Damage
      if (enemy.rank !== 'boss') {
        attack(enemy.hp); // Execute
      } else {
        attack(player.dpc * 50); // Massive damage to boss
      }
      setCooldowns(prev => ({ ...prev, e: now + 45000 }));
    }
  }, [cooldowns, player.dpc, enemy.rank, enemy.hp, attack]);

  return { cooldowns, activeBuffs, triggerSkill };
};
