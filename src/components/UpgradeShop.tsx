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
      className="fixed inset-y-0 right-80 w-96 bg-zinc-950 border-l border-zinc-900 p-10 flex flex-col gap-10 z-40 backdrop-blur-xl bg-zinc-950/90"
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] uppercase text-zinc-500 font-black tracking-[0.3em] italic">
            // ENHANCEMENT LAB
          </div>
          <div className="text-3xl font-black italic tracking-tighter">PROTOCOLS</div>
        </div>
        <button 
          onClick={onClose}
          className="text-[10px] text-zinc-600 hover:text-zinc-100 uppercase tracking-widest italic"
        >
          // CLOSE
        </button>
      </div>

      <div className="flex flex-col gap-2 p-4 border border-zinc-900 bg-zinc-900/20">
        <div className="text-[9px] text-zinc-500 uppercase tracking-widest italic">// AVAILABLE MANA</div>
        <div className="text-2xl font-black italic text-shadow">{player.mana.toLocaleString()}</div>
      </div>

      <div className="flex flex-col gap-6 overflow-y-auto pr-2">
        {shopItems.map(item => (
          <div key={item.id} className="group flex flex-col gap-4 p-5 border border-zinc-900 bg-zinc-950 hover:border-zinc-700 transition-all duration-500">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-900 text-shadow group-hover:bg-shadow group-hover:text-zinc-950 transition-colors duration-500">
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black italic uppercase tracking-tight">{item.name}</span>
                  <span className="text-[10px] text-zinc-500 tabular-nums">{item.display} ACTIVE</span>
                </div>
              </div>
            </div>
            
            <p className="text-[10px] text-zinc-600 leading-relaxed italic">// {item.description}</p>
            
            <button
              onClick={() => onBuy(item.id, Math.floor(item.cost), item.increment)}
              disabled={player.mana < item.cost}
              className="mt-2 w-full py-3 border border-zinc-800 text-[10px] font-black uppercase tracking-[0.2em] italic hover:bg-zinc-100 hover:text-zinc-950 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-zinc-500 transition-all duration-300"
            >
              INVEST {Math.floor(item.cost).toLocaleString()} MANA
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
