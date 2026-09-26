'use client';

import React from 'react';
import { PersonalizeIcon } from '../AeroIcons';
import { aeroSound } from '../AeroSound';

export type WallpaperPreset = 'harmony' | 'aurora' | 'security' | 'bliss';

export interface AeroColorOption {
  name: string;
  rgb: string;
  taskbarRgb: string;
  swatch: string;
}

export const AERO_COLORS: AeroColorOption[] = [
  { name: 'Sky Blue (Default)', rgb: '58, 122, 196', taskbarRgb: '14, 38, 68', swatch: '#3a7ac4' },
  { name: 'Twilight Sapphire', rgb: '28, 76, 160', taskbarRgb: '10, 26, 58', swatch: '#1c4ca0' },
  { name: 'Seafoam Teal', rgb: '20, 148, 160', taskbarRgb: '8, 48, 56', swatch: '#1494a0' },
  { name: 'Emerald Leaf', rgb: '38, 142, 78', taskbarRgb: '12, 48, 28', swatch: '#268e4e' },
  { name: 'Ruby Crimson', rgb: '175, 42, 58', taskbarRgb: '56, 12, 18', swatch: '#af2a3a' },
  { name: 'Violet Aura', rgb: '118, 62, 175', taskbarRgb: '36, 16, 58', swatch: '#763eaf' },
  { name: 'Amber Gold', rgb: '192, 128, 24', taskbarRgb: '54, 34, 8', swatch: '#c08018' },
  { name: 'Frost Graphite', rgb: '75, 85, 99', taskbarRgb: '24, 28, 34', swatch: '#4b5563' },
];

interface PersonalizeWindowProps {
  wallpaper: WallpaperPreset;
  onWallpaperChange: (wp: WallpaperPreset) => void;
  glassColor: AeroColorOption;
  onGlassColorChange: (color: AeroColorOption) => void;
  glassOpacity: number;
  onGlassOpacityChange: (alpha: number) => void;
  showGadgets: boolean;
  onToggleGadgets: () => void;
}

