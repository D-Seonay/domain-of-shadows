import { motion, AnimatePresence } from 'framer-motion';
import { Ghost, ShieldCheck, Sparkles } from 'lucide-react';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'merge' | 'info';
}

export const NotificationSystem = ({ notifications }: { notifications: Notification[] }) => {
  return (
    <div className="fixed bottom-12 right-100 flex flex-col gap-3 z-50 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="flex items-center gap-4 bg-zinc-950/90 border border-shadow/50 p-4 min-w-[300px] backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.2)]"
          >
            <div className="p-2 bg-shadow/20 text-shadow">
              {n.type === 'success' && <Ghost className="w-5 h-5" />}
              {n.type === 'merge' && <Sparkles className="w-5 h-5" />}
              {n.type === 'info' && <ShieldCheck className="w-5 h-5" />}
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-black italic">
                // {n.type === 'success' ? 'EXTRACTION SUCCESS' : n.type === 'merge' ? 'RESONANCE MERGE' : 'SYSTEM INFO'}
              </div>
              <div className="text-xs font-bold text-zinc-100 uppercase tracking-tight italic">
                {n.message}
              </div>
            </div>
            <motion.div 
              className="absolute bottom-0 left-0 h-[1px] bg-shadow"
              initial={{ width: "100%" }}
              animate={{ width: 0 }}
              transition={{ duration: 3, ease: "linear" }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
