import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameState } from './useGameState';
import { Shadow } from '../types/game';

describe('useGameState', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with correct player, enemy state, and empty army', () => {
    const { result } = renderHook(() => useGameState());

    expect(result.current.player.level).toBe(1);
    expect(result.current.player.exp).toBe(0);
    expect(result.current.enemy.hp).toBe(50);
    expect(result.current.army).toEqual([]);
    expect(result.current.totalDps).toBe(0);
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

  it('should add shadow to army and update totalDps', () => {
    const { result } = renderHook(() => useGameState());
    const newShadow: Shadow = { id: '1', name: 'Knight', rank: 'knight', dps: 5 };

    act(() => {
      result.current.addShadow(newShadow);
    });

    expect(result.current.army).toHaveLength(1);
    expect(result.current.army[0]).toEqual(newShadow);
    expect(result.current.totalDps).toBe(5);
  });

  it('should apply passive damage based on totalDps', () => {
    const { result } = renderHook(() => useGameState());
    const newShadow: Shadow = { id: '1', name: 'Knight', rank: 'knight', dps: 10 };

    act(() => {
      result.current.addShadow(newShadow);
    });

    expect(result.current.totalDps).toBe(10);
    const initialHp = result.current.enemy.hp;

    // Tick forward 100ms
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // totalDps is 10, so 10/10 = 1 damage per 100ms
    expect(result.current.enemy.hp).toBe(initialHp - 1);

    // Tick forward another 900ms (total 1s)
    act(() => {
      vi.advanceTimersByTime(900);
    });

    expect(result.current.enemy.hp).toBe(initialHp - 10);
  });
});

