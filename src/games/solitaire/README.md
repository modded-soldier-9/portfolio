# Solitaire

## Overview
Windows 7 Klondike Solitaire card game featuring standard 52-card deck play, Draw 1 and Draw 3 modes, HTML5 drag-and-drop and double-click foundation auto-moves, move undo history, auto-complete solver when all cards are face-up, visual hint system, and authentic score calculations.

## Interface
- `SolitaireGame`: Main React component managing stock, waste, foundation, and tableau card state [src/games/solitaire/index.tsx:SolitaireGame]
- `solitaireModule`: AppModuleContract registering Solitaire with the window manager and desktop shell [src/games/solitaire/index.tsx:solitaireModule]

## Invariants
- Tableau cards may only be placed on opposing color cards of immediately superior rank, or onto empty columns if the card is a King [src/games/solitaire/index.tsx:canMoveToTableau]
- Foundation piles must strictly sequence identical suits ascending from Ace (1) through King (13) [src/games/solitaire/index.tsx:canMoveToFoundation]
- Foundation-to-tableau reverse moves incur a -15 score penalty with the overall score clamped at zero to prevent score manipulation [src/games/solitaire/index.tsx:executeMoveToTableau]

## Side Effects
- Attaches drag payloads to browser `dataTransfer` events during HTML5 card drags [src/games/solitaire/index.tsx:handleDragStart]
- Plays card flipping and movement sound effects via `aeroSound.playClick()` [src/games/solitaire/index.tsx:aeroSound]

## Verification
- Run: `npm run lint`
