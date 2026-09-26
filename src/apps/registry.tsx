'use client';

import React from 'react';
import { AppModuleContract } from './types';
import { fileExplorerModule } from './file-explorer';
import { notepadModule } from './notepad';
import { calculatorModule } from './calculator';
import { paintModule } from './paint';
import { minesweeperModule } from '@/games/minesweeper';
import { solitaireModule } from '@/games/solitaire';
import { heartsModule } from '@/games/hearts';
import {
  ComputerIcon,
  SecurityShieldIcon,
  ContactMailIcon,
  CmdIcon,
  PersonalizeIcon,
} from '@/core/assets';
import { siteConfig } from '@/config/site';
import { SystemWindow } from '@/components/windows/SystemWindow';
import { SecurityCenterWindow } from '@/components/windows/SecurityCenterWindow';
import { ContactWindow } from '@/components/windows/ContactWindow';
import { CmdWindow } from '@/components/windows/CmdWindow';
import { PersonalizeWindow } from '@/components/windows/PersonalizeWindow';
import { useOS } from '@/state/os-store';

function SystemAppAdapter() {
  const { openExplorerAt, openWindow } = useOS();
  return (
    <SystemWindow
      onOpenExplorerSection={openExplorerAt}
      onOpenWindow={openWindow}
    />
  );
}

function SecurityCenterAppAdapter() {
  const { openExplorerAt, openWindow } = useOS();
  return (
    <SecurityCenterWindow
      onOpenExplorerSection={openExplorerAt}
      onOpenWindow={openWindow}
    />
  );
}

function CmdAppAdapter() {
  const { openWindow } = useOS();
  return <CmdWindow onOpenWindow={openWindow} />;
}

function PersonalizeAppAdapter() {
  const {
    wallpaper,
    setWallpaper,
    glassColor,
    setGlassColor,
    glassOpacity,
    setGlassOpacity,
    showGadgets,
    setShowGadgets,
  } = useOS();
  return (
    <PersonalizeWindow
      wallpaper={wallpaper}
      onWallpaperChange={setWallpaper}
      glassColor={glassColor}
      onGlassColorChange={setGlassColor}
      glassOpacity={glassOpacity}
      onGlassOpacityChange={setGlassOpacity}
      showGadgets={showGadgets}
      onToggleGadgets={() => setShowGadgets(!showGadgets)}
    />
  );
}

export const systemModule: AppModuleContract = {
  id: 'system',
  getWindowConfig: () => ({
    id: 'system',
    title: `System — ${siteConfig.name} (${siteConfig.role})`,
    shortLabel: 'System Properties',
    glowColor: 'rgba(56, 189, 248, 0.65)',
    defaultPos: { x: 268, y: 44, width: 790, height: 535 },
    pinned: true,
    category: 'system',
    description: 'Windows 7 System Properties & Portfolio Overview',
  }),
  renderIcon: (size = 28) => <ComputerIcon size={size} />,
  mount: () => {},
  unmount: () => {},
  onFocus: () => {},
  onMinimize: () => {},
  Component: SystemAppAdapter,
};

export const securityModule: AppModuleContract = {
  id: 'security',
  getWindowConfig: () => ({
    id: 'security',
    title: 'Cyber Security & Credentials Center — 15+ Certifications',
    shortLabel: 'Security Center',
    glowColor: 'rgba(34, 197, 94, 0.62)',
    defaultPos: { x: 220, y: 36, width: 780, height: 530 },
    pinned: true,
    category: 'portfolio',
    description: 'Cyber Security Center & 15+ Certifications',
  }),
  renderIcon: (size = 28) => <SecurityShieldIcon size={size} />,
  mount: () => {},
  unmount: () => {},
  onFocus: () => {},
  onMinimize: () => {},
  Component: SecurityCenterAppAdapter,
};

export const contactModule: AppModuleContract = {
  id: 'contact',
  getWindowConfig: () => ({
    id: 'contact',
    title: `New Message — Contact ${siteConfig.name}`,
    shortLabel: 'Contact Mohamed',
    glowColor: 'rgba(59, 130, 246, 0.65)',
    defaultPos: { x: 280, y: 62, width: 650, height: 470 },
    pinned: true,
    category: 'portfolio',
    description: 'Direct Contact & WhatsApp Message Composer',
  }),
  renderIcon: (size = 28) => <ContactMailIcon size={size} />,
  mount: () => {},
  unmount: () => {},
  onFocus: () => {},
  onMinimize: () => {},
  Component: ContactWindow,
};

export const cmdModule: AppModuleContract = {
  id: 'cmd',
  getWindowConfig: () => ({
    id: 'cmd',
    title: 'Administrator: C:\\System32\\cmd.exe',
    shortLabel: 'Command Prompt',
    glowColor: 'rgba(148, 163, 184, 0.6)',
    defaultPos: { x: 270, y: 74, width: 680, height: 440 },
    pinned: true,
    category: 'system',
    description: 'Windows 7 Command Prompt CLI',
  }),
  renderIcon: (size = 28) => <CmdIcon size={size} />,
  mount: () => {},
  unmount: () => {},
  onFocus: () => {},
  onMinimize: () => {},
  Component: CmdAppAdapter,
};

export const personalizeModule: AppModuleContract = {
  id: 'personalize',
  getWindowConfig: () => ({
    id: 'personalize',
    title: 'Personalization — Aero Glass & Desktop Appearance',
    shortLabel: 'Personalization',
    glowColor: 'rgba(168, 85, 247, 0.62)',
    defaultPos: { x: 260, y: 56, width: 710, height: 500 },
    pinned: false,
    category: 'system',
    description: 'Aero Glass Colors, Desktop Wallpapers & Session Controls',
  }),
  renderIcon: (size = 28) => <PersonalizeIcon size={size} />,
  mount: () => {},
  unmount: () => {},
  onFocus: () => {},
  onMinimize: () => {},
  Component: PersonalizeAppAdapter,
};

export const APP_REGISTRY: Record<string, AppModuleContract> = {
  explorer: fileExplorerModule,
  system: systemModule,
  notepad: notepadModule,
  calculator: calculatorModule,
  paint: paintModule,
  security: securityModule,
  contact: contactModule,
  cmd: cmdModule,
  minesweeper: minesweeperModule,
  solitaire: solitaireModule,
  hearts: heartsModule,
  personalize: personalizeModule,
};

export function getAppModule(id: string): AppModuleContract | undefined {
  return APP_REGISTRY[id];
}
