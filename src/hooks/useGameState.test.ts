import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameState } from './useGameState';
import { Shadow } from '../types/game';

describe('useGameState', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    // Mock Math.random to always pick the first monster (Shadow Soldier, normal rank)
    // for predictable tests unless specified otherwise.
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with correct player, enemy state, and empty army', () => {
    const { result } = renderHook(() => useGameState());

    expect(result.current.player.level).toBe(1);
    expect(result.current.player.exp).toBe(0);
    expect(result.current.player.mana).toBe(0);
    // New scaling: level 1 * 50 + (1^2)*5 = 55
    expect(result.current.enemy.hp).toBe(55);
    expect(result.current.army).toEqual([]);
    expect(result.current.totalDps).toBe(0);
  });

  it('should generate enemies with different ranks and scaled HP', () => {
    const { result } = renderHook(() => useGameState());
    
    const enemy = result.current.enemy;
    expect(enemy.maxHp).toBeGreaterThanOrEqual(55); 
    expect(enemy.hp).toBe(enemy.maxHp);
  });

  it('should decrease enemy hp on attack and handle critical hits', () => {
    const { result } = renderHook(() => useGameState());
    const initialHp = result.current.enemy.hp;

    // Mock Math.random to return 0.5 (no crit, 0.5 > 0.1)
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    act(() => {
      const hit = result.current.attack();
      expect(hit?.isCrit).toBe(false);
      expect(hit?.damage).toBe(result.current.player.dpc);
    });

    expect(result.current.enemy.hp).toBe(initialHp - result.current.player.dpc);
  });

  it('should trigger extraction and grant exp/mana when enemy hp reaches 0 if rank is not normal', () => {
    // Mock random to pick an Elite/Boss (e.g., index 2 is Ice Elf - elite)
    vi.spyOn(Math, 'random').mockReturnValue(0.4); // 0.4 * 6 = 2.4 -> index 2
    const { result } = renderHook(() => useGameState());
    
    // Mock no crits
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const enemyHp = result.current.enemy.hp;
    act(() => {
      result.current.attack(enemyHp);
    });

    // Extraction should be active for Elite
    expect(result.current.extraction.active).toBe(true);
    expect(result.current.enemy.hp).toBe(0);
  });

  it('should NOT trigger extraction for normal enemies', () => {
    // Mock random to pick Shadow Soldier (index 0 - normal)
    vi.spyOn(Math, 'random').mockReturnValue(0); 
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.attack(100);
    });

    expect(result.current.extraction.active).toBe(false);
  });

  it('should grant shadow on successful extraction', () => {
    // Mock random to pick Elite
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const { result } = renderHook(() => useGameState());
    
    // Kill enemy
    act(() => {
      result.current.attack(result.current.enemy.hp);
    });

    act(() => {
      // Mock success (< 0.2 now)
      vi.spyOn(Math, 'random').mockReturnValue(0.1);
      result.current.attemptExtraction();
    });

    expect(result.current.extraction.active).toBe(false);
    expect(result.current.army).toHaveLength(1);
  });

  it('should decrease attempts on failed extraction and auto-fail if 0', () => {
    // Mock random to pick Elite
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const { result } = renderHook(() => useGameState());
    
    // Kill enemy
    act(() => {
      result.current.attack(result.current.enemy.hp);
    });

    // Fail 1 - mock failure (> 0.2 now)
    act(() => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      result.current.attemptExtraction();
    });
    expect(result.current.extraction.attempts).toBe(2);
    expect(result.current.extraction.active).toBe(true);

    // Fail 2
    act(() => {
      result.current.attemptExtraction();
    });
    expect(result.current.extraction.attempts).toBe(1);

    // Fail 3 - should close extraction and respawn enemy
    act(() => {
      result.current.attemptExtraction();
    });
    expect(result.current.extraction.active).toBe(false);
  });

  it('should auto-fail extraction when time runs out', () => {
    // Mock random to pick Elite
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const { result } = renderHook(() => useGameState());

    // Kill enemy
    act(() => {
      result.current.attack(result.current.enemy.hp);
    });

    expect(result.current.extraction.active).toBe(true);

    // Advance time by 10 seconds
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(result.current.extraction.active).toBe(false);
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
    // Mock no crits
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

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

  it('should allow buying upgrades with mana', () => {
    // Mock Elite to get more mana
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const { result } = renderHook(() => useGameState());
    // Mock no crits
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    
    // Kill enemy
    act(() => {
      result.current.attack(result.current.enemy.hp);
    });
    // Level 1 elite gives Level*10 mana = 10 mana.
    expect(result.current.player.mana).toBe(10);
    expect(result.current.upgrades.criticalChance).toBe(0);

    // Try to buy upgrade costing 20 (should fail)
    act(() => {
      result.current.buyUpgrade('criticalChance', 20, 0.05);
    });
    expect(result.current.player.mana).toBe(10);
    expect(result.current.upgrades.criticalChance).toBe(0);

    // Buy upgrade costing 10 (should succeed)
    act(() => {
      result.current.buyUpgrade('criticalChance', 10, 0.05);
    });
    expect(result.current.player.mana).toBe(0);
    expect(result.current.upgrades.criticalChance).toBe(0.05);
  });

  it('should level up player when exp reaches maxExp (on kill)', () => {
    const { result } = renderHook(() => useGameState());
    // Mock no crits
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    // Kill first enemy (55 HP) -> 50 exp
    act(() => {
      result.current.attack(100);
    });
    expect(result.current.player.level).toBe(1);
    expect(result.current.player.exp).toBe(50);

    // Kill second enemy (55 HP) -> 50 exp -> 100 exp -> Level Up
    act(() => {
      result.current.attack(100);
    });

    expect(result.current.player.level).toBe(2);
    expect(result.current.player.exp).toBe(0); 
    expect(result.current.player.maxExp).toBe(200); 
    expect(result.current.player.dpc).toBe(20); 
  });
});

