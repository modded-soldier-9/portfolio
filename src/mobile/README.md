# Mobile Shells

## Overview
Dedicated mobile viewport operating system shells providing responsive, touch-first access to portfolio content on smartphones and narrow screens (<768px).

## Subdirectories & Boundaries
- WP7 Shell: [./wp7/README.md](./wp7/README.md) - Windows Phone 7 Aero Glass mobile interface featuring live tiles, 3D perspective tilt transforms, and full-screen detail sheets.

## Invariants
- Mobile shells must never break SSR hydration; viewport switching uses responsive CSS display rules (`hidden md:block` / `block md:hidden`) or hydration-guarded client hooks.
- Minimum touch target size across all mobile interactive controls is 48x48px.

## Verification
- Run: `npm run lint` and `npm run build`
