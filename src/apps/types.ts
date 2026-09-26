import type React from 'react';
import type { WindowPosition } from '@/state/os-store';

export type AppCategory = 'system' | 'accessory' | 'portfolio' | 'game';

export interface AppWindowConfig {
  id: string;
  title: string;
  shortLabel: string;
  glowColor: string;
  defaultPos: WindowPosition;
  pinned?: boolean;
  category: AppCategory;
  description: string;
}

/**
 * Standard Modular Application & Game Contract (Section 2)
 * Every application in /src/apps/* and game in /src/games/* implements this interface
 * so the Desktop Shell and Window Manager can host any module identically without coupling.
 */
export interface AppModuleContract {
  id: string;
  getWindowConfig: () => AppWindowConfig;
  renderIcon: (size?: number) => React.ReactNode;
  mount?: () => void;
  unmount?: () => void;
  onFocus?: () => void;
  onMinimize?: () => void;
  Component: React.FC;
}
