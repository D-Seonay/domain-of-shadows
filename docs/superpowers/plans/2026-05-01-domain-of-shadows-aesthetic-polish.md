# Final Aesthetic Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the final aesthetic polish to the Domain of Shadows prototype, including purple accents and stealth code-comment typography.

**Architecture:** UI-only adjustments using Tailwind CSS classes and existing theme variables.

**Tech Stack:** React, Tailwind CSS, Framer Motion, Lucide React.

---

### Task 1: Update App.tsx Styles

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Apply purple accent to Total Army DPS and update typography**

```tsx
<<<<
        <div className="absolute top-12 left-12 border-l border-zinc-800 pl-4 py-2">
           <div className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-1">Total Army DPS</div>
           <div className="text-3xl font-black italic text-zinc-100 tabular-nums">
             {totalDps.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
           </div>
        </div>

        {/* Right Player HUD */}
        <div className="fixed top-12 right-12 text-right flex flex-col items-end gap-3 border-r border-zinc-800 pr-4 py-2">
          <div className="text-[10px] text-zinc-500 uppercase tracking-[0.3em]">System Status</div>
          <div className="text-5xl font-black italic leading-none tracking-tighter">LV. {player.level}</div>
====
        <div className="absolute top-12 left-12 border-l border-zinc-800 pl-4 py-2">
           <div className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-1 italic">// TOTAL ARMY DPS</div>
           <div className="text-3xl font-black italic text-shadow tabular-nums">
             {totalDps.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
           </div>
        </div>

        {/* Right Player HUD */}
        <div className="fixed top-12 right-12 text-right flex flex-col items-end gap-3 border-r border-zinc-800 pr-4 py-2">
          <div className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] italic">// SYSTEM STATUS</div>
          <div className="text-5xl font-black italic leading-none tracking-tighter">LV. {player.level}</div>
>>>>
```

- [ ] **Step 2: Update EXP label typography**

```tsx
<<<<
            </div>
            <div className="text-[9px] text-zinc-600 uppercase tracking-widest tabular-nums">
              EXP {player.exp} / {player.maxExp}
            </div>
====
            </div>
            <div className="text-[9px] text-zinc-500 uppercase tracking-widest tabular-nums italic">
              // EXP {player.exp} / {player.maxExp}
            </div>
>>>>
```

- [ ] **Step 3: Commit changes to App.tsx**

```bash
git add src/App.tsx
git commit -m "style(app): apply purple accent and stealth typography"
```

### Task 2: Update ShadowInventory.tsx Styles

**Files:**
- Modify: `src/components/ShadowInventory.tsx`

- [ ] **Step 1: Update labels and Ghost icon color**

```tsx
<<<<
      <div className="flex flex-col gap-1">
        <div className="text-[10px] uppercase text-zinc-600 font-black tracking-[0.3em]">
          Shadow Manifest
        </div>
        <div className="text-4xl font-black italic tracking-tighter">
          {army.length.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto pr-4 -mr-4 scrollbar-hide">
        {army.length === 0 && (
          <div className="text-zinc-800 text-[10px] uppercase tracking-widest py-12 border-t border-zinc-900">
            Scanning for viable essences...
          </div>
        )}
====
      <div className="flex flex-col gap-1">
        <div className="text-[10px] uppercase text-zinc-500 font-black tracking-[0.3em] italic">
          // SHADOW MANIFEST
        </div>
        <div className="text-4xl font-black italic tracking-tighter">
          {army.length.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto pr-4 -mr-4 scrollbar-hide">
        {army.length === 0 && (
          <div className="text-zinc-500 text-[10px] uppercase tracking-widest py-12 border-t border-zinc-900 italic">
            // SCANNING FOR VIABLE ESSENCES...
          </div>
        )}
>>>>
```

```tsx
<<<<
            </div>
            <Ghost className="w-4 h-4 text-zinc-900 group-hover:text-zinc-700 transition-colors" />
          </div>
        ))}
      </div>

      <div className="mt-auto border-t border-zinc-900 pt-6">
        <div className="text-[9px] text-zinc-700 uppercase tracking-[0.2em] italic">
          Total Army Strength: {(army.reduce((acc, s) => acc + s.dps, 0)).toLocaleString()}
        </div>
      </div>
====
            </div>
            <Ghost className="w-4 h-4 text-shadow group-hover:text-shadow/80 transition-colors" />
          </div>
        ))}
      </div>

      <div className="mt-auto border-t border-zinc-900 pt-6">
        <div className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] italic">
          // TOTAL ARMY STRENGTH: {(army.reduce((acc, s) => acc + s.dps, 0)).toLocaleString()}
        </div>
      </div>
>>>>
```

- [ ] **Step 2: Commit changes to ShadowInventory.tsx**

```bash
git add src/components/ShadowInventory.tsx
git commit -m "style(inventory): apply purple accent and stealth typography"
```

### Task 3: Update ExtractionOverlay.tsx Styles

**Files:**
- Modify: `src/components/ExtractionOverlay.tsx`

- [ ] **Step 1: Update ARISE color and protocol label**

