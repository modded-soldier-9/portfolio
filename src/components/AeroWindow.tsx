'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { aeroSound } from './AeroSound';

export type SnapState = 'none' | 'maximized' | 'left' | 'right';

export interface WindowPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AeroWindowProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isActive: boolean;
  zIndex: number;
  defaultPos: WindowPosition;
  snapState: SnapState;
  onFocus: (id: string) => void;
  onMinimize: (id: string) => void;
  onClose: (id: string) => void;
  onSnapChange: (id: string, snap: SnapState) => void;
  children: React.ReactNode;
}

type ResizeDir = 'e' | 's' | 'se' | 'w';

export const AeroWindow: React.FC<AeroWindowProps> = ({
  id,
  title,
  icon,
  isOpen,
  isMinimized,
  isActive,
  zIndex,
  defaultPos,
  snapState,
  onFocus,
  onMinimize,
  onClose,
  onSnapChange,
  children,
}) => {
  const [pos, setPos] = useState<WindowPosition>(defaultPos);
  const [isMobile, setIsMobile] = useState(false);
  const [snapPreview, setSnapPreview] = useState<SnapState>('none');

  const dragRef = useRef<{
    dragging: boolean;
    moved: boolean;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  }>({
    dragging: false,
    moved: false,
    startX: 0,
    startY: 0,
    origX: defaultPos.x,
    origY: defaultPos.y,
  });

  const resizeRef = useRef<{
    resizing: boolean;
    dir: ResizeDir;
    startX: number;
    startY: number;
    origPos: WindowPosition;
  } | null>(null);

  useEffect(() => {
    const checkViewport = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setPos((prev) => {
        const maxW = Math.max(320, window.innerWidth - 16);
        const maxH = Math.max(300, window.innerHeight - 52);
        const w = Math.min(prev.width, maxW);
        const h = Math.min(prev.height, maxH);
        const x = Math.max(4, Math.min(prev.x, window.innerWidth - w - 4));
        const y = Math.max(4, Math.min(prev.y, window.innerHeight - h - 44));
        return { x, y, width: w, height: h };
      });
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const handlePointerDownTitle = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      if ((e.target as HTMLElement).closest('.w7-title-bar-controls')) return;
      onFocus(id);
      if (isMobile) return;

      dragRef.current = {
        dragging: true,
        moved: false,
        startX: e.clientX,
        startY: e.clientY,
        origX: pos.x,
        origY: pos.y,
      };
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // Ignore capture error on synthetic events
      }
    },
    [id, isMobile, onFocus, pos.x, pos.y]
  );

  const handlePointerMoveTitle = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current.dragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;

      // Require a 6px drag threshold before moving or detaching from Aero Snap / Maximize
      if (!dragRef.current.moved) {
        if (Math.hypot(dx, dy) < 6) return;
        dragRef.current.moved = true;

        if (snapState !== 'none') {
          const ratio = Math.min(0.85, Math.max(0.15, e.clientX / window.innerWidth));
          const restoredX = Math.max(
            8,
            Math.min(window.innerWidth - pos.width - 8, Math.round(e.clientX - pos.width * ratio))
          );
          const restoredY = Math.max(4, e.clientY - 14);
          dragRef.current.origX = restoredX;
          dragRef.current.origY = restoredY;
          dragRef.current.startX = e.clientX;
          dragRef.current.startY = e.clientY;
          setPos((prev) => ({ ...prev, x: restoredX, y: restoredY }));
          onSnapChange(id, 'none');
          return;
        }
      }

      const nextX = Math.max(
        -pos.width + 120,
        Math.min(window.innerWidth - 120, dragRef.current.origX + (e.clientX - dragRef.current.startX))
      );
      const nextY = Math.max(
        0,
        Math.min(window.innerHeight - 68, dragRef.current.origY + (e.clientY - dragRef.current.startY))
      );
      setPos((prev) => ({ ...prev, x: nextX, y: nextY }));

      // Detect Aero Snap edges
      if (e.clientY <= 10) {
        setSnapPreview('maximized');
      } else if (e.clientX <= 12) {
        setSnapPreview('left');
      } else if (e.clientX >= window.innerWidth - 12) {
        setSnapPreview('right');
      } else {
        setSnapPreview('none');
      }
    },
    [id, onSnapChange, pos.width, snapState]
  );

  const finishDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, applySnap: boolean) => {
      if (!dragRef.current.dragging) return;
      dragRef.current.dragging = false;
      dragRef.current.moved = false;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore capture release error
      }
      if (applySnap && snapPreview !== 'none') {
        aeroSound.playClick();
        onSnapChange(id, snapPreview);
      }
      setSnapPreview('none');
    },
    [id, onSnapChange, snapPreview]
  );

  const startResize = useCallback(
    (dir: ResizeDir) => (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0 || isMobile || snapState !== 'none') return;
      e.stopPropagation();
      onFocus(id);
      resizeRef.current = {
        resizing: true,
        dir,
        startX: e.clientX,
        startY: e.clientY,
        origPos: { ...pos },
      };
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    },
    [id, isMobile, onFocus, pos, snapState]
  );

  const moveResize = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const r = resizeRef.current;
    if (!r || !r.resizing) return;
    const dx = e.clientX - r.startX;
    const dy = e.clientY - r.startY;
    const minW = 380;
    const minH = 260;

    setPos((prev) => {
      let { x, width, height } = prev;
      if (r.dir === 'e' || r.dir === 'se') {
        width = Math.max(minW, Math.min(window.innerWidth - r.origPos.x - 4, r.origPos.width + dx));
      }
      if (r.dir === 's' || r.dir === 'se') {
        height = Math.max(minH, Math.min(window.innerHeight - r.origPos.y - 44, r.origPos.height + dy));
      }
      if (r.dir === 'w') {
        const maxDelta = r.origPos.width - minW;
        const clampedDx = Math.max(-r.origPos.x + 4, Math.min(maxDelta, dx));
        x = r.origPos.x + clampedDx;
        width = r.origPos.width - clampedDx;
      }
      return { ...prev, x, width, height };
    });
  }, []);

  const endResize = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!resizeRef.current?.resizing) return;
    resizeRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  }, []);

  if (!isOpen || isMinimized) return null;

  // Compute actual geometry based on snapState and mobile viewport
  let style: React.CSSProperties;
  if (isMobile || snapState === 'maximized') {
    style = {
      left: 0,
      top: 0,
      width: '100vw',
      height: 'calc(100vh - 40px)',
      zIndex,
    };
  } else if (snapState === 'left') {
    style = {
      left: 0,
      top: 0,
      width: '50vw',
      height: 'calc(100vh - 40px)',
      zIndex,
    };
  } else if (snapState === 'right') {
    style = {
      left: '50vw',
      top: 0,
      width: '50vw',
      height: 'calc(100vh - 40px)',
      zIndex,
    };
  } else {
    style = {
      left: `${pos.x}px`,
      top: `${pos.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
      zIndex,
    };
  }

  const isMaxOrMobile = isMobile || snapState === 'maximized';

  return (
    <>
      {/* Aero Snap Glass Preview Ghost Rectangle */}
      {snapPreview !== 'none' && (
        <div
          className="fixed pointer-events-none rounded-[6px] border border-white/80 bg-sky-300/20 backdrop-blur-[4px] shadow-[0_0_20px_rgba(92,225,255,0.55),inset_0_0_0_1px_rgba(255,255,255,0.6)] transition-all duration-150"
          style={{
            zIndex: zIndex - 1,
            top: '4px',
            height: 'calc(100vh - 48px)',
            left: snapPreview === 'right' ? 'calc(50vw + 2px)' : '4px',
            width: snapPreview === 'maximized' ? 'calc(100vw - 8px)' : 'calc(50vw - 6px)',
          }}
        />
      )}

      <section
        role="dialog"
        aria-label={title}
        onMouseDown={() => onFocus(id)}
        style={style}
        className={`w7-window ${isActive ? 'active' : 'inactive'} ${isMaxOrMobile ? 'maximized' : ''}`}
      >
        {/* Aero Glass Title Bar */}
        <div
          className="w7-title-bar"
          onPointerDown={handlePointerDownTitle}
          onPointerMove={handlePointerMoveTitle}
          onPointerUp={(e) => finishDrag(e, true)}
          onPointerCancel={(e) => finishDrag(e, false)}
          onDoubleClick={() => {
            if (isMobile) return;
            aeroSound.playClick();
            onSnapChange(id, snapState === 'maximized' ? 'none' : 'maximized');
          }}
        >
          <div className="w7-title-bar-left">
            <div className="w-4 h-4 flex items-center justify-center shrink-0 overflow-hidden drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] [&>svg]:w-4 [&>svg]:h-4">
              {icon}
            </div>
            <span className="w7-title-bar-text">{title}</span>
          </div>

          {/* Top-Right Attached Caption Controls Pill */}
          <div className="w7-title-bar-controls">
            <button
              type="button"
              aria-label="Minimize"
              title="Minimize"
              onClick={(e) => {
                e.stopPropagation();
                aeroSound.playClick();
                onMinimize(id);
              }}
              className="w7-caption-btn is-minimize"
            >
              <svg width="11" height="10" viewBox="0 0 11 10" aria-hidden="true">
                <rect x="1" y="6" width="9" height="3" fill="#fff" stroke="#1e293b" strokeWidth="0.9" />
              </svg>
            </button>

            {!isMobile && (
              <button
                type="button"
                aria-label={snapState === 'maximized' ? 'Restore Down' : 'Maximize'}
                title={snapState === 'maximized' ? 'Restore Down' : 'Maximize'}
                onClick={(e) => {
                  e.stopPropagation();
                  aeroSound.playClick();
                  onSnapChange(id, snapState === 'maximized' ? 'none' : 'maximized');
                }}
                className={`w7-caption-btn ${snapState === 'maximized' ? 'is-restore' : 'is-maximize'}`}
              >
                {snapState === 'maximized' ? (
                  <svg width="12" height="11" viewBox="0 0 12 11" aria-hidden="true">
                    <path d="M3 1 H11 V8 H9 V3 H3 Z" fill="#fff" stroke="#1e293b" strokeWidth="0.8" />
                    <rect x="1" y="3" width="8" height="7" fill="none" stroke="#1e293b" strokeWidth="1.6" />
                    <rect x="1.5" y="3.5" width="7" height="6" fill="none" stroke="#fff" strokeWidth="1" />
                  </svg>
                ) : (
                  <svg width="11" height="10" viewBox="0 0 11 10" aria-hidden="true">
                    <rect x="1" y="1" width="9" height="8" fill="none" stroke="#1e293b" strokeWidth="1.8" />
                    <rect x="1.5" y="1.5" width="8" height="7" fill="none" stroke="#fff" strokeWidth="1.1" />
                  </svg>
                )}
              </button>
            )}

            <button
              type="button"
              aria-label="Close"
              title="Close"
              onClick={(e) => {
                e.stopPropagation();
                aeroSound.playClick();
                onClose(id);
              }}
              className="w7-caption-btn is-close"
            >
              <svg width="11" height="10" viewBox="0 0 11 10" aria-hidden="true">
                <path
                  d="M2 1.5 L5.5 5 L9 1.5 M2 8.5 L5.5 5 L9 8.5"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
                <path
                  d="M2 1.5 L5.5 5 L9 1.5 M2 8.5 L5.5 5 L9 8.5"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Window Client Area */}
        <div className="w7-window-body">{children}</div>

        {/* Interactive Aero Glass Resize Borders (Desktop non-snapped state) */}
        {!isMobile && snapState === 'none' && (
          <>
            <div
              aria-hidden="true"
              onPointerDown={startResize('e')}
              onPointerMove={moveResize}
              onPointerUp={endResize}
              onPointerCancel={endResize}
              className="absolute top-6 bottom-2 right-0 w-2 cursor-ew-resize z-20"
            />
            <div
              aria-hidden="true"
              onPointerDown={startResize('w')}
              onPointerMove={moveResize}
              onPointerUp={endResize}
              onPointerCancel={endResize}
              className="absolute top-6 bottom-2 left-0 w-2 cursor-ew-resize z-20"
            />
            <div
              aria-hidden="true"
              onPointerDown={startResize('s')}
              onPointerMove={moveResize}
              onPointerUp={endResize}
              onPointerCancel={endResize}
              className="absolute bottom-0 left-2 right-2 h-2 cursor-ns-resize z-20"
            />
            <div
              aria-hidden="true"
              onPointerDown={startResize('se')}
              onPointerMove={moveResize}
              onPointerUp={endResize}
              onPointerCancel={endResize}
              className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-30"
            />
          </>
        )}
      </section>
    </>
  );
};

