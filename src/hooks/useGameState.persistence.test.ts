import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameState } from './useGameState';
import { Player, Shadow, Upgrades } from '../types/game';

describe('useGameState Persistence', () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      clear: () => {
        store = {};
      },
      removeItem: (key: string) => {
        delete store[key];
      },
    };
  })();

  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock);
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should load player and army from localStorage on initialization', () => {
    const savedPlayer: Player = {
      level: 5,
      exp: 150,
      maxExp: 500,
      mana: 100,
      dpc: 50,
      dps: 0,
    };
    const savedUpgrades: Upgrades = {
      extractionChance: 0.1,
      criticalChance: 0.05,
      criticalMultiplier: 0.5,
    };
    const savedArmy: Shadow[] = [
      { id: '1', name: 'Shadow Soldier', rank: 'normal', dps: 5 },
    ];

    localStorage.setItem('shadow_player', JSON.stringify(savedPlayer));
    localStorage.setItem('shadow_upgrades', JSON.stringify(savedUpgrades));
    localStorage.setItem('shadow_army', JSON.stringify(savedArmy));

    const { result } = renderHook(() => useGameState());

    expect(result.current.player).toEqual(savedPlayer);
    expect(result.current.upgrades).toEqual(savedUpgrades);
    expect(result.current.army).toEqual(savedArmy);
    expect(result.current.totalDps).toBe(5);
  });

  it('should save player and army to localStorage when they change', () => {
    const { result } = renderHook(() => useGameState());

    const newShadow: Shadow = { id: '1', name: 'Knight', rank: 'knight', dps: 10 };

    act(() => {
      result.current.addShadow(newShadow);
    });

    const savedArmy = JSON.parse(localStorage.getItem('shadow_army') || '[]');
    expect(savedArmy).toHaveLength(1);
    expect(savedArmy[0]).toEqual(newShadow);

    // Trigger an exp gain which changes player
    act(() => {
      result.current.attack(1000); // Kill current enemy
    });

    const savedPlayer = JSON.parse(localStorage.getItem('shadow_player') || '{}');
    expect(savedPlayer.exp).toBe(50);
    expect(savedPlayer.mana).toBe(10);
  });
});
