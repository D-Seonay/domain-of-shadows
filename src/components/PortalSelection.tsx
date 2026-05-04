import { motion } from 'framer-motion';
import { Portal } from '../types/game';
import { Shield, Zap, Target, Sword, Mountain, Flame, Ghost, Sparkles } from 'lucide-react';

const RANK_COLORS: Record<Portal['rank'], string> = {
  E: '#71717a',
  D: '#22c55e',
  C: '#3b82f6',
  B: '#a855f7',
  A: '#ef4444',
  S: '#facc15',
};

const BIOME_ICONS: Record<string, any> = {
  frost: Mountain,
  fire: Flame,
  void: Sparkles,
  shadow: Ghost,
};

const MODIFIER_ICONS: Record<string, any> = {
  dps_reduction: Sword,
  cd_increase: Zap,
  mana_boost: Target,
};

export const PortalSelection = ({ 
  portals, 
  onSelect 
}: { 
  portals: Portal[]; 
  onSelect: (id: string) => void 
}) => {
  return (
    <div className="fixed inset-0 bg-zinc-950/90 backdrop-blur-2xl z-50 flex flex-col items-center justify-center gap-16 p-10 overflow-hidden">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] text-zinc-500 uppercase tracking-[0.6em] font-black italic"
        >
          // DIMENSIONAL INSTABILITY DETECTED
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-6xl font-black italic tracking-tighter text-zinc-100"
        >
          SELECT GATE
        </motion.h2>
      </div>

      <div className="flex gap-8 max-w-7xl w-full justify-center">
        {portals.map((portal, index) => {
          const BiomeIcon = BIOME_ICONS[portal.biome.type] || Mountain;
          const ModIcon = portal.biome.modifier ? MODIFIER_ICONS[portal.biome.modifier.type] : Shield;
          const rankColor = RANK_COLORS[portal.rank];

          return (
            <motion.div
              key={portal.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="group flex-1 max-w-[320px] flex flex-col gap-6 p-8 border border-zinc-900 bg-zinc-950/50 hover:bg-zinc-900/20 transition-all duration-500 relative overflow-hidden"
              style={{ '--biome-color': portal.biome.color } as React.CSSProperties}
            >
              {/* Rank Badge */}
              <div className="flex justify-between items-start">
                <div 
                  className="px-3 py-1 border text-[10px] font-black uppercase italic tracking-widest"
                  style={{ color: rankColor, borderColor: `${rankColor}44`, backgroundColor: `${rankColor}11` }}
                >
                  RANK {portal.rank}
                </div>
                <div className="text-[10px] text-zinc-700 font-bold italic">// DIFF: {portal.difficulty}</div>
              </div>

              {/* Biome Info */}
              <div className="flex flex-col gap-2 py-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="p-4 bg-zinc-900/50 rounded-full group-hover:scale-110 transition-transform duration-700 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                    style={{ color: portal.biome.color }}
                  >
                    <BiomeIcon className="w-8 h-8" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest italic">// REALM</span>
                    <span className="text-xl font-black italic uppercase text-zinc-100">{portal.biome.name}</span>
                  </div>
                </div>
              </div>

              {/* Modifiers */}
              <div className="flex flex-col gap-3 min-h-[80px]">
                <div className="text-[8px] text-zinc-600 uppercase font-black tracking-widest italic">// ANOMALIES</div>
                {portal.biome.modifier ? (
                  <div className="flex items-center gap-3 p-3 border border-zinc-900 bg-zinc-900/10">
                    <ModIcon className="w-4 h-4 text-zinc-500" />
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-100 font-black italic uppercase">
                        {portal.biome.modifier.type.replace('_', ' ')}
                      </span>
                      <span className="text-[8px] text-zinc-500 italic">
                         Effect intensity: +{(portal.biome.modifier.value * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[9px] text-zinc-700 italic">// NO ENVIRONMENTAL MODIFIERS DETECTED</div>
                )}
              </div>

              {/* Enter Button */}
              <button
                onClick={() => onSelect(portal.id)}
                className="mt-4 w-full py-4 border border-zinc-800 text-[10px] font-black uppercase tracking-[0.3em] italic hover:bg-zinc-100 hover:text-zinc-950 transition-all duration-300 group-hover:border-zinc-100 shadow-[0_0_0_rgba(0,0,0,0)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                ENTER GATE
              </button>

              {/* Biome Glow */}
              <div 
                className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity duration-1000"
                style={{ backgroundColor: portal.biome.color }}
              />
            </motion.div>
          );
        })}
      </div>

      <div className="text-[9px] text-zinc-700 uppercase tracking-widest italic animate-pulse">
        // PROTOCOL: DIMENSIONAL TRANSITION REQUIRES AUTHORIZATION
      </div>
    </div>
  );
};
