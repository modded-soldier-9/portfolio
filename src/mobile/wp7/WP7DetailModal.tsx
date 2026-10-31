'use client';

import React, { useEffect } from 'react';
import { aeroSound } from '@/components/AeroSound';

export interface WP7DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  accentColor?: string;
  children: React.ReactNode;
}

export const WP7DetailModal: React.FC<WP7DetailModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  accentColor = '#0078d7',
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0f172a] text-white animate-in fade-in slide-in-from-right duration-200">
      {/* Top WP7 Header Bar */}
      <header
        style={{ backgroundColor: accentColor }}
        className="relative px-4 pt-6 pb-4 border-b border-white/20 shadow-md select-none"
      >
        {/* Aero Glass Gloss Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-2 -ml-2 rounded active:bg-black/20 text-white font-medium text-[15px] min-h-[48px] min-w-[48px]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Back</span>
          </button>

          <span className="text-[12px] uppercase tracking-widest text-white/70 font-semibold">
            Windows Phone
          </span>
        </div>

        <div className="relative z-10 mt-2">
          <h1 className="text-[26px] font-light tracking-tight text-white leading-none">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[13px] text-white/80 font-normal mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </header>

      {/* Modal Scrollable Content Sheet */}
      <main className="flex-1 overflow-y-auto p-4 w7-scroll bg-gradient-to-b from-[#111827] to-[#030712]">
        <div className="max-w-2xl mx-auto space-y-4">
          {children}
        </div>
      </main>

      {/* Bottom Sticky Action Bar */}
      <footer className="bg-black/80 backdrop-blur-md border-t border-white/10 p-3 flex items-center justify-around select-none">
        <button
          type="button"
          onClick={() => {
            aeroSound.playClick();
            onClose();
          }}
          className="flex flex-col items-center justify-center gap-1 text-[12px] text-white/80 active:text-white min-w-[64px] min-h-[48px]"
        >
          <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center text-[16px]">
            ✕
          </div>
          <span>Close</span>
        </button>
      </footer>
    </div>
  );
};
