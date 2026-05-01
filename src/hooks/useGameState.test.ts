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

  it('should trigger extraction when enemy hp reaches 0', () => {
    const { result } = renderHook(() => useGameState());

    // Initial enemy has 50 HP, player has 10 DPC. Need 5 attacks.
    for (let i = 0; i < 5; i++) {
      act(() => {
        result.current.attack();
      });
    }

    // Extraction should be active
    expect(result.current.extraction.active).toBe(true);
    // Enemy HP should be 0
    expect(result.current.enemy.hp).toBe(0);
    // Player exp should not have increased yet
    expect(result.current.player.exp).toBe(0);
  });

  it('should grant shadow and exp on successful extraction', () => {
    const { result } = renderHook(() => useGameState());

    // Kill enemy
    for (let i = 0; i < 5; i++) {
      act(() => {
        result.current.attack();
      });
    }

    act(() => {
      result.current.attemptExtraction(true);
    });

    // Extraction should be inactive
    expect(result.current.extraction.active).toBe(false);
    // Shadow should be added to army
    expect(result.current.army).toHaveLength(1);
    // Player should have gained 50 exp (as per Phase 3 logic)
    expect(result.current.player.exp).toBe(50);
    // New enemy should be spawned
    expect(result.current.enemy.hp).toBe(50);
  });

  it('should decrease attempts on failed extraction and auto-fail if 0', () => {
    const { result } = renderHook(() => useGameState());

    // Kill enemy
    for (let i = 0; i < 5; i++) {
      act(() => {
        result.current.attack();
      });
    }

    // Fail 1
    act(() => {
      result.current.attemptExtraction(false);
    });
    expect(result.current.extraction.attempts).toBe(2);
    expect(result.current.extraction.active).toBe(true);

    // Fail 2
    act(() => {
      result.current.attemptExtraction(false);
    });
    expect(result.current.extraction.attempts).toBe(1);

    // Fail 3 - should close extraction and respawn enemy
    act(() => {
      result.current.attemptExtraction(false);
    });
    expect(result.current.extraction.active).toBe(false);
    expect(result.current.enemy.hp).toBe(50);
  });

  it('should auto-fail extraction when time runs out', () => {
    const { result } = renderHook(() => useGameState());

    // Kill enemy
    for (let i = 0; i < 5; i++) {
      act(() => {
        result.current.attack();
      });
    }

    expect(result.current.extraction.active).toBe(true);

    // Advance time by 10 seconds
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(result.current.extraction.active).toBe(false);
    expect(result.current.enemy.hp).toBe(50);
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

