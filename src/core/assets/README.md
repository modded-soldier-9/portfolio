# Shared Assets

## Overview
Shared library of 100% vector SVG visual assets, including Windows 7 application and system icons, Start Orb with multi-state lighting, Action Center shield, logon screen botanical background, and a 52-card vector playing card deck used by Solitaire and Hearts.

## Interface
- `IconProps`: Standard interface defining sizing and CSS class overrides for vector icons [src/core/assets/index.tsx:IconProps]
- System & Accessory Icons: `StartOrbIcon`, `ComputerIcon`, `ExplorerIcon`, `FolderIcon`, `SecurityShieldIcon`, `BriefcaseIcon`, `CertificateIcon`, `ContactMailIcon`, `CmdIcon`, `NotepadIcon`, `PersonalizeIcon`, `ProjectAppIcon`, `CalculatorIcon`, `PaintIcon`, `RecycleBinIcon`, `MinesweeperIcon`, `SolitaireIcon`, `HeartsIcon`, `EaseOfAccessIcon`, `PowerIcon`, `UserAvatarSvg` [src/core/assets/index.tsx]
- `Win7LoginBackgroundSvg`: Vector SVG recreation of the Windows 7 Harmony logon wallpaper [src/core/assets/index.tsx:Win7LoginBackgroundSvg]
- `CardSuit`, `CardRank`, `PlayingCardData`: Type definitions for the standard 52-card deck [src/core/assets/playing-cards.tsx:PlayingCardData]
- `SuitGlyphSvg`: Standalone vector glyph renderer for Spades, Hearts, Diamonds, and Clubs [src/core/assets/playing-cards.tsx:SuitGlyphSvg]
- `PlayingCardSvg`: Vector playing card component rendering card faces, courts, and authentic blue geometric back [src/core/assets/playing-cards.tsx:PlayingCardSvg]

## Invariants
- All SVG definitions and gradients utilize instance-scoped or collision-free identifier namespaces [src/core/assets/index.tsx]
- Card rank representations are bounded strictly from 1 (Ace) to 13 (King) [src/core/assets/playing-cards.tsx:CardRank]

## Side Effects
- None

## Verification
- Run: `npm run lint`
