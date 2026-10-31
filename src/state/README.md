# OS State Store

## Overview
Central operating system state machine and React context provider managing session lifecycle (booting, login, desktop, sleeping), configurable user profiles, managed window registry, virtual file system, Recycle Bin lifecycle, and Aero Glass personalization.

## Interface
- `SessionPhase`: Session state union (`'booting' | 'login' | 'desktop' | 'sleeping'`) [src/state/os-store.tsx:SessionPhase]
- `SnapState`, `WindowPosition`, `ExplorerSection`, `WallpaperPreset`: Geometry and routing domain types [src/state/os-store.tsx]
- `AERO_COLORS`: Predefined Aero Glass color palettes with titlebar and taskbar RGB values [src/state/os-store.tsx:AERO_COLORS]
- `UserProfile`, `VirtualFile`, `ManagedWindowState`: Core operating system entity schemas [src/state/os-store.tsx]
- `buildDefaultResumeText()`: Generator compiling author resume text into virtual document storage [src/state/os-store.tsx:buildDefaultResumeText]
- `INITIAL_MANAGED_WINDOWS`: Baseline configuration for all 12 system, accessory, and game windows [src/state/os-store.tsx:INITIAL_MANAGED_WINDOWS]
- `OSProvider`: Root React provider component wrapping the desktop shell [src/state/os-store.tsx:OSProvider]
- `useOS()`: React hook exposing window manipulation, virtual file management, and personalization handlers [src/state/os-store.tsx:useOS]

## Invariants
- `useOS()` requires invocation within the subtree of an `<OSProvider />`, raising a runtime error otherwise [src/state/os-store.tsx:useOS]
- Bringing a window to the foreground monotonically increments `zIndex` above the current maximum to ensure visual stacking correctness [src/state/os-store.tsx:focusWindow]
- Deleted files preserve their originating directory in `originalFolder` when moved to `RecycleBin` to guarantee lossless restoration [src/state/os-store.tsx:deleteFileToRecycleBin]

## Side Effects
- Mutates global CSS variables on `document.documentElement` (`--aero-glass-rgb`, `--aero-taskbar-rgb`, `--aero-glass-alpha`) [src/state/os-store.tsx:useEffect]
- Triggers system chimes and clicks via `aeroSound` [src/state/os-store.tsx:aeroSound]

## Verification
- Run: `npm run lint`
