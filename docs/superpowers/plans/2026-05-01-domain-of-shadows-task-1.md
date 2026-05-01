# Task 1: Monster Database & Leveling Logic Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a dynamic monster database and player leveling system with scaling stats in `useGameState.ts`.

**Architecture:** 
- Centralize monster definitions in a `MONSTERS` constant.
- Enhance `createEnemy` to use random monsters and scale HP based on rank.
- Update `useGameState` to handle player experience gain, level-ups, and stat scaling (maxExp, dpc).

**Tech Stack:** React, TypeScript, Vitest

---

### Task 1.1: Monster Database and Enhanced `createEnemy`

**Files:**
- Modify: `src/hooks/useGameState.ts`
- Test: `src/hooks/useGameState.test.ts`

- [ ] **Step 1: Write failing tests for dynamic enemy generation**

```typescript
// src/hooks/useGameState.test.ts
// Add this test case to the 'useGameState' describe block

it('should generate enemies with different ranks and scaled HP', () => {
  const { result } = renderHook(() => useGameState());
  
  // We can't easily test randomness without mocking Math.random, 
  // but we can check if the generated enemy follows the new scaling rules.
  const enemy = result.current.enemy;
  expect(enemy.maxHp).toBeGreaterThanOrEqual(50); // Level 1 * 50 * multiplier(>=1)
  
  // Test if createEnemy respects player level scaling (indirectly via extraction success)
  // ... (to be handled in later steps)
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/hooks/useGameState.test.ts`
Expected: FAIL (or might pass accidentally if soldier is picked, but we need the new logic)

- [ ] **Step 3: Implement Monster Database and update `createEnemy`**

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
```

- [ ] **Step 4: Run tests to verify it passes**

Run: `npm test src/hooks/useGameState.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useGameState.ts
git commit -m "feat: implement monster database and scaled enemy generation"
```

---

### Task 1.2: Player Leveling Logic

**Files:**
- Modify: `src/hooks/useGameState.ts`
- Test: `src/hooks/useGameState.test.ts`

- [ ] **Step 1: Write failing test for leveling up**

```typescript
// src/hooks/useGameState.test.ts

it('should level up player when exp reaches maxExp', () => {
  const { result } = renderHook(() => useGameState());

  // Setup: kill enemy to trigger extraction
  act(() => {
    // Attack enough to kill any level 1 enemy (max HP 250 for boss)
    result.current.attack(250);
  });

  // Success 1: gain 50 exp (maxExp is 100)
  act(() => {
    result.current.attemptExtraction(true);
  });
  expect(result.current.player.level).toBe(1);
  expect(result.current.player.exp).toBe(50);

  // Kill second enemy
  act(() => {
    result.current.attack(250);
  });

  // Success 2: gain 50 exp -> 100 exp -> Level Up
  act(() => {
    result.current.attemptExtraction(true);
  });

  expect(result.current.player.level).toBe(2);
  expect(result.current.player.exp).toBe(0); // Carry over logic if needed, but 0 is fine for now
  expect(result.current.player.maxExp).toBe(200); // 100 * 2 (simple scaling)
  expect(result.current.player.dpc).toBeGreaterThan(10); // dpc should increase
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/hooks/useGameState.test.ts`
Expected: FAIL (player stays level 1, exp keeps growing)

- [ ] **Step 3: Implement leveling logic in `useGameState.ts`**

Update `attemptExtraction` and add a `useEffect` or logic within `attemptExtraction` to check for level up.

```typescript
// Inside useGameState.ts -> attemptExtraction

  const attemptExtraction = (success: boolean) => {
    if (success) {
      addShadow({
        id: Math.random().toString(),
        name: `Shadow ${extraction.targetEnemy?.name || 'Soldier'}`,
        rank: extraction.targetEnemy?.rank || 'normal',
        dps: (extraction.targetEnemy?.level || 1) * 5
      });
      setExtraction(INITIAL_EXTRACTION);
      
      setPlayer(p => {
        let newExp = p.exp + 50;
        let newLevel = p.level;
        let newMaxExp = p.maxExp;
        let newDpc = p.dpc;

        if (newExp >= p.maxExp) {
          newLevel += 1;
          newExp = newExp - p.maxExp; // Carry over exp
          newMaxExp = newLevel * 100; // Scaling: 100, 200, 300...
          newDpc = newLevel * 10; // Scaling: 10, 20, 30...
        }

        return {
          ...p,
          level: newLevel,
          exp: newExp,
          maxExp: newMaxExp,
          dpc: newDpc
        };
      });

      // Spawn next enemy based on POTENTIALLY new level
      // Note: setPlayer is async, so we might need to be careful.
      // Better: trigger enemy spawn in a useEffect watching player.level?
      // Or just use the current player.level + 1 logic if level up happened.
    } else {
      // ... fail logic
    }
  };
```

Wait, the spawn logic in `attemptExtraction` uses `player.level`. If `setPlayer` is called first, the subsequent `setEnemy(createEnemy(player.level))` will use the *old* level because of closure.

Refactor:
```typescript
// Use a useEffect to spawn enemy when extraction ends or player levels up?
// Or calculate the new level first.
```

Revised implementation for `attemptExtraction`:

```typescript
  const attemptExtraction = (success: boolean) => {
    if (success) {
      const target = extraction.targetEnemy;
      addShadow({
        id: Math.random().toString(),
        name: `Shadow ${target?.name || 'Soldier'}`,
        rank: target?.rank || 'normal',
        dps: (target?.level || 1) * 5
      });
      
      setPlayer(p => {
        let newExp = p.exp + 50;
        let newLevel = p.level;
        let newMaxExp = p.maxExp;
        let newDpc = p.dpc;

        if (newExp >= p.maxExp) {
          newLevel += 1;
          newExp = newExp - p.maxExp;
          newMaxExp = newLevel * 100;
          newDpc = newLevel * 10;
        }

        return { ...p, level: newLevel, exp: newExp, maxExp: newMaxExp, dpc: newDpc };
      });

      setExtraction(INITIAL_EXTRACTION);
      // Moving setEnemy to a useEffect is safer to ensure it uses the updated level
    } else {
       // ... existing fail logic
    }
  };
```

And add:
```typescript
  // Respawn enemy when extraction ends
  useEffect(() => {
    if (!extraction.active && !extraction.targetEnemy && enemy.hp === 0) {
       setEnemy(createEnemy(player.level));
    }
  }, [extraction.active, extraction.targetEnemy, enemy.hp, player.level]);
```

- [ ] **Step 4: Run tests to verify it passes**

Run: `npm test src/hooks/useGameState.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useGameState.ts
git commit -m "feat: implement player leveling and stat scaling"
```

---

### Task 1.3: Clean Up and Refactor

- [ ] **Step 1: Verify all Phase 3 tests still pass**
- [ ] **Step 2: Ensure Types are correct in `src/types/game.ts`** (if not already updated by Phase 3)
- [ ] **Step 3: Final validation of `useGameState.ts`**
