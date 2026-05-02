import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Hand, Crown } from 'lucide-react';

interface SkillBarProps {
  cooldowns: { q: number; w: number; e: number };
  activeBuffs: { w: boolean };
  onSkillClick: (key: 'q' | 'w' | 'e') => void;
}

export const SkillBar: React.FC<SkillBarProps> = ({ cooldowns, activeBuffs, onSkillClick }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(interval);
  }, []);
  
  const skills = [
    { key: 'q' as const, name: 'Shadow Strike', icon: Zap, cd: 5000 },
    { key: 'w' as const, name: "Dominator's Touch", icon: Hand, cd: 20000 },
    { key: 'e' as const, name: "Monarch's Authority", icon: Crown, cd: 45000 },
  ];

  return (
    <div className="flex gap-4 p-4 bg-zinc-900/30 border border-zinc-800 backdrop-blur-md">
      {skills.map((skill) => {
        const remaining = Math.max(0, cooldowns[skill.key] - now);
        const progress = remaining / skill.cd;
        const isActive = skill.key === 'w' && activeBuffs.w;

        return (
          <button
            key={skill.key}
            onClick={() => onSkillClick(skill.key)}
            disabled={remaining > 0}
            className={`relative w-16 h-16 flex flex-col items-center justify-center border transition-all duration-300 group
              ${remaining > 0 ? 'border-zinc-800 opacity-50' : 'border-zinc-700 hover:border-shadow hover:bg-shadow/5'}
              ${isActive ? 'border-shadow bg-shadow/10 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : ''}`}
          >
            <skill.icon className={`w-6 h-6 ${remaining > 0 ? 'text-zinc-600' : 'text-zinc-300 group-hover:text-shadow'}`} />
            <span className="text-[10px] mt-1 font-black text-zinc-500 uppercase">{skill.key}</span>

            {/* Cooldown Overlay */}
            {remaining > 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-zinc-950/80" />
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 bg-shadow/20"
                  initial={{ height: "100%" }}
                  animate={{ height: `${progress * 100}%` }}
                  transition={{ duration: 0.1 }}
                />
                <span className="relative text-xs font-bold text-shadow">
                  {(remaining / 1000).toFixed(1)}s
                </span>
              </div>
            )}

            {/* Active Buff Indicator */}
            {isActive && (
              <motion.div 
                className="absolute -top-1 -right-1 w-2 h-2 bg-shadow rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
