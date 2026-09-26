'use client';

import React, { useState, useEffect, useRef } from 'react';
import { siteConfig } from '@/config/site';
import {
  StartOrbIcon,
  ComputerIcon,
  ExplorerIcon,
  SecurityShieldIcon,
  ContactMailIcon,
  NotepadIcon,
  CmdIcon,
  PersonalizeIcon,
  CalculatorIcon,
  PaintIcon,
  MinesweeperIcon,
  SolitaireIcon,
  HeartsIcon,
} from './AeroIcons';
import { aeroSound } from './AeroSound';
import { animateFlyoutOpen } from '@/core/animation';

export interface TaskbarAppItem {
  id: string;
  title: string;
  shortLabel: string;
  glowColor: string;
  icon: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isActive: boolean;
  pinned?: boolean;
}

interface TaskbarProps {
  apps: TaskbarAppItem[];
  startOpen: boolean;
  onToggleStart: () => void;
  onTaskbarAppClick: (id: string) => void;
  onCloseApp: (id: string) => void;
  onShowDesktopClick: () => void;
  onAeroPeekChange: (peeking: boolean) => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  apps,
  startOpen,
  onToggleStart,
  onTaskbarAppClick,
  onCloseApp,
  onShowDesktopClick,
  onAeroPeekChange,
}) => {
  const [orbHover, setOrbHover] = useState(false);
  const [hoveredAppId, setHoveredAppId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volumeLevel, setVolumeLevel] = useState(80);
  const [showVolumeFlyout, setShowVolumeFlyout] = useState(false);
  const [showNetworkFlyout, setShowNetworkFlyout] = useState(false);
  const [showClockFlyout, setShowClockFlyout] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  const networkFlyoutRef = useRef<HTMLDivElement>(null);
  const volumeFlyoutRef = useRef<HTMLDivElement>(null);
  const clockFlyoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (showNetworkFlyout) animateFlyoutOpen(networkFlyoutRef.current);
  }, [showNetworkFlyout]);

  useEffect(() => {
    if (showVolumeFlyout) animateFlyoutOpen(volumeFlyoutRef.current);
  }, [showVolumeFlyout]);

  useEffect(() => {
    if (showClockFlyout) animateFlyoutOpen(clockFlyoutRef.current);
  }, [showClockFlyout]);

  const formattedTime = now
    ? now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : '12:00 PM';
  const formattedDate = now
    ? now.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
      })
    : '7/16/2025';
  const fullDateLabel = now
    ? now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Wednesday, July 16, 2025';

  const visibleApps = apps.filter((a) => a.pinned || a.isOpen);

  return (
    <header
      className="w7-taskbar"
      role="navigation"
      aria-label="Taskbar"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Left: Start Orb + Superbar App Icons */}
      <div className="flex items-center h-full min-w-0">
        <button
          type="button"
          aria-label="Start"
          aria-expanded={startOpen}
          title="Start"
          onMouseEnter={() => setOrbHover(true)}
          onMouseLeave={() => setOrbHover(false)}
          onClick={() => {
            aeroSound.playClick();
            setShowNetworkFlyout(false);
            setShowVolumeFlyout(false);
            setShowClockFlyout(false);
            onToggleStart();
          }}
          className={`w7-start-btn ${startOpen ? 'active' : ''}`}
        >
          <div className="w7-start-orb-inner">
            <StartOrbIcon
              state={startOpen ? 'active' : orbHover ? 'hover' : 'normal'}
            />
          </div>
        </button>

        {/* Pinned & Running Superbar Items */}
        <div className="flex items-center h-full overflow-x-auto no-scrollbar">
          {visibleApps.map((app) => {
            const isRunning = app.isOpen;
            const isActive = app.isOpen && !app.isMinimized && app.isActive;

            return (
              <div
                key={app.id}
                className="relative h-full flex items-center"
                onMouseEnter={() => setHoveredAppId(app.id)}
                onMouseLeave={() => setHoveredAppId(null)}
              >
                <button
                  type="button"
                  aria-label={app.title}
                  onClick={() => {
                    aeroSound.playClick();
                    onTaskbarAppClick(app.id);
                  }}
                  style={{ '--btn-glow': app.glowColor } as React.CSSProperties}
                  className={`w7-taskbar-btn ${isRunning ? 'running' : ''} ${
                    isActive ? 'active' : ''
                  }`}
                >
                  <div className="w-7 h-7 flex items-center justify-center drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)]">
                    {app.icon}
                  </div>
                </button>

                {/* Live Aero Thumbnail Preview Popup on Hover */}
                {hoveredAppId === app.id && (
                  <div
                    ref={(el) => {
                      if (el) animateFlyoutOpen(el);
                    }}
                    className="hidden sm:flex flex-col w-[206px] p-2 rounded-[6px] border border-black/80 shadow-[0_8px_28px_rgba(0,0,0,0.7),inset_0_0_0_1px_rgba(255,255,255,0.55)] backdrop-blur-md z-[9600] absolute bottom-[42px] left-1/2 -translate-x-1/2"
                    style={{
                      transformOrigin: 'bottom center',
                      background:
                        'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 50%), rgba(var(--aero-glass-rgb), 0.78)',
                    }}
                  >
                    <div className="flex items-center justify-between gap-1.5 pb-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-4 h-4 shrink-0">{app.icon}</div>
                        <span className="text-[11.5px] text-white font-medium truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                          {app.title}
                        </span>
                      </div>
                      {app.isOpen && (
                        <button
                          type="button"
                          title="Close window"
                          onClick={(e) => {
                            e.stopPropagation();
                            aeroSound.playClick();
                            onCloseApp(app.id);
                            setHoveredAppId(null);
                          }}
                          className="w-4 h-4 rounded-sm bg-red-600/90 hover:bg-red-500 border border-white/50 text-white text-[10px] flex items-center justify-center cursor-pointer shrink-0"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Miniature Window Preview Thumbnail */}
                    <div
                      onClick={() => {
                        onTaskbarAppClick(app.id);
                        setHoveredAppId(null);
                      }}
                      className="h-[92px] rounded-[3px] bg-gradient-to-b from-white to-[#eef4fb] border border-black/50 shadow-inner p-2 flex flex-col justify-between cursor-pointer overflow-hidden"
                    >
                      <div className="flex items-center gap-2 border-b border-[#dbe5f0] pb-1">
                        <div className="w-5 h-5 shrink-0">{app.icon}</div>
                        <div className="text-[10.5px] font-semibold text-[#003399] truncate">
                          {app.shortLabel}
                        </div>
                      </div>
                      <div className="text-[10px] text-[#475569] line-clamp-2 leading-snug">
                        {siteConfig.name} &mdash; {siteConfig.role}
                      </div>
                      <div className="text-[9.5px] text-[#0066cc] font-medium">
                        {app.isOpen
                          ? 'Click to focus window'
                          : 'Click to launch application'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Notification Area (System Tray) + Clock + 15px Show Desktop Aero Peek */}
      <div className="flex items-center h-full shrink-0">
        <div className="hidden sm:flex items-center gap-0.5 px-1.5 h-full">
          {/* Action Center / Security Status Flag */}
          <button
            type="button"
            title="Cyber Security Center: All security systems active (15+ Certifications)"
            onClick={() => {
              aeroSound.playClick();
              onTaskbarAppClick('security');
            }}
            className="w-6 h-7 rounded hover:bg-white/15 flex items-center justify-center cursor-pointer"
          >
            <SecurityShieldIcon size={16} />
          </button>

          {/* Network Connection Flyout Button */}
          <div className="relative">
            <button
              type="button"
              title={`${siteConfig.url.replace('https://', '')} — Internet access`}
              onClick={() => {
                aeroSound.playClick();
                setShowClockFlyout(false);
                setShowVolumeFlyout(false);
                setShowNetworkFlyout(!showNetworkFlyout);
              }}
              className="w-6 h-7 rounded hover:bg-white/15 flex items-center justify-center cursor-pointer text-white"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect
                  x="2"
                  y="4"
                  width="11"
                  height="8"
                  rx="1"
                  fill="#38bdf8"
                  stroke="#fff"
                />
                <line x1="7.5" y1="12" x2="7.5" y2="15" stroke="#fff" />
                <line x1="4.5" y1="15" x2="10.5" y2="15" stroke="#fff" />
                <circle cx="15" cy="12" r="3.5" fill="#22c55e" stroke="#fff" />
              </svg>
            </button>

            {showNetworkFlyout && (
              <div
                ref={networkFlyoutRef}
                className="fixed bottom-[44px] right-12 w-[265px] rounded-[6px] border border-black/75 bg-white shadow-[0_8px_28px_rgba(0,0,0,0.55)] p-3 text-[12px] text-[#111] z-[9700]"
              >
                <div className="font-semibold text-[#003399] border-b border-[#dbe5f0] pb-1.5 mb-2 flex items-center justify-between">
                  <span>Currently connected to:</span>
                  <span className="text-[10.5px] text-[#15803d] bg-[#dcfce7] px-1.5 py-0.5 rounded">
                    Connected
                  </span>
                </div>
                <div className="space-y-1.5 mb-2.5">
                  <div className="font-semibold text-[#111]">
                    {siteConfig.name} Network
                  </div>
                  <div className="text-[11px] text-[#555]">
                    Access: Public Portfolio &amp; Direct Contact
                  </div>
                </div>
                <div className="space-y-1 border-t border-[#e2e8f0] pt-2">
                  <a
                    href={siteConfig.github.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-1 px-2 rounded hover:bg-[#eef6ff] text-[#0066cc] hover:underline"
                  >
                    🌐 GitHub ({siteConfig.github.username}) ↗
                  </a>
                  <a
                    href={siteConfig.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-1 px-2 rounded hover:bg-[#eef6ff] text-[#0066cc] hover:underline"
                  >
                    💼 LinkedIn Profile ↗
                  </a>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="block py-1 px-2 rounded hover:bg-[#eef6ff] text-[#0066cc] hover:underline"
                  >
                    ✉️ {siteConfig.contact.email}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Volume / Sound Mixer Flyout Button */}
          <div className="relative">
            <button
              type="button"
              title={
                soundEnabled
                  ? `Speakers: ${volumeLevel}%`
                  : 'Speakers: Muted'
              }
              onClick={() => {
                aeroSound.playClick();
                setShowNetworkFlyout(false);
                setShowClockFlyout(false);
                setShowVolumeFlyout(!showVolumeFlyout);
              }}
              className="w-6 h-7 rounded hover:bg-white/15 flex items-center justify-center cursor-pointer text-white"
            >
              {soundEnabled && volumeLevel > 0 ? (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path d="M3 8v4h3l4 4V4L6 8H3z" fill="#e2e8f0" />
                  <path
                    d="M13.5 7a3.5 3.5 0 010 6M15.5 4.5a7 7 0 010 11"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path d="M3 8v4h3l4 4V4L6 8H3z" fill="#94a3b8" />
                  <path
                    d="M14 7l5 6M19 7l-5 6"
                    stroke="#f87171"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>

            {showVolumeFlyout && (
              <div
                ref={volumeFlyoutRef}
                className="fixed bottom-[44px] right-8 w-[190px] rounded-[6px] border border-black/75 bg-white shadow-[0_8px_28px_rgba(0,0,0,0.55)] p-3 text-[11.5px] text-[#111] z-[9700]"
              >
                <div className="font-semibold text-[#003399] border-b border-[#dbe5f0] pb-1.5 mb-2 flex items-center justify-between">
                  <span>Speakers (Aero Audio)</span>
                  <span className="font-mono text-[11px]">
                    {soundEnabled ? `${volumeLevel}%` : 'Muted'}
                  </span>
                </div>
                <div className="flex items-center gap-2 py-1.5">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={soundEnabled ? volumeLevel : 0}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setVolumeLevel(val);
                      const active = val > 0;
                      setSoundEnabled(active);
                      aeroSound.enabled = active;
                    }}
                    className="flex-1 accent-[#0066cc] cursor-pointer"
                  />
                </div>
                <div className="pt-1.5 border-t border-[#e2e8f0] flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => {
                      const next = !soundEnabled;
                      setSoundEnabled(next);
                      aeroSound.enabled = next;
                      if (next) aeroSound.playClick();
                    }}
                    className="win7-btn !px-2.5 !py-0.5 !text-[11px]"
                  >
                    {soundEnabled ? 'Mute' : 'Unmute'}
                  </button>
                  <button
                    type="button"
                    onClick={() => aeroSound.playChime()}
                    className="text-[11px] text-[#0066cc] hover:underline"
                  >
                    Test Chime
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Clock & Date Stack */}
        <div className="relative h-full flex items-center">
          <button
            type="button"
            title={fullDateLabel}
            onClick={() => {
              aeroSound.playClick();
              setShowNetworkFlyout(false);
              setShowVolumeFlyout(false);
              setShowClockFlyout(!showClockFlyout);
            }}
            className="h-[36px] px-1.5 sm:px-2 rounded hover:bg-white/15 hover:border-white/25 border border-transparent flex flex-col items-center justify-center text-white text-[10.5px] sm:text-[11px] leading-[13.5px] cursor-pointer select-none"
          >
            <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
              {formattedTime}
            </span>
            <span className="hidden sm:inline drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
              {formattedDate}
            </span>
          </button>

          {showClockFlyout && (
            <div
              ref={clockFlyoutRef}
              style={{ transformOrigin: 'bottom right' }}
              className="fixed bottom-[44px] right-4 w-[250px] rounded-[6px] border border-black/75 bg-white shadow-[0_8px_28px_rgba(0,0,0,0.55)] p-3.5 text-[12px] text-[#111] z-[9700]"
            >
              <div className="text-center text-[#003399] font-medium border-b border-[#dbe5f0] pb-2 mb-2.5">
                {fullDateLabel}
              </div>
              <div className="flex items-center justify-around py-2">
                <div className="text-center">
                  <div className="text-[20px] font-semibold text-[#1e395b]">
                    {formattedTime}
                  </div>
                  <div className="text-[11px] text-[#64748b]">
                    {siteConfig.location}
                  </div>
                </div>
              </div>
              <div className="border-t border-[#e2e8f0] pt-2 mt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowClockFlyout(false);
                    onTaskbarAppClick('personalize');
                  }}
                  className="text-[#0066cc] hover:underline text-[11.5px]"
                >
                  Change desktop theme &amp; settings...
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Rightmost 15px Aero Peek "Show Desktop" Sliver */}
        <button
          type="button"
          aria-label="Show desktop"
          title="Show desktop (Hover for Aero Peek)"
          onMouseEnter={() => onAeroPeekChange(true)}
          onMouseLeave={() => onAeroPeekChange(false)}
          onClick={() => {
            aeroSound.playClick();
            onAeroPeekChange(false);
            onShowDesktopClick();
          }}
          className="w7-show-desktop"
        />
      </div>
    </header>
  );
};

export const TASKBAR_ICONS = {
  system: <ComputerIcon size={28} />,
  explorer: <ExplorerIcon size={28} />,
  security: <SecurityShieldIcon size={28} />,
  contact: <ContactMailIcon size={28} />,
  notepad: <NotepadIcon size={28} />,
  calculator: <CalculatorIcon size={28} />,
  paint: <PaintIcon size={28} />,
  cmd: <CmdIcon size={28} />,
  minesweeper: <MinesweeperIcon size={28} />,
  solitaire: <SolitaireIcon size={28} />,
  hearts: <HeartsIcon size={28} />,
  personalize: <PersonalizeIcon size={28} />,
};
