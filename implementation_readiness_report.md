# Implementation Readiness Review Report (Stage 9)

**Target**: `docs/designs/windows7_portfolio_wp7_space_cadet.md` (`DetailedRange` lines 193..288)  
**Standard**: `implementation-readiness-standard.md`  
**Reviewers**: `egm-implementation-readiness`, `egm-codebase-details`, `egm-style`  
**Verdict**: Changes Requested (4 Blocker, 6 Major, 3 Nit)

---

## Reviewer Status

| Reviewer | Status |
| --- | --- |
| `egm-implementation-readiness` | completed |
| `egm-codebase-details` | completed |
| `egm-style` | completed |

---

## Prioritized Findings

### 1. Absence of Phasing & Incremental Checkpoints — Severity: 🔴 Blocker
* **Reviewer Lens**: `egm-implementation-readiness`, `egm-codebase-details`
* **Affected Scope**: Lines 193–196 (`### Detailed Implementation Plan`)
* **Discrepancy Description**: The plan specifies a single flat sequence across 15 files without phases or buildable checkpoints, violating the standard's mandate to partition work into incremental phases that leave the codebase buildable and testable at each step. Executing 15 simultaneous changes risks broken builds (e.g. referencing uncreated game components in `registry.tsx`).
* **Rationale & Recommendation**: Partition the work into 5 sequential phases with verification gates:
  1. Phase 1: Core State Defaults & System Window (`os-store.tsx`, `SystemWindow.tsx`) -> Checkpoint: `npm run lint`.
  2. Phase 2: Viewport Hook & WP7 Mobile Shell (`useViewport.ts`, `WP7MobileShell.tsx`, `WP7Tile.tsx`, `WP7DetailModal.tsx`) -> Checkpoint: `npm run lint`.
  3. Phase 3: Space Cadet Engine & Sound (`SpaceCadetGame.tsx`, `space-cadet/index.tsx`, `AeroSound.ts`, `assets/index.tsx`) -> Checkpoint: `npm run lint`.
  4. Phase 4: Shell Integration (`AeroDesktop.tsx`, `registry.tsx`, `core/shell/index.tsx`, `Taskbar.tsx`, `StartMenu.tsx`) -> Checkpoint: `npm run build`.
  5. Phase 5: Architecture Contracts & Drift (`games/space-cadet/README.md`, `games/README.md`) -> Checkpoint: Drift validation.

### 2. Total Omission of Test & Verification Plan — Severity: 🔴 Blocker
* **Reviewer Lens**: `egm-implementation-readiness`, `egm-codebase-details`
* **Affected Scope**: Lines 193–288 (Entire Detailed Plan)
* **Discrepancy Description**: The plan contains zero test specifications or assertion criteria, violating the standard requirement for a test plan covering happy paths and edge cases.
* **Rationale & Recommendation**: Add a dedicated Test Plan with concrete unit and integration assertions:
  1. `useViewport.test.ts`: SSR default behavior, matchMedia resize listener cleanup, manual desktop/mobile toggle.
  2. `os-store.test.tsx`: Initial `sessionPhase === 'desktop'`, `?boot=1` query parameter handling, `INITIAL_MANAGED_WINDOWS` asserting `system.isOpen === true` and `explorer.isOpen === false`.
  3. `SpaceCadetGame.test.tsx`: Canvas mount lifecycle, keyboard listeners (`Z`, `/`, `Space`), flipper collision handling, and ball drain reset.

### 3. Canvas Physics Engine Left to Developer Guesswork — Severity: 🔴 Blocker
* **Reviewer Lens**: `egm-implementation-readiness`
* **Affected Scope**: Lines 240–246 (Item 7: `SpaceCadetGame.tsx`)
* **Discrepancy Description**: Item 7 states "Implements HTML5 2D canvas physics loop modeling gravity, ball velocity, bumper elastic impulse, and flipper rotation" without defining physics constants, table dimensions, flipper coordinates, scoring rules, or ball lifecycles, leaving core design decisions to the implementer.
* **Rationale & Recommendation**: Codify the physics model in the plan:
  - Table coordinate space: `width: 600`, `height: 800`.
  - Constants: `GRAVITY = 0.22`, `BALL_RADIUS = 7`, `BOUNCE_RESTITUTION = 1.35`, `MAX_VELOCITY = 18`.
  - Geometric entities: (x, y) coordinates for top 3 bumpers, slingshots, and flipper rotation angles (`restAngle: 30°`, `peakAngle: -25°`).
  - Game state interface: `{ score: number, ballsLeft: number, isGameOver: boolean, tiltWarnings: number }`.

### 4. Missing Target Scope Modification for Desktop Shortcut Registration — Severity: 🔴 Blocker
* **Reviewer Lens**: `egm-codebase-details`
* **Affected Scope**: Lines 252–257 (Item 9) & `src/core/shell/index.tsx`
* **Discrepancy Description**: Desktop shortcuts are hardcoded in `src/core/shell/index.tsx` in the `desktopIcons` array. `src/core/shell/index.tsx` was omitted from the Target Files list, so Space Cadet would never appear on the desktop grid.
* **Rationale & Recommendation**: Add `src/core/shell/index.tsx` to the Target Files list (Modify) to register the Space Cadet shortcut in `desktopIcons`.

