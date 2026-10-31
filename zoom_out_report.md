# Zoom Out Review Report

**Target**: `docs/designs/windows7_portfolio_wp7_space_cadet.md` (`full file`, lines 1..288)  
**Standard**: `zoom-out-standard.md`  
**Reviewer**: `egm-zoom-out` (Skeptical Architect)  
**Status**: Changes Requested (1 Blocker, 2 Major, 1 Nit)

---

## Reviewer Status

| Reviewer | Status |
| --- | --- |
| `egm-zoom-out` | completed |

---

## Prioritized Findings

### 1. Scope Bloat & YAGNI Violation: Space Cadet Pinball Physics Engine — Severity: 🔴 Blocker
* **Reviewer Lens**: `egm-zoom-out`
* **Affected Scope**: Lines 24, 30, 35, 52–57, 133–144, 167–172, 240–251, 279–289 (Section 5 & Target Files 7, 8, 10, 12–15)
* **Discrepancy Description**: The stated root problem is recruiter bounce rate (10s boot friction) and broken mobile touch layouts. Writing a custom 2D pinball physics engine (canvas gravity, ball velocity, bumper elastic impulse, flipper rotational dynamics, mission ranks, synthetic Web Audio solenoids) does not address recruiter conversion.
* **Rationale & Recommendation**: The repo already ships 3 classic games (`minesweeper`, `solitaire`, `hearts`). Bundling an entire from-scratch physics engine into an urgent portfolio UX PR creates significant maintenance burden and regression surface. Cut Space Cadet Pinball from this design entirely; decouple it into a separate, non-urgent RFC if desired later.

### 2. Architectural Duality & Over-Engineering: Windows Phone 7 Mobile Shell — Severity: 🟡 Major
* **Reviewer Lens**: `egm-zoom-out`
* **Affected Scope**: Lines 23, 84–90, 112–132, 155–166, 220–239 (Section 4 & Target Files 4, 5, 6)
* **Discrepancy Description**: Introducing a separate mobile operating system shell (`src/mobile/wp7/`) with panoramic horizontal swipe drag, 3D tilt trigonometry, and custom slide-in modal sheets (`WP7DetailModal.tsx`) forces every future feature and window to be maintained twice. Furthermore, drawing a synthetic vector mobile status bar (cellular signal, Wi-Fi, battery, clock) directly underneath the visitor's real smartphone status bar wastes vertical screen height on mobile viewports.
* **Rationale & Recommendation**: `AeroWindow` already implements `snap: 'maximize'`. On `<768px`, auto-maximize the active window or use responsive flex/grid adaptations inside the existing `DesktopShell`. If tile navigation is desired, implement it as a view inside `SystemWindow.tsx` rather than maintaining two competing operating systems.

### 3. Premature Altitude Drops & Implementation Weeds — Severity: 🟡 Major
* **Reviewer Lens**: `egm-zoom-out`
* **Affected Scope**: Lines 95, 98, 125, 140, 204, 231 (Sections 2, 4, 5)
* **Discrepancy Description**: The architecture document hardcodes brittle source file line numbers (`os-store.tsx:412`), specific pixel coordinates (`{ x: 260, y: 35, width: 840, height: 570 }`), CSS transform strings (`transform: perspective(600px)...`), and keyboard scan codes (`Z`, `/`, `Space`).
* **Rationale & Recommendation**: High-level designs must specify interfaces, data flows, and state transitions, not line numbers or CSS formulas.

### 4. SSR-Safe URL Query Parameter Handling — Severity: 🟢 Nit
* **Reviewer Lens**: `egm-zoom-out`
* **Affected Scope**: Lines 96, 202–203 (Section 2 & Implementation Plan Target File 1)
* **Discrepancy Description**: Reading `window.location.search` directly in `OSProvider` during mount risks React 19 / Next.js 15 hydration mismatches.
* **Rationale & Recommendation**: Use standard Next.js search param hooks or ensure execution is strictly client-side deferred.
