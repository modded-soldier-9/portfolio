# Minesweeper

## Overview
Windows 7 Minesweeper recreation featuring Beginner (9x9, 10 mines), Intermediate (16x16, 40 mines), and Expert (16x30, 99 mines) modes, first-click safe zone guarantee, right-click flag/question mark cycling, number chording (middle/double click), F2 game reset shortcut, GSAP reveal animations, and local high score tracking.

## Interface
- `MinesweeperGame`: Main React component managing board grid state, timer, mine counters, and game over evaluations [src/games/minesweeper/index.tsx:MinesweeperGame]
- `minesweeperModule`: AppModuleContract registering Minesweeper with window managers and Start menu [src/games/minesweeper/index.tsx:minesweeperModule]

## Invariants
- The initial user click and its 3x3 surrounding radius are guaranteed mine-free by dynamically populating mines after the first click [src/games/minesweeper/index.tsx:generateBoard]
- Chording on a revealed number cell only triggers when the quantity of flagged adjacent neighbors matches the cell's mine count [src/games/minesweeper/index.tsx:chordCell]
- Board dimensions and mine quantities strictly follow Windows 7 standards (9x9/10, 16x16/40, 16x30/99) [src/games/minesweeper/index.tsx:DIFFICULTIES]

## Side Effects
- Reads and persists best times to browser `localStorage` under `w7_minesweeper_scores` [src/games/minesweeper/index.tsx:localStorage]
- Triggers GSAP DOM animations on tile reveals and game over explosions [src/games/minesweeper/index.tsx:animateMinesweeperReveal]
- Plays sound effects through `aeroSound.playClick()` and `aeroSound.playChime()` [src/games/minesweeper/index.tsx:aeroSound]

## Verification
- Run: `npm run lint`
