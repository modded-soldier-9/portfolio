# Hearts

## Overview
Authentic Windows 7 Hearts card game implementation featuring 4-player trick-taking against three AI opponents (Nadia - SOC Lead, Marcus - Cloud Sec, Elena - Red Team), 3-card passing cycles (Left, Right, Across, Hold), follow-suit rules, hearts breaking logic, Queen of Spades penalty tracking, and Shoot the Moon detection.

## Interface
- `HeartsCard`: Type extending card definitions with unique deal identifiers [src/games/hearts/index.tsx:HeartsCard]
- `HeartsGame`: Primary React component orchestrating card dealing, passing phase, trick evaluation, and scoring modals [src/games/hearts/index.tsx:HeartsGame]
- `heartsModule`: AppModuleContract registering the game with window management and shell menus [src/games/hearts/index.tsx:heartsModule]

## Invariants
- Players must follow the suit of the lead card when holding one or more cards of that suit [src/games/hearts/index.tsx:canPlayCard]
- Hearts cannot be led until a heart has been discarded on a previous trick or the leading player has no other suits [src/games/hearts/index.tsx:canPlayCard]
- Shooting the Moon awards 0 penalty points to the shooter while adding 26 points to each opponent's score [src/games/hearts/index.tsx:playCard]

## Side Effects
- Manages AI turn delays and trick clearing timers via browser `setTimeout` [src/games/hearts/index.tsx:trickTimeoutRef]
- Emits card interaction audio cues through `aeroSound.playClick()` [src/games/hearts/index.tsx:aeroSound]

## Verification
- Run: `npm run lint`
