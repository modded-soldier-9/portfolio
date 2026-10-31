# Theme Context

## Overview
React context provider and consumer hook implementing theme mode management (`light`, `dark`, `system`), system color scheme preference media query listeners, and local storage state persistence.

## Interface
- `ThemeProvider`: React context provider component managing root theme state [src/contexts/ThemeContext.tsx:ThemeProvider]
- `useTheme()`: Custom hook exposing current theme selection, resolved theme, and theme mutation handler [src/contexts/ThemeContext.tsx:useTheme]

## Invariants
- `useTheme()` enforces that it must be invoked within the child hierarchy of a `<ThemeProvider />`, throwing an exception otherwise [src/contexts/ThemeContext.tsx:useTheme]

## Side Effects
- Persists theme preference to `localStorage` under key `theme` [src/contexts/ThemeContext.tsx:localStorage]
- Toggles the `.dark` class directly on `document.documentElement` based on resolved theme [src/contexts/ThemeContext.tsx:document.documentElement]

## Verification
- Run: `npm run lint`
