// src/components/EnemyHUD.tsx
import { Enemy } from '../types/game';
import { motion } from 'framer-motion';

export const EnemyHUD = ({ enemy }: { enemy: Enemy }) => {
  const hpPercent = (enemy.hp / enemy.maxHp) * 100;

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <div className="text-sm uppercase tracking-widest text-zinc-500">
        Rank: {enemy.rank} | Level: {enemy.level}
      </div>
      <h2 className="text-2xl font-black italic">{enemy.name}</h2>
      <div className="w-full bg-zinc-900 h-2 border border-zinc-800 relative overflow-hidden">
        <motion.div 
          className="h-full bg-zinc-100"
          initial={{ width: '100%' }}
          animate={{ width: `${hpPercent}%` }}
          transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
        />
      </div>
      <div className="text-xs text-zinc-500 tabular-nums">
        {Math.ceil(enemy.hp)} / {enemy.maxHp} HP
      </div>
    </div>
  );
};
