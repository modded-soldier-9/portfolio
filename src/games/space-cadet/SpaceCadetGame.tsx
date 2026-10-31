'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { aeroSound } from '@/components/AeroSound';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Bumper {
  x: number;
  y: number;
  radius: number;
  color: string;
  glowColor: string;
  points: number;
  hitTimer: number;
}

const TABLE_WIDTH = 600;
const TABLE_HEIGHT = 800;
const GRAVITY = 0.22;
const BALL_RADIUS = 7;
const BOUNCE_RESTITUTION = 1.35;
const MAX_VELOCITY = 18;

export const SpaceCadetGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game State
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [ballsLeft, setBallsLeft] = useState<number>(3);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isBallInPlay, setIsBallInPlay] = useState<boolean>(false);

  // Control states for buttons / visual feedback
  const [leftActive, setLeftActive] = useState<boolean>(false);
  const [rightActive, setRightActive] = useState<boolean>(false);

  // Mutable game state held in refs for 60fps loop
  const stateRef = useRef({
    ball: {
      x: 550,
      y: 720,
      vx: 0,
      vy: 0,
      radius: BALL_RADIUS,
    } as Ball,
    leftFlipperAngle: 30, // degrees
    rightFlipperAngle: 150, // degrees
    leftPressed: false,
    rightPressed: false,
    score: 0,
    ballsLeft: 3,
    isGameOver: false,
    isBallInPlay: false,
    bumpers: [
      { x: 240, y: 230, radius: 28, color: '#e11d48', glowColor: '#f43f5e', points: 500, hitTimer: 0 },
      { x: 360, y: 230, radius: 28, color: '#0284c7', glowColor: '#38bdf8', points: 500, hitTimer: 0 },
      { x: 300, y: 310, radius: 30, color: '#d97706', glowColor: '#facc15', points: 500, hitTimer: 0 },
    ] as Bumper[],
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
  });

  const launchBall = useCallback(() => {
    const s = stateRef.current;
    if (s.isGameOver || s.isBallInPlay) return;

    aeroSound.playPinballPlunger();
    s.ball.x = 550;
    s.ball.y = 700;
    s.ball.vx = -1.5 + (Math.random() - 0.5) * 1.5;
    s.ball.vy = -16.5; // Upward impulse
    s.isBallInPlay = true;
    setIsBallInPlay(true);
  }, []);

  const resetGame = useCallback(() => {
    const s = stateRef.current;
    s.score = 0;
    s.ballsLeft = 3;
    s.isGameOver = false;
    s.isBallInPlay = false;
    s.ball.x = 550;
    s.ball.y = 720;
    s.ball.vx = 0;
    s.ball.vy = 0;

    setScore(0);
    setBallsLeft(3);
    setIsGameOver(false);
    setIsBallInPlay(false);
  }, []);

  // Keyboard Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.code === 'KeyZ' || e.code === 'KeyA' || e.code === 'ArrowLeft') {
        if (!s.leftPressed) {
          s.leftPressed = true;
          setLeftActive(true);
          aeroSound.playPinballFlipper();
        }
      } else if (e.code === 'Slash' || e.code === 'KeyD' || e.code === 'ArrowRight') {
        if (!s.rightPressed) {
          s.rightPressed = true;
          setRightActive(true);
          aeroSound.playPinballFlipper();
        }
      } else if (e.code === 'Space' || e.code === 'ArrowDown') {
        if (!s.isBallInPlay && !s.isGameOver) {
          launchBall();
        } else if (s.isGameOver) {
          resetGame();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.code === 'KeyZ' || e.code === 'KeyA' || e.code === 'ArrowLeft') {
        s.leftPressed = false;
        setLeftActive(false);
      } else if (e.code === 'Slash' || e.code === 'KeyD' || e.code === 'ArrowRight') {
        s.rightPressed = false;
        setRightActive(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [launchBall, resetGame]);

  // Main 60fps Physics & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isHidden = false;

    const handleVisibilityChange = () => {
      isHidden = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const leftFlipperPivot = { x: 210, y: 720 };
    const rightFlipperPivot = { x: 390, y: 720 };
    const flipperLength = 70;

    const loop = () => {
      if (!isHidden) {
        const s = stateRef.current;
        const b = s.ball;

        // 1. Flipper Angle Physics Interpolation
        const targetLeftAngle = s.leftPressed ? -25 : 30;
        const targetRightAngle = s.rightPressed ? 205 : 150;
        s.leftFlipperAngle += (targetLeftAngle - s.leftFlipperAngle) * 0.45;
        s.rightFlipperAngle += (targetRightAngle - s.rightFlipperAngle) * 0.45;

        // 2. Ball Physics (if in play)
        if (s.isBallInPlay && !s.isGameOver) {
          b.vy += GRAVITY;

          // Clamp speed
          const speed = Math.hypot(b.vx, b.vy);
          if (speed > MAX_VELOCITY) {
            b.vx = (b.vx / speed) * MAX_VELOCITY;
            b.vy = (b.vy / speed) * MAX_VELOCITY;
          }

          b.x += b.vx;
          b.y += b.vy;

          // Table Outer Wall Collisions
          // Left wall
          if (b.x - b.radius < 45) {
            b.x = 45 + b.radius;
            b.vx = -b.vx * (BOUNCE_RESTITUTION * 0.55);
          }
          // Right launch lane divider
          if (b.y > 220 && b.x + b.radius > 520 && b.vx > 0) {
            b.x = 520 - b.radius;
            b.vx = -b.vx * (BOUNCE_RESTITUTION * 0.55);
          }
          // Right outer wall
          if (b.x + b.radius > 570) {
            b.x = 570 - b.radius;
            b.vx = -b.vx * (BOUNCE_RESTITUTION * 0.55);
          }
          // Top arch curve
          if (b.y - b.radius < 50) {
            b.y = 50 + b.radius;
            b.vy = -b.vy * (BOUNCE_RESTITUTION * 0.55);
          }

          // Bumper Collisions
          s.bumpers.forEach((bmp) => {
            const dx = b.x - bmp.x;
            const dy = b.y - bmp.y;
            const dist = Math.hypot(dx, dy);

            if (dist < bmp.radius + b.radius) {
              // Collision normal
              const nx = dx / (dist || 1);
              const ny = dy / (dist || 1);

              // Impulse boost
              b.vx = nx * 9.5;
              b.vy = ny * 9.5;
              b.x = bmp.x + nx * (bmp.radius + b.radius + 1);
              b.y = bmp.y + ny * (bmp.radius + b.radius + 1);

              bmp.hitTimer = 10;
              s.score += bmp.points;
              setScore(s.score);
              setHighScore((prev) => Math.max(prev, s.score));
              aeroSound.playPinballBumper();

              // Spawn sparkle particles
              for (let p = 0; p < 8; p++) {
                s.particles.push({
                  x: bmp.x + nx * bmp.radius,
                  y: bmp.y + ny * bmp.radius,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  life: 1.0,
                  color: bmp.glowColor,
                });
              }
            }

            if (bmp.hitTimer > 0) bmp.hitTimer--;
          });

          // Slingshot Collisions
          const leftSlingshot = { x: 155, y: 580, r: 24 };
          const rightSlingshot = { x: 445, y: 580, r: 24 };
          [leftSlingshot, rightSlingshot].forEach((sling) => {
            const dx = b.x - sling.x;
            const dy = b.y - sling.y;
            const dist = Math.hypot(dx, dy);
            if (dist < sling.r + b.radius) {
              const nx = dx / (dist || 1);
              const ny = dy / (dist || 1);
              b.vx = nx * 8;
              b.vy = ny * 8;
              b.x = sling.x + nx * (sling.r + b.radius + 1);
              b.y = sling.y + ny * (sling.r + b.radius + 1);
              s.score += 100;
              setScore(s.score);
              aeroSound.playPinballBumper();
            }
          });

          // Flipper Dynamic Segment Collisions
          // Left Flipper
          const leftRad = (s.leftFlipperAngle * Math.PI) / 180;
          const leftTipX = leftFlipperPivot.x + Math.cos(leftRad) * flipperLength;
          const leftTipY = leftFlipperPivot.y + Math.sin(leftRad) * flipperLength;

          // Right Flipper
          const rightRad = (s.rightFlipperAngle * Math.PI) / 180;
          const rightTipX = rightFlipperPivot.x + Math.cos(rightRad) * flipperLength;
          const rightTipY = rightFlipperPivot.y + Math.sin(rightRad) * flipperLength;

          // Check line-segment to circle collision for Left Flipper
          const checkFlipperCollision = (x1: number, y1: number, x2: number, y2: number, isPressed: boolean) => {
            const lineDx = x2 - x1;
            const lineDy = y2 - y1;
            const len = Math.hypot(lineDx, lineDy);
            const u = Math.max(0, Math.min(1, ((b.x - x1) * lineDx + (b.y - y1) * lineDy) / (len * len)));
            const closestX = x1 + u * lineDx;
            const closestY = y1 + u * lineDy;
            const dist = Math.hypot(b.x - closestX, b.y - closestY);

            if (dist < b.radius + 8) {
              const nx = (b.x - closestX) / (dist || 1);
              const ny = (b.y - closestY) / (dist || 1);

              b.x = closestX + nx * (b.radius + 9);
              b.y = closestY + ny * (b.radius + 9);

              const boost = isPressed ? -13 : -6;
              b.vy = boost + ny * 3;
              b.vx = nx * 7 + (Math.random() - 0.5) * 2;
              s.score += 50;
              setScore(s.score);
              aeroSound.playPinballFlipper();
            }
          };

          checkFlipperCollision(leftFlipperPivot.x, leftFlipperPivot.y, leftTipX, leftTipY, s.leftPressed);
          checkFlipperCollision(rightFlipperPivot.x, rightFlipperPivot.y, rightTipX, rightTipY, s.rightPressed);

          // Ball Drain (Fall through bottom hole)
          if (b.y > TABLE_HEIGHT + 30) {
            s.ballsLeft--;
            setBallsLeft(s.ballsLeft);
            s.isBallInPlay = false;
            setIsBallInPlay(false);

            if (s.ballsLeft <= 0) {
              s.isGameOver = true;
              setIsGameOver(true);
              aeroSound.playPinballTilt();
            } else {
              // Ready next ball
              b.x = 550;
              b.y = 720;
              b.vx = 0;
              b.vy = 0;
            }
          }
        }

        // Particle updates
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const p = s.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.04;
          if (p.life <= 0) s.particles.splice(i, 1);
        }

        // 3. Render Canvas
        ctx.clearRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT);

        // Deep Cosmic Gradient Table Background
        const bgGrad = ctx.createLinearGradient(0, 0, 0, TABLE_HEIGHT);
        bgGrad.addColorStop(0, '#0a0518');
        bgGrad.addColorStop(0.5, '#120d2a');
        bgGrad.addColorStop(1, '#05020c');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT);

        // Retro Space Pinball Grid & Starfields
        ctx.strokeStyle = 'rgba(147, 51, 234, 0.15)';
        ctx.lineWidth = 1;
        for (let x = 60; x < 520; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 60);
          ctx.lineTo(x, 700);
          ctx.stroke();
        }
        for (let y = 60; y < 700; y += 40) {
          ctx.beginPath();
          ctx.moveTo(60, y);
          ctx.lineTo(500, y);
          ctx.stroke();
        }

        // Outer Cabinet Borders (Neon Chrome SVG aesthetic)
        ctx.strokeStyle = '#9333ea';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(45, 750);
        ctx.lineTo(45, 120);
        ctx.arc(120, 120, 75, Math.PI, Math.PI * 1.5);
        ctx.lineTo(450, 45);
        ctx.arc(450, 120, 75, Math.PI * 1.5, Math.PI * 2);
        ctx.lineTo(525, 750);
        ctx.stroke();

        // Right Plunger Launch Lane
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(525, 760);
        ctx.lineTo(525, 120);
        ctx.stroke();

        // Slingshot Wireframes
        ctx.fillStyle = 'rgba(236, 72, 153, 0.25)';
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 2;
        // Left slingshot triangle
        ctx.beginPath();
        ctx.moveTo(70, 520);
        ctx.lineTo(165, 600);
        ctx.lineTo(70, 640);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Right slingshot triangle
        ctx.beginPath();
        ctx.moveTo(495, 520);
        ctx.lineTo(405, 600);
        ctx.lineTo(495, 640);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Render Bumpers with Pulsing Glow
        s.bumpers.forEach((bmp) => {
          ctx.save();
          if (bmp.hitTimer > 0) {
            ctx.shadowColor = bmp.glowColor;
            ctx.shadowBlur = 24;
          }
          ctx.beginPath();
          ctx.arc(bmp.x, bmp.y, bmp.radius, 0, Math.PI * 2);
          ctx.fillStyle = bmp.color;
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = bmp.hitTimer > 0 ? '#ffffff' : bmp.glowColor;
          ctx.stroke();

          // Inner bumper ring
          ctx.beginPath();
          ctx.arc(bmp.x, bmp.y, bmp.radius * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.restore();
        });

        // Render Flippers
        const drawFlipper = (x1: number, y1: number, angleDeg: number, isPressed: boolean) => {
          ctx.save();
          ctx.translate(x1, y1);
          ctx.rotate((angleDeg * Math.PI) / 180);

          ctx.fillStyle = isPressed ? '#fb7185' : '#e11d48';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;

          ctx.beginPath();
          ctx.roundRect(0, -6, flipperLength, 12, 6);
          ctx.fill();
          ctx.stroke();

          // Pivot pin
          ctx.beginPath();
          ctx.arc(0, 0, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#f8fafc';
          ctx.fill();
          ctx.restore();
        };

        drawFlipper(leftFlipperPivot.x, leftFlipperPivot.y, s.leftFlipperAngle, s.leftPressed);
        drawFlipper(rightFlipperPivot.x, rightFlipperPivot.y, s.rightFlipperAngle, s.rightPressed);

        // Render Particles
        s.particles.forEach((p) => {
          ctx.save();
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // Render Ball (Gleaming Steel Chrome Sphere)
        if (s.isBallInPlay || (!s.isGameOver && s.ballsLeft > 0)) {
          ctx.save();
          ctx.shadowColor = '#67e8f9';
          ctx.shadowBlur = 8;

          const ballGrad = ctx.createRadialGradient(
            b.x - b.radius * 0.35,
            b.y - b.radius * 0.35,
            1,
            b.x,
            b.y,
            b.radius
          );
          ballGrad.addColorStop(0, '#ffffff');
          ballGrad.addColorStop(0.4, '#e2e8f0');
          ballGrad.addColorStop(0.8, '#94a3b8');
          ballGrad.addColorStop(1, '#334155');

          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fillStyle = ballGrad;
          ctx.fill();
          ctx.lineWidth = 1;
          ctx.strokeStyle = '#0f172a';
          ctx.stroke();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#090514] text-white select-none overflow-hidden font-sans">
      {/* Top Retro HUD Display Bar */}
      <div className="bg-gradient-to-r from-[#1e1b4b] via-[#2e1065] to-[#1e1b4b] px-4 py-2 border-b border-purple-500/30 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-[10px] text-purple-300 font-bold uppercase tracking-widest">Score</div>
            <div className="text-[20px] font-mono font-bold text-yellow-300 leading-none drop-shadow">
              {score.toLocaleString().padStart(8, '0')}
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="text-[10px] text-purple-300 font-bold uppercase tracking-widest">High Score</div>
            <div className="text-[15px] font-mono font-semibold text-emerald-400 leading-none">
              {highScore.toLocaleString().padStart(8, '0')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <div className="text-[10px] text-purple-300 font-bold uppercase tracking-widest text-right">Balls</div>
            <div className="flex items-center gap-1.5 justify-end">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full border border-white/40 ${
                    i < ballsLeft ? 'bg-gradient-to-tr from-slate-400 to-white shadow-sm' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={resetGame}
            className="px-2.5 py-1 rounded bg-purple-700/60 hover:bg-purple-600 border border-purple-400/40 text-[11px] font-semibold text-white shadow"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Canvas Table Area */}
      <div className="flex-1 relative flex items-center justify-center p-2 bg-black/60 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={TABLE_WIDTH}
          height={TABLE_HEIGHT}
          className="max-h-full max-w-full aspect-[3/4] object-contain rounded border-2 border-purple-900 shadow-2xl"
        />

        {/* Start / Game Over Overlay */}
        {!isBallInPlay && !isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none">
            <div className="bg-[#1e1b4b]/95 border-2 border-purple-400/60 p-6 rounded-lg shadow-2xl text-center max-w-xs pointer-events-auto">
              <h2 className="text-[20px] font-bold text-yellow-300 tracking-wider uppercase mb-1">
                Space Cadet Pinball
              </h2>
              <p className="text-[12px] text-purple-200 mb-4">
                Controls: <span className="text-white font-bold">[Z]</span> Left Flipper &middot; <span className="text-white font-bold">[/]</span> Right Flipper
              </p>
              <button
                type="button"
                onClick={launchBall}
                className="w-full py-2.5 rounded bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-[14px] shadow-lg active:scale-95 transition-transform"
              >
                Launch Ball (Space)
              </button>
            </div>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[3px] pointer-events-none">
            <div className="bg-[#1e1b4b]/95 border-2 border-red-500/60 p-6 rounded-lg shadow-2xl text-center max-w-xs pointer-events-auto">
              <h2 className="text-[22px] font-bold text-red-400 tracking-wider uppercase mb-1">
                Game Over
              </h2>
              <p className="text-[13px] text-purple-200 mb-1">Final Score:</p>
              <div className="text-[24px] font-mono font-bold text-yellow-300 mb-4">
                {score.toLocaleString()}
              </div>
              <button
                type="button"
                onClick={resetGame}
                className="w-full py-2.5 rounded bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-[14px] shadow-lg active:scale-95 transition-transform"
              >
                Play Again (Space)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Touch & On-Screen Controls Footer (for mobile / mouse play) */}
      <div className="bg-[#120d2a] px-4 py-2.5 border-t border-purple-500/20 flex items-center justify-between gap-3 select-none">
        <button
          type="button"
          onPointerDown={() => {
            stateRef.current.leftPressed = true;
            setLeftActive(true);
            aeroSound.playPinballFlipper();
          }}
          onPointerUp={() => {
            stateRef.current.leftPressed = false;
            setLeftActive(false);
          }}
          onPointerLeave={() => {
            stateRef.current.leftPressed = false;
            setLeftActive(false);
          }}
          className={`flex-1 py-3 rounded text-[13px] font-bold border transition-colors shadow ${
            leftActive
              ? 'bg-rose-600 text-white border-rose-400 scale-[0.98]'
              : 'bg-rose-950/80 text-rose-200 border-rose-700/60 active:bg-rose-600'
          }`}
        >
          ◄ Left Flipper (Z)
        </button>

        <button
          type="button"
          onClick={launchBall}
          disabled={isBallInPlay || isGameOver}
          className="px-4 py-3 rounded bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-bold text-[13px] border border-amber-400/60 shadow"
        >
          Launch 🚀
        </button>

        <button
          type="button"
          onPointerDown={() => {
            stateRef.current.rightPressed = true;
            setRightActive(true);
            aeroSound.playPinballFlipper();
          }}
          onPointerUp={() => {
            stateRef.current.rightPressed = false;
            setRightActive(false);
          }}
          onPointerLeave={() => {
            stateRef.current.rightPressed = false;
            setRightActive(false);
          }}
          className={`flex-1 py-3 rounded text-[13px] font-bold border transition-colors shadow ${
            rightActive
              ? 'bg-rose-600 text-white border-rose-400 scale-[0.98]'
              : 'bg-rose-950/80 text-rose-200 border-rose-700/60 active:bg-rose-600'
          }`}
        >
          Right Flipper (/) ►
        </button>
      </div>
    </div>
  );
};
