'use client';

import React, { useState, useEffect } from 'react';
import { siteConfig } from '@/config/site';
import { aeroSound } from './AeroSound';
import type { ExplorerSection } from './windows/SystemWindow';

interface DesktopGadgetsProps {
  onOpenWindow: (id: string) => void;
  onOpenExplorerSection: (section: ExplorerSection) => void;
  onCloseGadgets: () => void;
}

export const DesktopGadgets: React.FC<DesktopGadgetsProps> = ({
  onOpenWindow,
  onOpenExplorerSection,
  onCloseGadgets,
}) => {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hours = now ? now.getHours() % 12 : 10;
  const minutes = now ? now.getMinutes() : 10;
  const seconds = now ? now.getSeconds() : 30;

  const hourDeg = hours * 30 + minutes * 0.5;
  const minDeg = minutes * 6;
  const secDeg = seconds * 6;

  return (
    <aside
      aria-label="Desktop Gadgets"
      className="fixed top-3 right-3 z-[5] hidden xl:flex flex-col gap-3 w-[196px] select-none pointer-events-auto"
    >
      {/* 1. Analog & Digital Clock Gadget (Johannesburg SAST) */}
      <div className="group relative rounded-xl p-3 bg-gradient-to-b from-white/25 via-black/35 to-black/55 backdrop-blur-md border border-white/35 shadow-[0_6px_20px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.45)] text-white flex flex-col items-center">
        <button
          type="button"
          onClick={onCloseGadgets}
          title="Close Gadget"
          className="opacity-0 group-hover:opacity-100 absolute top-1.5 right-1.5 w-4 h-4 rounded bg-red-500/80 hover:bg-red-600 text-white text-[10px] flex items-center justify-center transition-opacity"
        >
          ✕
        </button>

        <div className="relative w-24 h-24 rounded-full border-2 border-white/70 bg-gradient-to-b from-[#1e3a5f] via-[#0b192c] to-[#07111e] shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),0_2px_8px_rgba(0,0,0,0.5)] flex items-center justify-center">
          {/* Clock Hour Ticks */}
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="absolute w-full h-full left-0 top-0 pointer-events-none"
              style={{ transform: `rotate(${i * 30}deg)` }}
            >
              <span className="block mx-auto mt-1 w-[2px] h-2 bg-cyan-200/80 rounded" />
            </span>
          ))}
          {/* Hands */}
          <div
            className="absolute w-[3px] h-6 bg-white rounded origin-bottom bottom-1/2 left-[calc(50%-1.5px)]"
            style={{ transform: `rotate(${hourDeg}deg)` }}
          />
          <div
            className="absolute w-[2px] h-8 bg-sky-200 rounded origin-bottom bottom-1/2 left-[calc(50%-1px)]"
            style={{ transform: `rotate(${minDeg}deg)` }}
          />
          <div
            className="absolute w-[1px] h-9 bg-red-400 rounded origin-bottom bottom-1/2 left-[calc(50%-0.5px)]"
            style={{ transform: `rotate(${secDeg}deg)` }}
          />
          <div className="w-2 h-2 rounded-full bg-white z-10 shadow" />
          {/* Top Glass Dome Reflection */}
          <div className="absolute top-1 left-3 right-3 h-9 rounded-full bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
        </div>

        <div className="mt-1.5 text-[11px] font-medium text-sky-100 tracking-wide">
          {siteConfig.location.split(',')[0]} (SAST)
        </div>
      </div>

      {/* 2. Security & Career Meter Gadget */}
      <div className="rounded-xl p-3 bg-gradient-to-b from-white/25 via-black/40 to-black/60 backdrop-blur-md border border-white/35 shadow-[0_6px_20px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.45)] text-white space-y-2">
        <div className="flex items-center justify-between border-b border-white/20 pb-1">
          <span className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
            Security Meter
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/30 border border-emerald-400/50 text-emerald-200">
            ONLINE
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center py-1">
          <div className="p-1.5 rounded bg-black/35 border border-white/15">
            <div className="text-[15px] font-bold text-sky-300">8+ Yrs</div>
            <div className="text-[10px] text-slate-300">Experience</div>
          </div>
          <div className="p-1.5 rounded bg-black/35 border border-white/15">
            <div className="text-[15px] font-bold text-emerald-300">15+</div>
            <div className="text-[10px] text-slate-300">Certifications</div>
          </div>
        </div>

        <div className="text-[10.5px] text-slate-200 space-y-0.5">
          <div className="flex justify-between">
            <span>Incident Reduction:</span>
            <span className="text-emerald-300 font-semibold">-40%</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Uptime:</span>
            <span className="text-sky-300 font-semibold">99.9%</span>
          </div>
        </div>
      </div>

      {/* 3. Sticky Note Gadget (Quick Recruiter Shortcuts) */}
      <div className="rounded-sm p-3 bg-gradient-to-b from-[#fef9c3] via-[#fef08a] to-[#fde047] border border-[#ca8a04] shadow-[0_6px_18px_rgba(0,0,0,0.45)] text-[#1c1917] space-y-2">
        <div className="flex items-center justify-between border-b border-[#eab308] pb-1 text-[11px] font-bold text-[#713f12]">
          <span>📌 Recruiter Quick Note</span>
          <span>{siteConfig.initials}</span>
        </div>
        <p className="text-[11.5px] leading-snug text-[#292524]">
          <strong>{siteConfig.name}</strong> &mdash; {siteConfig.role} &amp; Full-Stack Dev (BSc CS &amp; IT).
        </p>
        <div className="flex flex-col gap-1 pt-0.5">
          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              onOpenExplorerSection('projects');
            }}
            className="text-left text-[11px] font-semibold text-[#003399] hover:underline"
          >
            ▸ Open 6 Featured Projects
          </button>
          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              onOpenWindow('notepad');
            }}
            className="text-left text-[11px] font-semibold text-[#003399] hover:underline"
          >
            ▸ Read Plain-Text Resume.txt
          </button>
          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              onOpenWindow('contact');
            }}
            className="text-left text-[11px] font-semibold text-[#15803d] hover:underline"
          >
            ▸ Send WhatsApp / Email
          </button>
        </div>
      </div>
    </aside>
  );
};
