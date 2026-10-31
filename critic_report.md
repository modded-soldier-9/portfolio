# Critic Review Report (Stage 7)

**Target**: `docs/designs/windows7_portfolio_wp7_space_cadet.md` (`FeatureRange` lines 1..192)  
**Standard**: `feature-spec-standard.md`  
**Reviewers**: `egm-design`, `egm-structural`, `egm-style`  
**Overall Verdict**: Changes Requested (1 Blocker, 5 Major, 9 Nit)

---

## Reviewer Status

| Reviewer | Status |
| --- | --- |
| `egm-design` | completed |
| `egm-structural` | completed |
| `egm-style` | completed |

---

## Prioritized Findings

### 1. Missing Explicit "Risks & Mitigations" Section — Severity: 🔴 Blocker
* **Reviewer Lens**: `egm-design`, `egm-structural`
* **Affected Scope**: Lines 174–192 (or new section before Section 8)
* **Discrepancy Description**: The document specifies non-functional targets (TTI, zero external APIs) but omits a dedicated `## Risks & Mitigations` section required by the Feature Specification Standard. Critical failure modes—such as mobile Web Audio autoplay policies, canvas physics loop battery drain, and hydration flashes—are undocumented.
* **Rationale & Recommendation**: Add `## Risks & Mitigations` with explicit failure analysis: (1) iOS/Android AudioContext gesture unlock, (2) `requestAnimationFrame` pausing on background tabs, (3) CSS media query shielding to eliminate hydration CLS, and (4) state persistence across orientation changes.

### 2. Shell Unmount & State Loss on Breakpoint / Orientation Shifts — Severity: 🟡 Major
* **Reviewer Lens**: `egm-design`
* **Affected Scope**: Lines 66–91, 115–121 (`Architectural Topology & Component Flow`)
* **Discrepancy Description**: Branching `<DesktopShell />` vs `<WP7MobileShell />` across 768px unmounts the active shell upon screen rotation or resize. This destroys running game loops, audio nodes, and open modal sheets.
* **Rationale & Recommendation**: Hoist shared active state or pause animation/audio listeners cleanly, or bind shell mode strictly to initial load and manual toggle rather than un-debounced window resize events.

### 3. Mobile Web Audio Autoplay Block & Background Loop Throttling — Severity: 🟡 Major
* **Reviewer Lens**: `egm-design`
* **Affected Scope**: Lines 138–144 (`3D Space Cadet Pinball Integration`)
* **Discrepancy Description**: Mobile browsers block `AudioContext` until explicit user interaction. Asynchronous audio calls without an unlocked context fail silently or crash. Furthermore, continuous canvas loops drain battery when backgrounded.
* **Rationale & Recommendation**: Document lazy `AudioContext` initialization on first pointerdown, and hook into `document.visibilityState` to halt physics processing when hidden.

### 4. SSR Hydration Mismatch & Layout Shift (CLS) — Severity: 🟡 Major
* **Reviewer Lens**: `egm-design`
* **Affected Scope**: Lines 115–117 (`Viewport Detection`)
* **Discrepancy Description**: Defaulting `useViewport` to desktop during server rendering causes a visual flash of desktop window chrome on mobile screens before React mounts and switches to WP7.
* **Rationale & Recommendation**: Use CSS media queries (`@media (max-width: 767px)`) for initial visibility gating or render a neutral server-side layout.

### 5. Unprovable Absolute Claims and Hyperbole — Severity: 🟡 Major
* **Reviewer Lens**: `egm-style`
* **Affected Scope**: Lines 11, 171
* **Discrepancy Description**: Statements such as "eliminates recruiter bounce rate", "instantaneous load times", and "remaining 100% true to the original game's visual presentation" state unmeasurable absolutes.
* **Rationale & Recommendation**: Replace with measurable technical statements: "reduces landing friction", "sub-16ms frame dispatch", and "approximates original sprite geometry".

