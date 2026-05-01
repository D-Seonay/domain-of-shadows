# Domain of Shadows: Phase 4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the game systems by adding a variety of monsters, a scaling leveling system, and LocalStorage persistence.

**Architecture:** 
- Create a `monsterDatabase` for variety.
- Implement level-up logic that scales DPC and required EXP.
- Use a `useEffect` hook to sync the entire `GameState` to LocalStorage.

**Tech Stack:** React, TypeScript, LocalStorage.

---

### Task 1: Monster Database & Leveling Logic

**Files:**
- Modify: `src/hooks/useGameState.ts`

- [ ] **Step 1: Implement Monster Database and Leveling Logic**
Update `createEnemy` to pick from a list and implement `checkLevelUp`.

```typescript
// src/hooks/useGameState.ts

const MONSTERS = [
  { name: 'Shadow Soldier', ranks: ['normal'] },
  { name: 'Iron Knight', ranks: ['normal', 'elite'] },
  { name: 'Ice Elf', ranks: ['elite'] },
  { name: 'High Orc', ranks: ['elite', 'boss'] },
  { name: 'Cerberus', ranks: ['boss'] },
  { name: 'Blood Red Igris', ranks: ['boss'] },
];

const createEnemy = (playerLevel: number): Enemy => {
  const monster = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
  const rank = monster.ranks[Math.floor(Math.random() * monster.ranks.length)] as Rank;
  
  let multiplier = 1;
  if (rank === 'elite') multiplier = 2;
  if (rank === 'boss') multiplier = 5;

  const maxHp = playerLevel * 50 * multiplier;
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: monster.name,
    level: playerLevel + (rank === 'boss' ? 2 : 0),
    rank,
    hp: maxHp,
    maxHp: maxHp,
  };
};

// Inside useGameState:
const checkLevelUp = useCallback((currentExp: number, currentLevel: number) => {
  const maxExp = currentLevel * 100;
  if (currentExp >= maxExp) {
    setPlayer(prev => ({
      ...prev,
      level: prev.level + 1,
      exp: currentExp - maxExp,
      maxExp: (prev.level + 1) * 100,
      dpc: prev.dpc + 5, // Scale click damage
    }));
    return true;
  }
  return false;
}, []);
```

- [ ] **Step 2: Commit leveling logic**
Run: `git add src/hooks/useGameState.ts && git commit -m "feat: add monster variety and leveling scaling"`

---

### Task 2: Persistence (LocalStorage)

**Files:**
- Modify: `src/hooks/useGameState.ts`

- [ ] **Step 1: Add Save/Load logic**
```typescript
// src/hooks/useGameState.ts

// Load initial state from LocalStorage
const savedState = localStorage.getItem('shadow_monarch_save');
const INITIAL_DATA = savedState ? JSON.parse(savedState) : null;

// Inside useGameState:
useEffect(() => {
  const stateToSave = { player, army }; // We don't save the current enemy to avoid issues
  localStorage.setItem('shadow_monarch_save', JSON.stringify(stateToSave));
}, [player, army]);
```

- [ ] **Step 2: Commit persistence**
Run: `git add src/hooks/useGameState.ts && git commit -m "feat: implement LocalStorage persistence"`

---

### Task 3: UI Polish & Feedback

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/EnemyHUD.tsx`

- [ ] **Step 1: Add EXP Bar and Level Up feedback**
Show a progress bar for EXP at the top of the screen.

- [ ] **Step 2: Add "Floating Damage" or click feedback**
Use Framer Motion to show small numbers when clicking.

- [ ] **Step 3: Final build and verification**
Run: `npm run build && npx vitest run`

- [ ] **Step 4: Commit and Finish Project**
Run: `git add . && git commit -m "feat: complete game with persistence and polish"`
