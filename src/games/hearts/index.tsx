'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PlayingCardSvg,
  CardSuit,
  CardRank,
  SuitGlyphSvg,
} from '@/core/assets/playing-cards';
import { HeartsIcon } from '@/core/assets';
import { animateCardsDeal } from '@/core/animation';
import { AppModuleContract } from '@/apps/types';

type PlayerId = 'south' | 'west' | 'north' | 'east';
type PassDirection = 'left' | 'right' | 'across' | 'none';
type GamePhase = 'passing' | 'playing' | 'handOver' | 'gameOver';

export interface HeartsCard {
  id: string;
  suit: CardSuit;
  rank: CardRank;
}

interface TrickPlay {
  player: PlayerId;
  card: HeartsCard;
}

const PLAYERS: PlayerId[] = ['south', 'west', 'north', 'east'];

const PLAYER_NAMES: Record<PlayerId, string> = {
  south: 'You',
  west: 'Pauline',
  north: 'Michele',
  east: 'Ben',
};

const PASS_CYCLE: PassDirection[] = ['left', 'right', 'across', 'none'];

const SUIT_SORT_ORDER: Record<CardSuit, number> = {
  clubs: 0,
  diamonds: 1,
  spades: 2,
  hearts: 3,
};

function heartRankValue(rank: CardRank): number {
  return rank === 1 ? 14 : rank;
}

function compareCardsForHand(a: HeartsCard, b: HeartsCard): number {
  if (SUIT_SORT_ORDER[a.suit] !== SUIT_SORT_ORDER[b.suit]) {
    return SUIT_SORT_ORDER[a.suit] - SUIT_SORT_ORDER[b.suit];
  }
  return heartRankValue(a.rank) - heartRankValue(b.rank);
}

function isTwoOfClubs(card: HeartsCard): boolean {
  return card.suit === 'clubs' && card.rank === 2;
}

function isQueenOfSpades(card: HeartsCard): boolean {
  return card.suit === 'spades' && card.rank === 12;
}

function isPenaltyCard(card: HeartsCard): boolean {
  return card.suit === 'hearts' || isQueenOfSpades(card);
}

function cardPenaltyPoints(card: HeartsCard): number {
  if (card.suit === 'hearts') return 1;
  if (isQueenOfSpades(card)) return 13;
  return 0;
}

