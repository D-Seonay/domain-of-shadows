// src/App.tsx
import { useGameState } from './hooks/useGameState';
import { EnemyHUD } from './components/EnemyHUD';
import { Sword } from 'lucide-react';

export default function App() {
  const { player, enemy, attack } = useGameState();

  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center gap-12 bg-zinc-950 text-zinc-100">
      <div className="fixed top-8 right-8 text-right">
        <div className="text-sm text-zinc-500 uppercase">System Level</div>
        <div className="text-4xl font-black italic">LV. {player.level}</div>
      </div>

      <EnemyHUD enemy={enemy} />

      <button 
        onClick={attack}
        className="group relative flex items-center justify-center w-48 h-48 border border-zinc-800 hover:border-zinc-100 transition-colors"
      >
        <Sword className="w-12 h-12 text-zinc-800 group-hover:text-zinc-100 transition-colors" />
        <div className="absolute inset-0 bg-zinc-100/5 opacity-0 group-active:opacity-100 transition-opacity" />
      </button>
      
      <div className="text-zinc-500 text-xs uppercase tracking-tighter">
        Click to Arise
      </div>
    </main>
  );
}
