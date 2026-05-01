// src/components/ShadowInventory.tsx
import { Shadow, Rank } from '../types/game';
import { Ghost, Merge } from 'lucide-react';
import { useMemo } from 'react';

export const ShadowInventory = ({ 
  army,
  onMerge
}: { 
  army: Shadow[];
  onMerge: (name: string, rank: Rank) => void;
}) => {
  const groupedArmy = useMemo(() => {
    const groups: Record<string, { shadow: Shadow; count: number }> = {};
    army.forEach(s => {
      const key = `${s.name}-${s.rank}`;
      if (groups[key]) {
        groups[key].count += 1;
      } else {
        groups[key] = { shadow: s, count: 1 };
      }
    });
    return Object.values(groups);
  }, [army]);

  return (
    <div className="flex flex-col gap-8 w-80 border-l border-zinc-900 p-10 bg-zinc-950 z-10">
      <div className="flex flex-col gap-1">
        <div className="text-[10px] uppercase text-zinc-500 font-black tracking-[0.3em] italic">
          // SHADOW MANIFEST
        </div>
        <div className="text-4xl font-black italic tracking-tighter">
          {army.length.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto pr-4 -mr-4 scrollbar-hide">
        {groupedArmy.length === 0 && (
          <div className="text-zinc-500 text-[10px] uppercase tracking-widest py-12 border-t border-zinc-900 italic">
            // SCANNING FOR VIABLE ESSENCES...
          </div>
        )}
        {groupedArmy.map(({ shadow, count }) => (
          <div key={`${shadow.name}-${shadow.rank}`} className="group flex flex-col gap-3 p-5 border border-zinc-900 bg-zinc-950 hover:bg-zinc-900/30 transition-all duration-500">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-black italic uppercase tracking-tight text-zinc-100">
                  {shadow.name} {count > 1 && <span className="text-shadow ml-1 font-mono">x{count}</span>}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] text-zinc-600 uppercase tracking-widest font-bold">
                    {shadow.rank}
                  </span>
                  <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                  <span className="text-[8px] text-zinc-500 font-mono">
                    +{(shadow.dps * count).toLocaleString()} DPS
                  </span>
                </div>
              </div>
              <Ghost className="w-4 h-4 text-shadow group-hover:text-shadow/80 transition-colors" />
            </div>

            {count >= 3 && shadow.rank !== 'monarch' && (
              <button 
                onClick={() => onMerge(shadow.name, shadow.rank)}
                className="mt-2 flex items-center justify-center gap-2 py-2 border border-purple-900/50 text-[9px] text-purple-400 font-black uppercase tracking-widest italic hover:bg-purple-500 hover:text-zinc-950 transition-all duration-300"
              >
                <Merge className="w-3 h-3" />
                // MERGE TRANCE
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-auto border-t border-zinc-900 pt-6">
        <div className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] italic">
          // TOTAL ARMY STRENGTH: {(army.reduce((acc, s) => acc + s.dps, 0)).toLocaleString()}
        </div>
      </div>
    </div>
  );
};
