import { act, renderHook } from '@testing-library/react';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('defaults to light', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('toggles to dark and adds the dark class', () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.toggle());

    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('persists the chosen theme to localStorage', () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.toggle());

    expect(localStorage.getItem('acme-theme')).toBe('dark');
  });
});
