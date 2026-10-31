# Intermediate Zoom Out Review Report (Stage 8)

**Target**: `docs/designs/windows7_portfolio_wp7_space_cadet.md` (`full file`, lines 1..288)  
**Standard**: `zoom-out-standard.md`  
**Reviewer**: `egm-zoom-out` (Skeptical Architect)  
**Prior Reports Ingested**: `zoom_out_report.md`, `comprehension_report.md`, `critic_report.md`  
**Status**: Changes Requested (0 Blocker, 3 Major, 2 Nit)

---

## Reviewer Status

| Reviewer | Status |
| --- | --- |
| `egm-zoom-out` | completed |

---

## Prioritized Findings

### 1. Speculative Game Complexity & Mission Progression — Severity: 🟡 Major
* **Reviewer Lens**: `egm-zoom-out`
* **Affected Scope**: Section 5 (`src/games/space-cadet/`, lines 24, 133–144, 240–246)
* **Discrepancy Description**: Custom 2D canvas physics simulation and multi-stage Space Cadet mission progression (Cadet ranks, hyperspace ramps, wormholes) is speculative complexity (YAGNI). It does not serve the root goal of lowering recruiter bounce rate (CUJ 1).
* **Rationale & Recommendation**: Scope Space Cadet down to an arcade table with simplified flipper/bumper impulses and a single score counter; defer complex multi-tier mission state machines.

### 2. Architectural Duplication in Mobile Navigation — Severity: 🟡 Major
* **Reviewer Lens**: `egm-zoom-out`
* **Affected Scope**: Section 4 (`src/mobile/wp7/`, lines 84–90, 118–132, 220–239)
* **Discrepancy Description**: The proposal specifies both a panoramic horizontal swipe pivot (`overview | security | projects | games | contact`) AND a 2-column live tile grid with detail sheets covering the exact same 5 categories. This creates gesture contention (horizontal swipe vs tile touch/scroll) and redundant code.
* **Rationale & Recommendation**: Standardize on the authentic WP7 Start Screen layout (vertical live tile grid with 3D tilt opening detail sheets) and remove the redundant horizontal pivot.

### 3. Client-Side Viewport Shell Swapping Layout Shift (CLS) — Severity: 🟡 Major
* **Reviewer Lens**: `egm-zoom-out`
* **Affected Scope**: Section 1 & 4 (`src/hooks/useViewport.ts`, `src/components/AeroDesktop.tsx`, lines 64–73, 115–117, 213–219)
* **Discrepancy Description**: Branching `<DesktopShell />` vs `<WP7MobileShell />` via client-side `useViewport()` hook causes Cumulative Layout Shift (CLS) and a visible flash of the desktop shell on mobile devices during React hydration.
* **Rationale & Recommendation**: Avoid complex server-side device detection or custom hydration wrappers. Use responsive CSS display rules (`hidden md:block` and `block md:hidden`) on the shell containers to achieve zero-CLS shell switching with zero JavaScript overhead.

### 4. Silent Desktop Landing Audio Policy — Severity: 🟢 Nit
* **Reviewer Lens**: `egm-zoom-out`
* **Affected Scope**: Section 2 & 5 (`src/state/os-store.tsx`, `src/components/AeroSound.ts`, lines 95–97, 142, 279–283)
* **Discrepancy Description**: Direct landing with `sessionPhase: 'desktop'` must remain strictly silent. Browsers block autoplay audio without user interaction, and unexpected sound harms recruiter retention.
* **Rationale & Recommendation**: Ensure `aeroSound.playChime()` is only invoked on manual logon or explicit button actions. Do not add speculative audio-unlocker dialogs.

### 5. Missing Risks Section & Inaccurate Repo Paths — Severity: 🟢 Nit
* **Reviewer Lens**: `egm-zoom-out`
* **Affected Scope**: Section 1 & Non-Functional Requirements (lines 72, 79, 175–192)
* **Discrepancy Description**: The document lacks a dedicated Risks & Mitigations section to codify mobile canvas frame rates, audio autoplay constraints, and gesture isolation. In addition, the topology diagram and file lists cite `src/core/shell/DesktopShell.tsx`, but the actual repository path is `src/core/shell/index.tsx`.
* **Rationale & Recommendation**: Add a concise 4-point risk table and correct the path reference.
