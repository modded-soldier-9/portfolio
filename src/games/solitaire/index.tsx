'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SolitaireIcon } from '@/core/assets';
import {
  PlayingCardSvg,
  isRedSuit,
  SUIT_SYMBOLS,
  type CardSuit,
  type CardRank,
  type PlayingCardData,
} from '@/core/assets/playing-cards';
import { animateCardsDeal } from '@/core/animation';
import { aeroSound } from '@/components/AeroSound';
import type { AppModuleContract } from '@/apps/types';

const SUITS: CardSuit[] = ['spades', 'hearts', 'diamonds', 'clubs'];

interface SolitaireState {
  stock: PlayingCardData[];
  waste: PlayingCardData[];
  foundations: Record<CardSuit, PlayingCardData[]>;
  tableau: PlayingCardData[][];
  score: number;
  moves: number;
}

interface SelectionSource {
  zone: 'waste' | 'tableau' | 'foundation';
  colIdx?: number;
  cardIdx?: number;
  suit?: CardSuit;
}

function createShuffledDeck(): PlayingCardData[] {
  const deck: PlayingCardData[] = [];
  for (const suit of SUITS) {
    for (let r = 1; r <= 13; r++) {
      deck.push({
        id: `${suit}-${r}`,
        suit,
        rank: r as CardRank,
        faceUp: false,
      });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function dealInitialSolitaire(): SolitaireState {
  const deck = createShuffledDeck();
  const tableau: PlayingCardData[][] = Array.from({ length: 7 }, () => []);
  let cursor = 0;

  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = { ...deck[cursor++], faceUp: row === col };
      tableau[col].push(card);
    }
  }

  const stock = deck.slice(cursor).map((c) => ({ ...c, faceUp: false }));

  return {
    stock,
    waste: [],
    foundations: {
      spades: [],
      hearts: [],
      diamonds: [],
      clubs: [],
    },
    tableau,
    score: 0,
    moves: 0,
  };
}

export const SolitaireGame: React.FC = () => {
  const [game, setGame] = useState<SolitaireState>(() => dealInitialSolitaire());
  const [history, setHistory] = useState<SolitaireState[]>([]);
  const [drawCount, setDrawCount] = useState<1 | 3>(1);
  const [selected, setSelected] = useState<SelectionSource | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);

  const tableRef = useRef<HTMLDivElement>(null);

  const totalFoundationCards =
    game.foundations.spades.length +
    game.foundations.hearts.length +
    game.foundations.diamonds.length +
    game.foundations.clubs.length;
  const isWon = totalFoundationCards === 52;

  useEffect(() => {
    if (isWon) return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [isWon]);

  const triggerDealAnimation = useCallback(() => {
    requestAnimationFrame(() => {
      if (!tableRef.current) return;
      const cards = Array.from(tableRef.current.querySelectorAll<HTMLElement>('[data-sol-card="true"]'));
      animateCardsDeal(cards.slice(0, 28));
    });
  }, []);

  useEffect(() => {
    triggerDealAnimation();
  }, [triggerDealAnimation]);

  const startNewDeal = (newDraw: 1 | 3 = drawCount) => {
    aeroSound.playClick();
    setDrawCount(newDraw);
    setGame(dealInitialSolitaire());
    setHistory([]);
    setSelected(null);
    setElapsed(0);
    triggerDealAnimation();
  };

  const commitState = (next: SolitaireState) => {
    setHistory((prev) => [...prev.slice(-20), game]);
    setGame(next);
    setSelected(null);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    aeroSound.playClick();
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setGame(prev);
    setSelected(null);
  };

  const handleStockClick = () => {
    aeroSound.playClick();
    setSelected(null);
    if (game.stock.length === 0) {
      if (game.waste.length === 0) return;
      // Recycle waste back to stock
      const recycled = [...game.waste].reverse().map((c) => ({ ...c, faceUp: false }));
      commitState({
        ...game,
        stock: recycled,
        waste: [],
        moves: game.moves + 1,
      });
      return;
    }

    const take = Math.min(drawCount, game.stock.length);
    const drawn = game.stock.slice(0, take).map((c) => ({ ...c, faceUp: true }));
    commitState({
      ...game,
      stock: game.stock.slice(take),
      waste: [...game.waste, ...drawn],
      moves: game.moves + 1,
    });
  };

  const canPlaceOnFoundation = (card: PlayingCardData, suit: CardSuit): boolean => {
    if (card.suit !== suit) return false;
    const pile = game.foundations[suit];
    const expectedRank = pile.length + 1;
    return card.rank === expectedRank;
  };

  const canPlaceOnTableau = (card: PlayingCardData, targetCol: PlayingCardData[]): boolean => {
    if (targetCol.length === 0) {
      return card.rank === 13; // Only King on empty column
    }
    const topTarget = targetCol[targetCol.length - 1];
    if (!topTarget.faceUp) return false;
    return isRedSuit(card.suit) !== isRedSuit(topTarget.suit) && card.rank === topTarget.rank - 1;
  };

  const getMovingCards = (src: SelectionSource): PlayingCardData[] => {
    if (src.zone === 'waste') {
      return game.waste.length > 0 ? [game.waste[game.waste.length - 1]] : [];
    }
    if (src.zone === 'foundation' && src.suit) {
      const f = game.foundations[src.suit];
      return f.length > 0 ? [f[f.length - 1]] : [];
    }
    if (src.zone === 'tableau' && src.colIdx !== undefined && src.cardIdx !== undefined) {
      return game.tableau[src.colIdx].slice(src.cardIdx);
    }
    return [];
  };

  const executeMoveToFoundation = (src: SelectionSource, suit: CardSuit): boolean => {
    const moving = getMovingCards(src);
    if (moving.length !== 1) return false;
    const card = moving[0];
    if (!canPlaceOnFoundation(card, suit)) return false;

    const nextTableau = game.tableau.map((col) => [...col]);
    let nextWaste = [...game.waste];
    const nextFoundations = {
      ...game.foundations,
      [suit]: [...game.foundations[suit], card],
    };
    let bonus = 10;

    if (src.zone === 'waste') {
      nextWaste = nextWaste.slice(0, -1);
    } else if (src.zone === 'tableau' && src.colIdx !== undefined) {
      const col = nextTableau[src.colIdx];
      col.pop();
      if (col.length > 0 && !col[col.length - 1].faceUp) {
        col[col.length - 1] = { ...col[col.length - 1], faceUp: true };
        bonus += 5;
      }
    } else {
      return false;
    }

    aeroSound.playClick();
    commitState({
      ...game,
      waste: nextWaste,
      tableau: nextTableau,
      foundations: nextFoundations,
      score: game.score + bonus,
      moves: game.moves + 1,
    });
    return true;
  };

  const executeMoveToTableau = (src: SelectionSource, destColIdx: number): boolean => {
    if (src.zone === 'tableau' && src.colIdx === destColIdx) return false;
    const moving = getMovingCards(src);
    if (moving.length === 0) return false;
    const leadCard = moving[0];
    if (!canPlaceOnTableau(leadCard, game.tableau[destColIdx])) return false;

    const nextTableau = game.tableau.map((col) => [...col]);
    let nextWaste = [...game.waste];
    const nextFoundations = { ...game.foundations };
    let bonus = 0;

    if (src.zone === 'waste') {
      nextWaste = nextWaste.slice(0, -1);
      bonus += 5;
    } else if (src.zone === 'foundation' && src.suit) {
      nextFoundations[src.suit] = nextFoundations[src.suit].slice(0, -1);
      bonus -= 15;
    } else if (src.zone === 'tableau' && src.colIdx !== undefined && src.cardIdx !== undefined) {
      const srcCol = nextTableau[src.colIdx];
      nextTableau[src.colIdx] = srcCol.slice(0, src.cardIdx);
      const remaining = nextTableau[src.colIdx];
      if (remaining.length > 0 && !remaining[remaining.length - 1].faceUp) {
        remaining[remaining.length - 1] = { ...remaining[remaining.length - 1], faceUp: true };
        bonus += 5;
      }
    }

    nextTableau[destColIdx] = [...nextTableau[destColIdx], ...moving];

    aeroSound.playClick();
    commitState({
      ...game,
      waste: nextWaste,
      tableau: nextTableau,
      foundations: nextFoundations,
      score: Math.max(0, game.score + bonus),
      moves: game.moves + 1,
    });
    return true;
  };

  const tryAutoMoveCard = (src: SelectionSource) => {
    const moving = getMovingCards(src);
    if (moving.length === 0) return;

    // 1. Try moving single card to its matching Foundation pile first
    if (moving.length === 1) {
      const card = moving[0];
      if (executeMoveToFoundation(src, card.suit)) return;
    }

    // 2. Otherwise try moving to any valid Tableau column
    for (let colIdx = 0; colIdx < 7; colIdx++) {
      if (executeMoveToTableau(src, colIdx)) return;
    }
  };

  const handleAutoSendEligibleToFoundation = () => {
    // Check waste top card first, then each tableau top card
    if (game.waste.length > 0) {
      const topWaste = game.waste[game.waste.length - 1];
      if (canPlaceOnFoundation(topWaste, topWaste.suit)) {
        executeMoveToFoundation({ zone: 'waste' }, topWaste.suit);
        return;
      }
    }
    for (let c = 0; c < 7; c++) {
      const col = game.tableau[c];
      if (col.length > 0) {
        const topCard = col[col.length - 1];
        if (topCard.faceUp && canPlaceOnFoundation(topCard, topCard.suit)) {
          executeMoveToFoundation({ zone: 'tableau', colIdx: c, cardIdx: col.length - 1 }, topCard.suit);
          return;
        }
      }
    }
  };

  return (
    <div
      ref={tableRef}
      onClick={() => setSelected(null)}
      className="flex flex-col h-full bg-gradient-to-b from-[#15803d] via-[#166534] to-[#14532d] text-white select-none"
    >
      {/* 1. Classic Windows 7 Solitaire Menu Bar */}
      <div
        className="flex items-center justify-between px-3 py-1 bg-gradient-to-b from-[#ffffff] via-[#f1f5f9] to-[#e2e8f0] border-b border-[#94a3b8] text-[12px] text-[#1e293b]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => startNewDeal(drawCount)}
            className="px-2 py-0.5 rounded hover:bg-[#dbeafe] font-medium cursor-pointer"
          >
            <u>G</u>ame (New Deal)
          </button>
          <button
            type="button"
            disabled={history.length === 0}
            onClick={handleUndo}
            className="px-2 py-0.5 rounded hover:bg-[#dbeafe] disabled:opacity-40 cursor-pointer"
          >
            ↶ Undo ({history.length})
          </button>
          <button
            type="button"
            onClick={() => startNewDeal(drawCount === 1 ? 3 : 1)}
            className="px-2 py-0.5 rounded bg-[#e2e8f0] hover:bg-[#cbd5e1] text-[11px] font-medium cursor-pointer"
          >
            Mode: Draw {drawCount}
          </button>
        </div>

        <button
          type="button"
          onClick={handleAutoSendEligibleToFoundation}
          className="w7-btn !min-h-[21px] !px-2.5 !text-[11px] font-medium"
          title="Automatically send the next eligible card to its Foundation pile"
        >
          ⚡ Auto-Foundation Move
        </button>
      </div>

      {/* 2. Main Felt Table Area */}
      <div className="flex-1 overflow-y-auto w7-scroll p-3 sm:p-4 flex flex-col gap-4">
        {/* Top Row: Stock + Waste (Left) & 4 Suit Foundations (Right) */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          {/* Stock & Waste */}
          <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            {/* Stock Pile */}
            <div
              onClick={handleStockClick}
              role="button"
              tabIndex={0}
              aria-label="Draw from Stock"
              title="Click to draw from stock (or recycle waste)"
              className="relative w-[76px] h-[106px] rounded-[6px] border-2 border-emerald-300/40 bg-emerald-950/35 flex items-center justify-center cursor-pointer hover:border-emerald-200 transition-colors"
            >
              {game.stock.length > 0 ? (
                <>
                  <PlayingCardSvg suit="spades" rank={1} faceUp={false} />
                  <span className="absolute bottom-1 right-1.5 px-1.5 py-0.2 rounded bg-black/65 text-[10px] font-mono text-emerald-200">
                    {game.stock.length}
                  </span>
                </>
              ) : (
                <div className="w-10 h-10 rounded-full border-2 border-emerald-300/60 flex items-center justify-center text-emerald-200 text-[18px]">
                  ↻
                </div>
              )}
            </div>

            {/* Waste Pile */}
            <div className="relative w-[112px] h-[106px] flex items-center">
              {game.waste.slice(-3).map((card, idx, arr) => {
                const isTop = idx === arr.length - 1;
                const isSel = selected?.zone === 'waste' && isTop;
                return (
                  <div
                    key={card.id}
                    style={{ left: `${idx * 16}px` }}
                    className="absolute top-0"
                  >
                    <PlayingCardSvg
                      suit={card.suit}
                      rank={card.rank}
                      faceUp
                      selected={isSel}
                      draggable={isTop}
                      onDragStart={(e) => {
                        e.dataTransfer.setData(
                          'application/solitaire',
                          JSON.stringify({ zone: 'waste' } satisfies SelectionSource)
                        );
                      }}
                      onClick={() => {
                        if (!isTop) return;
                        aeroSound.playClick();
                        setSelected(isSel ? null : { zone: 'waste' });
                      }}
                      onDoubleClick={() => {
                        if (!isTop) return;
                        tryAutoMoveCard({ zone: 'waste' });
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4 Foundation Piles */}
          <div className="flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
            {SUITS.map((suit) => {
              const pile = game.foundations[suit];
              const topCard = pile.length > 0 ? pile[pile.length - 1] : null;
              const isSel = selected?.zone === 'foundation' && selected.suit === suit;

              return (
                <div
                  key={suit}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    try {
                      const src = JSON.parse(
                        e.dataTransfer.getData('application/solitaire')
                      ) as SelectionSource;
                      executeMoveToFoundation(src, suit);
                    } catch {
                      // Ignore malformed drag data
                    }
                  }}
                  onClick={() => {
                    if (selected) {
                      if (executeMoveToFoundation(selected, suit)) return;
                    }
                    if (topCard) {
                      aeroSound.playClick();
                      setSelected(isSel ? null : { zone: 'foundation', suit });
                    }
                  }}
                  className="relative w-[76px] h-[106px] rounded-[6px] border-2 border-emerald-300/40 bg-emerald-950/35 flex items-center justify-center cursor-pointer hover:border-emerald-200 transition-colors"
                >
                  {topCard ? (
                    <PlayingCardSvg
                      suit={topCard.suit}
                      rank={topCard.rank}
                      faceUp
                      selected={isSel}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData(
                          'application/solitaire',
                          JSON.stringify({ zone: 'foundation', suit })
                        );
                      }}
                    />
                  ) : (
                    <span
                      className={`text-[28px] opacity-35 ${
                        isRedSuit(suit) ? 'text-red-300' : 'text-emerald-100'
                      }`}
                    >
                      {SUIT_SYMBOLS[suit]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Row: 7 Tableau Columns */}
        <div
          className="grid grid-cols-7 gap-2 flex-1 min-h-[310px]"
          onClick={(e) => e.stopPropagation()}
        >
          {game.tableau.map((col, colIdx) => (
            <div
              key={colIdx}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                try {
                  const src = JSON.parse(
                    e.dataTransfer.getData('application/solitaire')
                  ) as SelectionSource;
                  executeMoveToTableau(src, colIdx);
                } catch {
                  // Ignore
                }
              }}
              onClick={() => {
                if (col.length === 0 && selected) {
                  executeMoveToTableau(selected, colIdx);
                }
              }}
              className="relative min-h-[280px] rounded-[6px] border border-emerald-300/25 bg-emerald-950/15 flex flex-col items-center pt-1"
            >
              {col.length === 0 && (
                <div className="w-[72px] h-[100px] rounded-[5px] border border-dashed border-emerald-300/30 flex items-center justify-center text-[11px] text-emerald-200/50">
                  K
                </div>
              )}

              {col.map((card, cardIdx) => {
                const topOffset = cardIdx * 22;
                const isSel =
                  selected?.zone === 'tableau' &&
                  selected.colIdx === colIdx &&
                  selected.cardIdx !== undefined &&
                  cardIdx >= selected.cardIdx;

                return (
                  <div
                    key={card.id}
                    data-sol-card="true"
                    style={{ top: `${topOffset}px` }}
                    className="absolute left-1/2 -translate-x-1/2"
                  >
                    <PlayingCardSvg
                      suit={card.suit}
                      rank={card.rank}
                      faceUp={card.faceUp}
                      selected={isSel}
                      draggable={card.faceUp}
                      onDragStart={(e) => {
                        if (!card.faceUp) return;
                        e.dataTransfer.setData(
                          'application/solitaire',
                          JSON.stringify({
                            zone: 'tableau',
                            colIdx,
                            cardIdx,
                          } satisfies SelectionSource)
                        );
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!card.faceUp) {
                          if (cardIdx === col.length - 1) {
                            aeroSound.playClick();
                            const nextTab = game.tableau.map((c, i) =>
                              i === colIdx
                                ? c.map((item, j) => (j === cardIdx ? { ...item, faceUp: true } : item))
                                : c
                            );
                            commitState({ ...game, tableau: nextTab, score: game.score + 5 });
                          }
                          return;
                        }

                        if (selected) {
                          if (executeMoveToTableau(selected, colIdx)) return;
                        }

                        aeroSound.playClick();
                        if (
                          selected?.zone === 'tableau' &&
                          selected.colIdx === colIdx &&
                          selected.cardIdx === cardIdx
                        ) {
                          setSelected(null);
                        } else {
                          setSelected({ zone: 'tableau', colIdx, cardIdx });
                        }
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        if (!card.faceUp) return;
                        tryAutoMoveCard({ zone: 'tableau', colIdx, cardIdx });
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Victory Overlay Banner */}
        {isWon && (
          <div className="p-4 rounded-[8px] bg-black/70 border border-emerald-300/60 backdrop-blur-md flex items-center justify-between">
            <div>
              <div className="text-[16px] font-bold text-emerald-300">
                🎉 Congratulations! You won Klondike Solitaire!
              </div>
              <div className="text-[12px] text-emerald-100">
                Final Score: {game.score} &middot; Time: {elapsed}s &middot; Moves: {game.moves}
              </div>
            </div>
            <button
              type="button"
              onClick={() => startNewDeal(drawCount)}
              className="w7-btn default font-semibold"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* 3. Bottom Windows 7 Solitaire Status Bar */}
      <div className="h-[26px] px-3 bg-[#0c3b1e] border-t border-emerald-400/30 flex items-center justify-between text-[11.5px] text-emerald-100 shrink-0">
        <span>Tip: Click a card then click its destination, double-click to auto-move, or drag &amp; drop.</span>
        <div className="flex items-center gap-4 font-mono">
          <span>Score: <strong>{game.score}</strong></span>
          <span>Time: <strong>{elapsed}s</strong></span>
          <span>Foundations: <strong>{totalFoundationCards}/52</strong></span>
        </div>
      </div>
    </div>
  );
};

export const solitaireModule: AppModuleContract = {
  id: 'solitaire',
  getWindowConfig: () => ({
    id: 'solitaire',
    title: 'Solitaire',
    shortLabel: 'Solitaire',
    glowColor: 'rgba(34, 197, 94, 0.68)',
    defaultPos: { x: 195, y: 24, width: 840, height: 575 },
    pinned: false,
    category: 'game',
    description: 'Classic Windows 7 Klondike Solitaire with SVG playing cards',
  }),
  renderIcon: (size = 32) => <SolitaireIcon size={size} />,
  Component: SolitaireGame,
};
