'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { siteConfig } from '@/config/site';
import {
  ComputerIcon,
  ExplorerIcon,
  FolderIcon,
  SecurityShieldIcon,
  ContactMailIcon,
  NotepadIcon,
  CmdIcon,
  PersonalizeIcon,
  CertificateIcon,
  BriefcaseIcon,
} from './AeroIcons';
import { AeroWindow, type SnapState, type WindowPosition } from './AeroWindow';
import { SystemWindow, type ExplorerSection } from './windows/SystemWindow';
import { ExplorerWindow } from './windows/ExplorerWindow';
import { SecurityCenterWindow } from './windows/SecurityCenterWindow';
import { ContactWindow } from './windows/ContactWindow';
import { CmdWindow } from './windows/CmdWindow';
import { NotepadWindow } from './windows/NotepadWindow';
import {
  PersonalizeWindow,
  AERO_COLORS,
  type AeroColorOption,
  type WallpaperPreset,
} from './windows/PersonalizeWindow';
import { StartMenu } from './StartMenu';
import { DesktopGadgets } from './DesktopGadgets';
import { Taskbar, TASKBAR_ICONS, type TaskbarAppItem } from './Taskbar';
import { aeroSound } from './AeroSound';

interface WinState {
  id: string;
  title: string;
  shortLabel: string;
  glowColor: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  snap: SnapState;
  defaultPos: WindowPosition;
  pinned: boolean;
}

const INITIAL_WINDOWS: WinState[] = [
  {
    id: 'explorer',
    title: `${siteConfig.name} — Portfolio Explorer`,
    shortLabel: 'Portfolio Explorer',
    glowColor: 'rgba(250, 204, 21, 0.62)',
    isOpen: true,
    isMinimized: false,
    zIndex: 20,
    snap: 'none',
    defaultPos: { x: 204, y: 18, width: 880, height: 575 },
    pinned: true,
  },
  {
    id: 'system',
    title: `System — ${siteConfig.name} (${siteConfig.role})`,
    shortLabel: 'System Properties',
    glowColor: 'rgba(56, 189, 248, 0.65)',
    isOpen: true,
    isMinimized: false,
    zIndex: 30,
    snap: 'none',
    defaultPos: { x: 268, y: 44, width: 790, height: 535 },
    pinned: true,
  },
  {
    id: 'security',
    title: `Cyber Security & Credentials Center — 15+ Certifications`,
    shortLabel: 'Security Center',
    glowColor: 'rgba(34, 197, 94, 0.62)',
    isOpen: false,
    isMinimized: false,
    zIndex: 15,
    snap: 'none',
    defaultPos: { x: 220, y: 36, width: 780, height: 530 },
    pinned: true,
  },
  {
    id: 'contact',
    title: `New Message — Contact ${siteConfig.name}`,
    shortLabel: 'Contact Mohamed',
    glowColor: 'rgba(59, 130, 246, 0.65)',
    isOpen: false,
    isMinimized: false,
    zIndex: 14,
    snap: 'none',
    defaultPos: { x: 280, y: 62, width: 650, height: 470 },
    pinned: true,
  },
  {
    id: 'notepad',
    title: `Resume_Mohamed_Elsheikh.txt — Notepad`,
    shortLabel: 'Resume.txt',
    glowColor: 'rgba(34, 211, 238, 0.62)',
    isOpen: false,
    isMinimized: false,
    zIndex: 13,
    snap: 'none',
    defaultPos: { x: 250, y: 50, width: 700, height: 500 },
    pinned: true,
  },
  {
    id: 'cmd',
    title: `Administrator: C:\\System32\\cmd.exe`,
    shortLabel: 'Command Prompt',
    glowColor: 'rgba(148, 163, 184, 0.6)',
    isOpen: false,
    isMinimized: false,
    zIndex: 12,
    snap: 'none',
    defaultPos: { x: 270, y: 74, width: 680, height: 440 },
    pinned: true,
  },
  {
    id: 'personalize',
    title: `Personalization — Aero Glass & Desktop Appearance`,
    shortLabel: 'Personalization',
    glowColor: 'rgba(168, 85, 247, 0.62)',
    isOpen: false,
    isMinimized: false,
    zIndex: 11,
    snap: 'none',
    defaultPos: { x: 260, y: 56, width: 710, height: 500 },
    pinned: false,
  },
];

