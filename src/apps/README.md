# Applications

## Overview
Application registry and contract specifications for all Windows 7 desktop applications and accessories. Defines the standard modular application interface (`AppModuleContract`) and registers system, accessory, and game modules with the desktop shell.

## Interface
- `AppCategory`: Category categorization union (`'system' | 'accessory' | 'portfolio' | 'game'`) [src/apps/types.ts:AppCategory]
- `AppWindowConfig`: Configuration interface for window defaults, geometry, titles, and taskbar styling [src/apps/types.ts:AppWindowConfig]
- `AppModuleContract`: Standard application contract providing window configuration, vector icon rendering, lifecycle callbacks, and React component [src/apps/types.ts:AppModuleContract]
- `APP_REGISTRY`: Master dictionary mapping window identifiers to their respective application modules [src/apps/registry.tsx:APP_REGISTRY]
- `getAppModule()`: Lookup helper retrieving application contract metadata by window ID [src/apps/registry.tsx:getAppModule]
- `systemModule`, `securityModule`, `contactModule`, `cmdModule`, `personalizeModule`: Native module wrappers for system portfolio windows [src/apps/registry.tsx]
- Subdirectories:
  - [Calculator](./calculator/README.md) - Standard desktop calculator application
  - [File Explorer](./file-explorer/README.md) - Portfolio and simulated file system browser
  - [Notepad](./notepad/README.md) - Text editor with virtual file system integration
  - [MS Paint](./paint/README.md) - Canvas-based drawing tool with ribbon toolbar

## Invariants
- `getAppModule()` returns `undefined` for unknown identifiers rather than throwing [src/apps/registry.tsx:getAppModule]
- All registered application components implement the uniform `AppModuleContract` interface to prevent cross-module coupling [src/apps/types.ts:AppModuleContract]

## Side Effects
- None

## Verification
- Run: `npm run lint`
