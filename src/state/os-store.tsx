'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { siteConfig } from '@/config/site';
import { experiences } from '@/data/experience';
import { projects } from '@/data/projects';
import { certificationGroups } from '@/data/certifications';
import { education } from '@/data/education';
import { aeroSound } from '@/components/AeroSound';

export type SessionPhase = 'booting' | 'login' | 'desktop' | 'sleeping';

export type SnapState = 'none' | 'maximized' | 'left' | 'right';

export interface WindowPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ExplorerSection =
  | 'overview'
  | 'projects'
  | 'experience'
  | 'skills'
  | 'certifications'
  | 'mentorship'
  | 'documents'
  | 'pictures'
  | 'computer'
  | 'recycle';

export type WallpaperPreset = 'harmony' | 'aurora' | 'security' | 'bliss';

export interface AeroColorOption {
  name: string;
  rgb: string;
  taskbarRgb: string;
  swatch: string;
}

export const AERO_COLORS: AeroColorOption[] = [
  { name: 'Sky Blue (Default)', rgb: '58, 122, 196', taskbarRgb: '14, 38, 68', swatch: '#3a7ac4' },
  { name: 'Twilight Sapphire', rgb: '28, 76, 160', taskbarRgb: '10, 26, 58', swatch: '#1c4ca0' },
  { name: 'Seafoam Teal', rgb: '20, 148, 160', taskbarRgb: '8, 48, 56', swatch: '#1494a0' },
  { name: 'Emerald Leaf', rgb: '38, 142, 78', taskbarRgb: '12, 48, 28', swatch: '#268e4e' },
  { name: 'Ruby Crimson', rgb: '175, 42, 58', taskbarRgb: '56, 12, 18', swatch: '#af2a3a' },
  { name: 'Violet Aura', rgb: '118, 62, 175', taskbarRgb: '36, 16, 58', swatch: '#763eaf' },
  { name: 'Amber Gold', rgb: '192, 128, 24', taskbarRgb: '54, 34, 8', swatch: '#c08018' },
  { name: 'Frost Graphite', rgb: '75, 85, 99', taskbarRgb: '24, 28, 34', swatch: '#4b5563' },
];

export interface UserProfile {
  name: string;
  role: string;
  avatarUrl: string;
  useVectorAvatar: boolean;
  passwordHint: string;
}

export interface VirtualFile {
  id: string;
  name: string;
  folder: 'Documents' | 'Pictures' | 'Desktop' | 'RecycleBin';
  originalFolder?: 'Documents' | 'Pictures' | 'Desktop';
  type: 'txt' | 'paint';
  content: string;
  size: string;
  modifiedAt: string;
}

