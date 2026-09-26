'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MinesweeperIcon } from '@/core/assets';
import { animateMinesweeperReveal, animateBoardShake } from '@/core/animation';
import { aeroSound } from '@/components/AeroSound';
import type { AppModuleContract } from '@/apps/types';

type DifficultyKey = 'beginner' | 'intermediate' | 'expert';

interface DifficultyConfig {
  label: string;
  rows: number;
  cols: number;
  mines: number;
}

const DIFFICULTIES: Record<DifficultyKey, DifficultyConfig> = {
  beginner: { label: 'Beginner (9×9, 10 Mines)', rows: 9, cols: 9, mines: 10 },
  intermediate: { label: 'Intermediate (16×16, 40 Mines)', rows: 16, cols: 16, mines: 40 },
  expert: { label: 'Expert (30×16, 99 Mines)', rows: 16, cols: 30, mines: 99 },
};

interface CellState {
  r: number;
  c: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  isQuestion: boolean;
  neighborMines: number;
  exploded?: boolean;
}

const NUMBER_COLORS: Record<number, string> = {
  1: '#1d4ed8',
  2: '#15803d',
  3: '#dc2626',
  4: '#312e81',
  5: '#7f1d1d',
  6: '#0f766e',
  7: '#111827',
  8: '#4b5563',
};

function createEmptyBoard(rows: number, cols: number): CellState[][] {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      r,
      c,
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      isQuestion: false,
      neighborMines: 0,
    }))
  );
}

function populateMines(
  board: CellState[][],
  rows: number,
  cols: number,
  mineCount: number,
  safeR: number,
  safeC: number
): CellState[][] {
  const next = board.map((row) => row.map((cell) => ({ ...cell })));
  let placed = 0;

  while (placed < mineCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    // Keep 3x3 area around first click completely mine-free
    if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
    if (next[r][c].isMine) continue;
    next[r][c].isMine = true;
    placed++;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (next[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && next[nr][nc].isMine) {
            count++;
          }
        }
      }
      next[r][c].neighborMines = count;
    }
  }

  return next;
}

