import { Shadow } from '../types/game';

export const DebugTools = ({ onAddShadow }: { onAddShadow: (s: Shadow) => void }) => {
  return (
    <div className="flex gap-2">
      <button 
        onClick={() => onAddShadow({
          id: Math.random().toString(36).substr(2, 9),
          name: 'Shadow Infantry',
          rank: 'normal',
          dps: 5,
          class: 'infantry'
        })}
        className="text-[10px] bg-zinc-900 border border-zinc-800 p-2 hover:border-zinc-100 uppercase tracking-widest italic"
      >
        + Add Infantry
      </button>
      <button 
        onClick={() => onAddShadow({
          id: Math.random().toString(36).substr(2, 9),
          name: 'Shadow Tank',
          rank: 'normal',
          dps: 2,
          class: 'tank'
        })}
        className="text-[10px] bg-zinc-900 border border-zinc-800 p-2 hover:border-zinc-100 uppercase tracking-widest italic"
      >
        + Add Tank
      </button>
    </div>
  );
};
