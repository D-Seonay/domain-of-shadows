// src/App.tsx
import { useState, useCallback } from 'react';
import { useGameState } from './hooks/useGameState';
import { EnemyHUD } from './components/EnemyHUD';
import { ShadowInventory } from './components/ShadowInventory';
import { DebugTools } from './components/DebugTools';
import { ExtractionOverlay } from './components/ExtractionOverlay';
import { Sword } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DamagePopup {
  id: number;
  value: number;
  x: number;
  y: number;
}

export default function App() {
  const { 
    player, enemy, army, extraction, 
    attack: baseAttack, addShadow, attemptExtraction, totalDps 
  } = useGameState();

  const [popups, setPopups] = useState<DamagePopup[]>([]);

  const attack = useCallback((amount?: number, x?: number, y?: number) => {
    const damage = amount ?? player.dpc;
    baseAttack(damage);
    
    if (x !== undefined && y !== undefined) {
      const id = Date.now() + Math.random();
      setPopups(prev => [...prev, { id, value: damage, x, y }]);
      setTimeout(() => {
        setPopups(prev => prev.filter(p => p.id !== id));
      }, 800);
    }
  }, [baseAttack, player.dpc]);

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100 overflow-hidden font-mono selection:bg-zinc-100 selection:text-zinc-950">
      {/* Main Content */}
      <main className="flex-1 p-12 flex flex-col items-center justify-center gap-24 relative">
        {/* Left Info HUD */}
        <div className="absolute top-12 left-12 border-l border-zinc-800 pl-4 py-2">
           <div className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-1">Total Army DPS</div>
           <div className="text-3xl font-black italic text-zinc-100 tabular-nums">
             {totalDps.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
           </div>
        </div>

        {/* Right Player HUD */}
        <div className="fixed top-12 right-12 text-right flex flex-col items-end gap-3 border-r border-zinc-800 pr-4 py-2">
          <div className="text-[10px] text-zinc-500 uppercase tracking-[0.3em]">System Status</div>
          <div className="text-5xl font-black italic leading-none tracking-tighter">LV. {player.level}</div>
          
          <div className="flex flex-col items-end gap-1">
            <div className="w-48 bg-zinc-900/50 h-[2px] relative overflow-hidden">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-zinc-100"
                initial={{ width: 0 }}
                animate={{ width: `${(player.exp / player.maxExp) * 100}%` }}
                transition={{ duration: 0.8, ease: "circOut" }}
              />
            </div>
            <div className="text-[9px] text-zinc-600 uppercase tracking-widest tabular-nums">
              EXP {player.exp} / {player.maxExp}
            </div>
          </div>
        </div>

        <div className="w-full max-w-2xl flex flex-col items-center gap-16">
          <EnemyHUD enemy={enemy} />

          <div className="relative">
            <button 
              onClick={(e) => attack(undefined, e.clientX, e.clientY)}
              disabled={extraction.active}
              className="group relative flex items-center justify-center w-64 h-64 border border-zinc-900 hover:border-zinc-700 active:border-zinc-100 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <Sword className="w-16 h-16 text-zinc-900 group-hover:text-zinc-100 group-active:scale-95 transition-all duration-300" />
              <div className="absolute inset-0 bg-zinc-100/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-800" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-800" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-800" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-800" />
            </button>

            {/* Floating Damage Popups */}
            <AnimatePresence>
              {popups.map(popup => (
                <motion.div
                  key={popup.id}
                  initial={{ opacity: 1, y: popup.y - 100, x: popup.x - 20 }}
                  animate={{ opacity: 0, y: popup.y - 250 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="fixed pointer-events-none text-2xl font-black italic text-zinc-100 z-50 mix-blend-difference"
                >
                  -{Math.floor(popup.value)}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="fixed bottom-12 left-12">
          <DebugTools onAddShadow={addShadow} />
        </div>

        <ExtractionOverlay state={extraction} onAttempt={attemptExtraction} />
      </main>

      {/* Sidebar */}
      <ShadowInventory army={army} />
    </div>
  );
}
