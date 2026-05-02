import { motion } from 'framer-motion';
import { Player, Upgrades } from '../types/game';
import { Zap, Target, Crosshair } from 'lucide-react';

export const UpgradeShop = ({ 
  player, 
  upgrades, 
  onBuy,
  onClose
}: { 
  player: Player; 
  upgrades: Upgrades; 
  onBuy: (type: keyof Upgrades, cost: number, increment: number) => void;
  onClose: () => void;
}) => {
  const shopItems = [
    {
      id: 'extractionChance' as keyof Upgrades,
      name: 'Extraction Resonance',
      description: 'Increases success rate of ARISE protocol.',
      icon: <Zap className="w-4 h-4" />,
      cost: 100 * (1 + upgrades.extractionChance * 10),
      increment: 0.05,
      display: `+${(upgrades.extractionChance * 100).toFixed(0)}%`
    },
    {
      id: 'criticalChance' as keyof Upgrades,
      name: 'Critical Protocol',
      description: 'Optimizes strike precision for higher crit rates.',
      icon: <Target className="w-4 h-4" />,
      cost: 150 * (1 + upgrades.criticalChance * 10),
      increment: 0.05,
      display: `+${(upgrades.criticalChance * 100).toFixed(0)}%`
    },
    {
      id: 'criticalMultiplier' as keyof Upgrades,
      name: 'Lethal Force',
      description: 'Augments the intensity of critical impacts.',
      icon: <Crosshair className="w-4 h-4" />,
      cost: 200 * (1 + upgrades.criticalMultiplier * 2),
      increment: 0.2,
      display: `x${(2.0 + upgrades.criticalMultiplier).toFixed(1)}`
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed inset-y-0 right-0 w-[450px] bg-zinc-950 border-l border-zinc-900 p-12 flex flex-col gap-12 z-40 backdrop-blur-3xl bg-zinc-950/95 shadow-[ -20px_0_50px_rgba(0,0,0,0.5)] h-screen overflow-hidden"
    >
      <div className="flex justify-between items-start shrink-0">
        <div className="flex flex-col gap-2">
          <div className="text-[10px] uppercase text-zinc-500 font-black tracking-[0.4em] italic">
            // CORE AUGMENTATION
          </div>
          <div className="text-4xl font-black italic tracking-tighter">ENHANCEMENT LAB</div>
        </div>
        <button 
          onClick={onClose}
          className="group flex items-center gap-2 text-[10px] text-zinc-600 hover:text-zinc-100 uppercase tracking-widest italic transition-colors"
        >
          <span className="w-4 h-[1px] bg-zinc-800 group-hover:bg-zinc-100 transition-colors" />
          // CLOSE
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 shrink-0">
        <div className="flex flex-col gap-1 p-5 border border-zinc-900 bg-zinc-900/10">
          <div className="text-[8px] text-zinc-600 uppercase tracking-widest italic">// MANA RESERVE</div>
          <div className="text-3xl font-black italic text-shadow leading-none tabular-nums">{player.mana.toLocaleString()}</div>
        </div>
        <div className="flex flex-col gap-1 p-5 border border-zinc-900 bg-zinc-900/10">
          <div className="text-[8px] text-zinc-600 uppercase tracking-widest italic">// SYSTEM LV</div>
          <div className="text-3xl font-black italic text-zinc-100 leading-none tabular-nums">{player.level}</div>
        </div>
      </div>

      <div className="flex flex-col gap-8 overflow-y-auto pr-4 -mr-4 flex-1">
        {shopItems.map(item => (
          <div key={item.id} className="group flex flex-col gap-5 p-6 border border-zinc-900 bg-zinc-950 hover:bg-zinc-900/20 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity">
               <div className="text-[40px] text-zinc-800">{item.icon}</div>
            </div>

            <div className="flex justify-between items-start relative z-10">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <div className="text-shadow">
                    {item.icon}
                  </div>
                  <span className="text-sm font-black italic uppercase tracking-tight">{item.name}</span>
                </div>
                <span className="text-[10px] text-zinc-500 tabular-nums tracking-widest">{item.display} ACTIVE</span>
              </div>
            </div>
            
            <p className="text-[11px] text-zinc-600 leading-relaxed italic relative z-10 border-l border-zinc-900 pl-4">// {item.description}</p>
            
            <button
              onClick={() => onBuy(item.id, Math.floor(item.cost), item.increment)}
              disabled={player.mana < item.cost}
              className="mt-2 w-full py-4 border border-zinc-800 text-[10px] font-black uppercase tracking-[0.3em] italic hover:bg-zinc-100 hover:text-zinc-950 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-zinc-500 transition-all duration-300 relative z-10"
            >
              INVEST {Math.floor(item.cost).toLocaleString()} MANA
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
