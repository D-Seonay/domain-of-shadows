// src/components/EnemyHUD.tsx
import { Enemy } from '../types/game';
import { motion } from 'framer-motion';

export const EnemyHUD = ({ enemy }: { enemy: Enemy }) => {
  const hpPercent = (enemy.hp / enemy.maxHp) * 100;

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg">
      <div className="flex items-center gap-4 w-full">
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-zinc-800" />
        <div className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 whitespace-nowrap">
          Target Identified: {enemy.rank}
        </div>
        <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-zinc-800" />
      </div>
      
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-5xl font-black italic tracking-tighter uppercase text-zinc-100">{enemy.name}</h2>
        <div className="text-[10px] text-zinc-600 tracking-[0.3em] font-bold">CORE LEVEL: {enemy.level}</div>
      </div>

      <div className="w-full flex flex-col gap-3">
        <div className="w-full bg-zinc-900/50 h-[3px] relative overflow-hidden">
          <motion.div 
            className="absolute inset-y-0 left-0 bg-zinc-100"
            initial={{ width: '100%' }}
            animate={{ width: `${hpPercent}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between items-center text-[9px] font-bold tabular-nums tracking-[0.2em] text-zinc-500 uppercase">
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 bg-zinc-500 rounded-full animate-pulse" />
            Integrity Scan
          </span>
          <span>{Math.ceil(enemy.hp).toLocaleString()} / {enemy.maxHp.toLocaleString()} UNITS</span>
        </div>
      </div>
    </div>
  );
};
