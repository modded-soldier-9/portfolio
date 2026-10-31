# Goldfish Annotated Review Report

**Target**: [`docs/designs/windows7_portfolio_wp7_space_cadet.md`](file:///c:/Users/modded/Documents/GitHub/portflio/docs/designs/windows7_portfolio_wp7_space_cadet.md) (`full file`, lines 1..288)  
**Status**: resolved  

## Prioritized Findings & AI Suggestions

### [TASK-B1] Absence of Phasing & Incremental Checkpoints [`egm-implementation-readiness`] - Severity: High
*   **Affected Scope**: [Lines 193–196](file:///c:/Users/modded/Documents/GitHub/portflio/docs/designs/windows7_portfolio_wp7_space_cadet.md#L193-L196) (`### Detailed Implementation Plan`)
*   **Discrepancy Description**: The plan specifies a single flat sequence across 15 files without phases or buildable checkpoints.
*   **Rationale**: The Implementation Readiness Standard mandates partitioning work into logical, incremental phases leaving the codebase buildable at each step.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** Partition into 5 sequential phases with automated validation commands.
*   ***Proposed Edit:***
    *   Location: `## Detailed Implementation Plan`
    *   Change: Partition the 16 target files across 5 phases: Phase 1 (State & System Window), Phase 2 (Viewport & WP7 Shell), Phase 3 (Space Cadet & Sound), Phase 4 (Shell Integration), Phase 5 (Contracts & Drift).

---

### [TASK-B2] Total Omission of Test & Verification Plan [`egm-implementation-readiness`] - Severity: High
*   **Affected Scope**: [Lines 193–288](file:///c:/Users/modded/Documents/GitHub/portflio/docs/designs/windows7_portfolio_wp7_space_cadet.md#L193-L288)
*   **Discrepancy Description**: Zero test specifications, test files, or assertion criteria exist in the implementation plan.
*   **Rationale**: Mandatory requirement of the Implementation Readiness Standard.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** Provide concrete unit and integration test assertions for state, viewport, and canvas lifecycles.
*   ***Proposed Edit:***
    *   Location: New `### Test & Verification Plan` section under `## Detailed Implementation Plan`
    *   Change: Add test specifications for `useViewport`, `os-store`, and `SpaceCadetGame`.

---

### [TASK-B3] Canvas Physics Engine Left to Developer Guesswork [`egm-implementation-readiness`, `egm-zoom-out`] - Severity: High
*   **Affected Scope**: [Lines 133–144, 240–246](file:///c:/Users/modded/Documents/GitHub/portflio/docs/designs/windows7_portfolio_wp7_space_cadet.md#L133-L144) (`Section 5 & Target File 7`)
*   **Discrepancy Description**: Physics constants, table dimensions, flipper angles, and collision rules are omitted, violating the Zero-Decision Rule. Complex multi-tier mission states represent speculative complexity.
*   **Rationale**: All parameters must be predetermined; game should focus on arcade table scoring.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** Define coordinate space `600x800`, `GRAVITY = 0.22`, `BALL_RADIUS = 7`, `BOUNCE_RESTITUTION = 1.35`, flipper angles (`rest: 30°`, `peak: -25°`), bumper coords, and prune complex rank progression.
*   ***Proposed Edit:***
    *   Location: Section 5 & Target File 7 (`SpaceCadetGame.tsx`)
    *   Change: Codify the complete physics constants, table layout, scoring, and lifecycle.

---

### [TASK-B4] Missing Target Scope Modification for Desktop Shortcut Registration [`egm-codebase-details`] - Severity: High
*   **Affected Scope**: [Lines 252–257](file:///c:/Users/modded/Documents/GitHub/portflio/docs/designs/windows7_portfolio_wp7_space_cadet.md#L252-L257) & `src/core/shell/index.tsx`
*   **Discrepancy Description**: Desktop shortcuts are defined in `src/core/shell/index.tsx` in `desktopIcons`, but this file was omitted from Target Files. Also, references cited non-existent `DesktopShell.tsx`.
*   **Rationale**: Space Cadet shortcut will not render without updating `desktopIcons`.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** Add `src/core/shell/index.tsx` as Target File 16 and fix all path citations.
*   ***Proposed Edit:***
    *   Location: Target Files list and Section 1
    *   Change: Add `src/core/shell/index.tsx` (Modify) and fix path citations.

---

### [TASK-B5] Missing Explicit "Risks & Mitigations" Section [`egm-design`, `egm-structural`] - Severity: High
*   **Affected Scope**: After Line 173 (Feature Specification)
*   **Discrepancy Description**: The document lacks a dedicated `## Risks & Mitigations` section required by the Feature Specification Standard.
*   **Rationale**: Explicit failure analysis is required for audio autoplay, CLS, and canvas battery drain.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** Insert an explicit `## Risks & Mitigations` section before Section 8.
*   ***Proposed Edit:***
    *   Location: Insert between `## Non-Functional Requirements` and `## Detailed Implementation Plan`
    *   Change: Add a 4-point risk analysis table covering audio gesture unlock, zero-CLS CSS display shielding, background tab RAF cancellation, and orientation persistence.

---

### [TASK-M1] Viewport Shell Swapping & Provider Hierarchy [`egm-design`, `egm-zoom-out`, `egm-comprehension`] - Severity: Medium
*   **Affected Scope**: [Lines 66–73, 115–117, 263–268](file:///c:/Users/modded/Documents/GitHub/portflio/docs/designs/windows7_portfolio_wp7_space_cadet.md#L66-L73)
*   **Discrepancy Description**: Unclear provider hoisting and client-side JS switching causing hydration CLS flash.
*   **Rationale**: Using CSS media queries (`hidden md:block` and `block md:hidden`) ensures zero CLS with no JS overhead. `<OSProvider>` remains in `AeroDesktop.tsx` wrapping both shells.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** Document responsive CSS shielding and provider hierarchy.
*   ***Proposed Edit:***
    *   Location: Section 1, Section 4, Target File 11
    *   Change: Update architecture diagram and implementation steps to use CSS responsive display rules.

---

### [TASK-M2] Standardize WP7 Navigation (Prune Redundant Pivot) [`egm-zoom-out`, `egm-comprehension`] - Severity: Medium
*   **Affected Scope**: [Lines 23, 84–90, 118–132](file:///c:/Users/modded/Documents/GitHub/portflio/docs/designs/windows7_portfolio_wp7_space_cadet.md#L84-L90)
*   **Discrepancy Description**: Document specifies both horizontal panoramic swipe and vertical 2-column live tile grid for identical categories, causing gesture conflict and category count mismatch (4 vs 5).
*   **Rationale**: WP7 Start Screen is a vertical live tile grid. Remove redundant horizontal swipe pivot.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** Standardize on 2-column vertical live tile grid with 4 hubs (Overview, Security, Projects, Games) and Contact action tile.
*   ***Proposed Edit:***
    *   Location: Goals, Section 4, Target Files 4, 5, 6
    *   Change: Remove horizontal panoramic swipe pivot; standardize on 2-column Start Screen with 3D tilt.

---

### [TASK-M3] Define Complete TypeScript Contracts [`egm-implementation-readiness`, `egm-codebase-details`] - Severity: Medium
*   **Affected Scope**: [Lines 199–206, 228–239, 279–283](file:///c:/Users/modded/Documents/GitHub/portflio/docs/designs/windows7_portfolio_wp7_space_cadet.md#L199-L206)
*   **Discrepancy Description**: `ManagedWindowState` missing 5 fields; `WP7TileProps` and `AeroSound` signatures missing.
*   **Rationale**: Implementer must not guess types.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** Provide all TypeScript definitions inline.
*   ***Proposed Edit:***
    *   Location: Target Files 1, 5, 6, 14
    *   Change: Define complete schemas and method signatures.

---

### [TASK-M4] Define Action Bar Handlers & Dynamic Resume Generation [`egm-codebase-details`, `egm-implementation-readiness`] - Severity: Medium
*   **Affected Scope**: [Lines 207–212](file:///c:/Users/modded/Documents/GitHub/portflio/docs/designs/windows7_portfolio_wp7_space_cadet.md#L207-L212)
*   **Discrepancy Description**: Citing static resume file references non-existent assets. Handlers are unspecified.
*   **Rationale**: Connect to dynamic client-side Notepad export or text blob, and explicit WhatsApp url.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** Document exact handler wiring in `SystemWindow.tsx`.
*   ***Proposed Edit:***
    *   Location: Target File 2 (`SystemWindow.tsx`)
    *   Change: Specify `onOpenWindow('notepad')`, WhatsApp direct link, `onOpenWindow('security')`, `onOpenExplorerSection('projects')`.

---

### [TASK-M5] Define Mobile Game Presentation & Lazy-Loading Adapter [`egm-codebase-details`, `egm-comprehension`] - Severity: Medium
*   **Affected Scope**: [Lines 184, 220–227, 247–251](file:///c:/Users/modded/Documents/GitHub/portflio/docs/designs/windows7_portfolio_wp7_space_cadet.md#L247-L251)
*   **Discrepancy Description**: Omission of `next/dynamic` wrapper in implementation item and unstated mobile presentation container.
*   **Rationale**: Games must be lazy-loaded and render in full-screen modal sheets on mobile.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** Wrap with `next/dynamic` `{ ssr: false }` and mount inside `WP7DetailModal`.
*   ***Proposed Edit:***
    *   Location: Target Files 4 & 8
    *   Change: Explicitly specify `next/dynamic` and `WP7DetailModal` hosting.

---

### [TASK-M6] Enforce Objective Phrasing & Strip Promotional Fluff [`egm-style`, `egm-design`] - Severity: Medium
*   **Affected Scope**: Document-wide ([Lines 11, 153, 158, 164, 171, 195, 210](file:///c:/Users/modded/Documents/GitHub/portflio/docs/designs/windows7_portfolio_wp7_space_cadet.md#L11))
*   **Discrepancy Description**: Subjective, emotional, and hyperbolic phrasing throughout document.
*   **Rationale**: Technical designs must be factual, dry, and objective.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** Replace all hyperbolic words with direct engineering terminology.
*   ***Proposed Edit:***
    *   Location: Sections 1, 6, 7, 8
    *   Change: Replace all flagged words per `critic_report.md` and `implementation_readiness_report.md`.

---

### [TASK-N1] Enforce Silent Direct Landing Policy [`egm-zoom-out`] - Severity: Low
*   **Affected Scope**: [Lines 95–97, 142](file:///c:/Users/modded/Documents/GitHub/portflio/docs/designs/windows7_portfolio_wp7_space_cadet.md#L95-L97)
*   **Discrepancy Description**: Direct landing must not trigger unprompted audio autoplay.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Proposed Edit:*** Document explicit silence on direct desktop mount.

---

### [TASK-N2] Pause Canvas Physics on Window Minimize / Tab Blur [`egm-codebase-details`] - Severity: Low
*   **Affected Scope**: [Lines 240–246](file:///c:/Users/modded/Documents/GitHub/portflio/docs/designs/windows7_portfolio_wp7_space_cadet.md#L240-L246)
*   **Discrepancy Description**: Canvas loop continuous execution drains battery when hidden.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Proposed Edit:*** Add visibility and minimization pausing logic to Item 7.

---

### [TASK-N3] Standardize Markdown Formatting & Code Links [`egm-structural`] - Severity: Low
*   **Affected Scope**: Document-wide
*   **Discrepancy Description**: Asterisk bullets, symmetric heading paths, and clickable file links.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Proposed Edit:*** Standardize layout across all sections.
