import React from 'react';
import { motion } from 'framer-motion';
import { Portal, DungeonState } from '../types/game';
import { Shield, Zap, Droplets, Target } from 'lucide-react';

interface RaidOverlayProps {
  activePortal: Portal | null;
  dungeon: DungeonState;
}

const AFFIX_ICONS: Record<string, React.ReactNode> = {
  hp_boost: <Shield className="w-3 h-3 text-cyan-400" />,
  dmg_boost: <Zap className="w-3 h-3 text-orange-400" />,
  mana_drain: <Droplets className="w-3 h-3 text-blue-400" />,
  dps_reduction: <Target className="w-3 h-3 text-red-400" />,
};

export const RaidOverlay: React.FC<RaidOverlayProps> = ({ activePortal, dungeon }) => {
  if (!activePortal) return null;

  const isBossWave = dungeon.enemiesDefeated >= dungeon.enemiesPerFloor;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-24 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-4 pointer-events-none"
    >
      <div className="flex flex-col items-center gap-1">
        <div className="text-[10px] text-shadow uppercase font-black tracking-[0.4em] italic animate-pulse">
          // RAID IN PROGRESS //
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-4xl font-black italic text-zinc-100 tracking-tighter">
            {isBossWave ? 'BOSS WAVE' : `WAVE ${dungeon.enemiesDefeated + 1}/${dungeon.enemiesPerFloor}`}
          </div>
          <div className="text-xs font-bold text-zinc-600 italic">RANK {activePortal.rank}</div>
        </div>
      </div>

      {activePortal.affixes.length > 0 && (
        <div className="flex gap-4 p-3 bg-zinc-950/80 border border-zinc-900/50 backdrop-blur-sm">
          {activePortal.affixes.map(affix => (
            <div key={affix.id} className="flex items-center gap-2 group relative pointer-events-auto">
              {AFFIX_ICONS[affix.type] || <Target className="w-3 h-3 text-zinc-400" />}
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{affix.name}</div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-zinc-900 border border-zinc-800 text-[9px] text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <div className="text-zinc-300 font-bold mb-1">{affix.name}</div>
                {affix.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
