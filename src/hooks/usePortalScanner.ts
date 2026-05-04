import { useState } from 'react';
import { Portal, PortalRank, BiomeType } from '../types/game';
import { BIOMES } from './useGameState';

export function usePortalScanner() {
  const [portals, setPortals] = useState<Portal[]>([]);

  const scan = () => {
    const ranks: PortalRank[] = ['E', 'D', 'C', 'B', 'A', 'S'];
    const types: BiomeType[] = ['frost', 'fire', 'void', 'shadow'];
    const count = Math.floor(Math.random() * 3) + 3;

    const newPortals: Portal[] = Array.from({ length: count }).map((_, i) => {
      const rank = ranks[Math.floor(Math.random() * ranks.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const biome = BIOMES[type];
      
      return {
        id: `portal-${Date.now()}-${i}`,
        rank,
        name: `${biome.name} Gate`,
        type: 'standard',
        biome,
        difficulty: (rank === 'S' ? 50 : rank === 'A' ? 30 : rank === 'B' ? 20 : 10),
        bossName: biome.monsters[biome.monsters.length - 1],
        instability: 0,
        maxInstability: 300,
        affixes: [],
        cleared: false,
        position: { 
          x: 0.1 + Math.random() * 0.8, 
          y: 0.1 + Math.random() * 0.8 
        }
      };
    });

    setPortals(newPortals);
  };

  return {
    portals,
    scan,
  };
}