### 5. Incomplete `ManagedWindowState` Schema & SSR Query Flash — Severity: 🟡 Major
* **Reviewer Lens**: `egm-implementation-readiness`, `egm-codebase-details`
* **Affected Scope**: Lines 199–206 (Item 1: `os-store.tsx`)
* **Discrepancy Description**: Registering `space-cadet` omits 5 mandatory properties of `ManagedWindowState`. Also, evaluating `?boot=1` in `useEffect` causes a visual flash.
* **Rationale & Recommendation**: Provide the full 10-property object in the plan:
  ```ts
  {
    id: 'space-cadet',
    title: '3D Pinball for Windows - Space Cadet',
    shortLabel: 'Space Cadet',
    glowColor: 'rgba(168, 85, 247, 0.65)',
    isOpen: false,
    isMinimized: false,
    zIndex: 25,
    snap: 'none',
    defaultPos: { x: 260, y: 30, width: 620, height: 620 },
    pinned: true,
  }
  ```
  Specify SSR-safe initialization.

### 6. `useViewport` Hook State Disconnection Across Shells — Severity: 🟡 Major
* **Reviewer Lens**: `egm-implementation-readiness`, `egm-codebase-details`
* **Affected Scope**: Lines 213–227, 263–268 (Items 3, 4, 11)
* **Discrepancy Description**: Hook-local `forcedMode` state leaves independent hook calls disconnected between `AeroDesktop` and `WP7MobileShell`.
* **Rationale & Recommendation**: Pass the callback down via props:
  ```ts
  export interface WP7MobileShellProps {
    onSwitchToDesktop: () => void;
  }
  ```
  `AeroDesktop.tsx` invokes `useViewport()` and passes `onSwitchToDesktop={() => toggleMode('desktop')}` down to `WP7MobileShell`.

### 7. Non-Existent Static Resume Asset & Undefined Action Bar Handlers — Severity: 🟡 Major
* **Reviewer Lens**: `egm-implementation-readiness`, `egm-codebase-details`
* **Affected Scope**: Lines 207–212 (Item 2: `SystemWindow.tsx`)
* **Discrepancy Description**: Citing static file `/Resume_Mohamed_Elsheikh.pdf` or `.txt` references files that do not exist; resume generation in Notepad uses dynamic in-memory Blobs. Also, action link click handlers are unspecified.
* **Rationale & Recommendation**: Specify exact execution handlers:
  - Resume TXT: launch Notepad with resume via `onOpenWindow('notepad')` or trigger dynamic in-memory text blob download.
  - WhatsApp: `window.open('https://wa.me/201021464357', '_blank')`.
  - Credentials: `onOpenWindow('security')`.
  - Projects: `onOpenExplorerSection('projects')`.

### 8. Undocumented Audio Method Signatures and Missing Component Wiring — Severity: 🟡 Major
* **Reviewer Lens**: `egm-codebase-details`
* **Affected Scope**: Lines 240–246, 279–283 (Items 7, 14)
* **Discrepancy Description**: `AeroSound.ts` currently only has `playClick()` and `playChime()`. The new pinball audio methods lack concrete method signatures and synthesis parameters.
* **Rationale & Recommendation**: Define method signatures (`playPinballFlipper()`, `playPinballBumper()`, `playPinballPlunger()`, `playPinballTilt()`) with Web Audio oscillator frequencies, gain decay envelopes, and invocation points in the physics loop.

### 9. Missing TypeScript Props for WP7 Tile & Modal Components — Severity: 🟡 Major
* **Reviewer Lens**: `egm-implementation-readiness`
* **Affected Scope**: Lines 228–239 (Items 5, 6)
* **Discrepancy Description**: Prop interfaces and 3D tilt trigonometry for WP7 tiles and modal sheets are omitted.
* **Rationale & Recommendation**: Define `WP7TileProps` and `WP7DetailModalProps` explicitly, along with the tilt formula: `rotateX = ((touchY - centerY) / height) * -20deg`, `rotateY = ((touchX - centerX) / width) * 20deg`.

### 10. Unspecified Mobile Game Execution Mechanism & Omitted `next/dynamic` Adapter — Severity: 🟡 Major
* **Reviewer Lens**: `egm-codebase-details`
* **Affected Scope**: Lines 184, 220–227, 247–251 (Items 4, 8)
* **Discrepancy Description**: NFR mandates lazy loading via `next/dynamic` with `{ ssr: false }`, but Item 8 omits this wrapper. Furthermore, mobile game presentation within WP7 detail modal is unspecified.
* **Rationale & Recommendation**: Include `dynamic(() => import('./SpaceCadetGame'), { ssr: false })` in `src/games/space-cadet/index.tsx`, and specify that games on mobile open inside a full-screen `WP7DetailModal`.

### 11. Shell Path Reference Mismatch (`DesktopShell.tsx` vs `index.tsx`) — Severity: 🟢 Nit
* **Reviewer Lens**: `egm-implementation-readiness`
* **Affected Scope**: Line 266 (Item 11)
* **Discrepancy Description**: Item 11 cites `src/core/shell/DesktopShell.tsx`. The actual path is `src/core/shell/index.tsx`.
* **Rationale & Recommendation**: Correct the path reference.

### 12. Undocumented Canvas Loop Pausing on Window Minimize / Blur — Severity: 🟢 Nit
* **Reviewer Lens**: `egm-codebase-details`
* **Affected Scope**: Lines 240–246 (Item 7)
* **Discrepancy Description**: Loop does not pause when minimized or tab is blurred, wasting CPU/battery.
* **Rationale & Recommendation**: Hook `requestAnimationFrame` to `document.hidden` and `ManagedWindowState.isMinimized`.

### 13. Style Simplifications & Buzzword Removal — Severity: 🟢 Nit
* **Reviewer Lens**: `egm-style`
* **Affected Scope**: Lines 195, 210–211, 218, 231, 238, 241
* **Discrepancy Description**: Remove unprovable claims ("without cross-module regressions"), corporate buzzwords ("executive callouts"), and marketing adjectives ("authentic WP7").
* **Rationale & Recommendation**: Apply direct, factual phrasing across implementation item descriptions.
