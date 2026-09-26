'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PaintIcon } from '@/core/assets';
import { aeroSound } from '@/components/AeroSound';
import { useOS } from '@/state/os-store';
import type { AppModuleContract } from '@/apps/types';

type PaintTool =
  | 'pencil'
  | 'brush'
  | 'fill'
  | 'eraser'
  | 'picker'
  | 'line'
  | 'rect'
  | 'roundRect'
  | 'ellipse'
  | 'diamond';

const WIN7_PAINT_PALETTE = [
  '#000000',
  '#7f7f7f',
  '#880015',
  '#ed1c24',
  '#ff7f27',
  '#fff200',
  '#22b14c',
  '#00a2e8',
  '#3f48cc',
  '#a349a4',
  '#ffffff',
  '#c3c3c3',
  '#b97a57',
  '#ffaec9',
  '#ffc90e',
  '#efe4b0',
  '#b5e61d',
  '#99d9ea',
  '#7092be',
  '#c8bfe7',
];

function hexToRgba(hex: string): [number, number, number, number] {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255, 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  );
}

export const PaintApp: React.FC = () => {
  const { files, activePaintFileId, saveVirtualFile, updateWindowTitle } = useOS();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snapshotRef = useRef<ImageData | null>(null);
  const loadedFileIdRef = useRef<string | null>(null);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);

  const [tool, setTool] = useState<PaintTool>('brush');
  const [strokeSize, setStrokeSize] = useState<number>(4);
  const [primaryColor, setPrimaryColor] = useState<string>('#00a2e8');
  const [secondaryColor, setSecondaryColor] = useState<string>('#ffffff');
  const [activeSlot, setActiveSlot] = useState<1 | 2>(1);
  const [fillShape, setFillShape] = useState<boolean>(false);

  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPt, setStartPt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cursorCoords, setCursorCoords] = useState<{ x: number; y: number } | null>(null);
  const [fileName, setFileName] = useState<string>('Aero_Artwork.png');
  const [statusMsg, setStatusMsg] = useState<string>('Ready — Click and drag on canvas to draw');

  const CANVAS_W = 720;
  const CANVAS_H = 420;

  const drawStarterBanner = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Subtle security architecture starter sketch on canvas
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 1;
    for (let x = 0; x < CANVAS_W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_H);
      ctx.stroke();
    }
    for (let y = 0; y < CANVAS_H; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_W, y);
      ctx.stroke();
    }

    // Center Aero Shield Diagram
    ctx.fillStyle = '#eff6ff';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(60, 50, 170, 90, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13px "Segoe UI", sans-serif';
    ctx.fillText('Edge WAF & TLS 1.3', 82, 92);
    ctx.font = '11px "Segoe UI", sans-serif';
    ctx.fillStyle = '#0369a1';
    ctx.fillText('Rate Limit + DDoS Shield', 82, 112);

    // Arrow
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(230, 95);
    ctx.lineTo(295, 95);
    ctx.stroke();

    // Node 2
    ctx.fillStyle = '#f0fdf4';
    ctx.strokeStyle = '#16a34a';
    ctx.beginPath();
    ctx.roundRect(295, 50, 185, 90, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#14532d';
    ctx.font = 'bold 13px "Segoe UI", sans-serif';
    ctx.fillText('Zero-Trust API Core', 318, 92);
    ctx.font = '11px "Segoe UI", sans-serif';
    ctx.fillStyle = '#15803d';
    ctx.fillText('RBAC + Honeypot Telemetry', 318, 112);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const targetFile = files.find((f) => f.id === activePaintFileId && f.folder !== 'RecycleBin');
    if (!targetFile) {
      if (!loadedFileIdRef.current) {
        drawStarterBanner(ctx);
        const initialSnap = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);
        setUndoStack([initialSnap]);
        loadedFileIdRef.current = 'default';
      }
      return;
    }

    if (loadedFileIdRef.current === `${targetFile.id}:${targetFile.modifiedAt}`) {
      return;
    }
    loadedFileIdRef.current = `${targetFile.id}:${targetFile.modifiedAt}`;
    setFileName(targetFile.name);
    updateWindowTitle('paint', `${targetFile.name} - Paint`);

    if (targetFile.content.startsWith('data:image/')) {
      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
        const snap = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);
        setUndoStack([snap]);
        setRedoStack([]);
        setStatusMsg(`Loaded "${targetFile.name}" from Libraries\\Pictures`);
      };
      img.src = targetFile.content;
    } else {
      drawStarterBanner(ctx);
      const initialSnap = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);
      setUndoStack([initialSnap]);
      setRedoStack([]);
      setStatusMsg(`Loaded "${targetFile.name}"`);
    }
  }, [activePaintFileId, drawStarterBanner, files, updateWindowTitle]);

  const pushUndoSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const snap = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);
    setUndoStack((prev) => [...prev.slice(-18), snap]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    aeroSound.playClick();
    if (undoStack.length <= 1) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const current = undoStack[undoStack.length - 1];
    const previous = undoStack[undoStack.length - 2];
    ctx.putImageData(previous, 0, 0);
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, current]);
    setStatusMsg('Undid last stroke');
  };

  const handleRedo = () => {
    aeroSound.playClick();
    if (redoStack.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const next = redoStack[redoStack.length - 1];
    ctx.putImageData(next, 0, 0);
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, next]);
    setStatusMsg('Redid stroke');
  };

  const handleClearCanvas = () => {
    aeroSound.playClick();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    ctx.fillStyle = secondaryColor;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    pushUndoSnapshot();
    setStatusMsg('Cleared canvas');
  };

  const performFloodFill = (startX: number, startY: number, fillHex: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);
    const data = imgData.data;
    const x0 = Math.max(0, Math.min(CANVAS_W - 1, Math.floor(startX)));
    const y0 = Math.max(0, Math.min(CANVAS_H - 1, Math.floor(startY)));

    const startIdx = (y0 * CANVAS_W + x0) * 4;
    const targetR = data[startIdx];
    const targetG = data[startIdx + 1];
    const targetB = data[startIdx + 2];
    const targetA = data[startIdx + 3];

    const [fillR, fillG, fillB, fillA] = hexToRgba(fillHex);
    if (
      targetR === fillR &&
      targetG === fillG &&
      targetB === fillB &&
      targetA === fillA
    ) {
      return;
    }

    const visited = new Uint8Array(CANVAS_W * CANVAS_H);
    const stack: number[] = [x0, y0];

    while (stack.length > 0) {
      const cy = stack.pop()!;
      const cx = stack.pop()!;
      const pos = cy * CANVAS_W + cx;
      if (visited[pos]) continue;

      const idx = pos * 4;
      if (
        Math.abs(data[idx] - targetR) <= 18 &&
        Math.abs(data[idx + 1] - targetG) <= 18 &&
        Math.abs(data[idx + 2] - targetB) <= 18 &&
        Math.abs(data[idx + 3] - targetA) <= 18
      ) {
        visited[pos] = 1;
        data[idx] = fillR;
        data[idx + 1] = fillG;
        data[idx + 2] = fillB;
        data[idx + 3] = fillA;

        if (cx > 0) stack.push(cx - 1, cy);
        if (cx < CANVAS_W - 1) stack.push(cx + 1, cy);
        if (cy > 0) stack.push(cx, cy - 1);
        if (cy < CANVAS_H - 1) stack.push(cx, cy + 1);
      }
    }

    ctx.putImageData(imgData, 0, 0);
    pushUndoSnapshot();
  };

  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: Math.round((e.clientX - rect.left) * scaleX),
      y: Math.round((e.clientY - rect.top) * scaleY),
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !ctx) return;

    const pt = getCanvasPoint(e);
    const activeColor = e.button === 2 ? secondaryColor : primaryColor;

    if (tool === 'fill') {
      aeroSound.playClick();
      performFloodFill(pt.x, pt.y, activeColor);
      setStatusMsg(`Flood filled at (${pt.x}, ${pt.y})`);
      return;
    }

    if (tool === 'picker') {
      aeroSound.playClick();
      const pixel = ctx.getImageData(pt.x, pt.y, 1, 1).data;
      const pickedHex = rgbToHex(pixel[0], pixel[1], pixel[2]);
      setPrimaryColor(pickedHex);
      setTool('brush');
      setStatusMsg(`Picked color ${pickedHex}`);
      return;
    }

    setIsDrawing(true);
    setStartPt(pt);
    snapshotRef.current = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);

    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      // Ignore synthetic pointer capture error
    }

    ctx.strokeStyle = tool === 'eraser' ? secondaryColor : activeColor;
    ctx.fillStyle = activeColor;
    ctx.lineWidth = tool === 'pencil' ? Math.max(1, strokeSize - 2) : tool === 'eraser' ? strokeSize * 2.5 : strokeSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'pencil' || tool === 'brush' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pt = getCanvasPoint(e);
    setCursorCoords(pt);

    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !ctx) return;

    if (tool === 'pencil' || tool === 'brush' || tool === 'eraser') {
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
      return;
    }

    // Shape tools: restore snapshot first, then draw live shape preview
    if (snapshotRef.current) {
      ctx.putImageData(snapshotRef.current, 0, 0);
    }

    ctx.strokeStyle = primaryColor;
    ctx.fillStyle = secondaryColor;
    ctx.lineWidth = strokeSize;

    const x = Math.min(startPt.x, pt.x);
    const y = Math.min(startPt.y, pt.y);
    const w = Math.abs(pt.x - startPt.x);
    const h = Math.abs(pt.y - startPt.y);

    ctx.beginPath();
    if (tool === 'line') {
      ctx.moveTo(startPt.x, startPt.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    } else if (tool === 'rect') {
      if (fillShape) ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);
    } else if (tool === 'roundRect') {
      ctx.roundRect(x, y, w, h, 10);
      if (fillShape) ctx.fill();
      ctx.stroke();
    } else if (tool === 'ellipse') {
      ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
      if (fillShape) ctx.fill();
      ctx.stroke();
    } else if (tool === 'diamond') {
      ctx.moveTo(x + w / 2, y);
      ctx.lineTo(x + w, y + h / 2);
      ctx.lineTo(x + w / 2, y + h);
      ctx.lineTo(x, y + h / 2);
      ctx.closePath();
      if (fillShape) ctx.fill();
      ctx.stroke();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    try {
      canvasRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
    pushUndoSnapshot();
  };

  const handleSaveToPictures = () => {
    aeroSound.playChime();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const saved = saveVirtualFile({
      name: fileName.endsWith('.png') ? fileName : `${fileName}.png`,
      folder: 'Pictures',
      type: 'paint',
      content: dataUrl,
      size: '34.2 KB',
    });
    updateWindowTitle('paint', `${saved.name} - Paint`);
    setStatusMsg(`Saved "${saved.name}" to Libraries\\Pictures`);
  };

  const handleDownloadPng = () => {
    aeroSound.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
    a.click();
    setStatusMsg(`Downloaded "${a.download}"`);
  };

  const selectSwatch = (hex: string) => {
    aeroSound.playClick();
    if (activeSlot === 1) {
      setPrimaryColor(hex);
    } else {
      setSecondaryColor(hex);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#ccd9ea] select-none">
      {/* 1. Windows 7 MS Paint Ribbon Header */}
      <div className="bg-gradient-to-b from-[#f5f9ff] via-[#e4effc] to-[#d5e5f8] border-b border-[#8da6c4] px-2 py-1.5 flex flex-wrap items-stretch gap-2 text-[11px] text-[#1e395b]">
        {/* File & Undo Group */}
        <div className="flex flex-col justify-between pr-2 border-r border-[#b8cce4]">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleSaveToPictures}
              className="px-2.5 py-1 rounded-[3px] border border-[#1d4ed8] bg-gradient-to-b from-[#60a5fa] to-[#1d4ed8] text-white font-semibold shadow-sm hover:brightness-110 active:scale-[0.97] cursor-pointer"
              title="Save artwork to Libraries\Pictures"
            >
              💾 Save
            </button>
            <button
              type="button"
              onClick={handleDownloadPng}
              className="w7-btn !min-h-[24px] !px-2 !text-[11px]"
              title="Export canvas as PNG file"
            >
              ⬇ PNG
            </button>
          </div>
          <div className="flex items-center gap-1 pt-1">
            <button
              type="button"
              disabled={undoStack.length <= 1}
              onClick={handleUndo}
              className="w7-btn !min-h-[21px] !px-2 !text-[10.5px] disabled:opacity-45"
            >
              ↶ Undo
            </button>
            <button
              type="button"
              disabled={redoStack.length === 0}
              onClick={handleRedo}
              className="w7-btn !min-h-[21px] !px-2 !text-[10.5px] disabled:opacity-45"
            >
              ↷ Redo
            </button>
            <button
              type="button"
              onClick={handleClearCanvas}
              className="w7-btn !min-h-[21px] !px-2 !text-[10.5px]"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Tools Group */}
        <div className="flex flex-col justify-between pr-2 border-r border-[#b8cce4]">
          <div className="grid grid-cols-5 gap-1">
            {(
              [
                { id: 'pencil', label: '✏️', title: 'Pencil' },
                { id: 'brush', label: '🖌️', title: 'Brush' },
                { id: 'fill', label: '🪣', title: 'Fill with color (Flood Fill)' },
                { id: 'eraser', label: '🧽', title: 'Eraser' },
                { id: 'picker', label: '💧', title: 'Color Picker (Eyedropper)' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                title={t.title}
                aria-label={t.title}
                onClick={() => {
                  aeroSound.playClick();
                  setTool(t.id);
                }}
                className={`w-7 h-7 rounded-[3px] border flex items-center justify-center text-[13px] cursor-pointer transition-transform active:scale-[0.95] ${
                  tool === t.id
                    ? 'bg-[#ffe8a6] border-[#c28b2c] shadow-inner'
                    : 'bg-white/70 border-[#9cb2cc] hover:bg-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="text-center text-[10px] text-[#4c627d] pt-0.5">Tools</div>
        </div>

        {/* Shapes Group */}
        <div className="flex flex-col justify-between pr-2 border-r border-[#b8cce4]">
          <div className="flex items-center gap-1">
            {(
              [
                { id: 'line', label: '╱', title: 'Line' },
                { id: 'rect', label: '▭', title: 'Rectangle' },
                { id: 'roundRect', label: '▢', title: 'Rounded Rectangle' },
                { id: 'ellipse', label: '◯', title: 'Ellipse' },
                { id: 'diamond', label: '◇', title: 'Diamond' },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                type="button"
                title={s.title}
                aria-label={s.title}
                onClick={() => {
                  aeroSound.playClick();
                  setTool(s.id);
                }}
                className={`w-7 h-7 rounded-[3px] border flex items-center justify-center font-bold text-[13px] cursor-pointer transition-transform active:scale-[0.95] ${
                  tool === s.id
                    ? 'bg-[#ffe8a6] border-[#c28b2c] shadow-inner'
                    : 'bg-white/70 border-[#9cb2cc] hover:bg-white'
                }`}
              >
                {s.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setFillShape(!fillShape)}
              className={`px-1.5 h-7 rounded-[3px] border text-[10px] cursor-pointer ${
                fillShape
                  ? 'bg-[#ffe8a6] border-[#c28b2c] font-semibold'
                  : 'bg-white/70 border-[#9cb2cc]'
              }`}
              title="Toggle solid shape fill with Color 2"
            >
              {fillShape ? 'Solid Fill' : 'Outline'}
            </button>
          </div>
          <div className="text-center text-[10px] text-[#4c627d] pt-0.5">Shapes</div>
        </div>

        {/* Stroke Size Group */}
        <div className="flex flex-col justify-between pr-2 border-r border-[#b8cce4]">
          <div className="flex items-center gap-1">
            {[2, 4, 8, 14].map((sz) => (
              <button
                key={sz}
                type="button"
                title={`Stroke width: ${sz}px`}
                onClick={() => {
                  aeroSound.playClick();
                  setStrokeSize(sz);
                }}
                className={`w-7 h-7 rounded-[3px] border flex flex-col items-center justify-center cursor-pointer ${
                  strokeSize === sz
                    ? 'bg-[#ffe8a6] border-[#c28b2c]'
                    : 'bg-white/70 border-[#9cb2cc] hover:bg-white'
                }`}
              >
                <span
                  className="block bg-[#1e293b] rounded-full"
                  style={{ width: '16px', height: `${Math.min(10, Math.max(2, sz / 1.4))}px` }}
                />
              </button>
            ))}
          </div>
          <div className="text-center text-[10px] text-[#4c627d] pt-0.5">Size ({strokeSize}px)</div>
        </div>

        {/* Color 1 / Color 2 + 20-Color Palette */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveSlot(1)}
              className={`flex flex-col items-center p-1 rounded border cursor-pointer ${
                activeSlot === 1
                  ? 'bg-[#ffe8a6] border-[#c28b2c]'
                  : 'bg-white/60 border-transparent'
              }`}
              title="Color 1 (Foreground)"
            >
              <span
                className="w-5 h-5 rounded-sm border border-black/60 shadow-inner"
                style={{ backgroundColor: primaryColor }}
              />
              <span className="text-[9.5px] mt-0.5">Color 1</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSlot(2)}
              className={`flex flex-col items-center p-1 rounded border cursor-pointer ${
                activeSlot === 2
                  ? 'bg-[#ffe8a6] border-[#c28b2c]'
                  : 'bg-white/60 border-transparent'
              }`}
              title="Color 2 (Background / Fill)"
            >
              <span
                className="w-5 h-5 rounded-sm border border-black/60 shadow-inner"
                style={{ backgroundColor: secondaryColor }}
              />
              <span className="text-[9.5px] mt-0.5">Color 2</span>
            </button>
          </div>

          {/* 20 Swatches Grid */}
          <div className="grid grid-cols-10 gap-1">
            {WIN7_PAINT_PALETTE.map((hex) => (
              <button
                key={hex}
                type="button"
                aria-label={`Select color ${hex}`}
                onClick={() => selectSwatch(hex)}
                className="w-4 h-4 rounded-[2px] border border-black/50 hover:scale-110 transition-transform cursor-pointer shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)]"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>

          {/* Custom Color Input */}
          <label className="flex flex-col items-center cursor-pointer text-[9.5px] text-[#1e395b] px-1">
            <input
              type="color"
              value={activeSlot === 1 ? primaryColor : secondaryColor}
              onChange={(e) => selectSwatch(e.target.value)}
              className="w-6 h-6 cursor-pointer border-0 bg-transparent"
            />
            <span>Edit</span>
          </label>
        </div>
      </div>

      {/* 2. Scrollable Paint Workspace & Interactive Canvas */}
      <div className="flex-1 overflow-auto w7-scroll p-3 bg-[#bbcde2] flex items-start justify-start">
        <div className="relative bg-white shadow-[0_4px_14px_rgba(0,0,0,0.35)] border border-[#64748b]">
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            onContextMenu={(e) => e.preventDefault()}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={() => setCursorCoords(null)}
            className="block cursor-crosshair touch-none"
          />
        </div>
      </div>

      {/* 3. Windows 7 Paint Status Bar */}
      <div className="h-[23px] px-3 bg-[#eff4fb] border-t border-[#a8bcd4] flex items-center justify-between text-[11px] text-[#2c3e50] shrink-0">
        <div className="flex items-center gap-4">
          <span>
            🎯 {cursorCoords ? `${cursorCoords.x}, ${cursorCoords.y}px` : '—'}
          </span>
          <span>
            📐 {CANVAS_W} &times; {CANVAS_H}px
          </span>
          <span className="hidden sm:inline text-[#003399]">{statusMsg}</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            aria-label="Paint file name"
            className="w-36 h-4 px-1.5 text-[10.5px] bg-white border border-[#94a3b8] rounded-sm"
          />
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export const paintModule: AppModuleContract = {
  id: 'paint',
  getWindowConfig: () => ({
    id: 'paint',
    title: 'Untitled - Paint',
    shortLabel: 'Paint',
    glowColor: 'rgba(244, 114, 182, 0.65)',
    defaultPos: { x: 210, y: 34, width: 820, height: 560 },
    pinned: true,
    category: 'accessory',
    description: 'Create and edit drawings, diagrams, and images',
  }),
  renderIcon: (size = 32) => <PaintIcon size={size} />,
  Component: PaintApp,
};