export interface ManagedWindowState {
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

export function buildDefaultResumeText(): string {
  const lines = [
    `========================================================================`,
    `${siteConfig.name.toUpperCase()} — ${siteConfig.role.toUpperCase()}`,
    `Location : ${siteConfig.location}`,
    `Email    : ${siteConfig.contact.email} | Phone/WA: ${siteConfig.contact.phoneDisplay}`,
    `GitHub   : ${siteConfig.github.url} | LinkedIn: ${siteConfig.linkedin}`,
    `========================================================================`,
    ``,
    `SUMMARY`,
    `${siteConfig.tagline}`,
    `Quick Stats: 8+ yrs experience | 15+ certifications | BSc CS & IT`,
    ``,
    `EXPERIENCE`,
    ...experiences.flatMap((exp) => [
      `• ${exp.title} — ${exp.company} (${exp.duration})`,
      `  ${exp.description}`,
      ...(exp.achievements.length ? [`  Achievements: ${exp.achievements.join(' · ')}`] : []),
      `  Skills: ${exp.skills.join(', ')}`,
      ``,
    ]),
    `PROJECTS`,
    ...projects.flatMap((proj) => [
      `• ${proj.name} [${proj.type}] — Tech: ${proj.tech.join(', ')}`,
      `  ${proj.description}`,
      ...(proj.liveUrl ? [`  Live: ${proj.liveUrl}`] : []),
      ...(proj.githubUrl ? [`  Source: ${proj.githubUrl}`] : []),
      ``,
    ]),
    `SKILLS`,
    `• Security    : Threat Detection, Vulnerability Assessment, Penetration Testing, Network Security, API Security, Security Auditing`,
    `• Cloud & Ops : AWS, Cloud Architecture, Linux, System Administration, Disaster Recovery`,
    `• Development : Python, JavaScript, TypeScript, Next.js, React, SQL, API Development, HTML/CSS`,
    ``,
    `EDUCATION`,
    ...education.map(
      (edu) => `• ${edu.degree} — ${edu.institution} ${edu.duration ? `(${edu.duration})` : ''}`
    ),
    ``,
    `MENTORSHIP`,
    `• Mentored student teams at AFRITECH — three groups secured top-3 finishes building cashless campus payment solutions.`,
    `• Delivers talks on cybersecurity careers and technical problem-solving.`,
    ``,
    `CERTIFICATIONS (15 VERIFIED CREDENTIALS)`,
    ...certificationGroups.flatMap((grp) => [
      `[${grp.title}]`,
      ...grp.certifications.map((c) => `  - ${c.name} (${c.issuer}, ${c.issued.split(' |')[0]})`),
    ]),
  ];
  return lines.join('\n');
}

const INITIAL_VIRTUAL_FILES: VirtualFile[] = [
  {
    id: 'file-resume',
    name: 'Resume_Mohamed_Elsheikh.txt',
    folder: 'Documents',
    type: 'txt',
    content: buildDefaultResumeText(),
    size: '4.2 KB',
    modifiedAt: '7/16/2025 12:00 PM',
  },
  {
    id: 'file-sec-notes',
    name: 'Security_Audit_Checklist.txt',
    folder: 'Documents',
    type: 'txt',
    content: [
      '=== QODEX & QUOTA LIBEX SECURITY AUDIT PLAYBOOK ===',
      'Author: Mohamed Elsheikh (Independent Security Researcher)',
      '',
      '1. Reconnaissance & Attack Surface Mapping',
      '   - Enumerate subdomains, API routes, and cloud storage buckets.',
      '   - Verify TLS 1.3 enforcement and strict HSTS headers.',
      '',
      '2. Authentication & Session Hardening',
      '   - Check JWT signature verification, token rotation, and RBAC boundaries.',
      '   - Audit rate limiting on login and password reset endpoints.',
      '',
      '3. Automated Honeypot & Threat Telemetry',
      '   - Monitor SSH/HTTP honeypot sensors for credential stuffing & CVE probes.',
      '   - Result: 40% reduction in security incidents across production workloads.',
    ].join('\n'),
    size: '1.8 KB',
    modifiedAt: '7/15/2025 04:30 PM',
  },
  {
    id: 'file-win7-readme',
    name: 'Windows7_Aero_Architecture.txt',
    folder: 'Documents',
    type: 'txt',
    content: [
      'WINDOWS 7 AERO SIMULATION — SYSTEM NOTES',
      '=========================================',
      '• Built with modular architecture (/core, /apps, /games, /state).',
      '• Powered by GSAP timelines and 100% vector SVG assets.',
      '• Classic Applications: Notepad, Calculator, MS Paint, File Explorer, Command Prompt.',
      '• Included Games: Minesweeper, Solitaire (Klondike), and Hearts.',
    ].join('\n'),
    size: '1.1 KB',
    modifiedAt: '7/16/2025 09:15 AM',
  },
  {
    id: 'file-paint-sketch',
    name: 'ZeroTrust_Diagram.png',
    folder: 'Pictures',
    type: 'paint',
    content: 'preset:zerotrust',
    size: '28.4 KB',
    modifiedAt: '7/14/2025 06:20 PM',
  },
  {
    id: 'file-recycled-1',
    name: 'Deprecated_Telnet_Policy.txt',
    folder: 'RecycleBin',
    originalFolder: 'Documents',
    type: 'txt',
    content: 'Legacy telnet configuration retired in favor of hardened SSHv2 bastions with MFA.',
    size: '0.6 KB',
    modifiedAt: '6/01/2025 11:10 AM',
  },
];

export const INITIAL_MANAGED_WINDOWS: ManagedWindowState[] = [
  {
    id: 'explorer',
    title: `${siteConfig.name} — Windows Explorer`,
    shortLabel: 'File Explorer',
    glowColor: 'rgba(250, 204, 21, 0.62)',
    isOpen: true,
    isMinimized: false,
    zIndex: 20,
    snap: 'none',
    defaultPos: { x: 196, y: 18, width: 885, height: 575 },
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
    defaultPos: { x: 262, y: 42, width: 790, height: 535 },
    pinned: true,
  },
  {
    id: 'notepad',
    title: `Resume_Mohamed_Elsheikh.txt — Notepad`,
    shortLabel: 'Notepad',
    glowColor: 'rgba(34, 211, 238, 0.62)',
    isOpen: false,
    isMinimized: false,
    zIndex: 18,
    snap: 'none',
    defaultPos: { x: 240, y: 46, width: 710, height: 505 },
    pinned: true,
  },
  {
    id: 'calculator',
    title: 'Calculator',
    shortLabel: 'Calculator',
    glowColor: 'rgba(96, 165, 250, 0.65)',
    isOpen: false,
    isMinimized: false,
    zIndex: 17,
    snap: 'none',
    defaultPos: { x: 360, y: 80, width: 320, height: 430 },
    pinned: true,
  },
  {
    id: 'paint',
    title: 'Untitled - Paint',
    shortLabel: 'Paint',
    glowColor: 'rgba(244, 114, 182, 0.65)',
    isOpen: false,
    isMinimized: false,
    zIndex: 16,
    snap: 'none',
    defaultPos: { x: 210, y: 34, width: 820, height: 560 },
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
    id: 'cmd',
    title: `Administrator: C:\\Windows\\System32\\cmd.exe`,
    shortLabel: 'Command Prompt',
    glowColor: 'rgba(148, 163, 184, 0.6)',
    isOpen: false,
    isMinimized: false,
    zIndex: 13,
    snap: 'none',
    defaultPos: { x: 270, y: 74, width: 680, height: 440 },
    pinned: false,
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    shortLabel: 'Minesweeper',
    glowColor: 'rgba(59, 130, 246, 0.68)',
    isOpen: false,
    isMinimized: false,
    zIndex: 12,
    snap: 'none',
    defaultPos: { x: 300, y: 52, width: 520, height: 510 },
    pinned: false,
  },
  {
    id: 'solitaire',
    title: 'Solitaire',
    shortLabel: 'Solitaire',
    glowColor: 'rgba(34, 197, 94, 0.68)',
    isOpen: false,
    isMinimized: false,
    zIndex: 12,
    snap: 'none',
    defaultPos: { x: 195, y: 24, width: 840, height: 575 },
    pinned: false,
  },
  {
    id: 'hearts',
    title: 'Hearts',
    shortLabel: 'Hearts',
    glowColor: 'rgba(239, 68, 68, 0.68)',
    isOpen: false,
    isMinimized: false,
    zIndex: 12,
    snap: 'none',
    defaultPos: { x: 215, y: 28, width: 800, height: 565 },
    pinned: false,
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

interface OSContextValue {
  // Session & Power
  sessionPhase: SessionPhase;
  setSessionPhase: (phase: SessionPhase) => void;
  userProfile: UserProfile;
  updateUserProfile: (patch: Partial<UserProfile>) => void;
  completeBoot: () => void;
  loginToDesktop: () => void;
  skipToDesktop: () => void;
  lockOrLogOff: () => void;
  sleepSystem: () => void;
  restartSystem: () => void;

  // Windows
  windows: ManagedWindowState[];
  activeWindowId: string | null;
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  setWindowSnap: (id: string, snap: SnapState) => void;
  updateWindowTitle: (id: string, title: string) => void;
  handleTaskbarAppClick: (id: string) => void;
  toggleShowDesktop: () => void;
  resetDesktop: () => void;

  // Explorer & App Payloads
  explorerSection: ExplorerSection;
  setExplorerSection: (sec: ExplorerSection) => void;
  openExplorerAt: (sec: ExplorerSection) => void;
  activeNotepadFileId: string;
  openFileInNotepad: (fileId: string) => void;
  activePaintFileId: string;
  openFileInPaint: (fileId: string) => void;

  // Virtual File System & Recycle Bin
  files: VirtualFile[];
  saveVirtualFile: (file: Omit<VirtualFile, 'id' | 'modifiedAt'> & { id?: string }) => VirtualFile;
  deleteFileToRecycleBin: (id: string) => void;
  restoreFileFromRecycleBin: (id: string) => void;
  emptyRecycleBin: () => void;

  // Personalization
  wallpaper: WallpaperPreset;
  setWallpaper: (wp: WallpaperPreset) => void;
  glassColor: AeroColorOption;
  setGlassColor: (c: AeroColorOption) => void;
  glassOpacity: number;
  setGlassOpacity: (alpha: number) => void;
  showGadgets: boolean;
  setShowGadgets: (show: boolean) => void;
}

const OSContext = createContext<OSContextValue | null>(null);

export const OSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionPhase, setSessionPhase] = useState<SessionPhase>('booting');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: siteConfig.name,
    role: siteConfig.role,
    avatarUrl: '/personal.jpg',
    useVectorAvatar: false,
    passwordHint: 'Press Enter or click the blue arrow (type "wrong" to test invalid password shake)',
  });

  const [windows, setWindows] = useState<ManagedWindowState[]>(INITIAL_MANAGED_WINDOWS);
  const [explorerSection, setExplorerSection] = useState<ExplorerSection>('overview');
  const [activeNotepadFileId, setActiveNotepadFileId] = useState<string>('file-resume');
  const [activePaintFileId, setActivePaintFileId] = useState<string>('file-paint-sketch');
  const [files, setFiles] = useState<VirtualFile[]>(INITIAL_VIRTUAL_FILES);

  const [wallpaper, setWallpaper] = useState<WallpaperPreset>('harmony');
  const [glassColor, setGlassColor] = useState<AeroColorOption>(AERO_COLORS[0]);
  const [glassOpacity, setGlassOpacity] = useState<number>(0.58);
  const [showGadgets, setShowGadgets] = useState<boolean>(true);

  // Sync Aero Glass CSS variables to document root
  useEffect(() => {
    document.documentElement.style.setProperty('--aero-glass-rgb', glassColor.rgb);
    document.documentElement.style.setProperty('--aero-taskbar-rgb', glassColor.taskbarRgb);
    document.documentElement.style.setProperty('--aero-glass-alpha', String(glassOpacity));
  }, [glassColor, glassOpacity]);

  const updateUserProfile = useCallback((patch: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const completeBoot = useCallback(() => {
    setSessionPhase('login');
  }, []);

  const loginToDesktop = useCallback(() => {
    aeroSound.playChime();
    setSessionPhase('desktop');
  }, []);

  const skipToDesktop = useCallback(() => {
    setSessionPhase('desktop');
  }, []);

  const lockOrLogOff = useCallback(() => {
    aeroSound.playClick();
    setSessionPhase('login');
  }, []);

  const sleepSystem = useCallback(() => {
    aeroSound.playClick();
    setSessionPhase('sleeping');
  }, []);

  const restartSystem = useCallback(() => {
    aeroSound.playClick();
    setSessionPhase('booting');
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const maxZ = prev.reduce((m, w) => Math.max(m, w.zIndex), 10);
      return prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1 } : w));
    });
  }, []);

  const openWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const maxZ = prev.reduce((m, w) => Math.max(m, w.zIndex), 10);
      return prev.map((w) =>
        w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 } : w
      );
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isOpen: false, isMinimized: false, snap: 'none' } : w))
    );
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)));
  }, []);

  const setWindowSnap = useCallback((id: string, snap: SnapState) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, snap } : w)));
  }, []);

  const updateWindowTitle = useCallback((id: string, title: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, title } : w)));
  }, []);

  const openExplorerAt = useCallback(
    (sec: ExplorerSection) => {
      setExplorerSection(sec);
      openWindow('explorer');
    },
    [openWindow]
  );

  const openFileInNotepad = useCallback(
    (fileId: string) => {
      const found = files.find((f) => f.id === fileId);
      setActiveNotepadFileId(fileId);
      if (found) {
        updateWindowTitle('notepad', `${found.name} — Notepad`);
      }
      openWindow('notepad');
    },
    [files, openWindow, updateWindowTitle]
  );

  const openFileInPaint = useCallback(
    (fileId: string) => {
      const found = files.find((f) => f.id === fileId);
      setActivePaintFileId(fileId);
      if (found) {
        updateWindowTitle('paint', `${found.name} - Paint`);
      }
      openWindow('paint');
    },
    [files, openWindow, updateWindowTitle]
  );

  const activeWindowId = useMemo(() => {
    const openVisible = windows.filter((w) => w.isOpen && !w.isMinimized);
    if (openVisible.length === 0) return null;
    return openVisible.reduce((top, curr) => (curr.zIndex > top.zIndex ? curr : top)).id;
  }, [windows]);

  const handleTaskbarAppClick = useCallback(
    (id: string) => {
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

  const toggleShowDesktop = useCallback(() => {
    setWindows((prev) => {
      const anyVisible = prev.some((w) => w.isOpen && !w.isMinimized);
      return prev.map((w) => (w.isOpen ? { ...w, isMinimized: anyVisible } : w));
    });
  }, []);

  const resetDesktop = useCallback(() => {
    aeroSound.playChime();
    setWindows(INITIAL_MANAGED_WINDOWS);
    setExplorerSection('overview');
  }, []);

  const saveVirtualFile = useCallback(
    (input: Omit<VirtualFile, 'id' | 'modifiedAt'> & { id?: string }): VirtualFile => {
      const nowStr = new Date().toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
      const fileId = input.id || `file-${Date.now()}`;
      const newFile: VirtualFile = {
        id: fileId,
        name: input.name,
        folder: input.folder,
        type: input.type,
        content: input.content,
        size: input.size || `${Math.max(1, Math.round(input.content.length / 256) / 4)} KB`,
        modifiedAt: nowStr,
      };
      setFiles((prev) => {
        const exists = prev.some((f) => f.id === fileId);
        if (exists) {
          return prev.map((f) => (f.id === fileId ? newFile : f));
        }
        return [newFile, ...prev];
      });
      return newFile;
    },
    []
  );

  const deleteFileToRecycleBin = useCallback((id: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id && f.folder !== 'RecycleBin'
          ? { ...f, originalFolder: f.folder, folder: 'RecycleBin' }
          : f
      )
    );
  }, []);

  const restoreFileFromRecycleBin = useCallback((id: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id && f.folder === 'RecycleBin'
          ? { ...f, folder: f.originalFolder || 'Documents', originalFolder: undefined }
          : f
      )
    );
  }, []);

  const emptyRecycleBin = useCallback(() => {
    aeroSound.playClick();
    setFiles((prev) => prev.filter((f) => f.folder !== 'RecycleBin'));
  }, []);

  const value = useMemo<OSContextValue>(
    () => ({
      sessionPhase,
      setSessionPhase,
      userProfile,
      updateUserProfile,
      completeBoot,
      loginToDesktop,
      skipToDesktop,
      lockOrLogOff,
      sleepSystem,
      restartSystem,
      windows,
      activeWindowId,
      openWindow,
      closeWindow,
      minimizeWindow,
      focusWindow,
      setWindowSnap,
      updateWindowTitle,
      handleTaskbarAppClick,
      toggleShowDesktop,
      resetDesktop,
      explorerSection,
      setExplorerSection,
      openExplorerAt,
      activeNotepadFileId,
      openFileInNotepad,
      activePaintFileId,
      openFileInPaint,
      files,
      saveVirtualFile,
      deleteFileToRecycleBin,
      restoreFileFromRecycleBin,
      emptyRecycleBin,
      wallpaper,
      setWallpaper,
      glassColor,
      setGlassColor,
      glassOpacity,
      setGlassOpacity,
      showGadgets,
      setShowGadgets,
    }),
    [
      sessionPhase,
      userProfile,
      updateUserProfile,
      completeBoot,
      loginToDesktop,
      skipToDesktop,
      lockOrLogOff,
      sleepSystem,
      restartSystem,
      windows,
      activeWindowId,
      openWindow,
      closeWindow,
      minimizeWindow,
      focusWindow,
      setWindowSnap,
      updateWindowTitle,
      handleTaskbarAppClick,
      toggleShowDesktop,
      resetDesktop,
      explorerSection,
      openExplorerAt,
      activeNotepadFileId,
      openFileInNotepad,
      activePaintFileId,
      openFileInPaint,
      files,
      saveVirtualFile,
      deleteFileToRecycleBin,
      restoreFileFromRecycleBin,
      emptyRecycleBin,
      wallpaper,
      glassColor,
      glassOpacity,
      showGadgets,
    ]
  );

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
};

export function useOS(): OSContextValue {
  const ctx = useContext(OSContext);
  if (!ctx) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return ctx;
}