```tsx
<<<<
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="text-8xl font-black italic text-zinc-100 tracking-tighter"
        >
          ARISE
        </motion.h2>
        <div className="flex items-center gap-6 justify-center">
          <div className="w-16 h-[1px] bg-zinc-900" />
          <p className="text-zinc-600 uppercase tracking-[0.5em] text-[10px] font-black italic">Extraction Protocol Active</p>
          <div className="w-16 h-[1px] bg-zinc-900" />
        </div>
====
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="text-8xl font-black italic text-shadow tracking-tighter"
        >
          ARISE
        </motion.h2>
        <div className="flex items-center gap-6 justify-center">
          <div className="w-16 h-[1px] bg-zinc-900" />
          <p className="text-zinc-500 uppercase tracking-[0.5em] text-[10px] font-black italic">// EXTRACTION PROTOCOL ACTIVE</p>
          <div className="w-16 h-[1px] bg-zinc-900" />
        </div>
>>>>
```

- [ ] **Step 2: Update Sync button and attempts label**

```tsx
<<<<
        <motion.button
          onClick={handleSyncClick}
          className="absolute w-32 h-32 border border-zinc-100/50 rounded-full cursor-pointer focus:outline-none z-10"
          animate={{
            scale: [0, 3],
            opacity: [1, 0]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
        
        <div className="absolute text-[10px] uppercase font-black text-zinc-100 tracking-[0.3em] pointer-events-none">Sync</div>
      </div>

      <div className="flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className={`w-[2px] h-6 transition-colors duration-500 ${i < state.attempts ? 'bg-zinc-100' : 'bg-zinc-900'}`} 
              />
            ))}
          </div>
          <div className="text-[10px] text-zinc-700 uppercase tracking-[0.3em] font-black">Resonance Attempts</div>
        </div>
====
        <motion.button
          onClick={handleSyncClick}
          className="absolute w-32 h-32 border border-shadow rounded-full cursor-pointer focus:outline-none z-10"
          animate={{
            scale: [0, 3],
            opacity: [1, 0]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
        
        <div className="absolute text-[10px] uppercase font-black text-zinc-500 tracking-[0.3em] pointer-events-none italic">// SYNC</div>
      </div>

      <div className="flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className={`w-[2px] h-6 transition-colors duration-500 ${i < state.attempts ? 'bg-shadow' : 'bg-zinc-900'}`} 
              />
            ))}
          </div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-black italic">// RESONANCE ATTEMPTS</div>
        </div>
>>>>
```

- [ ] **Step 3: Update Link Persistence label**

```tsx
<<<<
        <div className="flex flex-col items-center gap-1">
          <div className="text-5xl font-black tabular-nums italic text-zinc-500">{state.timeLeft.toString().padStart(2, '0')}</div>
          <div className="text-[9px] text-zinc-800 uppercase tracking-var(--color-shadow) font-bold">Link Persistence</div>
        </div>
====
        <div className="flex flex-col items-center gap-1">
          <div className="text-5xl font-black tabular-nums italic text-zinc-500">{state.timeLeft.toString().padStart(2, '0')}</div>
          <div className="text-[9px] text-zinc-500 uppercase tracking-[0.4em] font-bold italic">// LINK PERSISTENCE</div>
        </div>
>>>>
```

- [ ] **Step 4: Commit changes to ExtractionOverlay.tsx**

```bash
git add src/components/ExtractionOverlay.tsx
git commit -m "style(extraction): apply purple accent and stealth typography"
```

### Task 4: Update EnemyHUD.tsx Styles

**Files:**
- Modify: `src/components/EnemyHUD.tsx`

- [ ] **Step 1: Update Target Identified and Integrity Scan labels**

```tsx
<<<<
      <div className="flex items-center gap-4 w-full">
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-zinc-800" />
        <div className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 whitespace-nowrap">
          Target Identified: {enemy.rank}
        </div>
        <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-zinc-800" />
      </div>
====
      <div className="flex items-center gap-4 w-full">
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-zinc-800" />
        <div className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 whitespace-nowrap italic">
          // TARGET IDENTIFIED: {enemy.rank}
        </div>
        <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-zinc-800" />
      </div>
>>>>
```

```tsx
<<<<
        <div className="flex justify-between items-center text-[9px] font-bold tabular-nums tracking-[0.2em] text-zinc-500 uppercase">
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 bg-zinc-500 rounded-full animate-pulse" />
            Integrity Scan
          </span>
          <span>{Math.ceil(enemy.hp).toLocaleString()} / {enemy.maxHp.toLocaleString()} UNITS</span>
        </div>
====
        <div className="flex justify-between items-center text-[9px] font-bold tabular-nums tracking-[0.2em] text-zinc-500 uppercase italic">
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 bg-zinc-500 rounded-full animate-pulse" />
            // INTEGRITY SCAN
          </span>
          <span>{Math.ceil(enemy.hp).toLocaleString()} / {enemy.maxHp.toLocaleString()} UNITS</span>
        </div>
>>>>
```

- [ ] **Step 2: Commit changes to EnemyHUD.tsx**

```bash
git add src/components/EnemyHUD.tsx
git commit -m "style(enemy): apply stealth typography"
```

### Task 5: Verify and Final Commit

- [ ] **Step 1: Run build**

Run: `npm run build`
Expected: Success

- [ ] **Step 2: Final Commit**

```bash
git add .
git commit -m "style: apply final purple accents and stealth typography"
```
