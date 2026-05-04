import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Portal } from '../types/game';
import { Radar, Crosshair, ChevronLeft, Wifi } from 'lucide-react';

interface Props {
  portals: Portal[];
  onSelect: (portal: Portal) => void;
  onScan: () => void;
  onBack: () => void;
}

export const PortalRadar: React.FC<Props> = ({ portals, onSelect, onScan, onBack }) => {
  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, #a855f7 1px, transparent 0)',
          backgroundSize: '40px 40px' 
        }} />
      </div>

      {/* Header */}
      <div className="absolute top-12 left-12 right-12 flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 border border-zinc-800 hover:border-shadow text-zinc-500 hover:text-shadow transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <div className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] italic font-bold">
                // DIMENSIONAL RADAR
              </div>
              <div className="text-3xl font-black italic tracking-tighter text-zinc-100 uppercase">
                Portal Scanner <span className="text-shadow">v2.4</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] italic">// SCANNER STATUS</div>
          <div className="flex items-center gap-3 px-4 py-2 border border-zinc-800 bg-zinc-900/20">
            <Wifi className="w-4 h-4 text-shadow animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">SYSTEMS_NOMINAL</span>
          </div>
        </div>
      </div>

      {/* Main Radar Area */}
      <div className="relative w-[600px] h-[600px] flex items-center justify-center">
        {/* Radar Circles */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
          <div 
            key={i}
            className="absolute border border-zinc-800/50 rounded-full"
            style={{ 
              width: `${scale * 100}%`, 
              height: `${scale * 100}%` 
            }}
          />
        ))}

        {/* Radar Crosshair Lines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-[1px] bg-zinc-800/30" />
          <div className="h-full w-[1px] bg-zinc-800/30 absolute" />
        </div>

        {/* Sweep Animation */}
        <motion.div 
          className="absolute inset-0 origin-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-1/2 left-1/2 w-1/2 h-[300px] origin-top-left -translate-y-full"
               style={{ 
                 background: 'linear-gradient(45deg, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
                 clipPath: 'polygon(0 0, 100% 0, 0 100%)'
               }} />
          <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-shadow/40 origin-left" />
        </motion.div>

        {/* Portals */}
        <div className="absolute inset-0">
          <AnimatePresence>
            {portals.map((portal) => (
              <motion.button
                key={portal.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.2 }}
                onClick={() => onSelect(portal)}
                className="absolute w-6 h-6 -ml-3 -mt-3 group"
                style={{ 
                  left: `${portal.position.x * 100}%`, 
                  top: `${portal.position.y * 100}%` 
                }}
              >
                {/* Portal Icon/Marker */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-shadow/20 rounded-full animate-ping" />
                  <div className="w-2 h-2 bg-shadow rounded-full shadow-[0_0_10px_#a855f7]" />
                  
                  {/* Label on Hover */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-zinc-900 border border-shadow px-3 py-1 flex flex-col gap-0.5">
                      <div className="text-[8px] text-shadow font-black uppercase tracking-widest italic">
                        {portal.rank}-RANK GATE
                      </div>
                      <div className="text-[10px] text-zinc-100 font-bold uppercase tracking-tight">
                        {portal.name}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Center Marker */}
        <div className="relative z-10 w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 border border-shadow/40 rounded-full animate-pulse" />
          <Crosshair className="w-6 h-6 text-shadow" />
        </div>
      </div>

      {/* Footer / Controls */}
      <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
        <div className="flex flex-col gap-4">
          <div className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] italic font-bold">
            // DETECTED_SIGNALS: {portals.length}
          </div>
          <div className="flex gap-4">
            {portals.slice(0, 4).map(p => (
              <div key={p.id} className="flex flex-col gap-1 border-l border-zinc-800 pl-3">
                <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest italic">SIGNAL_{p.id.slice(-4)}</div>
                <div className="text-[10px] text-zinc-400 font-black italic">{p.rank} // {p.biome.name.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={onScan}
          className="relative group overflow-hidden px-10 py-5 bg-transparent border border-shadow/30 hover:border-shadow transition-all duration-500"
        >
          <div className="absolute inset-0 bg-shadow/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          <div className="flex items-center gap-4">
            <Radar className="w-5 h-5 text-shadow group-hover:rotate-90 transition-transform duration-700" />
            <span className="text-xs font-black uppercase tracking-[0.4em] italic text-zinc-100">
              Initiate Wide-Scan
            </span>
          </div>
          
          <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-shadow" />
          <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-shadow" />
          <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-shadow" />
          <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-shadow" />
        </button>
      </div>

      {/* Side Decorative Tech Lines */}
      <div className="absolute left-12 top-1/2 -translate-y-1/2 w-[1px] h-64 bg-gradient-to-b from-transparent via-zinc-800 to-transparent" />
      <div className="absolute right-12 top-1/2 -translate-y-1/2 w-[1px] h-64 bg-gradient-to-b from-transparent via-zinc-800 to-transparent" />
    </div>
  );
};
