import { motion, AnimatePresence } from 'framer-motion';
import { Player, CodexEntry, Achievement } from '../types/game';
import { Trophy, Book, Zap, X, ChevronRight, RefreshCw } from 'lucide-react';
import { useState } from 'react';

type Tab = 'codex' | 'achievements' | 'rebirth';

export const MetaOverlay = ({
  player,
  codex,
  achievements,
  onRebirth,
  onClose
}: {
  player: Player;
  codex: CodexEntry[];
  achievements: Achievement[];
  onRebirth: () => void;
  onClose: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('codex');

  const codexDpsBonus = codex.reduce((acc, entry) => acc + (entry.count * 0.01), 0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-zinc-950/98 backdrop-blur-xl z-[60] flex items-center justify-center p-20"
    >
      <div className="w-full max-w-5xl h-full flex flex-col gap-12 border border-zinc-900 bg-zinc-950/50 p-12 relative overflow-hidden">
        
        {/* Background Decorative Text */}
        <div className="absolute top-0 right-0 text-[150px] font-black italic text-zinc-900/10 select-none pointer-events-none -translate-y-1/4 translate-x-1/4 tracking-tighter uppercase">
          {activeTab}
        </div>

        <div className="flex items-center justify-between border-b border-zinc-900 pb-8 shrink-0 relative z-10">
          <div className="flex flex-col gap-2">
            <div className="text-[10px] text-zinc-500 uppercase tracking-[0.5em] italic font-black">// ARCHIVE SYSTEM</div>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase">Shadow Manifest</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-4 bg-zinc-900/50 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 transition-all border border-zinc-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex gap-12 flex-1 overflow-hidden relative z-10">
          {/* Tabs Sidebar */}
          <div className="flex flex-col gap-2 w-64 shrink-0">
            {(['codex', 'achievements', 'rebirth'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-4 px-6 py-4 border transition-all duration-500 group ${
                  activeTab === tab 
                    ? 'bg-zinc-100 text-zinc-950 border-zinc-100' 
                    : 'bg-transparent text-zinc-500 border-zinc-900 hover:border-zinc-700'
                }`}
              >
                {tab === 'codex' && <Book className="w-4 h-4" />}
                {tab === 'achievements' && <Trophy className="w-4 h-4" />}
                {tab === 'rebirth' && <RefreshCw className="w-4 h-4" />}
                <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">
                  {tab}
                </span>
              </button>
            ))}

            <div className="mt-auto p-6 border border-zinc-900 flex flex-col gap-3">
              <div className="text-[9px] text-zinc-600 uppercase tracking-widest font-black italic">// STATS OVERVIEW</div>
              <div className="flex flex-col gap-1">
                <div className="text-[10px] text-zinc-400">Codex Bonus: <span className="text-shadow font-black">+{Math.floor(codexDpsBonus * 100)}% DPS</span></div>
                <div className="text-[10px] text-zinc-400">Rebirths: <span className="text-zinc-100 font-black">{player.rebirths}</span></div>
                <div className="text-[10px] text-zinc-400">Prestige Pts: <span className="text-shadow font-black">{player.prestigePoints}</span></div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto pr-4 -mr-4">
            <AnimatePresence mode="wait">
              {activeTab === 'codex' && (
                <motion.div 
                  key="codex"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-2 gap-6"
                >
                  {codex.length === 0 && (
                    <div className="col-span-2 py-40 text-center border border-dashed border-zinc-900 text-zinc-600 text-[10px] uppercase tracking-[0.4em] italic">
                      // NO ENTRIES RECORDED IN THE ARCHIVE
                    </div>
                  )}
                  {codex.map((entry) => (
                    <div key={entry.name} className="flex flex-col gap-4 p-6 border border-zinc-900 bg-zinc-950 hover:border-zinc-700 transition-all group">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs text-zinc-500 uppercase tracking-widest font-black italic">{entry.rank}</span>
                          <span className="text-xl font-black italic uppercase text-zinc-100">{entry.name}</span>
                        </div>
                        <div className="text-3xl font-black italic text-zinc-800 group-hover:text-shadow transition-colors">
                          {entry.count.toString().padStart(3, '0')}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 border-t border-zinc-900 pt-4">
                        <div className="text-[9px] text-zinc-500 tracking-widest uppercase font-black italic">// BONUS GRANTED</div>
                        <div className="text-xs text-shadow font-black">+{(entry.count * 1).toLocaleString()}% BASE DPS</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'achievements' && (
                <motion.div 
                  key="achievements"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-4"
                >
                  {achievements.map((ach) => (
                    <div 
                      key={ach.id} 
                      className={`flex items-center gap-8 p-8 border transition-all ${
                        ach.completed ? 'border-shadow/30 bg-shadow/5' : 'border-zinc-900 bg-zinc-950 opacity-60'
                      }`}
                    >
                      <div className={`p-4 border ${ach.completed ? 'border-shadow bg-shadow/10 text-shadow' : 'border-zinc-800 text-zinc-700'}`}>
                        <Trophy className="w-6 h-6" />
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="text-lg font-black italic uppercase tracking-tight">{ach.title}</div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest">{ach.description}</div>
                        <div className="mt-3 w-full bg-zinc-900 h-[2px] relative overflow-hidden">
                          <motion.div 
                            className={`absolute inset-y-0 left-0 ${ach.completed ? 'bg-shadow' : 'bg-zinc-700'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (ach.current / ach.requirement) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right flex flex-col gap-1 shrink-0 min-w-[120px]">
                        <div className="text-[9px] text-zinc-500 uppercase font-black italic tracking-widest">// REWARD</div>
                        <div className={`text-xs font-black ${ach.completed ? 'text-shadow' : 'text-zinc-600'}`}>
                          +{ach.rewardAmount} {ach.rewardType.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'rebirth' && (
                <motion.div 
                  key="rebirth"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col items-center justify-center h-full py-20 text-center gap-12"
                >
                  <div className="flex flex-col gap-4 max-w-xl">
                    <Zap className="w-16 h-16 text-shadow mx-auto animate-pulse" />
                    <h3 className="text-5xl font-black italic tracking-tighter uppercase">Shadow Rebirth</h3>
                    <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] leading-relaxed">
                      Sacrifice your current army and progress to transcend your limits. You will gain permanent power based on your level.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
                    <div className="p-8 border border-zinc-900 bg-zinc-950 flex flex-col gap-2">
                      <div className="text-[9px] text-zinc-600 uppercase font-black tracking-widest italic">// CURRENT MULTIPLIER</div>
                      <div className="text-4xl font-black italic text-zinc-100">x{(1 + player.prestigePoints * 0.1).toFixed(1)}</div>
                    </div>
                    <div className="p-8 border border-zinc-900 bg-zinc-950 flex flex-col gap-2">
                      <div className="text-[9px] text-zinc-600 uppercase font-black tracking-widest italic">// NEW MULTIPLIER</div>
                      <div className="text-4xl font-black italic text-shadow">
                        x{(1 + (player.prestigePoints + Math.floor(player.level / 10)) * 0.1).toFixed(1)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <button
                      onClick={onRebirth}
                      disabled={player.level < 10}
                      className={`group relative flex items-center gap-6 px-12 py-6 border transition-all duration-500 ${
                        player.level >= 10 
                          ? 'border-shadow bg-shadow/5 hover:bg-shadow hover:text-zinc-950' 
                          : 'border-zinc-900 bg-zinc-950 opacity-50 cursor-not-allowed text-zinc-600'
                      }`}
                    >
                      <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
                      <span className="text-xl font-black italic uppercase tracking-widest">
                        {player.level >= 10 ? 'INITIATE REBIRTH' : `LOCKED (LV. ${player.level}/10)`}
                      </span>
                    </button>
                    <div className="text-[10px] text-zinc-600 uppercase tracking-widest italic">
                      // GAIN +{Math.floor(player.level / 10)} PRESTIGE POINTS UPON ASCENSION
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
