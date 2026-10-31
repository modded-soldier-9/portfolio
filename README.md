# Mohamed Elsheikh Portfolio Blueprint

## System Overview
Web-based portfolio and authentic Windows 7 Aero desktop simulation built with Next.js 15, React 19, TypeScript, Tailwind CSS, and GreenSock (GSAP). The architecture features a modular operating system model incorporating a BIOS-less boot sequence, logon screen with customizable user profile, Aero Glass window manager with Aero Snap docking, desktop shell with Superbar taskbar and Start Menu, classic accessories (Calculator, File Explorer, Notepad, MS Paint), and authentic Windows 7 games (Hearts, Minesweeper, Solitaire).

## Subdirectories & System Boundaries
- [Source Subsystem (src)](./src/README.md) - Primary application source tree encompassing Next.js routing, core operating system services, classic accessories, games, UI components, and state management

## Global Invariants
- All operating system visual assets, icons, window controls, and game cards are 100% vector SVG without raster image dependencies [src/core/assets]
- Applications and games communicate exclusively through the shared window manager contract (`AppModuleContract`) and global OS state store (`useOS()`) without direct cross-module coupling [src/apps/registry.tsx, src/state/os-store.tsx]
- Window minimization preserves the mounted React component subtree in the DOM via `display: none` to guarantee zero state loss for unsaved text, canvas artwork, or in-progress game deals [src/core/window-manager/index.tsx]
- Interactive animations adhere strictly to duration caps under 240ms and immediately resolve when `prefers-reduced-motion` is detected [src/core/animation/index.ts]

## Global Side Effects
- Local Storage: Persists user theme preference (`theme`) and Minesweeper high score records (`w7_minesweeper_scores`) [src/contexts/ThemeContext.tsx, src/games/minesweeper/index.tsx]
- Document Root Styling: Dynamically injects Aero Glass RGB and alpha variables on `document.documentElement` (`--aero-glass-rgb`, `--aero-taskbar-rgb`, `--aero-glass-alpha`) [src/state/os-store.tsx]
- Audio Hardware: Synthesizes procedural UI sound effects (clicks, chimes) via client Web Audio API [src/components/AeroSound.ts]
- Analytics: Mounts Vercel Web Analytics tracking beacons on page load [src/app/layout.tsx]

## System Verification
- Run: `npm run lint && npm run build`
