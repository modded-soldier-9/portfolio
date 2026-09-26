'use client';

import React from 'react';

export type CardSuit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type CardRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export interface PlayingCardData {
  id: string;
  suit: CardSuit;
  rank: CardRank;
  faceUp: boolean;
}

export const RANK_LABELS: Record<CardRank, string> = {
  1: 'A',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: 'J',
  12: 'Q',
  13: 'K',
};

export const SUIT_SYMBOLS: Record<CardSuit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};

export function isRedSuit(suit: CardSuit): boolean {
  return suit === 'hearts' || suit === 'diamonds';
}

export const SuitGlyphSvg: React.FC<{ suit: CardSuit; size?: number; className?: string }> = ({
  suit,
  size = 16,
  className = '',
}) => {
  const color = isRedSuit(suit) ? '#dc2626' : '#0f172a';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      {suit === 'hearts' && (
        <path
          d="M12 21 C12 21, 3 14.5, 3 8.5 C3 5.2, 5.6 3, 8.5 3 C10.4 3, 11.5 4.2, 12 5.5 C12.5 4.2, 13.6 3, 15.5 3 C18.4 3, 21 5.2, 21 8.5 C21 14.5, 12 21, 12 21 Z"
          fill={color}
        />
      )}
      {suit === 'diamonds' && (
        <polygon points="12,2 21,12 12,22 3,12" fill={color} />
      )}
      {suit === 'spades' && (
        <path
          d="M12 2 C12 2, 3 10.5, 3 15 C3 17.8, 5.2 19.5, 7.8 19.5 C9.4 19.5, 10.5 18.7, 11.1 17.8 L9.5 22 H14.5 L12.9 17.8 C13.5 18.7, 14.6 19.5, 16.2 19.5 C18.8 19.5, 21 17.8, 21 15 C21 10.5, 12 2, 12 2 Z"
          fill={color}
        />
      )}
      {suit === 'clubs' && (
        <g fill={color}>
          <circle cx="12" cy="7.5" r="4.5" />
          <circle cx="7.2" cy="13.5" r="4.5" />
          <circle cx="16.8" cy="13.5" r="4.5" />
          <path d="M11 14 L9.2 22 H14.8 L13 14 Z" />
        </g>
      )}
    </svg>
  );
};

