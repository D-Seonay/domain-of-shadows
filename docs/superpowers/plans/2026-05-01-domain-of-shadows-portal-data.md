# Portal & Biome Data Structures Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Biome and Portal definitions and integrate them into the game state to support multi-biome gameplay.

**Architecture:** Extend the existing `GameState` and `useGameState` hook to include biome-specific logic, portal generation, and persistence. Biomes will affect monster spawning and provide gameplay modifiers.

**Tech Stack:** React, TypeScript, LocalStorage for persistence.

---

### Task 1: Define Biome and Portal Types

**Files:**
- Modify: `src/types/game.ts`

- [ ] **Step 1: Add Biome and Portal type definitions**

```typescript
export type BiomeType = 'frost' | 'fire' | 'void' | 'shadow';

export interface Biome {
  type: BiomeType;
  name: string;
  color: string; // Tailwind hex or class
  monsters: string[];
  modifier?: {
    type: 'dps_reduction' | 'cd_increase' | 'mana_boost';
    value: number;
  };
}

export interface Portal {
  id: string;
  rank: 'blue' | 'red' | 's';
  biome: Biome;
  difficulty: number;
}
```

- [ ] **Step 2: Update GameState interface**

Update `GameState` to include `activePortal` and `availablePortals`.

```typescript
export interface GameState {
  player: Player;
  enemy: Enemy;
  army: Shadow[];
  extraction: ExtractionState;
  extractionMode: ExtractionMode;
  upgrades: Upgrades;
  codex: CodexEntry[];
  achievements: Achievement[];
  dungeon: DungeonState;
  activePortal: Portal | null;
  availablePortals: Portal[];
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS (with warnings about unused types/properties in useGameState)

### Task 2: Initialize Biomes and Portal Logic

**Files:**
- Modify: `src/hooks/useGameState.ts`

- [ ] **Step 1: Define BIOMES constant**

```typescript
const BIOMES: Record<BiomeType, Biome> = {
  frost: {
    type: 'frost',
    name: 'Frost Realm',
    color: '#00f2ff',
    monsters: ['Ice Elf', 'Frost Bear'],
    modifier: { type: 'cd_increase', value: 1.2 }
  },
  fire: {
    type: 'fire',
    name: 'Hellfire Caves',
    color: '#ff4d00',
    monsters: ['Cerberus', 'High Orc'],
    modifier: { type: 'dps_reduction', value: 0.85 }
  },
  void: {
    type: 'void',
    name: 'Void Abyss',
    color: '#8b00ff',
    monsters: ['Void Knight', 'Shadow Soldier'],
    modifier: { type: 'mana_boost', value: 1.5 }
  },
  shadow: {
    type: 'shadow',
    name: 'Shadow Domain',
    color: '#4b0082',
    monsters: ['Blood Red Igris', 'Iron Knight']
  }
};
```

- [ ] **Step 2: Add Portal State and generatePortals function**

Add state for `activePortal` and `availablePortals`. Implement `generatePortals` helper.

```typescript
const generatePortals = (level: number): Portal[] => {
  const ranks: ('blue' | 'red' | 's')[] = ['blue', 'red', 's'];
  const types: BiomeType[] = ['frost', 'fire', 'void', 'shadow'];
  
  return Array(3).fill(null).map((_, i) => ({
    id: Math.random().toString(36).substr(2, 9),
    rank: ranks[Math.floor(Math.random() * ranks.length)],
    biome: BIOMES[types[Math.floor(Math.random() * types.length)]],
    difficulty: level + i * 2
  }));
};
```

- [ ] **Step 3: Update createEnemy to use biome monsters**

```typescript
const createEnemy = (playerLevel: number, forceBoss: boolean = false, activePortal: Portal | null = null): Enemy => {
  const currentMonsters = activePortal 
    ? MONSTERS.filter(m => activePortal.biome.monsters.includes(m.name))
    : MONSTERS;

  const monsterList = forceBoss 
    ? currentMonsters.filter(m => m.ranks.includes('boss'))
    : currentMonsters;
  
  // Fallback if biome has no boss/rank
  const finalMonsterList = monsterList.length > 0 ? monsterList : MONSTERS;
  const monster = finalMonsterList[Math.floor(Math.random() * finalMonsterList.length)];
  // ... rest of createEnemy
```

- [ ] **Step 4: Update useGameState return and state initialization**

Include `activePortal` and `availablePortals` in the hook's return and handle their initialization from LocalStorage.

### Task 3: Update Persistence and Verification

**Files:**
- Modify: `src/hooks/useGameState.ts`

- [ ] **Step 1: Add portal state to persistence Effect**

```typescript
  useEffect(() => {
    const saveToLocalStorage = () => {
      // ...
      localStorage.setItem('shadow_active_portal', JSON.stringify(activePortal));
      localStorage.setItem('shadow_available_portals', JSON.stringify(availablePortals));
    };
    saveToLocalStorage();
  }, [player, upgrades, army, extractionMode, codex, achievements, dungeon, activePortal, availablePortals]);
```

- [ ] **Step 2: Initialize from LocalStorage**

```typescript
  const [activePortal, setActivePortal] = useState<Portal | null>(() => {
    const saved = localStorage.getItem('shadow_active_portal');
    return saved ? JSON.parse(saved) : null;
  });
  const [availablePortals, setAvailablePortals] = useState<Portal[]>(() => {
    const saved = localStorage.getItem('shadow_available_portals');
    return saved ? JSON.parse(saved) : generatePortals(player?.level || 1);
  });
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS
