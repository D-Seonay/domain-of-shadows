# Domain of Shadows: Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the basic combat loop where players can click to attack monsters, see health bars, and witness monster respawning.

**Architecture:** React 19 with Vite, Tailwind v4 for styling. State managed via a central `useGameState` hook.

**Tech Stack:** React, TypeScript, Vite, TailwindCSS v4.0, Framer Motion, Lucide-React.

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `src/main.tsx`

- [ ] **Step 1: Create package.json**
```json
{
  "name": "domain-of-shadows",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "framer-motion": "^11.11.11",
    "lucide-react": "^0.454.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.4"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^4.0.0-alpha.31",
    "typescript": "^5.6.3",
    "vite": "^5.4.11"
  }
}
```

- [ ] **Step 2: Create vite.config.ts**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

- [ ] **Step 3: Install dependencies**
Run: `npm install`
Expected: `node_modules` created.

- [ ] **Step 4: Create basic index.html and main.tsx**
```html
<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Domain of Shadows</title>
  </head>
  <body class="bg-zinc-950 text-zinc-100">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Commit scaffolding**
Run: `git add . && git commit -m "chore: initial project scaffolding"`

---

### Task 2: Type Definitions & State Hook

**Files:**
- Create: `src/types/game.ts`
- Create: `src/hooks/useGameState.ts`

- [ ] **Step 1: Define game types**
```typescript
// src/types/game.ts
export type Rank = 'normal' | 'elite' | 'boss';

export interface Enemy {
  id: string;
  name: string;
  level: number;
  rank: Rank;
  hp: number;
  maxHp: number;
}

export interface Player {
  level: number;
  exp: number;
  maxExp: number;
  dpc: number; // Damage Per Click
  dps: number; // Damage Per Second
}

export interface GameState {
  player: Player;
  enemy: Enemy;
}
```

- [ ] **Step 2: Create useGameState hook**
```typescript
// src/hooks/useGameState.ts
import { useState, useCallback, useEffect } from 'react';
import { GameState, Enemy, Player } from '../types/game';

const INITIAL_PLAYER: Player = {
  level: 1,
  exp: 0,
  maxExp: 100,
  dpc: 10,
  dps: 0,
};

const createEnemy = (level: number): Enemy => ({
  id: Math.random().toString(36).substr(2, 9),
  name: 'Shadow Soldier',
  level,
  rank: 'normal',
  hp: level * 50,
  maxHp: level * 50,
});

export const useGameState = () => {
  const [player, setPlayer] = useState<Player>(INITIAL_PLAYER);
  const [enemy, setEnemy] = useState<Enemy>(createEnemy(1));

  const attack = useCallback(() => {
    setEnemy(prev => {
      const newHp = Math.max(0, prev.hp - player.dpc);
      if (newHp === 0) {
        // Monster killed logic
        setPlayer(p => ({ ...p, exp: p.exp + 20 }));
        return createEnemy(player.level);
      }
      return { ...prev, hp: newHp };
    });
  }, [player.dpc, player.level]);

  return { player, enemy, attack };
};
```

- [ ] **Step 3: Commit types and hook**
Run: `git add src/types/game.ts src/hooks/useGameState.ts && git commit -m "feat: add game types and state hook"`

---

### Task 3: Core UI & Combat Zone

**Files:**
- Create: `src/App.tsx`
- Create: `src/components/EnemyHUD.tsx`
- Create: `src/styles/index.css`

- [ ] **Step 1: Add global styles with Tailwind v4**
```css
/* src/styles/index.css */
@import "tailwindcss";

@theme {
  --color-zinc-950: #09090b;
  --color-zinc-900: #18181b;
  --color-zinc-100: #f4f4f5;
  --color-shadow: #a855f7;
}

:root {
  background-color: var(--color-zinc-950);
  color: var(--color-zinc-100);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
```

- [ ] **Step 2: Create EnemyHUD component**
```tsx
// src/components/EnemyHUD.tsx
import { Enemy } from '../types/game';
import { motion } from 'framer-motion';

export const EnemyHUD = ({ enemy }: { enemy: Enemy }) => {
  const hpPercent = (enemy.hp / enemy.maxHp) * 100;

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <div className="text-sm uppercase tracking-widest text-zinc-500">
        Rank: {enemy.rank} | Level: {enemy.level}
      </div>
      <h2 className="text-2xl font-black italic">{enemy.name}</h2>
      <div className="w-full bg-zinc-900 h-2 border border-zinc-800 relative overflow-hidden">
        <motion.div 
          className="h-full bg-zinc-100"
          initial={{ width: '100%' }}
          animate={{ width: `${hpPercent}%` }}
          transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
        />
      </div>
      <div className="text-xs text-zinc-500 tabular-nums">
        {Math.ceil(enemy.hp)} / {enemy.maxHp} HP
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Create Main App layout**
```tsx
// src/App.tsx
import { useGameState } from './hooks/useGameState';
import { EnemyHUD } from './components/EnemyHUD';
import { Sword } from 'lucide-react';

export default function App() {
  const { player, enemy, attack } = useGameState();

  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center gap-12 bg-zinc-950">
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
```

- [ ] **Step 4: Commit UI**
Run: `git add src/App.tsx src/components/EnemyHUD.tsx src/styles/index.css && git commit -m "feat: implement basic combat UI"`

---

### Task 4: Final Verification

- [ ] **Step 1: Start dev server**
Run: `npm run dev`
Expected: Server starts on localhost.

- [ ] **Step 2: Verify Combat Loop**
1. Open browser.
2. Click the Sword button.
3. Observe health bar decreasing.
4. Verify monster "respawns" with full health when HP reaches 0.
5. Verify experience increases (check React DevTools or add a console.log).

- [ ] **Step 3: Commit and Finish**
Run: `git commit -m "feat: complete Phase 1 combat loop"`