function createShuffledDeck(): HeartsCard[] {
  const suits: CardSuit[] = ['clubs', 'diamonds', 'spades', 'hearts'];
  const deck: HeartsCard[] = [];
  for (const suit of suits) {
    for (let r = 1; r <= 13; r++) {
      const rank = r as CardRank;
      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
      });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function nextPlayer(p: PlayerId): PlayerId {
  const idx = PLAYERS.indexOf(p);
  return PLAYERS[(idx + 1) % 4];
}

function passTarget(from: PlayerId, dir: PassDirection): PlayerId {
  const idx = PLAYERS.indexOf(from);
  if (dir === 'left') return PLAYERS[(idx + 1) % 4];
  if (dir === 'right') return PLAYERS[(idx + 3) % 4];
  if (dir === 'across') return PLAYERS[(idx + 2) % 4];
  return from;
}

function chooseAiPassCards(hand: HeartsCard[]): HeartsCard[] {
  const scored = hand.map((card) => {
    let risk = heartRankValue(card.rank);
    if (isQueenOfSpades(card)) risk += 100;
    else if (card.suit === 'spades' && (card.rank === 1 || card.rank === 13)) risk += 85;
    else if (card.suit === 'hearts' && heartRankValue(card.rank) >= 10) risk += 50;
    return { card, risk };
  });
  scored.sort((a, b) => b.risk - a.risk);
  return scored.slice(0, 3).map((s) => s.card);
}

function getValidCardsForPlay(
  hand: HeartsCard[],
  currentTrick: TrickPlay[],
  isFirstTrick: boolean,
  heartsBroken: boolean
): HeartsCard[] {
  if (hand.length === 0) return [];

  // Leading a trick
  if (currentTrick.length === 0) {
    if (isFirstTrick) {
      const twoClubs = hand.find(isTwoOfClubs);
      if (twoClubs) return [twoClubs];
    }
    if (!heartsBroken) {
      const nonHearts = hand.filter((c) => c.suit !== 'hearts');
      if (nonHearts.length > 0) return nonHearts;
    }
    return hand;
  }

  // Following a trick
  const ledSuit = currentTrick[0].card.suit;
  const sameSuit = hand.filter((c) => c.suit === ledSuit);
  if (sameSuit.length > 0) {
    return sameSuit;
  }

  // Cannot follow suit
  if (isFirstTrick) {
    const nonPenalty = hand.filter((c) => !isPenaltyCard(c));
    if (nonPenalty.length > 0) return nonPenalty;
  }

  return hand;
}

function chooseAiPlayCard(
  hand: HeartsCard[],
  currentTrick: TrickPlay[],
  isFirstTrick: boolean,
  heartsBroken: boolean
): HeartsCard {
  const valid = getValidCardsForPlay(hand, currentTrick, isFirstTrick, heartsBroken);
  if (valid.length === 1) return valid[0];

  const sortedAsc = [...valid].sort(
    (a, b) => heartRankValue(a.rank) - heartRankValue(b.rank)
  );

  // Leading: lead low non-penalty card
  if (currentTrick.length === 0) {
    const safeLead = sortedAsc.find((c) => !isQueenOfSpades(c) && c.suit !== 'hearts');
    return safeLead || sortedAsc[0];
  }

  const ledSuit = currentTrick[0].card.suit;
  const followingSuit = valid[0].suit === ledSuit;

  if (followingSuit) {
    // Try to duck under current highest card of led suit
    const highestInTrick = Math.max(
      ...currentTrick
        .filter((t) => t.card.suit === ledSuit)
        .map((t) => heartRankValue(t.card.rank))
    );
    const underCards = sortedAsc.filter(
      (c) => heartRankValue(c.rank) < highestInTrick
    );
    if (underCards.length > 0) {
      return underCards[underCards.length - 1];
    }
    // If last player and no penalty in trick, can play highest safe card
    const trickHasPenalty = currentTrick.some((t) => isPenaltyCard(t.card));
    if (currentTrick.length === 3 && !trickHasPenalty) {
      const nonQueen = sortedAsc.filter((c) => !isQueenOfSpades(c));
      if (nonQueen.length > 0) return nonQueen[nonQueen.length - 1];
    }
    return sortedAsc[0];
  } else {
    // Off-suit: dump Queen of Spades first, then highest Heart, then highest card
    const qos = valid.find(isQueenOfSpades);
    if (qos) return qos;
    const hearts = valid
      .filter((c) => c.suit === 'hearts')
      .sort((a, b) => heartRankValue(b.rank) - heartRankValue(a.rank));
    if (hearts.length > 0) return hearts[0];
    return sortedAsc[sortedAsc.length - 1];
  }
}

export function HeartsGame() {
  const [hands, setHands] = useState<Record<PlayerId, HeartsCard[]>>({
    south: [],
    west: [],
    north: [],
    east: [],
  });
  const [roundNumber, setRoundNumber] = useState(1);
  const [passDirection, setPassDirection] = useState<PassDirection>('left');
  const [phase, setPhase] = useState<GamePhase>('passing');
  const [selectedPassIds, setSelectedPassIds] = useState<string[]>([]);
  const [currentTurn, setCurrentTurn] = useState<PlayerId>('south');
  const [currentTrick, setCurrentTrick] = useState<TrickPlay[]>([]);
  const [isFirstTrick, setIsFirstTrick] = useState(true);
  const [heartsBroken, setHeartsBroken] = useState(false);
  const [handPoints, setHandPoints] = useState<Record<PlayerId, number>>({
    south: 0,
    west: 0,
    north: 0,
    east: 0,
  });
  const [totalScores, setTotalScores] = useState<Record<PlayerId, number>>({
    south: 0,
    west: 0,
    north: 0,
    east: 0,
  });
  const [statusMessage, setStatusMessage] = useState<string>(
    'Select 3 cards to pass left to Pauline.'
  );
  const [lastTrickWinner, setLastTrickWinner] = useState<PlayerId | null>(null);
  const [resolvingTrick, setResolvingTrick] = useState(false);

  const tableRef = useRef<HTMLDivElement>(null);
  const trickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (trickTimeoutRef.current) {
        clearTimeout(trickTimeoutRef.current);
      }
    };
  }, []);

  const startHand = useCallback(
    (nextRound: number, scoresOverride?: Record<PlayerId, number>) => {
      if (trickTimeoutRef.current) {
        clearTimeout(trickTimeoutRef.current);
        trickTimeoutRef.current = null;
      }
      const deck = createShuffledDeck();
      const dealt: Record<PlayerId, HeartsCard[]> = {
        south: deck.slice(0, 13).sort(compareCardsForHand),
        west: deck.slice(13, 26).sort(compareCardsForHand),
        north: deck.slice(26, 39).sort(compareCardsForHand),
        east: deck.slice(39, 52).sort(compareCardsForHand),
      };
      const dir = PASS_CYCLE[(nextRound - 1) % 4];
      setHands(dealt);
      setRoundNumber(nextRound);
      setPassDirection(dir);
      setSelectedPassIds([]);
      setCurrentTrick([]);
      setIsFirstTrick(true);
      setHeartsBroken(false);
      setLastTrickWinner(null);
      setResolvingTrick(false);
      setHandPoints({ south: 0, west: 0, north: 0, east: 0 });
      if (scoresOverride) {
        setTotalScores(scoresOverride);
      }

      if (dir === 'none') {
        const starter =
          PLAYERS.find((p) => dealt[p].some(isTwoOfClubs)) || 'south';
        setPhase('playing');
        setCurrentTurn(starter);
        setStatusMessage(
          starter === 'south'
            ? 'No passing this hand. Lead with the 2 of Clubs.'
            : `${PLAYER_NAMES[starter]} holds the 2 of Clubs and leads.`
        );
      } else {
        setPhase('passing');
        const target = passTarget('south', dir);
        setStatusMessage(
          `Select 3 cards to pass ${dir} to ${PLAYER_NAMES[target]}.`
        );
      }

      requestAnimationFrame(() => {
        if (!tableRef.current) return;
        const cards = Array.from(
          tableRef.current.querySelectorAll<HTMLElement>('[data-hearts-card]')
        );
        animateCardsDeal(cards);
      });
    },
    []
  );

  useEffect(() => {
    startHand(1, { south: 0, west: 0, north: 0, east: 0 });
  }, [startHand]);

  // Execute card play for a player
  const playCard = useCallback(
    (player: PlayerId, card: HeartsCard) => {
      const remainingInPlayerHand = hands[player].filter((c) => c.id !== card.id).length;
      setHands((prev) => ({
        ...prev,
        [player]: prev[player].filter((c) => c.id !== card.id),
      }));

      const nextTrick = [...currentTrick, { player, card }];
      setCurrentTrick(nextTrick);

      const brokeHeartNow = card.suit === 'hearts' && !heartsBroken;
      if (brokeHeartNow) {
        setHeartsBroken(true);
      }

      if (nextTrick.length < 4) {
        const nextP = nextPlayer(player);
        setCurrentTurn(nextP);
        setStatusMessage(
          nextP === 'south'
            ? 'Your turn — click a highlighted card to play.'
            : `${PLAYER_NAMES[nextP]} is thinking...`
        );
      } else {
        // Resolve trick after short pause
        setResolvingTrick(true);
        const ledSuit = nextTrick[0].card.suit;
        let winningPlay = nextTrick[0];
        for (const play of nextTrick) {
          if (
            play.card.suit === ledSuit &&
            heartRankValue(play.card.rank) >
              heartRankValue(winningPlay.card.rank)
          ) {
            winningPlay = play;
          }
        }
        const trickPts = nextTrick.reduce(
          (sum, t) => sum + cardPenaltyPoints(t.card),
          0
        );
        const winner = winningPlay.player;
        setLastTrickWinner(winner);
        setStatusMessage(
          `${PLAYER_NAMES[winner]} takes the trick${
            trickPts > 0 ? ` (+${trickPts} pts)` : ''
          }.`
        );

        const updatedPts: Record<PlayerId, number> = {
          ...handPoints,
          [winner]: handPoints[winner] + trickPts,
        };

        if (trickTimeoutRef.current) {
          clearTimeout(trickTimeoutRef.current);
        }

        trickTimeoutRef.current = setTimeout(() => {
          trickTimeoutRef.current = null;
          if (remainingInPlayerHand === 0) {
            // Hand over: check Shoot the Moon
            const moonShooter = PLAYERS.find((p) => updatedPts[p] === 26);
            const finalHandPts: Record<PlayerId, number> = moonShooter
              ? {
                  south: moonShooter === 'south' ? 0 : 26,
                  west: moonShooter === 'west' ? 0 : 26,
                  north: moonShooter === 'north' ? 0 : 26,
                  east: moonShooter === 'east' ? 0 : 26,
                }
              : updatedPts;

            const nextTotal: Record<PlayerId, number> = {
              south: totalScores.south + finalHandPts.south,
              west: totalScores.west + finalHandPts.west,
              north: totalScores.north + finalHandPts.north,
              east: totalScores.east + finalHandPts.east,
            };
            const gameEnded = PLAYERS.some((p) => nextTotal[p] >= 100);

            setHandPoints(finalHandPts);
            setTotalScores(nextTotal);
            setPhase(gameEnded ? 'gameOver' : 'handOver');
            setStatusMessage(
              moonShooter
                ? `${PLAYER_NAMES[moonShooter]} SHOT THE MOON! Everyone else gets +26 points!`
                : gameEnded
                  ? 'Game Over! Lowest total score wins.'
                  : 'Hand complete! Review scores and start the next hand.'
            );
          } else {
            setHandPoints(updatedPts);
            setCurrentTrick([]);
            setIsFirstTrick(false);
            setResolvingTrick(false);
            setCurrentTurn(winner);
            setStatusMessage(
              winner === 'south'
                ? 'You won the trick — lead any valid card.'
                : `${PLAYER_NAMES[winner]} leads the next trick.`
            );
          }
        }, 680);
      }
    },
    [currentTrick, handPoints, hands, heartsBroken, totalScores]
  );

  // AI turn automation
  useEffect(() => {
    if (phase !== 'playing' || resolvingTrick) return;
    if (currentTurn === 'south') return;

    const timer = setTimeout(() => {
      const aiHand = hands[currentTurn];
      if (!aiHand || aiHand.length === 0) return;
      const chosen = chooseAiPlayCard(
        aiHand,
        currentTrick,
        isFirstTrick,
        heartsBroken
      );
      playCard(currentTurn, chosen);
    }, 420);

    return () => clearTimeout(timer);
  }, [
    phase,
    resolvingTrick,
    currentTurn,
    hands,
    currentTrick,
    isFirstTrick,
    heartsBroken,
    playCard,
  ]);

  const toggleSelectPassCard = (cardId: string) => {
    if (phase !== 'passing') return;
    setSelectedPassIds((prev) => {
      if (prev.includes(cardId)) {
        return prev.filter((id) => id !== cardId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), cardId];
      }
      return [...prev, cardId];
    });
  };

  const confirmPassCards = () => {
    if (phase !== 'passing' || selectedPassIds.length !== 3) return;

    const chosenByPlayer: Record<PlayerId, HeartsCard[]> = {
      south: hands.south.filter((c) => selectedPassIds.includes(c.id)),
      west: chooseAiPassCards(hands.west),
      north: chooseAiPassCards(hands.north),
      east: chooseAiPassCards(hands.east),
    };

    const nextHands: Record<PlayerId, HeartsCard[]> = {
      south: hands.south.filter((c) => !selectedPassIds.includes(c.id)),
      west: hands.west.filter(
        (c) => !chosenByPlayer.west.some((p) => p.id === c.id)
      ),
      north: hands.north.filter(
        (c) => !chosenByPlayer.north.some((p) => p.id === c.id)
      ),
      east: hands.east.filter(
        (c) => !chosenByPlayer.east.some((p) => p.id === c.id)
      ),
    };

    for (const giver of PLAYERS) {
      const receiver = passTarget(giver, passDirection);
      nextHands[receiver] = [
        ...nextHands[receiver],
        ...chosenByPlayer[giver],
      ].sort(compareCardsForHand);
    }

    const starter =
      PLAYERS.find((p) => nextHands[p].some(isTwoOfClubs)) || 'south';

    setHands(nextHands);
    setSelectedPassIds([]);
    setPhase('playing');
    setCurrentTurn(starter);
    setStatusMessage(
      starter === 'south'
        ? 'Cards passed! You have the 2 of Clubs — click it to lead.'
        : `Cards passed! ${PLAYER_NAMES[starter]} leads with the 2 of Clubs.`
    );
  };

  const validSouthCards =
    phase === 'playing' && currentTurn === 'south' && !resolvingTrick
      ? getValidCardsForPlay(
          hands.south,
          currentTrick,
          isFirstTrick,
          heartsBroken
        )
      : [];
  const validSouthIds = new Set(validSouthCards.map((c) => c.id));

  const lowestScore = Math.min(...PLAYERS.map((p) => totalScores[p]));

  return (
    <div
      ref={tableRef}
      className="flex flex-col h-full select-none text-white overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 50% 45%, #1d6d37 0%, #134e26 62%, #0a2e16 100%)',
      }}
    >
      {/* Top Toolbar */}
      <div
        className="flex items-center justify-between px-3 py-1.5 text-[11px] border-b border-emerald-950/80"
        style={{
          background: 'linear-gradient(180deg, #1b4d29 0%, #10331a 100%)',
        }}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              startHand(1, { south: 0, west: 0, north: 0, east: 0 })
            }
            className="win7-btn !px-2.5 !py-0.5 !text-[11px] text-slate-900 font-semibold"
          >
            New Game
          </button>
          <span className="px-2 py-0.5 rounded bg-black/30 border border-white/10 text-emerald-200 font-semibold">
            Hand #{roundNumber} • Pass:{' '}
            <strong className="uppercase text-amber-300">{passDirection}</strong>
          </span>
          <span
            className={`px-2 py-0.5 rounded border text-[10px] font-bold flex items-center gap-1 ${
              heartsBroken
                ? 'bg-red-950/70 border-red-400/50 text-red-200'
                : 'bg-black/25 border-white/10 text-emerald-200/75'
            }`}
          >
            <SuitGlyphSvg suit="hearts" size={11} />
            {heartsBroken ? 'Hearts Broken' : 'Hearts Unbroken'}
          </span>
        </div>

        {/* Live Score Pill Bar */}
        <div className="flex items-center gap-2 text-[11px]">
          {PLAYERS.map((p) => (
            <div
              key={p}
              className={`px-2 py-0.5 rounded border ${
                currentTurn === p && phase === 'playing'
                  ? 'bg-amber-400/20 border-amber-300 text-amber-100 font-bold'
                  : 'bg-black/35 border-white/10 text-emerald-100'
              }`}
            >
              <span>{PLAYER_NAMES[p]}: </span>
              <span className="font-mono font-bold">
                {totalScores[p]}
              </span>
              {handPoints[p] > 0 && (
                <span className="ml-1 text-red-300 font-mono text-[10px]">
                  (+{handPoints[p]})
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Felt Table */}
      <div className="flex-1 relative flex flex-col justify-between p-3 overflow-hidden">
        {/* North AI (Michele) */}
        <div className="flex flex-col items-center z-10">
          <div className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-black/40 border border-white/15 text-emerald-100 mb-1">
            Michele (North) • {hands.north.length} cards • Hand: {handPoints.north} pts
          </div>
          <div className="flex items-center justify-center">
            {hands.north.map((c, idx) => (
              <div
                key={c.id}
                data-hearts-card
                style={{ marginLeft: idx === 0 ? 0 : -42 }}
              >
                <PlayingCardSvg
                  suit={c.suit}
                  rank={c.rank}
                  faceUp={false}
                  width={54}
                  height={76}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Middle Row: West AI + Trick Center + East AI */}
        <div className="flex items-center justify-between my-auto px-2">
          {/* West AI (Pauline) */}
          <div className="flex flex-col items-center z-10">
            <div className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-black/40 border border-white/15 text-emerald-100 mb-1.5">
              Pauline (West) • {hands.west.length}
            </div>
            <div className="flex items-center">
              {hands.west.map((c, idx) => (
                <div
                  key={c.id}
                  data-hearts-card
                  style={{ marginLeft: idx === 0 ? 0 : -46 }}
                >
                  <PlayingCardSvg
                    suit={c.suit}
                    rank={c.rank}
                    faceUp={false}
                    width={52}
                    height={72}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Center Trick Arena */}
          <div className="relative w-[300px] h-[195px] rounded-2xl border border-white/15 bg-black/25 backdrop-blur-[2px] flex items-center justify-center shadow-inner">
            {/* Status Banner */}
            <div className="absolute top-2 left-3 right-3 text-center text-[11px] text-emerald-100/95 font-medium truncate">
              {statusMessage}
            </div>

            {/* Pass Phase CTA */}
            {phase === 'passing' && (
              <div className="flex flex-col items-center gap-2 mt-4">
                <div className="text-xs text-amber-200 font-semibold">
                  Selected {selectedPassIds.length} / 3 cards
                </div>
                <button
                  type="button"
                  disabled={selectedPassIds.length !== 3}
                  onClick={confirmPassCards}
                  className={`px-4 py-1.5 rounded-md font-bold text-xs shadow-lg border transition-transform ${
                    selectedPassIds.length === 3
                      ? 'bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 border-amber-200 cursor-pointer hover:brightness-105'
                      : 'bg-white/10 text-white/40 border-white/15 cursor-not-allowed'
                  }`}
                >
                  Pass 3 Cards {passDirection.toUpperCase()}
                </button>
              </div>
            )}

            {/* Played Cards in Current Trick */}
            {phase === 'playing' && (
              <div className="relative w-full h-full">
                {currentTrick.map((play) => {
                  const posStyle: Record<PlayerId, React.CSSProperties> = {
                    north: {
                      top: '24px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    },
                    south: {
                      bottom: '12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    },
                    west: {
                      left: '28px',
                      top: '54%',
                      transform: 'translateY(-50%)',
                    },
                    east: {
                      right: '28px',
                      top: '54%',
                      transform: 'translateY(-50%)',
                    },
                  };
                  return (
                    <div
                      key={play.card.id}
                      className="absolute transition-[transform,opacity] duration-180 ease-[cubic-bezier(0.23,1,0.32,1)]"
                      style={posStyle[play.player]}
                    >
                      <PlayingCardSvg
                        suit={play.card.suit}
                        rank={play.card.rank}
                        faceUp
                        width={68}
                        height={96}
                      />
                    </div>
                  );
                })}
                {currentTrick.length === 0 && lastTrickWinner && (
                  <div className="h-full flex items-center justify-center text-xs text-emerald-200/70 pt-4">
                    Waiting for {PLAYER_NAMES[currentTurn]} to lead...
                  </div>
                )}
              </div>
            )}

            {/* Hand Over / Game Over Modal Overlay inside Center */}
            {(phase === 'handOver' || phase === 'gameOver') && (
              <div className="z-20 bg-slate-900/95 border border-sky-300/40 rounded-xl p-3.5 w-[270px] shadow-2xl text-center">
                <div className="text-xs font-bold text-amber-300 mb-2">
                  {phase === 'gameOver'
                    ? `🏆 Winner: ${
                        PLAYER_NAMES[
                          PLAYERS.find((p) => totalScores[p] === lowestScore) ||
                            'south'
                        ]
                      }!`
                    : `Hand #${roundNumber} Complete`}
                </div>
                <div className="space-y-1 text-[11px] mb-3">
                  {PLAYERS.map((p) => (
                    <div
                      key={p}
                      className="flex items-center justify-between px-2 py-0.5 rounded bg-white/5"
                    >
                      <span className="font-semibold">{PLAYER_NAMES[p]}</span>
                      <span className="font-mono">
                        +{handPoints[p]} pts →{' '}
                        <strong className="text-sky-300">
                          {totalScores[p]}
                        </strong>
                      </span>
                    </div>
                  ))}
                </div>
                {phase === 'handOver' ? (
                  <button
                    type="button"
                    onClick={() => startHand(roundNumber + 1)}
                    className="win7-btn !px-4 !py-1 !text-xs text-slate-900 font-bold"
                  >
                    Deal Next Hand
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      startHand(1, { south: 0, west: 0, north: 0, east: 0 })
                    }
                    className="win7-btn !px-4 !py-1 !text-xs text-slate-900 font-bold"
                  >
                    Play New Match
                  </button>
                )}
              </div>
            )}
          </div>

          {/* East AI (Ben) */}
          <div className="flex flex-col items-center z-10">
            <div className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-black/40 border border-white/15 text-emerald-100 mb-1.5">
              Ben (East) • {hands.east.length}
            </div>
            <div className="flex items-center">
              {hands.east.map((c, idx) => (
                <div
                  key={c.id}
                  data-hearts-card
                  style={{ marginLeft: idx === 0 ? 0 : -46 }}
                >
                  <PlayingCardSvg
                    suit={c.suit}
                    rank={c.rank}
                    faceUp={false}
                    width={52}
                    height={72}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* South Player (User) Hand */}
        <div className="flex flex-col items-center z-20 pb-1">
          <div className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-black/45 border border-white/15 text-emerald-100 mb-2">
            You (South) • Hand Penalty: {handPoints.south} pts • Total:{' '}
            {totalScores.south} pts
          </div>
          <div className="flex items-end justify-center min-h-[118px] px-4">
            {hands.south.map((card, idx) => {
              const isSelectedForPass =
                phase === 'passing' && selectedPassIds.includes(card.id);
              const isPlayable =
                phase === 'playing' &&
                currentTurn === 'south' &&
                !resolvingTrick &&
                validSouthIds.has(card.id);
              const isDimmed =
                phase === 'playing' &&
                currentTurn === 'south' &&
                !resolvingTrick &&
                !validSouthIds.has(card.id);

              return (
                <button
                  key={card.id}
                  type="button"
                  data-hearts-card
                  onClick={() => {
                    if (phase === 'passing') {
                      toggleSelectPassCard(card.id);
                    } else if (isPlayable) {
                      playCard('south', card);
                    }
                  }}
                  disabled={phase === 'playing' && !isPlayable}
                  className="relative transition-transform duration-150 focus:outline-none"
                  style={{
                    marginLeft: idx === 0 ? 0 : -24,
                    transform: isSelectedForPass
                      ? 'translateY(-16px)'
                      : isPlayable
                        ? 'translateY(-6px)'
                        : 'translateY(0px)',
                    opacity: isDimmed ? 0.58 : 1,
                    cursor:
                      phase === 'passing' || isPlayable ? 'pointer' : 'default',
                  }}
                  title={`${card.rank} of ${card.suit}`}
                >
                  <PlayingCardSvg
                    suit={card.suit}
                    rank={card.rank}
                    faceUp
                    selected={isSelectedForPass || isPlayable}
                    width={76}
                    height={106}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export const heartsModule: AppModuleContract = {
  id: 'hearts',
  getWindowConfig: () => ({
    id: 'hearts',
    title: 'Hearts',
    shortLabel: 'Hearts',
    glowColor: 'rgba(244, 63, 94, 0.65)',
    defaultPos: { x: 205, y: 30, width: 820, height: 590 },
    pinned: false,
    category: 'game',
    description: 'Classic Windows 7 4-player Hearts card game',
  }),
  renderIcon: (size = 28) => <HeartsIcon size={size} />,
  mount: () => {},
  unmount: () => {},
  onFocus: () => {},
  onMinimize: () => {},
  Component: HeartsGame,
};
