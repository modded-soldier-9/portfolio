'use client';

import React, { useState, useRef } from 'react';
import { aeroSound } from '@/components/AeroSound';

export interface WP7TileProps {
  title: string;
  subtitle?: string;
  size?: 'square' | 'wide';
  icon?: React.ReactNode;
  badge?: string | number;
  accentColor?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const WP7Tile: React.FC<WP7TileProps> = ({
  title,
  subtitle,
  size = 'square',
  icon,
  badge,
  accentColor = '#0078d7',
  onClick,
  children,
}) => {
  const tileRef = useRef<HTMLButtonElement | null>(null);
  const [transform, setTransform] = useState<string>('perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = tileRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    // WP7 3D tilt formula
    const rotateY = deltaX * 16;
    const rotateX = -deltaY * 16;

    setTransform(`perspective(600px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(0.97, 0.97, 0.97)`);
  };

  const handlePointerUp = () => {
    setTransform('perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  const handleClick = () => {
    aeroSound.playClick();
    if (onClick) onClick();
  };

  return (
    <button
      ref={tileRef}
      type="button"
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{
        transform,
        transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        backgroundColor: accentColor,
      }}
      className={`relative select-none text-left p-3.5 flex flex-col justify-between overflow-hidden shadow-md active:shadow-sm border border-white/20 rounded-sm ${
        size === 'wide' ? 'col-span-2 h-[140px]' : 'col-span-1 h-[140px]'
      }`}
    >
      {/* Aero Glass Gloss Highlight Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-white/5 to-transparent pointer-events-none" />

      {/* Top Section: Icon / Children / Badge */}
      <div className="relative z-10 flex items-start justify-between w-full">
        {icon && <div className="text-white drop-shadow">{icon}</div>}
        {badge !== undefined && (
          <span className="bg-black/30 backdrop-blur-sm text-white text-[12px] font-bold px-2 py-0.5 rounded-full border border-white/20">
            {badge}
          </span>
        )}
      </div>

      {children && <div className="relative z-10 my-auto">{children}</div>}

      {/* Bottom Section: Title & Subtitle */}
      <div className="relative z-10 mt-auto">
        <div className="text-white font-semibold text-[14px] leading-tight drop-shadow-sm tracking-wide">
          {title}
        </div>
        {subtitle && (
          <div className="text-white/80 text-[11px] leading-tight pt-0.5 truncate font-normal">
            {subtitle}
          </div>
        )}
      </div>
    </button>
  );
};
