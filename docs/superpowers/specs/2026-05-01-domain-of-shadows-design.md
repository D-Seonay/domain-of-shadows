# Domain of Shadows: Design Specification
**Date:** 2026-05-01
**Status:** Approved

## Project Overview
"Domain of Shadows" is a "Solo Leveling" inspired Clicker / Idle game where the player (The Monarch of Shadows) battles monsters and extracts their shadows to build an invincible army.

## Core Mechanics

### 1. Combat (Clicker/Idle)
- **Manual Clicks (DPC):** Reduces enemy HP based on player level and equipment.
- **Idle Damage (DPS):** Automatically reduces enemy HP every second, scaled by the total power of the Shadow Army.
- **UI:** A "Tactical HUD" displaying enemy rank, health, and player stats.

### 2. Extraction (ARISE)
- **Trigger:** Activation after defeating Elite or Boss monsters.
- **Mini-game:** A "Sync" game where players must click when a pulsing circle overlaps a target area.
- **Attempts:** 3 attempts per extraction; fails if time runs out (10s) or attempts reach 0.
- **Outcome:** Success adds a new Shadow to the army; failure causes the shadow to dissipate.

### 3. Shadow Army
- **Inventory:** A list of extracted shadows.
- **Bonuses:** Each shadow provides passive buffs (e.g., +5 DPS, +2% Crit Chance).
- **Ranks:** Shadows have ranks (Normal, Elite, Knight, General, etc.) influencing their power.

## Technical Architecture

### Tech Stack
- **Framework:** React 19 (TypeScript)
- **Build Tool:** Vite
- **Styling:** TailwindCSS v4.0 (Custom Zinc/Black theme)
- **Animations:** Framer Motion
- **Icons:** Lucide-React
- **Persistence:** LocalStorage (via custom hooks)

### Data Model
```typescript
interface Player {
  level: number;
  exp: number;
  shadowEnergy: number;
}

interface Shadow {
  id: string;
  name: string;
  rank: 'normal' | 'elite' | 'knight' | 'general' | 'monarch';
  baseDamage: number;
}

interface Enemy {
  id: string;
  name: string;
  rank: 'normal' | 'elite' | 'boss';
  level: number;
  hp: number;
  maxHp: number;
}
```

## UI/UX Design (Tactical Commander)
- **Aesthetic:** High-Tech Stealth / Dark Mode Absolute.
- **Background:** Zinc-950 (Deep Black).
- **Foreground:** Zinc-100 (Silver/White).
- **Accent:** Purple-500 (Shadow Energy/Mana).
- **Layout:** Split-pane dashboard with real-time logs and tactical feedback.

## Roadmap
1. **Phase 1:** Basic combat loop & monster spawning.
2. **Phase 2:** Army inventory & passive damage logic.
3. **Phase 3:** Extraction mini-game (Sync mechanics).
4. **Phase 4:** Persistence & UI Polish (Stealth animations).
