import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameState } from './useGameState';

describe('useGameState', () => {
  it('should initialize with correct player and enemy state', () => {
    const { result } = renderHook(() => useGameState());
    
    expect(result.current.player.level).toBe(1);
    expect(result.current.player.exp).toBe(0);
    expect(result.current.enemy.hp).toBe(50);
  });

  it('should decrease enemy hp on attack', () => {
    const { result } = renderHook(() => useGameState());
    const initialHp = result.current.enemy.hp;
    
    act(() => {
      result.current.attack();
    });
    
    expect(result.current.enemy.hp).toBe(initialHp - result.current.player.dpc);
  });

  it('should kill enemy and grant exp when hp reaches 0', () => {
    const { result } = renderHook(() => useGameState());
    
    // Initial enemy has 50 HP, player has 10 DPC. Need 5 attacks.
    for (let i = 0; i < 5; i++) {
      act(() => {
        result.current.attack();
      });
    }
    
    // Enemy should be respawned
    expect(result.current.enemy.hp).toBe(50);
    // Player should have gained 20 exp
    expect(result.current.player.exp).toBe(20);
  });
});
