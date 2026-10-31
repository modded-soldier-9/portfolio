# Calculator

## Overview
Windows 7 Aero styled calculator application supporting standard arithmetic operations, sign inversion, square root, percentage, reciprocal calculations, memory registers (MC, MR, MS, M+, M-), and calculation history.

## Interface
- `CalculatorApp`: Primary React UI component for the calculator window [src/apps/calculator/index.tsx:CalculatorApp]
- `calculatorModule`: AppModuleContract registering window configuration, icons, and lifecycle hooks [src/apps/calculator/index.tsx:calculatorModule]

## Invariants
- Division by zero yields the explicit error string `'Cannot divide by zero'` rather than throwing [src/apps/calculator/index.tsx:formatNumber]
- Numeric string formatting constrains precision to 16 characters or 10 significant digits [src/apps/calculator/index.tsx:formatNumber]

## Side Effects
- Synthesizes user interaction audio feedback through `aeroSound.playClick()` [src/apps/calculator/index.tsx:aeroSound]
- Writes active calculation display values to the system clipboard via `navigator.clipboard.writeText` [src/apps/calculator/index.tsx:copyToClipboard]

## Verification
- Run: `npm run lint`