### 6. Subjective and Emotional Phrasing in Architecture Decisions — Severity: 🟡 Major
* **Reviewer Lens**: `egm-style`
* **Affected Scope**: Lines 153, 158, 164
* **Discrepancy Description**: Phrasing like "discards the user's explicit love for Windows operating system aesthetics", "non-skippable ritual", and "touch target frustration" inject emotional commentary into technical trade-offs.
* **Rationale & Recommendation**: Replace with objective engineering rationale: "maintains visual brand continuity", "mandatory startup delay", and "violates 48px touch-target minimums".

### 7. Touch Ambiguity on 768px Tablet Screens — Severity: 🟢 Nit
* **Reviewer Lens**: `egm-design`
* **Affected Scope**: Lines 115–117 (`Viewport Detection`)
* **Discrepancy Description**: 768px breakpoint boundary leaves portrait tablets with 16px desktop controls lacking hover states.
* **Rationale & Recommendation**: Incorporate `@media (pointer: coarse)` detection to size controls appropriately.

### 8. Promotional Fluff and Buzzwords — Severity: 🟢 Nit
* **Reviewer Lens**: `egm-style`
* **Affected Scope**: Lines 11, 125, 165
* **Discrepancy Description**: "authentic Windows-era", "authentic WP7", "entertainment suite", and "authentic Windows nostalgia" add decorative praise.
* **Rationale & Recommendation**: Strip "authentic" and replace "entertainment suite" with "games module".

### 9. Tautological Acronym Redundancy — Severity: 🟢 Nit
* **Reviewer Lens**: `egm-style`
* **Affected Scope**: Lines 11, 30, 119, 143, 171, 185
* **Discrepancy Description**: Phrasing repeats "vector" alongside SVG ("Scalable vector SVG", "vector SVG cabinet trim").
* **Rationale & Recommendation**: Standardize to "SVG assets" or "vector graphics".

### 10. Informal Phrasing and Sentence Fragments — Severity: 🟢 Nit
* **Reviewer Lens**: `egm-style`
* **Affected Scope**: Lines 17, 151, 171
* **Discrepancy Description**: Phrasing like "shows off", "Overlap Clutter", and fragment "Unjustified complexity." degrade technical precision.
* **Rationale & Recommendation**: Replace with "demonstrates", "Overlapping Window Default", and full clause "Introduces disproportionate dependency overhead."

### 11. List Structural Inversion in Technical Plan — Severity: 🟢 Nit
* **Reviewer Lens**: `egm-structural`
* **Affected Scope**: Lines 102–110 (`### 3. Executive Overview Window Enhancement`)
* **Discrepancy Description**: Subsection 3 inverts list structure by placing top-level bullets with nested numbers, while other subsections use top-level numbers with nested bullets.
* **Rationale & Recommendation**: Standardize to top-level numbered steps with nested bullets.

### 12. Inconsistent Unordered List Bullet Markers — Severity: 🟢 Nit
* **Reviewer Lens**: `egm-structural`
* **Affected Scope**: Document-wide (lines 98–100, 105, 110, 116–131, 136–143 vs lines 3–5, 21–25, etc.)
* **Discrepancy Description**: Document mixes asterisk bullets (`*   `) with hyphen bullets (`- `).
* **Rationale & Recommendation**: Standardize on asterisk bullets (`*   `) throughout.

### 13. Asymmetric Heading Annotation Syntax — Severity: 🟢 Nit
* **Reviewer Lens**: `egm-structural`
* **Affected Scope**: Lines 62, 93, 102, 112, 133 (H3 Headings)
* **Discrepancy Description**: Subsections 4 and 5 include directory paths in parentheses, while Subsections 1, 2, and 3 omit them.
* **Rationale & Recommendation**: Harmonize heading annotations across all subsections.

### 14. Missing Hyperlinks for Codebase Artifacts — Severity: 🟢 Nit
* **Reviewer Lens**: `egm-structural`
* **Affected Scope**: Lines 1–192
* **Discrepancy Description**: Source paths and symbol names are inline monospace text without clickable Markdown links.
* **Rationale & Recommendation**: Add file links to cited source files.
