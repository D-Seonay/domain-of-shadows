// src/components/ShadowInventory.tsx
import { Shadow } from '../types/game';
import { Ghost } from 'lucide-react';

export const ShadowInventory = ({ army }: { army: Shadow[] }) => {
  return (
    <div className="flex flex-col gap-8 w-80 border-l border-zinc-900 p-10 bg-zinc-950">
      <div className="flex flex-col gap-1">
        <div className="text-[10px] uppercase text-zinc-500 font-black tracking-[0.3em] italic">
          // SHADOW MANIFEST
        </div>
        <div className="text-4xl font-black italic tracking-tighter">
          {army.length.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto pr-4 -mr-4 scrollbar-hide">
        {army.length === 0 && (
          <div className="text-zinc-500 text-[10px] uppercase tracking-widest py-12 border-t border-zinc-900 italic">
            // SCANNING FOR VIABLE ESSENCES...
          </div>
        )}
        {army.map(shadow => (
          <div key={shadow.id} className="group flex items-center justify-between p-5 border border-zinc-900 bg-zinc-950 hover:bg-zinc-900/30 transition-all duration-500">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-black italic uppercase tracking-tight text-zinc-300 group-hover:text-zinc-100 transition-colors">
                {shadow.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[8px] text-zinc-600 uppercase tracking-widest font-bold">
                  {shadow.rank}
                </span>
                <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                <span className="text-[8px] text-zinc-500 font-mono">
                  +{shadow.dps} DPS
                </span>
              </div>
            </div>
            <Ghost className="w-4 h-4 text-shadow group-hover:text-shadow/80 transition-colors" />
          </div>
        ))}
      </div>

      <div className="mt-auto border-t border-zinc-900 pt-6">
        <div className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] italic">
          // TOTAL ARMY STRENGTH: {(army.reduce((acc, s) => acc + s.dps, 0)).toLocaleString()}
        </div>
      </div>
      >>>>
  );
};
