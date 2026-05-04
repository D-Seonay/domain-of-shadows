import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePortalScanner } from '../usePortalScanner';

describe('usePortalScanner', () => {
  it('should start with an empty list of portals', () => {
    const { result } = renderHook(() => usePortalScanner());
    expect(result.current.portals).toEqual([]);
  });

  it('should generate between 3 and 5 portals when scan is called', () => {
    const { result } = renderHook(() => usePortalScanner());

    act(() => {
      result.current.scan();
    });

    expect(result.current.portals.length).toBeGreaterThanOrEqual(3);
    expect(result.current.portals.length).toBeLessThanOrEqual(5);
  });

  it('should generate portals with valid properties', () => {
    const { result } = renderHook(() => usePortalScanner());

    act(() => {
      result.current.scan();
    });

    const portal = result.current.portals[0];
    expect(portal.id).toBeDefined();
    expect(portal.name).toBeDefined();
    expect(portal.rank).toBeDefined();
    expect(portal.position.x).toBeGreaterThanOrEqual(0);
    expect(portal.position.x).toBeLessThanOrEqual(1);
    expect(portal.position.y).toBeGreaterThanOrEqual(0);
    expect(portal.position.y).toBeLessThanOrEqual(1);
  });
});
