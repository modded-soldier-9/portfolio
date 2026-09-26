'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  CalculatorIcon,
  PaintIcon,
  MinesweeperIcon,
  SolitaireIcon,
  HeartsIcon,
  RecycleBinIcon,
} from '@/core/assets';
import { AeroWindow } from '@/core/window-manager';
import { BootSequence } from '@/core/boot';
import { LoginScreen } from '@/core/login';
import { getAppModule } from '@/apps/registry';
import { StartMenu } from '@/components/StartMenu';
import { DesktopGadgets } from '@/components/DesktopGadgets';
import {
  Taskbar,
  TASKBAR_ICONS,
  type TaskbarAppItem,
} from '@/components/Taskbar';
import { aeroSound } from '@/components/AeroSound';
import { useOS, type ExplorerSection } from '@/state/os-store';

export const DesktopShell: React.FC = () => {
  const {
    sessionPhase,
    completeBoot,
    skipToDesktop,
    windows,
    openWindow,
    openExplorerAt,
    minimizeWindow,
    closeWindow,
    setWindowSnap,
    focusWindow,
    resetDesktop,
    files,
    emptyRecycleBin,
    saveVirtualFile,
    openFileInNotepad,
    restartSystem,
    wallpaper,
    glassColor,
    glassOpacity,
    showGadgets,
    setShowGadgets,
  } = useOS();

  const [selectedDesktopIcons, setSelectedDesktopIcons] = useState<string[]>([
    'system',
  ]);
  const [startOpen, setStartOpen] = useState(false);
  const [aeroPeek, setAeroPeek] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
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

  const recycleCount = useMemo(
    () => files.filter((f) => f.folder === 'RecycleBin').length,
    [files]
  );

  // Sync Aero Glass CSS variables to document root
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--aero-glass-rgb',
      glassColor.rgb
    );
    document.documentElement.style.setProperty(
      '--aero-taskbar-rgb',
      glassColor.taskbarRgb
    );
    document.documentElement.style.setProperty(
      '--aero-glass-alpha',
      String(glassOpacity)
    );
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

  // Determine the topmost open & non-minimized window
  const activeWindowId = useMemo(() => {
    const openVisible = windows.filter((w) => w.isOpen && !w.isMinimized);
    if (openVisible.length === 0) return null;
    return openVisible.reduce((top, curr) =>
      curr.zIndex > top.zIndex ? curr : top
    ).id;
  }, [windows]);

  const handleOpenWindow = (id: string) => {
    setStartOpen(false);
    setContextMenu(null);
    openWindow(id);
  };

  const handleOpenExplorerAt = (section: ExplorerSection) => {
    setStartOpen(false);
    setContextMenu(null);
    openExplorerAt(section);
  };

  const handleTaskbarAppClick = (id: string) => {
    setStartOpen(false);
    setContextMenu(null);
    const target = windows.find((w) => w.id === id);
    if (!target) return;
    if (!target.isOpen || target.isMinimized) {
      openWindow(id);
    } else if (activeWindowId === id) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  const handleShowDesktopClick = () => {
    setStartOpen(false);
    setContextMenu(null);
    const anyVisible = windows.some((w) => w.isOpen && !w.isMinimized);
    windows.forEach((w) => {
      if (w.isOpen) {
        if (anyVisible) minimizeWindow(w.id);
        else openWindow(w.id);
      }
    });
  };

  const handleResetDesktop = () => {
    aeroSound.playChime();
    resetDesktop();
  };

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setStartOpen(false);
    const x = Math.min(e.clientX, window.innerWidth - 220);
    const y = Math.min(e.clientY, window.innerHeight - 310);
    setContextMenu({ x, y });
  };

  const triggerRefresh = () => {
    aeroSound.playClick();
    setContextMenu(null);
    setRefreshFlash(true);
    setTimeout(() => setRefreshFlash(false), 140);
  };

  const handleCreateNewTextDocument = () => {
    aeroSound.playClick();
    setContextMenu(null);
    const name = `New_Text_Document_${files.length + 1}.txt`;
    const created = saveVirtualFile({
      name,
      folder: 'Documents',
      type: 'txt',
      content: `Created on Windows 7 Desktop (${new Date().toLocaleString()})\n\nType your notes here...`,
      size: '1 KB',
    });
    openFileInNotepad(created.id);
    openWindow('notepad');
  };

  const desktopIcons = [
    {
      id: 'recycle',
      label:
        recycleCount > 0 ? `Recycle Bin (${recycleCount})` : 'Recycle Bin',
      icon: <RecycleBinIcon size={42} isEmpty={recycleCount === 0} />,
      onLaunch: () => handleOpenExplorerAt('recycle'),
    },
    {
      id: 'system',
      label: 'System Info (About Me)',
      icon: <ComputerIcon size={42} />,
      onLaunch: () => handleOpenWindow('system'),
    },
    {
      id: 'explorer',
      label: 'Portfolio Explorer',
      icon: <ExplorerIcon size={42} />,
      onLaunch: () => handleOpenExplorerAt('overview'),
    },
    {
      id: 'projects',
      label: 'Projects (6)',
      icon: <FolderIcon size={42} badgeColor="#2563eb" />,
      onLaunch: () => handleOpenExplorerAt('projects'),
    },
    {
      id: 'certifications',
      label: 'Certifications (15)',
      icon: <CertificateIcon size={42} />,
      onLaunch: () => handleOpenWindow('security'),
    },
    {
      id: 'notepad',
      label: 'Resume.txt',
      icon: <NotepadIcon size={42} />,
      onLaunch: () => handleOpenWindow('notepad'),
    },
    {
      id: 'calculator',
      label: 'Calculator',
      icon: <CalculatorIcon size={42} />,
      onLaunch: () => handleOpenWindow('calculator'),
    },
    {
      id: 'paint',
      label: 'MS Paint',
      icon: <PaintIcon size={42} />,
      onLaunch: () => handleOpenWindow('paint'),
    },
    {
      id: 'minesweeper',
      label: 'Minesweeper',
      icon: <MinesweeperIcon size={42} />,
      onLaunch: () => handleOpenWindow('minesweeper'),
    },
    {
      id: 'solitaire',
      label: 'Solitaire',
      icon: <SolitaireIcon size={42} />,
      onLaunch: () => handleOpenWindow('solitaire'),
    },
    {
      id: 'hearts',
      label: 'Hearts',
      icon: <HeartsIcon size={42} />,
      onLaunch: () => handleOpenWindow('hearts'),
    },
    {
      id: 'cmd',
      label: 'Command Prompt',
      icon: <CmdIcon size={42} />,
      onLaunch: () => handleOpenWindow('cmd'),
    },
    {
      id: 'contact',
      label: 'Contact Mohamed',
      icon: <ContactMailIcon size={42} />,
      onLaunch: () => handleOpenWindow('contact'),
    },
    {
      id: 'personalize',
      label: 'Personalize Aero',
      icon: <PersonalizeIcon size={42} />,
      onLaunch: () => handleOpenWindow('personalize'),
    },
  ];

  const taskbarApps: TaskbarAppItem[] = windows.map((w) => ({
    id: w.id,
    title: w.title,
    shortLabel: w.shortLabel,
    glowColor: w.glowColor,
    icon:
      TASKBAR_ICONS[w.id as keyof typeof TASKBAR_ICONS] || (
        <ExplorerIcon size={28} />
      ),
    isOpen: w.isOpen,
    isMinimized: w.isMinimized,
    isActive: activeWindowId === w.id,
    pinned: w.pinned,
  }));

  return (
    <>
      {/* Boot, Sleep & Login Overlays (rendered above desktop when active) */}
      {sessionPhase === 'booting' && (
        <BootSequence
          onComplete={completeBoot}
          onSkipToDesktop={skipToDesktop}
        />
      )}
      {sessionPhase === 'login' && <LoginScreen />}
      {sessionPhase === 'sleeping' && (
        <div
          role="dialog"
          aria-label="System in Sleep Mode"
          tabIndex={0}
          onClick={() => {
            aeroSound.playClick();
            completeBoot();
          }}
          onKeyDown={() => {
            aeroSound.playClick();
            completeBoot();
          }}
          className="fixed inset-0 z-[99999] bg-black/95 flex flex-col items-center justify-center text-white cursor-pointer select-none"
        >
          <div className="w-3.5 h-3.5 rounded-full bg-amber-400 animate-pulse mb-4 shadow-[0_0_16px_rgba(251,191,36,0.9)]" />
          <div className="text-sm font-medium text-sky-100/90 tracking-wide">
            Windows 7 is in Sleep Mode
          </div>
          <div className="text-xs text-slate-400 mt-1.5">
            Click anywhere or press any key to wake up
          </div>
        </div>
      )}

      <div
        id="main"
        onContextMenu={handleDesktopContextMenu}
        onClick={() => {
          setStartOpen(false);
          setContextMenu(null);
        }}
        onPointerDown={(e) => {
          if (
            e.target === e.currentTarget ||
            (e.target as HTMLElement).dataset.desktopSurface === 'true'
          ) {
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
            if (
              Math.abs(currX - marquee.startX) > 4 ||
              Math.abs(currY - marquee.startY) > 4
            ) {
              const left = Math.min(marquee.startX, currX);
              const right = Math.max(marquee.startX, currX);
              const top = Math.min(marquee.startY, currY);
              const bottom = Math.max(marquee.startY, currY);
              const iconNodes = document.querySelectorAll<HTMLElement>(
                '[data-desktop-icon-id]'
              );
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
          <svg
            data-desktop-surface="true"
            viewBox="0 0 1600 900"
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full opacity-75 pointer-events-none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="harmonyWave1"
                x1="0%"
                y1="100%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="45%" stopColor="rgba(186, 235, 255, 0.35)" />
                <stop offset="70%" stopColor="rgba(255, 255, 255, 0.55)" />
                <stop offset="100%" stopColor="rgba(125, 211, 252, 0)" />
              </linearGradient>
              <linearGradient
                id="harmonyWave2"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="rgba(56, 189, 248, 0)" />
                <stop offset="50%" stopColor="rgba(224, 247, 255, 0.42)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
              </linearGradient>
            </defs>
            <path
              d="M-100,780 C380,680 650,240 1120,320 C1380,365 1520,180 1700,90 L1700,900 L-100,900 Z"
              fill="url(#harmonyWave1)"
            />
            <path
              d="M150,920 C480,550 820,620 1240,210 C1420,40 1580,110 1700,0 L1700,480 C1320,420 940,740 150,920 Z"
              fill="url(#harmonyWave2)"
            />
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
            className="relative z-[2] p-2.5 grid grid-flow-col grid-rows-6 sm:grid-rows-7 gap-y-1.5 gap-x-2 w-fit max-h-[calc(100vh-48px)]"
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
                  <div className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                    {item.icon}
                  </div>
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
            onOpenWindow={handleOpenWindow}
            onOpenExplorerSection={handleOpenExplorerAt}
            onCloseGadgets={() => setShowGadgets(false)}
          />
        )}

        {/* 4. Managed Aero Glass Application & Game Windows */}
        {windows.map((win) => {
          const appModule = getAppModule(win.id);
          const iconNode =
            appModule?.renderIcon(16) ||
            TASKBAR_ICONS[win.id as keyof typeof TASKBAR_ICONS] || (
              <ExplorerIcon size={16} />
            );

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
              onFocus={focusWindow}
              onMinimize={minimizeWindow}
              onClose={closeWindow}
              onSnapChange={setWindowSnap}
              onMountModule={() => appModule?.mount?.()}
              onUnmountModule={() => appModule?.unmount?.()}
              onFocusModule={() => appModule?.onFocus?.()}
              onMinimizeModule={() => appModule?.onMinimize?.()}
            >
              {appModule ? <appModule.Component /> : null}
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
              onClick={() => handleOpenExplorerAt('overview')}
            >
              <span>Open Windows Explorer</span>
            </button>
            <button
              type="button"
              className="w7-menu-item"
              onClick={triggerRefresh}
            >
              <span>Refresh</span>
            </button>
            <button
              type="button"
              className="w7-menu-item"
              onClick={handleCreateNewTextDocument}
            >
              <span>New → Text Document (.txt)</span>
            </button>
            <div className="w7-menu-sep" />
            <button
              type="button"
              className="w7-menu-item"
              onClick={() => handleOpenWindow('calculator')}
            >
              <span>Open Calculator</span>
            </button>
            <button
              type="button"
              className="w7-menu-item"
              onClick={() => handleOpenWindow('paint')}
            >
              <span>Open MS Paint</span>
            </button>
            <button
              type="button"
              className="w7-menu-item"
              onClick={() => handleOpenWindow('minesweeper')}
            >
              <span>Play Minesweeper</span>
            </button>
            <button
              type="button"
              className="w7-menu-item"
              onClick={() => handleOpenWindow('solitaire')}
            >
              <span>Play Solitaire</span>
            </button>
            <button
              type="button"
              className="w7-menu-item"
              onClick={() => handleOpenWindow('hearts')}
            >
              <span>Play Hearts</span>
            </button>
            <div className="w7-menu-sep" />
            {recycleCount > 0 && (
              <button
                type="button"
                className="w7-menu-item text-red-700"
                onClick={() => {
                  aeroSound.playClick();
                  emptyRecycleBin();
                  setContextMenu(null);
                }}
              >
                <span>Empty Recycle Bin ({recycleCount})</span>
              </button>
            )}
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
              onClick={() => handleOpenWindow('personalize')}
            >
              <span>Personalize</span>
            </button>
            <button
              type="button"
              className="w7-menu-item text-[#003399]"
              onClick={() => {
                setContextMenu(null);
                restartSystem();
              }}
            >
              <span>Restart Windows 7 Boot Sequence</span>
            </button>
          </div>
        )}

        {/* 6. System Tray Welcome Balloon Notification */}
        {showWelcomeBalloon && sessionPhase === 'desktop' && (
          <div
            role="status"
            className="hidden sm:block fixed bottom-[48px] right-4 z-[9200] w-[295px] rounded-[5px] border border-[#767676] bg-gradient-to-b from-[#ffffff] to-[#ebeff5] shadow-[2px_3px_10px_rgba(0,0,0,0.45)] p-3 text-[11.5px] text-[#111]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 font-semibold text-[#003399]">
                <SecurityShieldIcon size={18} />
                <span>{siteConfig.name} — Windows 7 Aero</span>
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
              Explore portfolio apps, classic accessories (Notepad, Calculator,
              Paint), and Windows 7 games (Minesweeper, Solitaire, Hearts).
            </p>
          </div>
        )}

        {/* 7. Two-Pane Start Menu */}
        {startOpen && (
          <StartMenu
            onOpenWindow={handleOpenWindow}
            onOpenExplorerSection={handleOpenExplorerAt}
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
    </>
  );
};
