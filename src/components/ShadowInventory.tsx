// src/components/ShadowInventory.tsx
import { Shadow } from '../types/game';
import { Ghost } from 'lucide-react';

export const ShadowInventory = ({ army }: { army: Shadow[] }) => {
  return (
    <div className="flex flex-col gap-4 w-64 border-l border-zinc-800 p-4 bg-zinc-900/50">
      <div className="text-xs uppercase text-zinc-500 font-bold tracking-widest border-b border-zinc-800 pb-2">
        Shadow Army ({army.length})
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[60vh] pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
        {army.length === 0 && (
          <div className="text-zinc-600 text-xs italic py-4">No shadows extracted... yet.</div>
        )}
        {army.map(shadow => (
          <div key={shadow.id} className="flex items-center gap-3 p-2 border border-zinc-800 bg-zinc-950/50 hover:border-purple-500/50 transition-colors">
            <Ghost className="w-4 h-4 text-purple-500" />
            <div className="flex flex-col">
              <span className="text-xs font-bold italic">{shadow.name}</span>
              <span className="text-[10px] text-zinc-500 uppercase">{shadow.rank} | +{shadow.dps} DPS</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
