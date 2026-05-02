# Domain of Shadows: Phase 6 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Portals (Dungeons) with floor progression, Active Skills for the Monarch, and specialized Shadow Classes.

**Architecture:** 
- Add `dungeon` state to track current floor and progress.
- Implement a `skills` hook to manage cooldowns and active effects.
- Extend `Shadow` type with `class` and unique stat modifiers.

**Tech Stack:** React, TypeScript, Framer Motion.

---

### Task 1: Dungeon & Portal System

**Files:**
- Modify: `src/types/game.ts`
- Modify: `src/hooks/useGameState.ts`

- [ ] **Step 1: Update Types for Dungeon**
```typescript
export interface DungeonState {
  currentFloor: number;
  enemiesDefeated: number;
  enemiesPerFloor: number; // e.g., 5
  isBossFloor: boolean;
}
// Update GameState to include dungeon
```

- [ ] **Step 2: Implement Dungeon Logic**
Update `attack` to progress through floors. Every 5 enemies, spawn a Boss. After Boss, move to next Floor.

- [ ] **Step 3: Commit Dungeon logic**
Run: `git add . && git commit -m "feat: implement portal progression system"`

---

### Task 2: Active Monarch Skills (Q, W, E)

**Files:**
- Create: `src/hooks/useSkills.ts`
- Modify: `src/App.tsx`
- Create: `src/components/SkillBar.tsx`

- [ ] **Step 1: Create useSkills hook**
Skills:
- **Q: Shadow Strike** (Instant Damage, 5s CD)
- **W: Dominator's Touch** (+50% DPC for 5s, 15s CD)
- **E: Monarch's Authority** (Instant kill normal enemies, 30s CD)

- [ ] **Step 2: Create SkillBar UI**
Show icons with cooldown overlays and keyboard shortcuts.

- [ ] **Step 3: Integrate Skills into App**
Add event listeners for keys.

---

### Task 3: Shadow Classes & Specializations

**Files:**
- Modify: `src/types/game.ts`
- Modify: `src/hooks/useGameState.ts`
- Modify: `src/components/ShadowInventory.tsx`

- [ ] **Step 1: Add Shadow Classes**
Classes:
- **Infantry:** Base DPS.
- **Tank:** Increases DPC (Monarch protection).
- **Mage:** Adds "Magic DPS" (chance to double passive tick).
- **Assassin:** Increases Critical Chance.

- [ ] **Step 2: Update Bonus Calculations**
Modify `totalDps` and `player.dpc` calculations to account for army composition.

- [ ] **Step 3: Final Polish & Verification**
Run: `npm run build && npx vitest run`
Run: `git add . && git commit -m "feat: add active skills and shadow classes"`