export const PersonalizeWindow: React.FC<PersonalizeWindowProps> = ({
  wallpaper,
  onWallpaperChange,
  glassColor,
  onGlassColorChange,
  glassOpacity,
  onGlassOpacityChange,
  showGadgets,
  onToggleGadgets,
}) => {
  const wallpapers: { id: WallpaperPreset; name: string; desc: string; previewClass: string }[] = [
    {
      id: 'harmony',
      name: 'Harmony Aero (Default)',
      desc: 'Radiant cerulean sky with soft glass light flares',
      previewClass: 'w7-wallpaper-harmony',
    },
    {
      id: 'aurora',
      name: 'Aurora Borealis',
      desc: 'Deep oceanic cyan and teal atmospheric ribbons',
      previewClass: 'w7-wallpaper-aurora',
    },
    {
      id: 'security',
      name: 'Midnight Security',
      desc: 'Dark tactical cyber operations blue environment',
      previewClass: 'w7-wallpaper-security',
    },
    {
      id: 'bliss',
      name: 'Daylight Horizon',
      desc: 'Bright azure sky gradient with warm horizon glow',
      previewClass: 'w7-wallpaper-bliss',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Address Bar */}
      <div className="w7-explorer-nav">
        <div className="w7-address-bar">
          <PersonalizeIcon size={15} className="mr-1 shrink-0" />
          <span className="text-[#666] text-[11px] mx-0.5">▸</span>
          <span className="w7-crumb-btn">Control Panel</span>
          <span className="text-[#666] text-[11px] mx-0.5">▸</span>
          <span className="w7-crumb-btn">Appearance and Personalization</span>
          <span className="text-[#666] text-[11px] mx-0.5">▸</span>
          <span className="w7-crumb-btn font-semibold text-[#003399]">Personalization</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto w7-scroll p-4 sm:p-5 space-y-5">
        <div>
          <h1 className="text-[18px] text-[#003399] font-normal" style={{ fontFamily: 'Calibri, "Segoe UI", sans-serif' }}>
            Change the visuals and Aero glass effects on your desktop
          </h1>
          <p className="text-[12px] text-[#444] mt-0.5">
            Click a desktop theme or window glass color swatch to immediately customize the workspace.
          </p>
        </div>

        {/* 1. Desktop Background Themes */}
        <fieldset className="w7-groupbox">
          <legend className="font-semibold text-[12.5px]">Aero Themes &amp; Desktop Background (4)</legend>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {wallpapers.map((wp) => {
              const selected = wallpaper === wp.id;
              return (
                <button
                  key={wp.id}
                  type="button"
                  onClick={() => {
                    aeroSound.playClick();
                    onWallpaperChange(wp.id);
                  }}
                  className={`w7-item-box p-2 flex flex-col items-center text-center gap-1.5 ${
                    selected ? 'selected' : ''
                  }`}
                >
                  <div className={`w-full h-14 rounded border border-[#64748b] shadow-inner relative overflow-hidden ${wp.previewClass}`}>
                    <div
                      className="absolute bottom-1.5 right-1.5 w-10 h-6 rounded-[2px] border border-white/70 shadow"
                      style={{ backgroundColor: `rgba(${glassColor.rgb}, 0.65)` }}
                    />
                  </div>
                  <div className="font-semibold text-[11.5px] text-[#111]">{wp.name}</div>
                  <div className="text-[10.5px] text-[#555] line-clamp-2">{wp.desc}</div>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* 2. Window Glass Color Swatches */}
        <fieldset className="w7-groupbox">
          <legend className="font-semibold text-[12.5px]">Window Color and Appearance (Aero Glass)</legend>
          <div className="space-y-3 pt-1">
            <div className="flex flex-wrap gap-2.5">
              {AERO_COLORS.map((c) => {
                const isSelected = glassColor.name === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    onClick={() => {
                      aeroSound.playClick();
                      onGlassColorChange(c);
                    }}
                    className={`group flex flex-col items-center gap-1 p-1.5 rounded border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#0066cc] bg-[#e6f2ff] shadow-sm'
                        : 'border-transparent hover:border-[#9abbe0] hover:bg-[#f4f9ff]'
                    }`}
                  >
                    <div
                      className="w-9 h-9 rounded-[4px] border border-black/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_3px_rgba(0,0,0,0.25)] relative overflow-hidden"
                      style={{ backgroundColor: c.swatch }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-black/20" />
                    </div>
                    <span className="text-[10.5px] text-[#222]">{c.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Color Intensity Slider */}
            <div className="flex items-center gap-3 pt-1 max-w-md">
              <label htmlFor="glass-intensity" className="text-[12px] text-[#333] w-28 shrink-0">
                Color intensity:
              </label>
              <input
                id="glass-intensity"
                type="range"
                min={0.32}
                max={0.88}
                step={0.04}
                value={glassOpacity}
                onChange={(e) => onGlassOpacityChange(parseFloat(e.target.value))}
                className="flex-1 cursor-pointer accent-[#0066cc]"
              />
              <span className="text-[11px] font-mono text-[#555] w-10 text-right">
                {Math.round(glassOpacity * 100)}%
              </span>
            </div>
          </div>
        </fieldset>

        {/* 3. Desktop Gadgets Toggle */}
        <div className="flex items-center justify-between p-3 rounded border border-[#d0d7de] bg-[#f8fafc]">
          <div>
            <div className="font-semibold text-[12.5px] text-[#111]">Desktop Gadgets</div>
            <div className="text-[11.5px] text-[#555]">
              Display floating Johannesburg Clock, Security Meter, and Recruiter Sticky Note on the desktop.
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              onToggleGadgets();
            }}
            className="w7-btn"
          >
            {showGadgets ? 'Hide Gadgets' : 'Show Gadgets'}
          </button>
        </div>
      </div>
    </div>
  );
};
