import { motion } from 'framer-motion';
import { ExtractionState } from '../types/game';

export const ExtractionOverlay = ({ 
  state, 
  onAttempt 
}: { 
  state: ExtractionState; 
  onAttempt: (success: boolean) => void 
}) => {
  if (!state.active) return null;

  const handleSyncClick = () => {
    // For this prototype, success is based on RNG (60% chance)
    const isSuccess = Math.random() > 0.4;
    onAttempt(isSuccess);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-12">
      <div className="text-center space-y-2">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-black italic text-purple-500 tracking-tighter"
        >
          ARISE
        </motion.h2>
        <p className="text-zinc-500 uppercase tracking-widest text-xs">Extraction in progress...</p>
      </div>

      <div className="relative flex items-center justify-center w-64 h-64">
        {/* Target Circle */}
        <div className="absolute w-32 h-32 border-2 border-zinc-800 rounded-full" />
        
        {/* Pulsing Circle */}
        <motion.button
          onClick={handleSyncClick}
          className="absolute w-32 h-32 border-4 border-purple-500 rounded-full cursor-pointer focus:outline-none"
          animate={{
            scale: [0.2, 2],
            opacity: [1, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <div className="absolute text-[10px] uppercase font-bold text-zinc-500 pointer-events-none">Sync</div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full ${i < state.attempts ? 'bg-purple-500' : 'bg-zinc-800'}`} 
            />
          ))}
        </div>
        <div className="text-xs text-zinc-500 uppercase">Attempts Remaining</div>
        <div className="text-2xl font-bold mt-4 tabular-nums">{state.timeLeft}s</div>
      </div>
    </div>
  );
};
