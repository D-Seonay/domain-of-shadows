// src/components/ShadowInventory.tsx
import { Shadow, Rank, ShadowClass } from '../types/game';
import { Ghost, Merge, Shield, Zap, Target, Sword } from 'lucide-react';
import { useMemo } from 'react';

const CLASS_ICONS: Record<ShadowClass, any> = {
  infantry: Sword,
  tank: Shield,
  mage: Zap,
  assassin: Target,
};

export const ShadowInventory = ({ 
  army,
  onMerge,
  classCounts,
  totalDps
}: { 
  army: Shadow[];
  onMerge: (name: string, rank: Rank) => void;
  classCounts: Record<ShadowClass, number>;
  totalDps: number;
}) => {
  const groupedArmy = useMemo(() => {
    const groups: Record<string, { shadow: Shadow; count: number }> = {};
    army.forEach(s => {
      const key = `${s.name}-${s.rank}-${s.class}`;
      if (groups[key]) {
        groups[key].count += 1;
      } else {
        groups[key] = { shadow: s, count: 1 };
      }
    });
    return Object.values(groups);
  }, [army]);

  return (
    <div className="flex flex-col gap-10 w-96 border-l border-zinc-900 p-12 bg-zinc-950 z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.3)] h-screen overflow-hidden">
      <div className="flex flex-col gap-2 border-b border-zinc-900 pb-8 shrink-0">
        <div className="text-[11px] uppercase text-zinc-500 font-black tracking-[0.4em] italic">
          // SHADOW MANIFEST
        </div>
        <div className="flex items-baseline gap-3">
          <div className="text-6xl font-black italic tracking-tighter text-zinc-100">
            {army.length.toString().padStart(2, '0')}
          </div>
          <div className="text-[10px] text-zinc-700 uppercase font-bold tracking-widest italic">// UNITS RECORDED</div>
        </div>
      </div>

      {/* Army Bonuses Summary */}
      <div className="grid grid-cols-2 gap-2 shrink-0">
        <div className="p-3 border border-zinc-900 bg-zinc-900/10 flex flex-col">
          <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest italic">// TANKS</span>
          <span className="text-xs font-bold text-zinc-100">+{((classCounts['tank'] || 0) * 2).toLocaleString()} DPC</span>
        </div>
        <div className="p-3 border border-zinc-900 bg-zinc-900/10 flex flex-col">
          <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest italic">// MAGES</span>
          <span className="text-xs font-bold text-shadow">+{((classCounts['mage'] || 0) * 10)}% DPS</span>
        </div>
        <div className="p-3 border border-zinc-900 bg-zinc-900/10 flex flex-col">
          <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest italic">// ASSASSINS</span>
          <span className="text-xs font-bold text-zinc-100">+{((classCounts['assassin'] || 0))} % CRIT</span>
        </div>
      </div>

      <div className="flex flex-col gap-6 overflow-y-auto pr-4 -mr-4 flex-1">
        {groupedArmy.length === 0 && (
          <div className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] py-20 text-center italic border border-dashed border-zinc-900">
            // SCANNING FOR VIABLE ESSENCES...
          </div>
        )}
        {groupedArmy.map(({ shadow, count }) => {
          const Icon = CLASS_ICONS[shadow.class] || Ghost;
          return (
            <div key={`${shadow.name}-${shadow.rank}-${shadow.class}`} className="group flex flex-col gap-4 p-6 border border-zinc-900 bg-zinc-950 hover:bg-zinc-900/40 hover:border-zinc-700 transition-all duration-500 relative">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black italic uppercase tracking-tight text-zinc-100">
                      {shadow.name}
                    </span>
                    {count > 1 && (
                      <span className="px-2 py-0.5 bg-shadow/10 text-shadow text-[9px] font-black italic rounded-sm">
                        x{count}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">
                      {shadow.rank}
                    </span>
                    <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                    <Icon className="w-3 h-3 text-zinc-600" />
                    <span className="text-[9px] text-shadow font-black tabular-nums">
                      +{(shadow.dps * count).toLocaleString()} DPS
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-zinc-900/50 text-shadow group-hover:scale-110 transition-transform duration-500">
                  <Ghost className="w-5 h-5" />
                </div>
              </div>

              {count >= 3 && shadow.rank !== 'monarch' && (
                <div className="flex flex-col gap-3 pt-2 border-t border-zinc-900/50">
                  <div className="text-[8px] text-shadow font-black animate-pulse tracking-[0.3em] italic text-center">
                    // RESONANCE DETECTED
                  </div>
                  <button 
                    onClick={() => onMerge(shadow.name, shadow.rank)}
                    className="flex items-center justify-center gap-3 py-3 border border-purple-500 text-[10px] text-zinc-100 bg-purple-900/10 font-black uppercase tracking-[0.2em] italic hover:bg-purple-500 hover:text-zinc-950 transition-all duration-500"
                  >
                    <Merge className="w-3 h-3" />
                    // INITIATE MERGE
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-auto border-t border-zinc-900 pt-8 flex flex-col gap-2 shrink-0">
        <div className="text-[9px] text-zinc-600 uppercase tracking-[0.3em] italic font-black">
          // ARMY TOTAL STRENGTH
        </div>
        <div className="text-2xl font-black italic text-zinc-300 tracking-tighter">
          {totalDps.toLocaleString()} <span className="text-[10px] text-zinc-600 ml-1">DPS</span>
        </div>
      </div>
    </div>
  );
};
