# File Explorer

## Overview
Windows 7 Aero styled File Explorer application providing folder tree navigation, breadcrumb address bar routing, search filtering, content/tiles/details view modes, and browsing for both portfolio libraries (Projects, Experience, Skills, Certifications, Mentorship) and system libraries (Documents, Pictures, Computer, Recycle Bin).

## Interface
- `ExplorerWindowProps`: Configuration properties for section routing and window launch handlers [src/apps/file-explorer/index.tsx:ExplorerWindowProps]
- `FileExplorerApp`: Main Explorer window React component [src/apps/file-explorer/index.tsx:FileExplorerApp]
- `fileExplorerModule`: AppModuleContract providing window geometry, icons, and shell registration [src/apps/file-explorer/index.tsx:fileExplorerModule]

## Invariants
- Navigation history boundaries disable the Back and Forward orb buttons when respective stacks are empty [src/apps/file-explorer/index.tsx:canGoBack]
- Preview and Details panes dynamically reflect the currently focused item across all portfolio and file system views [src/apps/file-explorer/index.tsx:FileExplorerApp]

## Side Effects
- Mutates global OS navigation section, virtual files, and window visibility via `useOS()` [src/apps/file-explorer/index.tsx:useOS]
- Generates navigation click sound effects through `aeroSound.playClick()` [src/apps/file-explorer/index.tsx:aeroSound]

## Verification
- Run: `npm run lint`
