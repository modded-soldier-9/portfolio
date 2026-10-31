# MS Paint

## Overview
Windows 7 Scenic Ribbon styled Paint application featuring HTML5 Canvas freehand drawing, geometric shape tools (Line, Rectangle, Ellipse), flood fill bucket, eyedropper color picker, eraser, stroke width adjustment, 20-step undo/redo history, virtual Pictures library persistence, and PNG image export.

## Interface
- `PaintApp`: Main React UI component managing canvas events, tool state, and ribbon actions [src/apps/paint/index.tsx:PaintApp]
- `paintModule`: AppModuleContract providing application metadata and window configuration [src/apps/paint/index.tsx:paintModule]

## Invariants
- History stack depth is capped at 20 snapshots to bound memory overhead [src/apps/paint/index.tsx:MAX_HISTORY]
- Flood fill operations run a breadth-first search pixel traversal bounded strictly within canvas coordinate boundaries [src/apps/paint/index.tsx:floodFill]

## Side Effects
- Mutates HTML5 2D Canvas bitmap raster buffers on user pointer interaction [src/apps/paint/index.tsx:canvasRef]
- Persists canvas PNG data URLs to the virtual file system via `useOS().saveVirtualFile` [src/apps/paint/index.tsx:useOS]
- Emits UI interaction sound effects via `aeroSound.playClick()` [src/apps/paint/index.tsx:aeroSound]

## Verification
- Run: `npm run lint`
