# Domain of Shadows: Phase 5 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the game from a prototype into a "cool" experience by adding Economy & Upgrades, Visual Juice (Screen Shake, Crits), and Shadow Merging mechanics.

**Architecture:** 
- Add `mana` to `Player` state for the shop.
- Create an `Upgrades` state to track purchased boosts.
- Create a `ShopOverlay` or expand the UI to include a shop tab.
- Add Critical Hit logic to `attack`.
- Add merge logic to `useGameState`.

**Tech Stack:** React, TypeScript, Framer Motion, TailwindCSS v4.0.

---

### Task 1: Economy, Upgrades & Critical Hits

**Files:**
- Modify: `src/types/game.ts`
- Modify: `src/hooks/useGameState.ts`

- [ ] **Step 1: Update Types**
```typescript
// src/types/game.ts
// Add mana to Player
export interface Player {
  // ... existing
  mana: number;
}

export interface Upgrades {
  extractionChance: number; // base 0.4 + this
  criticalChance: number; // base 0.1 + this
  criticalMultiplier: number; // base 2.0 + this
}

export interface GameState {
  // ... existing
  upgrades: Upgrades;
}
```

- [ ] **Step 2: Update useGameState**
```typescript
// src/hooks/useGameState.ts
// Add INITIAL_UPGRADES and update INITIAL_PLAYER (add mana: 0).
const INITIAL_UPGRADES: Upgrades = { extractionChance: 0, criticalChance: 0, criticalMultiplier: 0 };
// Add upgrades to state, initialize from LocalStorage.
// Update `localStorage` save logic to include `upgrades`.

// Inside attack logic:
// Calculate critical hit
const isCrit = Math.random() < (0.1 + upgrades.criticalChance);
const finalDamage = isCrit ? amount * (2.0 + upgrades.criticalMultiplier) : amount;

// On enemy death:
// Grant mana = enemy.level * 10
setPlayer(p => ({ ...p, exp: p.exp + 50, mana: p.mana + (prev.level * 10) }));

// In attemptExtraction:
// Update success chance: Math.random() < (0.4 + upgrades.extractionChance)

// Add buyUpgrade function
const buyUpgrade = (type: keyof Upgrades, cost: number, increment: number) => {
  if (player.mana >= cost) {
    setPlayer(p => ({ ...p, mana: p.mana - cost }));
    setUpgrades(u => ({ ...u, [type]: u[type] + increment }));
  }
};

// Export upgrades, buyUpgrade, and return isCrit from attack (maybe change attack to return the damage info for UI, or handle popups in App as we do now but we need to know if it was a crit).
// Alternatively, keep UI simple: if damage > player.dpc, it's a crit.
```

- [ ] **Step 3: Commit state updates**
Run: `git add src/types/game.ts src/hooks/useGameState.ts && git commit -m "feat: add mana, upgrades state, and crits"`

---

### Task 2: Visual Juice (Screen Shake & Crits)

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles/index.css`

- [ ] **Step 1: Add Screen Shake CSS**
```css
/* src/styles/index.css */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px) rotate(-1deg); }
  75% { transform: translateX(5px) rotate(1deg); }
}
.animate-shake {
  animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both;
}
```

- [ ] **Step 2: Update App.tsx for Crits and Shake**
```tsx
// src/App.tsx
// Add a shake state
const [isShaking, setIsShaking] = useState(false);

// Update handleAttack to determine if it was a crit (if amount parameter is not passed, useGameState calculates it. Wait, App passes `undefined` to `attack()`. Let's update `attack` to return the actual damage dealt and whether it was a crit.)
// Actually, easier: change `attack` to return `{ damage: number, isCrit: boolean } | void`.
// Then in `handleAttack`:
/*
const result = attack();
if (result) {
  if (result.isCrit) {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 200);
  }
  // Add popup with result.damage and result.isCrit
}
*/
```

- [ ] **Step 3: Update Floating Damage**
If `isCrit`, make the popup text larger and red/purple instead of white.

- [ ] **Step 4: Commit Visual Juice**
Run: `git add src/App.tsx src/styles/index.css src/hooks/useGameState.ts && git commit -m "feat: add screen shake and critical hit visuals"`

---

### Task 3: The Shop & Shadow Merging UI

**Files:**
- Create: `src/components/UpgradeShop.tsx`
- Modify: `src/components/ShadowInventory.tsx`
- Modify: `src/hooks/useGameState.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Shadow Merging Logic**
In `useGameState.ts`, add `mergeShadows(name: string, rank: Rank)`.
Logic: Find 3 shadows with exact `name` and `rank`. Remove them. Add 1 shadow with the same name but next rank (e.g., normal -> elite -> knight), with increased DPS.

- [ ] **Step 2: Shadow Inventory UI**
Update `ShadowInventory.tsx` to group identical shadows. If count >= 3, show a `// MERGE` button.

- [ ] **Step 3: Upgrade Shop UI**
Create `UpgradeShop.tsx`. A simple modal or sidebar section showing Mana.
Buttons to buy: 
- `Extraction Resonance (+5% Chance) - Cost: 100 Mana`
- `Critical Protocol (+5% Crit Chance) - Cost: 150 Mana`

- [ ] **Step 4: Integrate Shop in App**
Add a button in `App.tsx` to toggle the Shop overlay.

- [ ] **Step 5: Verify and Commit**
Run: `npm run build && npx vitest run`
Run: `git add . && git commit -m "feat: implement shop and shadow merging"`
