# Notepad

## Overview
Classic Windows 7 Notepad text editor application featuring standard File, Edit, Format, View, and Help menu bars, virtual file system integration, text search, line/column status tracking, font resizing, word wrap toggle, and `.txt` file export.

## Interface
- `NotepadApp`: Primary React component implementing the text editor UI and menu actions [src/apps/notepad/index.tsx:NotepadApp]
- `notepadModule`: AppModuleContract registering Notepad's window dimensions, taskbar metadata, and icon [src/apps/notepad/index.tsx:notepadModule]

## Invariants
- Cursor position indicators (`Ln`, `Col`) accurately map to the active caret offset in the text buffer [src/apps/notepad/index.tsx:updateCursorPos]
- Virtual file title updates dynamically synchronize with the window manager title bar [src/apps/notepad/index.tsx:updateWindowTitle]

## Side Effects
- Mutates and persists virtual files in the OS store via `useOS().saveVirtualFile` [src/apps/notepad/index.tsx:useOS]
- Initiates client-side file downloads of the buffer as `.txt` files [src/apps/notepad/index.tsx:handleDownload]
- Plays audio clicks on menu and dialog interactions through `aeroSound.playClick()` [src/apps/notepad/index.tsx:aeroSound]

## Verification
- Run: `npm run lint`
