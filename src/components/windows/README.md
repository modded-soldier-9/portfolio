# Windows Components

## Overview
Collection of specialized Windows 7 window client implementations, including Command Prompt (`cmd.exe`), Contact Messenger, Personalization Control Panel, Security Center, and System Properties, along with backward-compatibility re-exports for Explorer and Notepad.

## Interface
- `CmdWindow`: Terminal emulator component supporting interactive commands (`help`, `projects`, `skills`, `cls`, `exit`, etc.) [src/components/windows/CmdWindow.tsx:CmdWindow]
- `ContactWindow`: Message and email composer window component [src/components/windows/ContactWindow.tsx:ContactWindow]
- `ExplorerWindow`: Compatibility re-export of `FileExplorerApp` [src/components/windows/ExplorerWindow.tsx:ExplorerWindow]
- `NotepadWindow`: Compatibility re-export of `NotepadApp` [src/components/windows/NotepadWindow.tsx:NotepadWindow]
- `PersonalizeWindow`: Aero Glass tint, opacity, wallpaper preset, and gadget toggle control panel [src/components/windows/PersonalizeWindow.tsx:PersonalizeWindow]
- `AERO_COLORS`: Array of pre-configured Aero Glass tint color configurations [src/components/windows/PersonalizeWindow.tsx:AERO_COLORS]
- `SecurityCenterWindow`: Action Center security credentials and verified certifications audit window [src/components/windows/SecurityCenterWindow.tsx:SecurityCenterWindow]
- `SystemWindow`: Windows 7 System Properties window presenting author specifications and experience index [src/components/windows/SystemWindow.tsx:SystemWindow]

## Invariants
- Command prompt inputs are parsed against a deterministic token evaluation table with formatted terminal responses [src/components/windows/CmdWindow.tsx:handleCommand]
- System experience index and subscore meters remain clamped within the standard 1.0 to 7.9 scale [src/components/windows/SystemWindow.tsx:SystemWindow]

## Side Effects
- Mutates global OS state (window visibility, active section, themes) via `useOS()` [src/components/windows/PersonalizeWindow.tsx:useOS]
- Synthesizes click feedback audio using `aeroSound.playClick()` [src/components/windows/SecurityCenterWindow.tsx:aeroSound]

## Verification
- Run: `npm run lint`
