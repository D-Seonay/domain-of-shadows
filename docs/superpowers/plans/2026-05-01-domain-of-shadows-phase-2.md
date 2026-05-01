# Domain of Shadows: Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the shadow army inventory system and passive damage (DPS) logic where shadows automatically attack enemies.

**Architecture:** Extend `useGameState` to manage an array of `Shadow` objects. Create a new `ShadowInventory` component to display the army.

**Tech Stack:** React, TypeScript, Framer Motion, TailwindCSS v4.0.

---

### Task 1: Update Types & Initial State

**Files:**
- Modify: `src/types/game.ts`
- Modify: `src/hooks/useGameState.ts`

- [ ] **Step 1: Update types to include Shadow and Army**
```typescript
// src/types/game.ts
export type Rank = 'normal' | 'elite' | 'knight' | 'general' | 'monarch';

export interface Shadow {
  id: string;
  name: string;
  rank: Rank;
  dps: number;
}

export interface Player {
  level: number;
  exp: number;
  maxExp: number;
  dpc: number;
  dps: number; // This will be calculated from the army
}

export interface GameState {
  player: Player;
  enemy: Enemy;
  army: Shadow[];
}
```

- [ ] **Step 2: Update useGameState to handle army**
```typescript
// src/hooks/useGameState.ts
// ... imports
const INITIAL_ARMY: Shadow[] = [];

// ... createEnemy

export const useGameState = () => {
  const [player, setPlayer] = useState<Player>(INITIAL_PLAYER);
  const [enemy, setEnemy] = useState<Enemy>(createEnemy(1));
  const [army, setArmy] = useState<Shadow[]>(INITIAL_ARMY);

  const totalDps = army.reduce((acc, shadow) => acc + shadow.dps, 0);

  const attack = useCallback((amount: number = player.dpc) => {
    setEnemy(prev => {
      const newHp = Math.max(0, prev.hp - amount);
      if (newHp === 0) {
        setPlayer(p => ({ ...p, exp: p.exp + 20 }));
        return createEnemy(player.level);
      }
      return { ...prev, hp: newHp };
    });
  }, [player.dpc, player.level]);

  // Passive DPS tick
  useEffect(() => {
    if (totalDps <= 0) return;
    const interval = setInterval(() => {
      attack(totalDps / 10); // Tick every 100ms
    }, 100);
    return () => clearInterval(interval);
  }, [totalDps, attack]);

  const addShadow = (shadow: Shadow) => {
    setArmy(prev => [...prev, shadow]);
  };

  return { player, enemy, army, attack, addShadow, totalDps };
};
```

- [ ] **Step 3: Commit state changes**
Run: `git add src/types/game.ts src/hooks/useGameState.ts && git commit -m "feat: add army state and passive damage logic"`

---

### Task 2: Shadow Inventory Component

**Files:**
- Create: `src/components/ShadowInventory.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create ShadowInventory component**
```tsx
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
```

- [ ] **Step 2: Update App layout to include sidebar**
```tsx
// src/App.tsx
// ... imports
import { ShadowInventory } from './components/ShadowInventory';

export default function App() {
  const { player, enemy, army, attack, totalDps } = useGameState();

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
      </main>

      {/* Sidebar */}
      <ShadowInventory army={army} />
    </div>
  );
}
```

- [ ] **Step 3: Commit UI changes**
Run: `git add src/App.tsx src/components/ShadowInventory.tsx && git commit -m "feat: add shadow inventory UI"`

---

### Task 3: Testing & Debug Helper

**Files:**
- Create: `src/components/DebugTools.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create DebugTools to spawn shadows**
```tsx
// src/components/DebugTools.tsx
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
```

- [ ] **Step 2: Add DebugTools to App**
```tsx
// src/App.tsx
import { DebugTools } from './components/DebugTools';
// ...
// Inside return:
<DebugTools onAddShadow={addShadow} />
```

- [ ] **Step 3: Verify passive damage**
1. Add a shadow using DebugTools.
2. Observe enemy HP decreasing automatically every second.
3. Verify HP bar moves smoothly.

- [ ] **Step 4: Commit and Finish Phase 2**
Run: `git add . && git commit -m "feat: complete Phase 2 shadow army and dps"`
