'use client';

import { useState, useEffect, useCallback } from 'react';

export type ForcedViewportMode = 'desktop' | 'mobile' | null;

export interface ViewportState {
  isMobile: boolean;
  effectiveIsMobile: boolean;
  forcedMode: ForcedViewportMode;
  setForcedMode: (mode: ForcedViewportMode) => void;
  toggleForcedMode: (mode: 'desktop' | 'mobile') => void;
}

export function useViewport(): ViewportState {
  // SSR-safe default: false to prevent hydration mismatch
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [forcedMode, setForcedMode] = useState<ForcedViewportMode>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // Defer initial sync so the effect only schedules updates (React 19 lint).
    const boot = window.setTimeout(() => setIsMobile(mediaQuery.matches), 0);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => {
        window.clearTimeout(boot);
        mediaQuery.removeEventListener('change', handler);
      };
    }

    mediaQuery.addListener(handler);
    return () => {
      window.clearTimeout(boot);
      mediaQuery.removeListener(handler);
    };
  }, []);

  const toggleForcedMode = useCallback((target: 'desktop' | 'mobile') => {
    setForcedMode((prev) => (prev === target ? null : target));
  }, []);

  const effectiveIsMobile = forcedMode ? forcedMode === 'mobile' : isMobile;

  return {
    isMobile,
    effectiveIsMobile,
    forcedMode,
    setForcedMode,
    toggleForcedMode,
  };
}