interface PlayingCardSvgProps {
  suit: CardSuit;
  rank: CardRank;
  faceUp?: boolean;
  selected?: boolean;
  highlighted?: boolean;
  disabled?: boolean;
  width?: number;
  height?: number;
  onClick?: (e: React.MouseEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  className?: string;
}

/**
 * Windows 7 Vector Playing Card Component
 * Renders either the classic Aero Blue lattice back or crisp vector front
 */
export const PlayingCardSvg: React.FC<PlayingCardSvgProps> = ({
  suit,
  rank,
  faceUp = true,
  selected = false,
  highlighted = false,
  disabled = false,
  width = 76,
  height = 106,
  onClick,
  onDoubleClick,
  draggable = false,
  onDragStart,
  className = '',
}) => {
  const red = isRedSuit(suit);
  const rankStr = RANK_LABELS[rank];
  const color = red ? '#dc2626' : '#0f172a';
  const isFaceCard = rank >= 11;

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      draggable={draggable && faceUp && !disabled}
      onDragStart={onDragStart}
      onClick={disabled ? undefined : onClick}
      onDoubleClick={disabled ? undefined : onDoubleClick}
      style={{ width, height }}
      className={`relative select-none rounded-[6px] transition-transform duration-150 ${
        selected
          ? 'ring-2 ring-[#38bdf8] -translate-y-2 shadow-[0_6px_14px_rgba(56,189,248,0.55)]'
          : highlighted
          ? 'ring-2 ring-[#fde047] shadow-[0_4px_12px_rgba(250,204,21,0.5)]'
          : 'shadow-[0_2px_6px_rgba(0,0,0,0.45)]'
      } ${disabled ? 'opacity-70 cursor-not-allowed' : onClick ? 'cursor-pointer active:scale-[0.97]' : ''} ${className}`}
    >
      {!faceUp ? (
        /* Classic Windows 7 Aero Blue Geometric Card Back */
        <svg viewBox="0 0 76 106" className="w-full h-full rounded-[6px] overflow-hidden" aria-label="Card face down">
          <defs>
            <linearGradient id="w7CardBackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="45%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
          <rect x="0.5" y="0.5" width="75" height="105" rx="5.5" fill="#ffffff" stroke="#334155" strokeWidth="1" />
          <rect x="4" y="4" width="68" height="98" rx="3.5" fill="url(#w7CardBackGrad)" stroke="#bae6fd" strokeWidth="0.8" />
          {/* Inner ornamental lattice */}
          <rect x="8" y="8" width="60" height="90" rx="2" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" strokeDasharray="3 2" />
          <circle cx="38" cy="53" r="16" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
          <path d="M38 39 L48 53 L38 67 L28 53 Z" fill="rgba(255,255,255,0.28)" stroke="#ffffff" strokeWidth="0.8" />
          <circle cx="38" cy="53" r="4" fill="#bae6fd" />
        </svg>
      ) : (
        /* Vector Playing Card Front */
        <svg
          viewBox="0 0 76 106"
          className="w-full h-full rounded-[6px] overflow-hidden"
          aria-label={`${rankStr} of ${suit}`}
        >
          <rect x="0.5" y="0.5" width="75" height="105" rx="5.5" fill="#ffffff" stroke="#475569" strokeWidth="1" />
          {/* Subtle inner card sheen */}
          <rect x="2" y="2" width="72" height="102" rx="4" fill="none" stroke="#f1f5f9" strokeWidth="1" />

          {/* Top-Left Corner Index */}
          <text
            x="6.5"
            y="15"
            fill={color}
            fontSize="12"
            fontWeight="bold"
            fontFamily="Segoe UI, Arial, sans-serif"
          >
            {rankStr}
          </text>
          <text x="6.5" y="26.5" fill={color} fontSize="12" fontFamily="Segoe UI Symbol, sans-serif">
            {SUIT_SYMBOLS[suit]}
          </text>

          {/* Bottom-Right Inverted Corner Index */}
          <g transform="rotate(180 38 53)">
            <text
              x="6.5"
              y="15"
              fill={color}
              fontSize="12"
              fontWeight="bold"
              fontFamily="Segoe UI, Arial, sans-serif"
            >
              {rankStr}
            </text>
            <text x="6.5" y="26.5" fill={color} fontSize="12" fontFamily="Segoe UI Symbol, sans-serif">
              {SUIT_SYMBOLS[suit]}
            </text>
          </g>

          {/* Center Artwork */}
          {isFaceCard ? (
            <g>
              <rect
                x="17"
                y="22"
                width="42"
                height="62"
                rx="3"
                fill={red ? '#fef2f2' : '#f8fafc'}
                stroke={red ? '#fca5a5' : '#cbd5e1'}
                strokeWidth="1"
              />
              {/* Royal Crown Motif */}
              <polygon
                points="26,42 31,33 38,40 45,33 50,42"
                fill="#facc15"
                stroke="#ca8a04"
                strokeWidth="1"
              />
              <text
                x="38"
                y="64"
                textAnchor="middle"
                fill={color}
                fontSize="22"
                fontWeight="bold"
                fontFamily="Georgia, serif"
              >
                {rankStr}
              </text>
              <text
                x="38"
                y="78"
                textAnchor="middle"
                fill={color}
                fontSize="14"
              >
                {SUIT_SYMBOLS[suit]}
              </text>
            </g>
          ) : (
            <text
              x="38"
              y="62"
              textAnchor="middle"
              fill={color}
              fontSize={rank === 1 ? '34' : '26'}
              fontFamily="Segoe UI Symbol, sans-serif"
            >
              {SUIT_SYMBOLS[suit]}
            </text>
          )}
        </svg>
      )}
    </div>
  );
};
