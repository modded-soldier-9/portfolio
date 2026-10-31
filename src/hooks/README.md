# Hooks

## Overview
Custom React hooks providing shared hardware, viewport, and client-side lifecycle utilities for the portfolio application.

## Subdirectories & Boundaries
- `useViewport`: Responsive viewport measurement and forced-mode toggle hook [src/hooks/useViewport.ts:useViewport]

## Invariants
- `useViewport` defaults `isMobile` to `false` during SSR to ensure server and client markup match without hydration layout shifts.
- Media query listeners are cleanly attached and detached on mount/unmount.

## Verification
- Run: `npm run lint` and `npm run build`