export const MinesweeperGame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<DifficultyKey>('beginner');
  const cfg = DIFFICULTIES[difficulty];

  const [board, setBoard] = useState<CellState[][]>(() => createEmptyBoard(cfg.rows, cfg.cols));
  const [status, setStatus] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [flagMode, setFlagMode] = useState<boolean>(false);
  const [elapsed, setElapsed] = useState<number>(0);
  const [gamesPlayed, setGamesPlayed] = useState<number>(0);
  const [gamesWon, setGamesWon] = useState<number>(0);

  const boardRef = useRef<HTMLDivElement>(null);

  const startNewGame = useCallback(
    (diff: DifficultyKey = difficulty) => {
      aeroSound.playClick();
      const d = DIFFICULTIES[diff];
      setDifficulty(diff);
      setBoard(createEmptyBoard(d.rows, d.cols));
      setStatus('idle');
      setElapsed(0);
    },
    [difficulty]
  );

  // F2 keyboard shortcut to start a new game
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        startNewGame(difficulty);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [difficulty, startNewGame]);

  // Timer tick while playing
  useEffect(() => {
    if (status !== 'playing') return;
    const t = setInterval(() => {
      setElapsed((prev) => Math.min(999, prev + 1));
    }, 1000);
    return () => clearInterval(t);
  }, [status]);

  const flagCount = board.reduce(
    (sum, row) => sum + row.filter((c) => c.isFlagged).length,
    0
  );
  const remainingMines = Math.max(0, cfg.mines - flagCount);

  const toggleFlag = (r: number, c: number) => {
    if (status === 'won' || status === 'lost') return;
    const target = board[r][c];
    if (target.isRevealed) return;
    aeroSound.playClick();

    setBoard((prev) =>
      prev.map((row, ri) =>
        row.map((cell, ci) => {
          if (ri !== r || ci !== c) return cell;
          if (!cell.isFlagged && !cell.isQuestion) {
            return { ...cell, isFlagged: true, isQuestion: false };
          }
          if (cell.isFlagged) {
            return { ...cell, isFlagged: false, isQuestion: true };
          }
          return { ...cell, isFlagged: false, isQuestion: false };
        })
      )
    );
  };

  const revealTargets = (working: CellState[][], targets: [number, number][]) => {
    // Check if any target is an unflagged mine
    const hitMine = targets.find(([tr, tc]) => working[tr][tc].isMine && !working[tr][tc].isFlagged);
    if (hitMine) {
      const [mr, mc] = hitMine;
      aeroSound.playClick();
      working[mr][mc].exploded = true;
      for (let ri = 0; ri < cfg.rows; ri++) {
        for (let ci = 0; ci < cfg.cols; ci++) {
          if (working[ri][ci].isMine) {
            working[ri][ci].isRevealed = true;
          }
        }
      }
      setBoard(working);
      setStatus('lost');
      setGamesPlayed((p) => p + 1);
      animateBoardShake(boardRef.current);
      return;
    }

    // BFS Flood-Fill Reveal
    const queue: [number, number][] = [...targets];
    const newlyRevealedKeys: string[] = [];

    while (queue.length > 0) {
      const [cr, cc] = queue.shift()!;
      const cell = working[cr][cc];
      if (cell.isRevealed || cell.isFlagged) continue;
      cell.isRevealed = true;
      cell.isQuestion = false;
      newlyRevealedKeys.push(`${cr}-${cc}`);

      if (cell.neighborMines === 0 && !cell.isMine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = cr + dr;
            const nc = cc + dc;
            if (
              nr >= 0 &&
              nr < cfg.rows &&
              nc >= 0 &&
              nc < cfg.cols &&
              !working[nr][nc].isRevealed &&
              !working[nr][nc].isFlagged
            ) {
              queue.push([nr, nc]);
            }
          }
        }
      }
    }

    if (newlyRevealedKeys.length === 0) return;

    aeroSound.playClick();
    setBoard(working);

    // Animate newly revealed cells via GSAP
    requestAnimationFrame(() => {
      if (!boardRef.current) return;
      const domCells = newlyRevealedKeys
        .slice(0, 40)
        .map((k) => boardRef.current?.querySelector<HTMLElement>(`[data-cell="${k}"]`))
        .filter((el): el is HTMLElement => Boolean(el));
      animateMinesweeperReveal(domCells);
    });

    // Check Win condition
    const unrevealedSafe = working.reduce(
      (acc, row) => acc + row.filter((cell) => !cell.isMine && !cell.isRevealed).length,
      0
    );
    if (unrevealedSafe === 0) {
      aeroSound.playChime();
      setStatus('won');
      setGamesPlayed((p) => p + 1);
      setGamesWon((w) => w + 1);
    }
  };

  const revealCell = (r: number, c: number) => {
    if (status === 'won' || status === 'lost') return;
    if (flagMode) {
      toggleFlag(r, c);
      return;
    }

    let working = board.map((row) => row.map((cell) => ({ ...cell })));
    if (working[r][c].isFlagged || working[r][c].isRevealed) return;

    if (status === 'idle') {
      working = populateMines(working, cfg.rows, cfg.cols, cfg.mines, r, c);
      setStatus('playing');
    }

    revealTargets(working, [[r, c]]);
  };

  const chordCell = (r: number, c: number) => {
    if (status !== 'playing') return;
    const center = board[r][c];
    if (!center.isRevealed || center.neighborMines <= 0) return;

    let adjacentFlags = 0;
    const unflaggedNeighbors: [number, number][] = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < cfg.rows && nc >= 0 && nc < cfg.cols) {
          const nCell = board[nr][nc];
          if (nCell.isFlagged) {
            adjacentFlags++;
          } else if (!nCell.isRevealed) {
            unflaggedNeighbors.push([nr, nc]);
          }
        }
      }
    }

    if (adjacentFlags === center.neighborMines && unflaggedNeighbors.length > 0) {
      const working = board.map((row) => row.map((cell) => ({ ...cell })));
      revealTargets(working, unflaggedNeighbors);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#1e3a8a] via-[#172554] to-[#0f172a] text-white select-none">
      {/* 1. Classic Windows 7 Minesweeper Menu Bar */}
      <div className="flex items-center justify-between px-2.5 py-1 bg-gradient-to-b from-[#ffffff] via-[#f1f5f9] to-[#e2e8f0] border-b border-[#94a3b8] text-[12px] text-[#1e293b]">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => startNewGame(difficulty)}
            className="px-2 py-0.5 rounded hover:bg-[#dbeafe] font-medium cursor-pointer"
          >
            <u>G</u>ame (New F2)
          </button>
          {(Object.keys(DIFFICULTIES) as DifficultyKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => startNewGame(key)}
              className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                difficulty === key
                  ? 'bg-[#bfdbfe] text-[#1e3a8a] font-semibold border border-[#60a5fa]'
                  : 'hover:bg-[#e2e8f0]'
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            aeroSound.playClick();
            setFlagMode(!flagMode);
          }}
          className={`px-2.5 py-0.5 rounded border text-[11px] cursor-pointer transition-transform active:scale-[0.96] ${
            flagMode
              ? 'bg-[#fef08a] border-[#ca8a04] text-[#713f12] font-semibold'
              : 'bg-white border-[#94a3b8] text-[#1e293b]'
          }`}
          title="Toggle Flag Mode (or right-click any tile)"
        >
          🚩 {flagMode ? 'Flag Mode: ON' : 'Dig Mode (Right-click to Flag)'}
        </button>
      </div>

      {/* 2. Main Minesweeper Board Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 overflow-auto w7-scroll">
        <div
          ref={boardRef}
          className="p-2.5 rounded-[8px] bg-gradient-to-b from-[#3b82f6]/35 to-[#1e3a8a]/65 border border-sky-300/45 shadow-[0_10px_28px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.35)]"
        >
          <div
            className="grid gap-[2px] bg-[#0f172a] p-1.5 rounded-[4px] border border-sky-200/30"
            style={{
              gridTemplateColumns: `repeat(${cfg.cols}, minmax(0, 1fr))`,
            }}
          >
            {board.map((row) =>
              row.map((cell) => {
                const key = `${cell.r}-${cell.c}`;
                const isCheckerDark = (cell.r + cell.c) % 2 === 1;
                const cellSizeClass =
                  difficulty === 'expert'
                    ? 'w-[22px] h-[22px] text-[12px]'
                    : difficulty === 'intermediate'
                      ? 'w-[24px] h-[24px] text-[13px]'
                      : 'w-[26px] h-[26px] text-[13.5px]';

                if (cell.isRevealed) {
                  return (
                    <div
                      key={key}
                      data-cell={key}
                      onDoubleClick={() => chordCell(cell.r, cell.c)}
                      onAuxClick={(e) => {
                        if (e.button === 1) {
                          e.preventDefault();
                          chordCell(cell.r, cell.c);
                        }
                      }}
                      title={
                        cell.neighborMines > 0
                          ? 'Double-click or middle-click to chord adjacent tiles'
                          : undefined
                      }
                      className={`${cellSizeClass} rounded-[2px] flex items-center justify-center font-bold select-none ${
                        cell.exploded
                          ? 'bg-gradient-to-b from-red-500 to-red-700 text-white shadow-inner'
                          : isCheckerDark
                          ? 'bg-[#dbeafe] text-[#0f172a]'
                          : 'bg-[#eff6ff] text-[#0f172a]'
                      } ${cell.neighborMines > 0 ? 'cursor-pointer' : ''}`}
                    >
                      {cell.isMine ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" aria-label="Mine">
                          <line x1="12" y1="2" x2="12" y2="22" stroke="#0f172a" strokeWidth="2.5" />
                          <line x1="2" y1="12" x2="22" y2="12" stroke="#0f172a" strokeWidth="2.5" />
                          <line x1="5" y1="5" x2="19" y2="19" stroke="#0f172a" strokeWidth="2.2" />
                          <line x1="19" y1="5" x2="5" y2="19" stroke="#0f172a" strokeWidth="2.2" />
                          <circle cx="12" cy="12" r="6" fill="#0f172a" />
                          <circle cx="10" cy="10" r="2" fill="#ffffff" />
                        </svg>
                      ) : cell.neighborMines > 0 ? (
                        <span style={{ color: NUMBER_COLORS[cell.neighborMines] }}>
                          {cell.neighborMines}
                        </span>
                      ) : null}
                    </div>
                  );
                }

                return (
                  <button
                    key={key}
                    type="button"
                    data-cell={key}
                    aria-label={`Row ${cell.r + 1} Column ${cell.c + 1}`}
                    onClick={() => revealCell(cell.r, cell.c)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      toggleFlag(cell.r, cell.c);
                    }}
                    className={`${cellSizeClass} rounded-[3px] border border-[#93c5fd]/70 bg-gradient-to-b from-[#60a5fa] via-[#3b82f6] to-[#1d4ed8] hover:from-[#93c5fd] hover:via-[#60a5fa] hover:to-[#2563eb] active:scale-[0.94] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] flex items-center justify-center cursor-pointer transition-transform`}
                  >
                    {cell.isFlagged ? (
                      <svg width="14" height="14" viewBox="0 0 20 20" aria-label="Flagged">
                        <line x1="6" y1="3" x2="6" y2="17" stroke="#ffffff" strokeWidth="2" />
                        <polygon points="7,3 16,6.5 7,10" fill="#ef4444" stroke="#fee2e2" strokeWidth="0.6" />
                        <rect x="3.5" y="15.5" width="7" height="2" rx="0.5" fill="#e2e8f0" />
                      </svg>
                    ) : cell.isQuestion ? (
                      <span className="text-yellow-200 font-bold text-[13px] drop-shadow">?</span>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Win / Loss Banner */}
        {(status === 'won' || status === 'lost') && (
          <div className="mt-3 px-4 py-2 rounded-[6px] bg-black/60 border border-white/30 backdrop-blur-md flex items-center gap-4">
            <div className="text-[12.5px]">
              {status === 'won' ? (
                <span className="text-emerald-300 font-semibold">
                  🏆 Congratulations! You cleared the minefield in {elapsed}s!
                </span>
              ) : (
                <span className="text-rose-300 font-semibold">
                  💥 Boom! You hit a naval mine after {elapsed}s.
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => startNewGame(difficulty)}
              className="w7-btn default !min-h-[22px] font-semibold"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* 3. Bottom Windows 7 Aero Counter Bar (Time & Remaining Mines) */}
      <div className="h-[42px] px-4 bg-gradient-to-b from-[#0f172a]/90 to-[#020617] border-t border-sky-400/30 flex items-center justify-between">
        {/* Elapsed Timer Pill */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-sky-500/20 border border-sky-300/40 flex items-center justify-center text-[13px]">
            ⏱️
          </div>
          <div className="px-3 py-0.5 rounded bg-[#082f49] border border-sky-400/50 font-mono text-[16px] font-bold text-sky-200 min-w-[64px] text-center shadow-inner">
            {String(elapsed).padStart(3, '0')}
          </div>
        </div>

        {/* Win Rate Status */}
        <div className="text-[11px] text-sky-200/80 hidden sm:block">
          Won: <strong>{gamesWon}</strong> / {gamesPlayed} &middot;{' '}
          {status === 'idle' ? 'First click is always safe' : status.toUpperCase()}
        </div>

        {/* Remaining Mines Pill */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-0.5 rounded bg-[#082f49] border border-sky-400/50 font-mono text-[16px] font-bold text-amber-300 min-w-[64px] text-center shadow-inner">
            {String(remainingMines).padStart(2, '0')}
          </div>
          <div className="w-7 h-7 rounded-full bg-sky-500/20 border border-sky-300/40 flex items-center justify-center">
            <MinesweeperIcon size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const minesweeperModule: AppModuleContract = {
  id: 'minesweeper',
  getWindowConfig: () => ({
    id: 'minesweeper',
    title: 'Minesweeper',
    shortLabel: 'Minesweeper',
    glowColor: 'rgba(59, 130, 246, 0.68)',
    defaultPos: { x: 300, y: 52, width: 520, height: 510 },
    pinned: false,
    category: 'game',
    description: 'Windows 7 Aero Minesweeper with Beginner, Intermediate & Expert modes',
  }),
  renderIcon: (size = 32) => <MinesweeperIcon size={size} />,
  Component: MinesweeperGame,
};
