import { Shadow } from '../types/game';

export const DebugTools = ({ onAddShadow }: { onAddShadow: (s: Shadow) => void }) => {
  return (
    <div className="fixed bottom-4 left-4 flex gap-2">
      <button 
        onClick={() => onAddShadow({
          id: Math.random().toString(),
          name: 'Shadow Infantry',
          rank: 'normal',
          dps: 5
        })}
        className="text-[10px] bg-zinc-900 border border-zinc-800 p-1 hover:border-zinc-100"
      >
        + Add Shadow
      </button>
    </div>
  );
};