export const AeroDesktop: React.FC = () => {
  const [windows, setWindows] = useState<WinState[]>(INITIAL_WINDOWS);
  const [explorerSection, setExplorerSection] = useState<ExplorerSection>('overview');
  const [selectedDesktopIcons, setSelectedDesktopIcons] = useState<string[]>(['system']);
  const [startOpen, setStartOpen] = useState(false);
  const [aeroPeek, setAeroPeek] = useState(false);
  const [showGadgets, setShowGadgets] = useState(true);
  const [wallpaper, setWallpaper] = useState<WallpaperPreset>('harmony');
  const [glassColor, setGlassColor] = useState<AeroColorOption>(AERO_COLORS[0]);
  const [glassOpacity, setGlassOpacity] = useState<number>(0.58);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [refreshFlash, setRefreshFlash] = useState(false);
  const [showWelcomeBalloon, setShowWelcomeBalloon] = useState(true);

  // Marquee selection box state on desktop
  const [marquee, setMarquee] = useState<{
    active: boolean;
    startX: number;
    startY: number;
    currX: number;
    currY: number;
  } | null>(null);

  // Sync Aero Glass CSS variables to document root
  useEffect(() => {
    document.documentElement.style.setProperty('--aero-glass-rgb', glassColor.rgb);
    document.documentElement.style.setProperty('--aero-taskbar-rgb', glassColor.taskbarRgb);
    document.documentElement.style.setProperty('--aero-glass-alpha', String(glassOpacity));
  }, [glassColor, glassOpacity]);

  // Auto-hide welcome balloon after 9 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowWelcomeBalloon(false), 9000);
    return () => clearTimeout(t);
  }, []);

  // Close Start menu and context menu on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setStartOpen(false);
        setContextMenu(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const bringToFront = useCallback((id: string) => {
    setWindows((prev) => {
      const maxZ = prev.reduce((m, w) => Math.max(m, w.zIndex), 10);
      return prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1 } : w));
    });
  }, []);

  const openOrFocusWindow = useCallback((id: string) => {
    setStartOpen(false);
    setContextMenu(null);
    setWindows((prev) => {
      const maxZ = prev.reduce((m, w) => Math.max(m, w.zIndex), 10);
      return prev.map((w) =>
        w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 } : w
      );
    });
  }, []);

  const openExplorerAt = useCallback(
    (section: ExplorerSection) => {
      setExplorerSection(section);
      openOrFocusWindow('explorer');
    },
    [openOrFocusWindow]
  );

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)));
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isOpen: false, isMinimized: false, snap: 'none' } : w))
    );
  }, []);

  const setWindowSnap = useCallback((id: string, snap: SnapState) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, snap } : w)));
  }, []);

  // Determine the topmost open & non-minimized window
  const activeWindowId = React.useMemo(() => {
    const openVisible = windows.filter((w) => w.isOpen && !w.isMinimized);
    if (openVisible.length === 0) return null;
    return openVisible.reduce((top, curr) => (curr.zIndex > top.zIndex ? curr : top)).id;
  }, [windows]);

  const handleTaskbarAppClick = useCallback(
    (id: string) => {
      setStartOpen(false);
      setContextMenu(null);
      setWindows((prev) => {
        const target = prev.find((w) => w.id === id);
        if (!target) return prev;
        const maxZ = prev.reduce((m, w) => Math.max(m, w.zIndex), 10);

        if (!target.isOpen) {
          return prev.map((w) =>
            w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 } : w
          );
        }
        if (target.isMinimized) {
          return prev.map((w) =>
            w.id === id ? { ...w, isMinimized: false, zIndex: maxZ + 1 } : w
          );
        }
        if (activeWindowId === id) {
          return prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w));
        }
        return prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1 } : w));
      });
    },
    [activeWindowId]
  );

  const handleShowDesktopClick = useCallback(() => {
    setStartOpen(false);
    setContextMenu(null);
    setWindows((prev) => {
      const anyVisible = prev.some((w) => w.isOpen && !w.isMinimized);
      return prev.map((w) => (w.isOpen ? { ...w, isMinimized: anyVisible } : w));
    });
  }, []);

  const handleResetDesktop = useCallback(() => {
    aeroSound.playChime();
    setWindows(INITIAL_WINDOWS);
    setExplorerSection('overview');
  }, []);

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setStartOpen(false);
    const x = Math.min(e.clientX, window.innerWidth - 210);
    const y = Math.min(e.clientY, window.innerHeight - 260);
    setContextMenu({ x, y });
  };

  const triggerRefresh = () => {
    aeroSound.playClick();
    setContextMenu(null);
    setRefreshFlash(true);
    setTimeout(() => setRefreshFlash(false), 140);
  };

  const desktopIcons = [
    {
      id: 'system',
      label: 'System Info (About Me)',
      icon: <ComputerIcon size={42} />,
      onLaunch: () => openOrFocusWindow('system'),
    },
    {
      id: 'explorer',
      label: 'Portfolio Explorer',
      icon: <ExplorerIcon size={42} />,
      onLaunch: () => openExplorerAt('overview'),
    },
    {
      id: 'projects',
      label: 'Projects (6)',
      icon: <FolderIcon size={42} badgeColor="#2563eb" />,
      onLaunch: () => openExplorerAt('projects'),
    },
    {
      id: 'experience',
      label: 'Experience (4)',
      icon: <BriefcaseIcon size={42} />,
      onLaunch: () => openExplorerAt('experience'),
    },
    {
      id: 'certifications',
      label: 'Certifications (15)',
      icon: <CertificateIcon size={42} />,
      onLaunch: () => openOrFocusWindow('security'),
    },
    {
      id: 'skills',
      label: 'Skills & Education',
      icon: <FolderIcon size={42} badgeColor="#16a34a" />,
      onLaunch: () => openExplorerAt('skills'),
    },
    {
      id: 'notepad',
      label: 'Resume.txt',
      icon: <NotepadIcon size={42} />,
      onLaunch: () => openOrFocusWindow('notepad'),
    },
    {
      id: 'cmd',
      label: 'Command Prompt',
      icon: <CmdIcon size={42} />,
      onLaunch: () => openOrFocusWindow('cmd'),
    },
    {
      id: 'contact',
      label: 'Contact Mohamed',
      icon: <ContactMailIcon size={42} />,
      onLaunch: () => openOrFocusWindow('contact'),
    },
    {
      id: 'personalize',
      label: 'Personalize Aero',
      icon: <PersonalizeIcon size={42} />,
      onLaunch: () => openOrFocusWindow('personalize'),
    },
  ];

  const taskbarApps: TaskbarAppItem[] = windows.map((w) => ({
    id: w.id,
    title: w.title,
    shortLabel: w.shortLabel,
    glowColor: w.glowColor,
    icon: TASKBAR_ICONS[w.id as keyof typeof TASKBAR_ICONS] || <ExplorerIcon size={28} />,
    isOpen: w.isOpen,
    isMinimized: w.isMinimized,
    isActive: activeWindowId === w.id,
    pinned: w.pinned,
  }));

  return (
    <div
      id="main"
      onContextMenu={handleDesktopContextMenu}
      onClick={() => {
        setStartOpen(false);
        setContextMenu(null);
      }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.desktopSurface === 'true') {
          setSelectedDesktopIcons([]);
          setStartOpen(false);
          setContextMenu(null);
          setMarquee({
            active: true,
            startX: e.clientX,
            startY: e.clientY,
            currX: e.clientX,
            currY: e.clientY,
          });
        }
      }}
      onPointerMove={(e) => {
        if (marquee?.active) {
          const currX = e.clientX;
          const currY = e.clientY;
          setMarquee((prev) => (prev ? { ...prev, currX, currY } : null));
          if (Math.abs(currX - marquee.startX) > 4 || Math.abs(currY - marquee.startY) > 4) {
            const left = Math.min(marquee.startX, currX);
            const right = Math.max(marquee.startX, currX);
            const top = Math.min(marquee.startY, currY);
            const bottom = Math.max(marquee.startY, currY);
            const iconNodes = document.querySelectorAll<HTMLElement>('[data-desktop-icon-id]');
            const selectedIds: string[] = [];
            iconNodes.forEach((node) => {
              const rect = node.getBoundingClientRect();
              const intersects =
                rect.left < right &&
                rect.right > left &&
                rect.top < bottom &&
                rect.bottom > top;
              if (intersects && node.dataset.desktopIconId) {
                selectedIds.push(node.dataset.desktopIconId);
              }
            });
            setSelectedDesktopIcons(selectedIds);
          }
        }
      }}
      onPointerUp={() => {
        if (marquee?.active) {
          setMarquee(null);
        }
      }}
      className={`relative w-screen h-screen overflow-hidden select-none ${
        aeroPeek ? 'aero-peek-active' : ''
      }`}
    >
      {/* 1. Authentic Harmony Wallpaper + Atmospheric Glass Ribbons */}
      <div
        data-desktop-surface="true"
        className={`w7-desktop-bg w7-wallpaper-${wallpaper}`}
      >
        {/* Translucent Frutiger Aero Light Waves & Bokeh */}
        <svg
          data-desktop-surface="true"
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full opacity-75 pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="harmonyWave1" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="45%" stopColor="rgba(186, 235, 255, 0.35)" />
              <stop offset="70%" stopColor="rgba(255, 255, 255, 0.55)" />
              <stop offset="100%" stopColor="rgba(125, 211, 252, 0)" />
            </linearGradient>
            <linearGradient id="harmonyWave2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0)" />
              <stop offset="50%" stopColor="rgba(224, 247, 255, 0.42)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </linearGradient>
          </defs>
          {/* Sweeping glass light ribbons */}
          <path
            d="M-100,780 C380,680 650,240 1120,320 C1380,365 1520,180 1700,90 L1700,900 L-100,900 Z"
            fill="url(#harmonyWave1)"
          />
          <path
            d="M150,920 C480,550 820,620 1240,210 C1420,40 1580,110 1700,0 L1700,480 C1320,420 940,740 150,920 Z"
            fill="url(#harmonyWave2)"
          />
          {/* Soft bokeh light spheres */}
          <circle cx="1020" cy="340" r="85" fill="rgba(255,255,255,0.12)" />
          <circle cx="1140" cy="240" r="42" fill="rgba(255,255,255,0.18)" />
          <circle cx="910" cy="440" r="28" fill="rgba(255,255,255,0.16)" />
          <circle cx="1220" cy="410" r="55" fill="rgba(186,230,253,0.14)" />
        </svg>
      </div>

      {/* 2. Desktop Shortcut Icons Grid */}
      {!refreshFlash && (
        <nav
          aria-label="Desktop Shortcuts"
          data-desktop-surface="true"
          className="relative z-[2] p-2.5 grid grid-flow-col grid-rows-5 sm:grid-rows-6 gap-y-2 gap-x-2 w-fit max-h-[calc(100vh-48px)]"
        >
          {desktopIcons.map((item) => {
            const isSelected = selectedDesktopIcons.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                data-desktop-icon-id={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  aeroSound.playClick();
                  setSelectedDesktopIcons(
                    e.ctrlKey || e.metaKey
                      ? isSelected
                        ? selectedDesktopIcons.filter((id) => id !== item.id)
                        : [...selectedDesktopIcons, item.id]
                      : [item.id]
                  );
                  // On mobile/touch screens, single tap opens the window immediately
                  if (window.innerWidth < 768) {
                    item.onLaunch();
                  }
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  aeroSound.playClick();
                  item.onLaunch();
                }}
                className={`w7-desktop-icon ${isSelected ? 'selected' : ''}`}
              >
                <div className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{item.icon}</div>
                <span className="w7-desktop-icon-label">{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Rubber-band Desktop Marquee Selection Rectangle */}
      {marquee?.active &&
        (Math.abs(marquee.currX - marquee.startX) > 4 ||
          Math.abs(marquee.currY - marquee.startY) > 4) && (
          <div
            className="fixed pointer-events-none z-[8] border border-[#0078d7] bg-[#3399ff]/25"
            style={{
              left: Math.min(marquee.startX, marquee.currX),
              top: Math.min(marquee.startY, marquee.currY),
              width: Math.abs(marquee.currX - marquee.startX),
              height: Math.abs(marquee.currY - marquee.startY),
            }}
          />
        )}

      {/* 3. Floating Desktop Gadgets (Right Side) */}
      {showGadgets && (
        <DesktopGadgets
          onOpenWindow={openOrFocusWindow}
          onOpenExplorerSection={openExplorerAt}
          onCloseGadgets={() => setShowGadgets(false)}
        />
      )}

      {/* 4. Managed Aero Glass Application Windows */}
      {windows.map((win) => {
        const iconNode =
          TASKBAR_ICONS[win.id as keyof typeof TASKBAR_ICONS] || <ExplorerIcon size={16} />;

        return (
          <AeroWindow
            key={win.id}
            id={win.id}
            title={win.title}
            icon={iconNode}
            isOpen={win.isOpen}
            isMinimized={win.isMinimized}
            isActive={activeWindowId === win.id}
            zIndex={win.zIndex}
            defaultPos={win.defaultPos}
            snapState={win.snap}
            onFocus={bringToFront}
            onMinimize={minimizeWindow}
            onClose={closeWindow}
            onSnapChange={setWindowSnap}
          >
            {win.id === 'system' && (
              <SystemWindow
                onOpenExplorerSection={openExplorerAt}
                onOpenWindow={openOrFocusWindow}
              />
            )}
            {win.id === 'explorer' && (
              <ExplorerWindow
                activeSection={explorerSection}
                onSectionChange={setExplorerSection}
                onOpenWindow={openOrFocusWindow}
              />
            )}
            {win.id === 'security' && (
              <SecurityCenterWindow
                onOpenExplorerSection={openExplorerAt}
                onOpenWindow={openOrFocusWindow}
              />
            )}
            {win.id === 'contact' && <ContactWindow />}
            {win.id === 'cmd' && <CmdWindow onOpenWindow={openOrFocusWindow} />}
            {win.id === 'notepad' && <NotepadWindow />}
            {win.id === 'personalize' && (
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
            )}
          </AeroWindow>
        );
      })}

      {/* 5. Desktop Right-Click Context Menu */}
      {contextMenu && (
        <div
          className="w7-context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="w7-menu-item font-semibold"
            onClick={() => openExplorerAt('overview')}
          >
            <span>Open Portfolio Explorer</span>
          </button>
          <button
            type="button"
            className="w7-menu-item"
            onClick={() => openOrFocusWindow('system')}
          >
            <span>System Properties (About)</span>
          </button>
          <button type="button" className="w7-menu-item" onClick={triggerRefresh}>
            <span>Refresh</span>
          </button>
          <div className="w7-menu-sep" />
          <button
            type="button"
            className="w7-menu-item"
            onClick={() => openExplorerAt('projects')}
          >
            <span>Browse Featured Projects (6)</span>
          </button>
          <button
            type="button"
            className="w7-menu-item"
            onClick={() => openOrFocusWindow('security')}
          >
            <span>Cyber Security &amp; Certifications (15)</span>
          </button>
          <button
            type="button"
            className="w7-menu-item"
            onClick={() => openOrFocusWindow('notepad')}
          >
            <span>Open Resume.txt (Notepad)</span>
          </button>
          <button
            type="button"
            className="w7-menu-item"
            onClick={() => openOrFocusWindow('cmd')}
          >
            <span>Open Command Prompt here</span>
          </button>
          <div className="w7-menu-sep" />
          <button
            type="button"
            className="w7-menu-item"
            onClick={() => {
              aeroSound.playClick();
              setShowGadgets(!showGadgets);
              setContextMenu(null);
            }}
          >
            <span>{showGadgets ? '✓ ' : ''}Show desktop gadgets</span>
          </button>
          <button
            type="button"
            className="w7-menu-item"
            onClick={() => openOrFocusWindow('personalize')}
          >
            <span>Personalize</span>
          </button>
        </div>
      )}

      {/* 6. System Tray Welcome Balloon Notification */}
      {showWelcomeBalloon && (
        <div
          role="status"
          className="hidden sm:block fixed bottom-[48px] right-4 z-[9200] w-[290px] rounded-[5px] border border-[#767676] bg-gradient-to-b from-[#ffffff] to-[#ebeff5] shadow-[2px_3px_10px_rgba(0,0,0,0.45)] p-3 text-[11.5px] text-[#111]"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 font-semibold text-[#003399]">
              <SecurityShieldIcon size={18} />
              <span>{siteConfig.name} — Portfolio</span>
            </div>
            <button
              type="button"
              aria-label="Close notification"
              onClick={() => setShowWelcomeBalloon(false)}
              className="w-4 h-4 rounded-sm hover:bg-black/10 flex items-center justify-center text-[#555] text-[10px]"
            >
              ✕
            </button>
          </div>
          <p className="mt-1 text-[#333] leading-snug">
            Double-click desktop icons, drag windows to Aero Snap, or open the Start Menu to explore 6 projects, 4 roles &amp; 15 certifications.
          </p>
        </div>
      )}

      {/* 7. Two-Pane Start Menu */}
      {startOpen && (
        <StartMenu
          onOpenWindow={openOrFocusWindow}
          onOpenExplorerSection={openExplorerAt}
          onResetDesktop={handleResetDesktop}
          onCloseMenu={() => setStartOpen(false)}
        />
      )}

      {/* 8. Bottom Superbar Taskbar */}
      <Taskbar
        apps={taskbarApps}
        startOpen={startOpen}
        onToggleStart={() => setStartOpen(!startOpen)}
        onTaskbarAppClick={handleTaskbarAppClick}
        onCloseApp={closeWindow}
        onShowDesktopClick={handleShowDesktopClick}
        onAeroPeekChange={setAeroPeek}
      />
    </div>
  );
};
