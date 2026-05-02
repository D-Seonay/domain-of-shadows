import { motion } from 'framer-motion';
import { ExtractionState } from '../types/game';
import { soundManager } from '../utils/SoundManager';
import { useEffect } from 'react';

export const ExtractionOverlay = ({ 
  state, 
  onAttempt 
}: { 
  state: ExtractionState; 
  onAttempt: () => void 
}) => {
  useEffect(() => {
    if (state.active) {
      soundManager.playExtraction();
    }
  }, [state.active]);

  if (!state.active) return null;

  const handleSyncClick = () => {
    soundManager.playHit();
    onAttempt();
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/95 backdrop-blur-2xl z-50 flex flex-col items-center justify-center gap-20">
      <div className="text-center space-y-6">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
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
      </div>

      <div className="relative flex items-center justify-center w-96 h-96">
        <div className="absolute inset-0 border border-zinc-900 rounded-full scale-125 opacity-20" />
        <div className="absolute inset-0 border border-zinc-900 rounded-full scale-110 opacity-40" />
        <div className="absolute w-32 h-32 border border-zinc-800 rounded-full" />
        
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
        
        <div className="flex flex-col items-center gap-1">
          <div className="text-5xl font-black tabular-nums italic text-zinc-500">{state.timeLeft.toString().padStart(2, '0')}</div>
          <div className="text-[9px] text-zinc-500 uppercase tracking-[0.4em] font-bold italic">// LINK PERSISTENCE</div>
        </div>
      </div>
    </div>
  );
};
