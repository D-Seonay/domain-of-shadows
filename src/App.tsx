import { useGameState } from './hooks/useGameState';
import { EnemyHUD } from './components/EnemyHUD';
import { Sword, FlaskConical, RefreshCw, Radar } from 'lucide-react';
import { ExtractionOverlay } from './components/ExtractionOverlay';
import { ShadowInventory } from './components/ShadowInventory';
import { UpgradeShop } from './components/UpgradeShop';
import { DebugTools } from './components/DebugTools';
import { NotificationSystem, Notification } from './components/NotificationSystem';
import { SkillBar } from './components/SkillBar';
import { PortalSelection } from './components/PortalSelection';
import { PortalRadar } from './components/PortalRadar';
import { RaidOverlay } from './components/RaidOverlay';
import { useSkills } from './hooks/useSkills';
import { usePortalScanner } from './hooks/usePortalScanner';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useEffect, useRef } from 'react';
import { ExtractionMode } from './types/game';

interface DamagePopup {
  id: number;
  value: number;
  isCrit: boolean;
  x: number;
  y: number;
}

export default function App() {
  const { 
    player, enemy, army, extraction, extractionMode, upgrades, dungeon, classCounts,
    activePortal, availablePortals, gameMode, raidTimeLeft, selectPortal, setGameMode,
    setExtractionMode, attack, addShadow, attemptExtraction, buyUpgrade, mergeShadows, totalDps, rebirth 
  } = useGameState();

  const { portals: scannedPortals, scan } = usePortalScanner();

  useEffect(() => {
    if (gameMode === 'radar' && scannedPortals.length === 0) {
      scan();
    }
  }, [gameMode, scannedPortals.length, scan]);

  const [popups, setPopups] = useState<DamagePopup[]>([]);
  const [isShaking, setIsShaking] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: Notification['type']) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  const handleAttackRef = useRef<(amount?: number, x?: number, y?: number) => void>(() => {});

  const { cooldowns, activeBuffs, triggerSkill } = useSkills(
    player, 
    enemy, 
    (amt) => handleAttackRef.current(amt),
    activePortal?.biome.modifier?.type === 'cd_increase' ? activePortal.biome.modifier.value : 0
  );

  const handleAttack = useCallback((amount?: number, x?: number, y?: number) => {
    let finalAmount = amount || (player.dpc + (classCounts['tank'] || 0) * 2);
    if (activeBuffs?.w) finalAmount *= 2; 

    const result = attack(finalAmount);
    if (!result) return;
    
    const id = Date.now();
    const newPopup: DamagePopup = {
      id,
      value: result.damage,
      isCrit: result.isCrit,
      x: x || window.innerWidth / 2,
      y: y || window.innerHeight / 2
    };

    if (result.isCrit) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 200);
    }
    
    setPopups(prev => [...prev, newPopup]);
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== id));
    }, 800);
  }, [attack, player.dpc, classCounts, activeBuffs?.w]);

  useEffect(() => {
    handleAttackRef.current = handleAttack;
  }, [handleAttack]);

  const [lastArmyLength, setLastArmyLength] = useState(army.length);
  useEffect(() => {
    if (army.length > lastArmyLength) {
      const newShadow = army[army.length - 1];
      if (notifications.some(n => n.type === 'merge')) {
      } else {
        addNotification(`${newShadow.name} has joined the army.`, 'success');
      }
    }
    setLastArmyLength(army.length);
  }, [army, lastArmyLength, addNotification, notifications]);

  const handleMerge = useCallback((name: string, rank: any) => {
    mergeShadows(name, rank);
    addNotification(`Resonance successful: ${name} evolved.`, 'merge');
  }, [mergeShadows, addNotification]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'q' || key === 'w' || key === 'e') {
        triggerSkill(key as 'q' | 'w' | 'e');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerSkill]);

  const themeColor = activePortal?.biome.color || '#a855f7';

  return (
    <div 
      className={`min-h-screen flex bg-zinc-950 text-zinc-100 overflow-hidden font-mono selection:bg-shadow/30 ${isShaking ? 'animate-shake' : ''}`}
      style={{ '--color-shadow': themeColor } as React.CSSProperties}
    >
      <ShadowInventory army={army} onMerge={handleMerge} classCounts={classCounts} totalDps={totalDps} />

      <main className="flex-1 p-12 flex flex-col items-center justify-center gap-20 relative border-x border-zinc-900/50">
        
        <div className="absolute top-12 left-12 flex flex-col gap-1 border-l border-zinc-800 pl-4 py-2">
          <div className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] italic">// TOTAL ARMY DPS</div>
          <div className="text-3xl font-black italic text-shadow leading-none tracking-tighter">
            {totalDps.toLocaleString()}
          </div>
          {activePortal?.biome.modifier?.type === 'dps_reduction' && (
            <div className="text-[8px] text-red-500 uppercase font-bold italic tracking-widest mt-1">
              // BIOME INTERFERENCE: -{(activePortal.biome.modifier.value * 100).toFixed(0)}% DPS
            </div>
          )}
        </div>

        <div className="fixed top-12 right-12 text-right flex flex-col items-end gap-3 border-r border-zinc-800 pr-4 py-2 z-30">
          <div className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] italic">// SYSTEM STATUS</div>
          <div className="flex items-baseline gap-4">
            <div className="text-[10px] text-zinc-700 uppercase font-black italic tracking-widest">// FLOOR {dungeon.currentFloor}</div>
            <div className="text-5xl font-black italic leading-none tracking-tighter text-zinc-100">LV. {player.level}</div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <div className="w-48 bg-zinc-900/50 h-[2px] relative overflow-hidden">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-zinc-100"
                initial={{ width: 0 }}
                animate={{ width: `${(player.exp / player.maxExp) * 100}%` }}
                transition={{ duration: 0.8, ease: "circOut" }}
              />
            </div>
            <div className="text-[9px] text-zinc-500 uppercase tracking-widest tabular-nums italic">
              // EXP {player.exp} / {player.maxExp}
            </div>
          </div>

          <div className="relative mt-6 flex flex-col items-end gap-2">
            <div className="relative">
              {player.mana >= 100 && !showShop && (
                <motion.div 
                  layoutId="shop-ping"
                  className="absolute -top-1 -right-1 w-3 h-3 bg-shadow rounded-full z-10"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <button 
                onClick={() => setShowShop(!showShop)}
                className={`w-48 flex items-center gap-3 px-6 py-3 border transition-all duration-500 group ${showShop ? 'bg-zinc-100 text-zinc-950 border-zinc-100' : 'bg-transparent text-zinc-100 border-zinc-800 hover:border-shadow'}`}
              >
                <FlaskConical className={`w-4 h-4 transition-transform duration-500 group-hover:rotate-12 ${showShop ? '' : 'text-shadow'}`} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">
                  {showShop ? '// CLOSE LAB' : '// ENHANCEMENT LAB'}
                </span>
              </button>
            </div>

            <button 
              onClick={() => setGameMode('radar')}
              className="w-48 flex items-center gap-3 px-6 py-3 border bg-transparent text-zinc-100 border-zinc-800 hover:border-shadow transition-all duration-500 group"
            >
              <Radar className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180 text-shadow" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">
                // PORTAL RADAR
              </span>
            </button>

            <button 
              onClick={() => rebirth()}
              className="w-48 flex items-center gap-3 px-6 py-3 border bg-transparent text-zinc-100 border-zinc-800 hover:border-shadow transition-all duration-500 group"
            >
              <RefreshCw className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180 text-shadow" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">
                // SYSTEM REBIRTH
              </span>
            </button>
          </div>
        </div>

        <div className="w-full max-w-2xl flex flex-col items-center gap-16">
          {activePortal ? (
            <>
              <div className="text-center flex flex-col items-center gap-2">
                <div className="text-[10px] text-shadow uppercase font-black tracking-[0.4em] italic animate-pulse">
                  // CURRENT DIMENSION: {activePortal.biome.name}
                </div>
                {activePortal.biome.modifier && (
                   <div className="text-[9px] text-zinc-600 uppercase font-bold italic tracking-widest">
                      [ MODIFIER: {activePortal.biome.modifier.type.replace('_', ' ')} (+{(activePortal.biome.modifier.value * 100).toFixed(0)}%) ]
                   </div>
                )}
              </div>
              <EnemyHUD enemy={enemy} />

              <div className="relative">
                <button 
                  onClick={(e) => handleAttack(undefined, e.clientX, e.clientY)}
                  disabled={extraction.active}
                  className="group relative flex items-center justify-center w-64 h-64 border border-zinc-900 hover:border-zinc-700 active:border-zinc-100 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <Sword className="w-16 h-16 text-zinc-900 group-hover:text-zinc-100 group-active:scale-95 transition-all duration-300" />
                  <div className="absolute inset-0 bg-zinc-100/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-800" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-800" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-800" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-800" />
                </button>

                <AnimatePresence>
                  {popups.map(popup => (
                    <motion.div
                      key={popup.id}
                      initial={{ opacity: 1, scale: popup.isCrit ? 1.5 : 1, y: popup.y - 100, x: popup.x - 20 }}
                      animate={{ opacity: 0, scale: popup.isCrit ? 2 : 1, y: popup.y - 250 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`fixed pointer-events-none font-black italic z-50 mix-blend-difference ${popup.isCrit ? 'text-4xl text-shadow' : 'text-2xl text-zinc-100'}`}
                    >
                      -{Math.floor(popup.value)}{popup.isCrit ? '!' : ''}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <PortalSelection portals={availablePortals} onSelect={selectPortal} />
          )}
        </div>

        <div className="fixed bottom-32 left-1/2 -translate-x-1/2">
          <SkillBar cooldowns={cooldowns} activeBuffs={activeBuffs} onSkillClick={triggerSkill} />
        </div>

        <div className="fixed bottom-12 left-[450px]">
          <DebugTools onAddShadow={addShadow} />
        </div>

        <div className="fixed bottom-12 right-12 flex flex-col items-end gap-3 border-r border-zinc-800 pr-4 py-2">
          <div className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] italic">// EXTRACTION PROTOCOL</div>
          <div className="flex gap-2">
            {(['manual', 'auto', 'none'] as ExtractionMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setExtractionMode(mode)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] italic border transition-all duration-500 ${
                  extractionMode === mode 
                    ? 'bg-zinc-100 text-zinc-950 border-zinc-100' 
                    : 'bg-transparent text-zinc-500 border-zinc-900 hover:border-zinc-700'
                }`}
              >
                {mode === 'manual' ? '// MANUAL' : mode === 'auto' ? '// AUTO' : '// NONE'}
              </button>
            ))}
          </div>
        </div>

        <ExtractionOverlay state={extraction} onAttempt={attemptExtraction} />
        
        <RaidOverlay activePortal={activePortal} dungeon={dungeon} raidTimeLeft={raidTimeLeft} />

        <AnimatePresence>
          {showShop && (
            <UpgradeShop 
              player={player} 
              upgrades={upgrades} 
              onBuy={buyUpgrade} 
              onClose={() => setShowShop(false)} 
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {gameMode === 'radar' && (
            <PortalRadar 
              portals={scannedPortals}
              onSelect={selectPortal}
              onScan={scan}
              onBack={() => setGameMode('idle')}
            />
          )}
        </AnimatePresence>

        <NotificationSystem notifications={notifications} />
      </main>
    </div>
  );
}
