'use client';

import React, { useEffect, useRef } from 'react';
import { createBootSequenceTimeline } from '@/core/animation';
import { siteConfig } from '@/config/site';

interface BootSequenceProps {
  onComplete: () => void;
  onSkipToDesktop: () => void;
}

/**
 * Windows 7 Boot Sequence (bootres.dll recreation)
 * - BIOS-less fast boot straight to the 4 glowing firefly orbs (Red, Yellow, Green, Blue)
 *   swirling with SVG light trails and merging into the luminous 4-color Windows 7 flag.
 * - Driven by centralized GSAP timeline in /core/animation.
 */
export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete, onSkipToDesktop }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbStageRef = useRef<SVGGElement>(null);
  const orbRedRef = useRef<SVGGElement>(null);
  const orbYellowRef = useRef<SVGGElement>(null);
  const orbGreenRef = useRef<SVGGElement>(null);
  const orbBlueRef = useRef<SVGGElement>(null);
  const trailRedRef = useRef<SVGPathElement>(null);
  const trailYellowRef = useRef<SVGPathElement>(null);
  const trailGreenRef = useRef<SVGPathElement>(null);
  const trailBlueRef = useRef<SVGPathElement>(null);
  const flagGroupRef = useRef<SVGGElement>(null);
  const flashBloomRef = useRef<SVGCircleElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);
  const dot0Ref = useRef<HTMLSpanElement>(null);
  const dot1Ref = useRef<HTMLSpanElement>(null);
  const dot2Ref = useRef<HTMLSpanElement>(null);
  const dot3Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tl = createBootSequenceTimeline(
      {
        container: containerRef.current,
        orbStage: orbStageRef.current,
        orbRed: orbRedRef.current,
        orbYellow: orbYellowRef.current,
        orbGreen: orbGreenRef.current,
        orbBlue: orbBlueRef.current,
        trailRed: trailRedRef.current,
        trailYellow: trailYellowRef.current,
        trailGreen: trailGreenRef.current,
        trailBlue: trailBlueRef.current,
        flagGroup: flagGroupRef.current,
        flashBloom: flashBloomRef.current,
        textGroup: textGroupRef.current,
        dots: [dot0Ref.current, dot1Ref.current, dot2Ref.current, dot3Ref.current],
      },
      onComplete
    );

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        tl.kill();
        onSkipToDesktop();
      } else if (e.key === 'Enter' || e.key === ' ') {
        tl.kill();
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      tl.kill();
    };
  }, [onComplete, onSkipToDesktop]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Starting Windows Boot Sequence"
      className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-between py-10 px-6 select-none overflow-hidden"
    >
      {/* Top spacer */}
      <div className="w-full flex items-center justify-end">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onComplete}
            className="px-3 py-1 rounded border border-white/20 bg-white/5 hover:bg-white/15 text-white/80 text-[11.5px] cursor-pointer transition-transform active:scale-[0.97]"
          >
            Skip to Login &rarr;
          </button>
          <button
            type="button"
            onClick={onSkipToDesktop}
            className="px-3 py-1 rounded border border-sky-400/35 bg-sky-500/15 hover:bg-sky-500/25 text-sky-200 text-[11.5px] cursor-pointer transition-transform active:scale-[0.97]"
          >
            Skip to Desktop &#9197;
          </button>
        </div>
      </div>

      {/* Center: Swirling 4 Orbs + Light Trails + Merging Windows 7 Flag SVG */}
      <div className="flex flex-col items-center">
        <svg
          width="260"
          height="230"
          viewBox="0 0 240 220"
          className="overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <filter id="bootGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="5.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="bootFlashGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#7dd3fc" stopOpacity="0.6" />
              <stop offset="75%" stopColor="#0284c7" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Flag Quadrant Gradients */}
            <linearGradient id="bootFlagRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff9466" />
              <stop offset="50%" stopColor="#f25022" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
            <linearGradient id="bootFlagGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bef264" />
              <stop offset="50%" stopColor="#7fba00" />
              <stop offset="100%" stopColor="#3f6212" />
            </linearGradient>
            <linearGradient id="bootFlagBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="50%" stopColor="#00a4ef" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="bootFlagYellow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#ffb900" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>

          {/* Radial merge bloom */}
          <circle
            ref={flashBloomRef}
            cx="120"
            cy="110"
            r="68"
            fill="url(#bootFlashGrad)"
          />

          {/* Swirling Light Trails & 4 Glowing Orbs */}
          <g ref={orbStageRef}>
            {/* Light Trails */}
            <path
              ref={trailRedRef}
              d="M42,54 C85,18 145,45 104,94"
              fill="none"
              stroke="#f25022"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#bootGlow)"
            />
            <path
              ref={trailYellowRef}
              d="M198,58 C178,125 148,142 136,126"
              fill="none"
              stroke="#ffb900"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#bootGlow)"
            />
            <path
              ref={trailGreenRef}
              d="M48,168 C75,112 115,68 136,94"
              fill="none"
              stroke="#7fba00"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#bootGlow)"
            />
            <path
              ref={trailBlueRef}
              d="M194,166 C142,188 86,146 104,126"
              fill="none"
              stroke="#00a4ef"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#bootGlow)"
            />

            {/* 4 Firefly Orbs (centered at 120,110 before GSAP offset) */}
            <g ref={orbRedRef} filter="url(#bootGlow)">
              <circle cx="120" cy="110" r="11" fill="#f25022" opacity="0.55" />
              <circle cx="120" cy="110" r="6" fill="#ffedd5" />
            </g>
            <g ref={orbYellowRef} filter="url(#bootGlow)">
              <circle cx="120" cy="110" r="11" fill="#ffb900" opacity="0.55" />
              <circle cx="120" cy="110" r="6" fill="#fef9c3" />
            </g>
            <g ref={orbGreenRef} filter="url(#bootGlow)">
              <circle cx="120" cy="110" r="11" fill="#7fba00" opacity="0.55" />
              <circle cx="120" cy="110" r="6" fill="#ecfccb" />
            </g>
            <g ref={orbBlueRef} filter="url(#bootGlow)">
              <circle cx="120" cy="110" r="11" fill="#00a4ef" opacity="0.55" />
              <circle cx="120" cy="110" r="6" fill="#e0f2fe" />
            </g>
          </g>

          {/* Assembled Glowing Windows 7 Wavy Flag */}
          <g ref={flagGroupRef} filter="url(#bootGlow)">
            <g transform="translate(76, 66) scale(4.1)">
              {/* Top-left Red Quadrant */}
              <path
                d="M1 2.2 C4.2 0.6, 7.2 0.8, 10 2.3 L10 10.2 C7.2 8.8, 4.2 8.6, 1 10.1 Z"
                fill="url(#bootFlagRed)"
              />
              {/* Top-right Green Quadrant */}
              <path
                d="M11.6 2.6 C14.6 4.1, 17.6 4.1, 20.6 2.5 L20.6 10.4 C17.6 12, 14.6 12, 11.6 10.5 Z"
                fill="url(#bootFlagGreen)"
              />
              {/* Bottom-left Blue Quadrant */}
              <path
                d="M1 11.7 C4.2 10.2, 7.2 10.4, 10 11.9 L10 19.8 C7.2 18.4, 4.2 18.2, 1 19.7 Z"
                fill="url(#bootFlagBlue)"
              />
              {/* Bottom-right Yellow Quadrant */}
              <path
                d="M11.6 12.1 C14.6 13.6, 17.6 13.6, 20.6 12 L20.6 19.9 C17.6 21.5, 14.6 21.5, 11.6 20 Z"
                fill="url(#bootFlagYellow)"
              />
            </g>
          </g>
        </svg>

        {/* "Starting Windows" Text + Pulsing Loading Dots */}
        <div ref={textGroupRef} className="mt-4 flex flex-col items-center gap-3">
          <div
            className="text-[21px] text-[#e5e7eb] tracking-[0.02em] font-normal"
            style={{
              fontFamily: '"Segoe UI", Tahoma, sans-serif',
              textShadow: '0 0 12px rgba(255,255,255,0.28)',
            }}
          >
            Starting Windows
          </div>

          {/* Pulsing Dots */}
          <div className="flex items-center gap-2.5 h-4" aria-hidden="true">
            <span
              ref={dot0Ref}
              className="w-2 h-2 rounded-full bg-sky-300 shadow-[0_0_8px_#38bdf8]"
            />
            <span
              ref={dot1Ref}
              className="w-2 h-2 rounded-full bg-sky-300 shadow-[0_0_8px_#38bdf8]"
            />
            <span
              ref={dot2Ref}
              className="w-2 h-2 rounded-full bg-sky-300 shadow-[0_0_8px_#38bdf8]"
            />
            <span
              ref={dot3Ref}
              className="w-2 h-2 rounded-full bg-sky-300 shadow-[0_0_8px_#38bdf8]"
            />
          </div>
        </div>
      </div>

      {/* Bottom Copyright Footer */}
      <div className="text-center text-[11.5px] text-[#8b95a5] tracking-wide">
        &copy; {siteConfig.name} &middot; Windows 7 Aero Ultimate Simulation (Build 7601 SP1)
      </div>
    </div>
  );
};
