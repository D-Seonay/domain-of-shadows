// src/App.tsx
import { useGameState } from './hooks/useGameState';
import { EnemyHUD } from './components/EnemyHUD';
import { ShadowInventory } from './components/ShadowInventory';
import { DebugTools } from './components/DebugTools';
import { Sword } from 'lucide-react';

export default function App() {
  const { player, enemy, army, attack, addShadow, totalDps } = useGameState();

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100 overflow-hidden font-mono">
      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col items-center justify-center gap-12 relative">
        <div className="absolute top-8 left-8">
           <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Total Army DPS</div>
           <div className="text-2xl font-black italic text-purple-500">{totalDps.toFixed(1)}</div>
        </div>

        <div className="fixed top-8 right-8 text-right">
          <div className="text-sm text-zinc-500 uppercase">System Level</div>
          <div className="text-4xl font-black italic">LV. {player.level}</div>
        </div>

        <EnemyHUD enemy={enemy} />

        <button 
          onClick={() => attack()}
          className="group relative flex items-center justify-center w-48 h-48 border border-zinc-800 hover:border-zinc-100 transition-colors"
        >
          <Sword className="w-12 h-12 text-zinc-800 group-hover:text-zinc-100 transition-colors" />
          <div className="absolute inset-0 bg-zinc-100/5 opacity-0 group-active:opacity-100 transition-opacity" />
        </button>

        <DebugTools onAddShadow={addShadow} />
      </main>

      {/* Sidebar */}
      <ShadowInventory army={army} />
    </div>
  );
}
