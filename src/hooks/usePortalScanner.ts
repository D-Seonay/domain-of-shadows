import { useState } from 'react';
import { Portal, PortalRank } from '../types/game';

export function usePortalScanner() {
  const [portals, setPortals] = useState<Portal[]>([]);

  const scan = () => {
    const ranks: PortalRank[] = ['E', 'D', 'C', 'B', 'A', 'S'];
    const types = ['frost', 'fire', 'void', 'shadow'];
    const count = Math.floor(Math.random() * 3) + 3;

    const newPortals: Portal[] = Array.from({ length: count }).map((_, i) => {
      const rank = ranks[Math.floor(Math.random() * ranks.length)];
      return {
        id: `portal-${Date.now()}-${i}`,
        rank,
        name: `${rank}-Rank Gate`,
        type: types[Math.floor(Math.random() * types.length)],
        bossName: 'Dimensional Guardian',
        instability: 300,
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
