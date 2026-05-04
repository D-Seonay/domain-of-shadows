# Portal System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a dimensional portal scanner and raid system where players can find and enter dungeons of various ranks to defeat bosses and extract shadows.

**Architecture:** 
- A new hook `usePortalScanner` handles the state of discovered portals.
- The `gameMode` state is expanded to include `radar` and `raid`.
- Portals are generated with random ranks and affixes.
- Combat logic is adapted to handle dungeon cleaning and boss spawning.

**Tech Stack:** React 19, TypeScript, Framer Motion (for UI), Vitest.

---

### Task 1: Data Model & Types

**Files:**
- Modify: `src/types/game.ts`

- [ ] **Step 1: Update types for Portals and Game Mode**

```typescript
// src/types/game.ts

export type PortalRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface PortalAffix {
  name: string;
  description: string;
  effect: (stats: any) => any; // We'll refine this
}

export interface Portal {
  id: string;
  rank: PortalRank;
  name: string;
  type: string;
  bossName: string;
  instability: number; // Time in seconds before closing
  maxInstability: number;
  affixes: PortalAffix[];
  cleared: boolean;
  position: { x: number; y: number }; // Radar coordinates (normalized 0-1)
}

// Add 'radar' and 'raid' to GameMode or similar state
```

- [ ] **Step 2: Commit types**

```bash
git add src/types/game.ts
git commit -m "types: add portal and raid interfaces"
```

---

### Task 2: Scanner Hook Logic

**Files:**
- Create: `src/hooks/usePortalScanner.ts`
- Test: `src/hooks/__tests__/usePortalScanner.test.ts`

- [ ] **Step 1: Write failing test for portal generation**

```typescript
import { renderHook, act } from '@testing-library/react';
import { usePortalScanner } from '../usePortalScanner';
import { describe, it, expect } from 'vitest';

describe('usePortalScanner', () => {
  it('should generate 3-5 portals on scan', () => {
    const { result } = renderHook(() => usePortalScanner());
    act(() => {
      result.current.scan();
    });
    expect(result.current.portals.length).toBeGreaterThanOrEqual(3);
    expect(result.current.portals.length).toBeLessThanOrEqual(5);
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm test src/hooks/__tests__/usePortalScanner.test.ts`
Expected: FAIL (module not found)

- [ ] **Step 3: Implement minimal logic**

```typescript
import { useState } from 'react';
import { Portal, PortalRank } from '../types/game';

export const usePortalScanner = () => {
  const [portals, setPortals] = useState<Portal[]>([]);

  const scan = () => {
    const count = Math.floor(Math.random() * 3) + 3;
    const newPortals: Portal[] = Array.from({ length: count }).map((_, i) => ({
      id: `portal-${Date.now()}-${i}`,
      rank: 'E',
      name: 'Shadow Realm',
      type: 'Darkness',
      bossName: 'Shadow Guard',
      instability: 300,
      maxInstability: 300,
      affixes: [],
      cleared: false,
      position: { x: Math.random(), y: Math.random() }
    }));
    setPortals(newPortals);
  };

  return { portals, scan };
};
```

- [ ] **Step 4: Run test to verify success**

Run: `npm test src/hooks/__tests__/usePortalScanner.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/usePortalScanner.ts src/hooks/__tests__/usePortalScanner.test.ts
git commit -m "feat: add basic portal scanner hook"
```

---

### Task 3: Portal Radar UI

**Files:**
- Create: `src/components/PortalRadar.tsx`
- Modify: `src/App.tsx` (to display the radar)

- [ ] **Step 1: Create the Radar component with Framer Motion**

```tsx
// src/components/PortalRadar.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Portal } from '../types/game';

interface Props {
  portals: Portal[];
  onSelect: (portal: Portal) => void;
  onScan: () => void;
}

export const PortalRadar: React.FC<Props> = ({ portals, onSelect, onScan }) => {
  return (
    <div className="relative w-96 h-96 border-2 border-zinc-800 rounded-full bg-zinc-950 overflow-hidden">
      <motion.div 
        className="absolute w-1/2 h-1/2 top-1/2 left-1/2 bg-gradient-to-tr from-purple-500/20 to-transparent origin-top-left"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      {portals.map(p => (
        <button 
          key={p.id}
          className="absolute w-4 h-4 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7] transform -translate-x-1/2 -translate-y-1/2"
          style={{ top: `${p.position.y * 100}%`, left: `${p.position.x * 100}%` }}
          onClick={() => onSelect(p)}
        >
          <span className="text-[8px] font-bold">{p.rank}</span>
        </button>
      ))}
      <button onClick={onScan} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-100 text-zinc-950 px-4 py-2 font-black italic">
        SCAN
      </button>
    </div>
  );
};
```

- [ ] **Step 2: Commit UI**

```bash
git add src/components/PortalRadar.tsx
git commit -m "feat: add portal radar UI component"
```

---

### Task 4: Integration & Game Mode Transition

**Files:**
- Modify: `src/hooks/useGameState.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Add 'radar' and 'raid' modes to useGameState**
- [ ] **Step 2: Handle transition from Radar to Raid**
- [ ] **Step 3: Commit integration**

```bash
git add src/hooks/useGameState.ts src/App.tsx
git commit -m "feat: integrate radar mode into game state"
```

---

### Task 5: Raid Implementation (Waves & Boss)

**Files:**
- Modify: `src/hooks/useGameState.ts`
- Create: `src/components/RaidOverlay.tsx`

- [ ] **Step 1: Implement wave counter and boss trigger logic**
- [ ] **Step 2: Apply portal affixes to enemy stats**
- [ ] **Step 3: Commit raid logic**

---

### Task 4: Fatigue & Rewards

**Files:**
- Modify: `src/hooks/useGameState.ts`

- [ ] **Step 1: Add fatigue debuff on failure**
- [ ] **Step 2: Add reward payout on boss defeat**
- [ ] **Step 3: Commit rewards logic**
