'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Win7LoginBackgroundSvg,
  UserAvatarSvg,
  EaseOfAccessIcon,
  PowerIcon,
  SecurityShieldIcon,
} from '@/core/assets';
import {
  animateLoginScreenIn,
  animateInvalidPasswordShake,
  animateWelcomeTransition,
  animateFlyoutOpen,
} from '@/core/animation';
import { useOS } from '@/state/os-store';
import { aeroSound } from '@/components/AeroSound';

/**
 * Windows 7 Welcome / Logon Screen (/core/login)
 * - Authentic Harmony blue botanical vector background
 * - Configurable user tile frame + avatar
 * - Password input with focus glow, blue circular arrow submit button,
 *   GSAP invalid-password shake, and "Welcome" spinner transition into Desktop.
 */
export const LoginScreen: React.FC = () => {
  const { userProfile, updateUserProfile, loginToDesktop, sleepSystem, restartSystem } = useOS();

  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isWelcoming, setIsWelcoming] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [draftName, setDraftName] = useState(userProfile.name);
  const [draftRole, setDraftRole] = useState(userProfile.role);
  const [showEaseMenu, setShowEaseMenu] = useState(false);
  const [showPowerMenu, setShowPowerMenu] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const loginBoxRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const passwordRowRef = useRef<HTMLDivElement>(null);
  const welcomeBoxRef = useRef<HTMLDivElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const easeMenuRef = useRef<HTMLDivElement>(null);
  const powerMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    animateLoginScreenIn(overlayRef.current, loginBoxRef.current, controlsRef.current);
    const t = setTimeout(() => passwordInputRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (showEaseMenu) animateFlyoutOpen(easeMenuRef.current);
  }, [showEaseMenu]);

  useEffect(() => {
    if (showPowerMenu) animateFlyoutOpen(powerMenuRef.current);
  }, [showPowerMenu]);

  const triggerInvalidShake = () => {
    aeroSound.playClick();
    animateInvalidPasswordShake(passwordRowRef.current);
    setErrorMsg('The user name or password is incorrect.');
  };

  const handleSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isWelcoming) return;

    const trimmed = password.trim().toLowerCase();
    if (trimmed === 'wrong' || trimmed === 'invalid' || trimmed === 'error') {
      triggerInvalidShake();
      return;
    }

    setErrorMsg(null);
    setIsWelcoming(true);
    aeroSound.playClick();

    animateWelcomeTransition(
      loginBoxRef.current,
      welcomeBoxRef.current,
      overlayRef.current,
      () => {
        loginToDesktop();
      }
    );
  };

  const handleSaveUserCustomization = (e: React.FormEvent) => {
    e.preventDefault();
    aeroSound.playClick();
    updateUserProfile({
      name: draftName.trim() || userProfile.name,
      role: draftRole.trim() || userProfile.role,
    });
    setIsEditingUser(false);
  };

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-label="Windows 7 Welcome Screen"
      onClick={() => {
        setShowEaseMenu(false);
        setShowPowerMenu(false);
      }}
      className="fixed inset-0 z-[9990] flex flex-col items-center justify-between p-6 select-none overflow-hidden"
    >
      {/* 1. Vector Windows 7 Logon Background */}
      <Win7LoginBackgroundSvg />

      {/* Top Bar: Security Status & Quick Customize User */}
      <div className="relative z-10 w-full flex items-center justify-between text-white/90 text-[12px]">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 border border-white/20 backdrop-blur-sm">
          <SecurityShieldIcon size={16} />
          <span>Session: {userProfile.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              setDraftName(userProfile.name);
              setDraftRole(userProfile.role);
              setIsEditingUser(!isEditingUser);
            }}
            className="px-3 py-1 rounded border border-white/30 bg-white/10 hover:bg-white/20 text-white text-[11.5px] backdrop-blur-sm cursor-pointer transition-transform active:scale-[0.97]"
          >
            {isEditingUser ? 'Cancel Edit' : 'Switch / Edit User Tile'}
          </button>
        </div>
      </div>

      {/* 2. Center Stage: User Tile + Password Form OR "Welcome" Spinner */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto w-full max-w-md">
        {/* Main Login Tile Box */}
        <div
          ref={loginBoxRef}
          className={`flex flex-col items-center text-center w-full ${
            isWelcoming ? 'pointer-events-none' : ''
          }`}
        >
          {/* Glossy Aero Glass User Tile Frame */}
          <div
            onClick={() => {
              if (!errorMsg && !isEditingUser) handleSignIn();
            }}
            title="Click user tile or press Enter to log on"
            className="group relative w-[132px] h-[132px] rounded-[10px] p-[6px] cursor-pointer transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background:
                'linear-gradient(145deg, rgba(255,255,255,0.85) 0%, rgba(165,210,245,0.55) 48%, rgba(255,255,255,0.3) 52%, rgba(255,255,255,0.75) 100%)',
              boxShadow:
                '0 10px 28px rgba(0,0,0,0.6), 0 0 18px rgba(125,211,252,0.35), inset 0 0 0 1px rgba(255,255,255,0.9)',
              border: '1px solid rgba(15, 23, 42, 0.75)',
            }}
          >
            <div className="relative w-full h-full rounded-[6px] overflow-hidden border border-black/60 bg-[#0c274e]">
              {userProfile.useVectorAvatar ? (
                <UserAvatarSvg size={120} className="w-full h-full" />
              ) : (
                <Image
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  width={120}
                  height={120}
                  className="w-full h-full object-cover"
                  priority
                />
              )}
              {/* Diagonal glass reflection */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.08) 42%, transparent 50%)',
                }}
              />
            </div>
          </div>

          {/* Configurable User Name & Role */}
          <h1
            className="mt-3.5 text-[24px] font-normal text-white tracking-wide"
            style={{
              fontFamily: '"Segoe UI", Tahoma, sans-serif',
              textShadow: '0 2px 6px rgba(0,0,0,0.85), 0 0 12px rgba(0,0,0,0.5)',
            }}
          >
            {userProfile.name}
          </h1>
          <p
            className="text-[12.5px] text-sky-100/90 mt-0.5"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
          >
            {userProfile.role}
          </p>

          {/* Interactive Controls Area */}
          <div ref={controlsRef} className="mt-4 w-full flex flex-col items-center">
            {isEditingUser ? (
              /* Configurable User Tile Editor */
              <form
                onSubmit={handleSaveUserCustomization}
                className="w-[290px] p-3.5 rounded-[6px] bg-black/45 border border-white/35 backdrop-blur-md space-y-2.5 text-left text-white text-[12px]"
              >
                <div className="font-semibold text-sky-200 border-b border-white/20 pb-1">
                  Configure User Account Tile
                </div>
                <div>
                  <label className="block text-[11px] text-sky-100 mb-0.5">Display Name:</label>
                  <input
                    type="text"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    className="w7-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-sky-100 mb-0.5">Title / Role:</label>
                  <input
                    type="text"
                    value={draftRole}
                    onChange={(e) => setDraftRole(e.target.value)}
                    className="w7-input w-full"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      updateUserProfile({ useVectorAvatar: !userProfile.useVectorAvatar })
                    }
                    className="px-2.5 py-1 rounded bg-white/15 hover:bg-white/25 border border-white/30 text-[11px] cursor-pointer"
                  >
                    Avatar: {userProfile.useVectorAvatar ? 'SVG Vector' : 'Photo'}
                  </button>
                  <button type="submit" className="w7-btn default !min-h-[22px]">
                    Apply
                  </button>
                </div>
              </form>
            ) : errorMsg ? (
              /* Authentic Windows 7 Incorrect Password Error Screen */
              <div className="flex flex-col items-center gap-3 mt-1">
                <div className="flex items-center gap-2.5 px-4 py-2 rounded bg-black/35 border border-red-300/45 text-white text-[13px] shadow-lg">
                  <span className="w-5 h-5 rounded-full bg-red-600 border border-white flex items-center justify-center text-[11px] font-bold">
                    ✕
                  </span>
                  <span>{errorMsg}</span>
                </div>
                <button
                  type="button"
                  autoFocus
                  onClick={() => {
                    aeroSound.playClick();
                    setErrorMsg(null);
                    setPassword('');
                    setTimeout(() => passwordInputRef.current?.focus(), 50);
                  }}
                  className="w7-btn default !min-w-[82px] font-semibold"
                >
                  OK
                </button>
              </div>
            ) : (
              /* Classic Password Field + Glossy Blue Circular Arrow Button */
              <form onSubmit={handleSignIn} className="flex flex-col items-center w-full">
                <div ref={passwordRowRef} className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      ref={passwordInputRef}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password (press Enter)"
                      aria-label="Password"
                      className="w-[216px] h-[28px] px-2.5 rounded-[3px] bg-white/95 text-[#111] text-[13px] border border-[#1e3a5f] shadow-[inset_0_1px_2px_rgba(0,0,0,0.25),0_1px_2px_rgba(255,255,255,0.35)] focus:outline-none focus:border-[#38bdf8] focus:shadow-[0_0_10px_2px_rgba(56,189,248,0.85),inset_0_0_0_1px_#0284c7] transition-shadow"
                    />
                  </div>

                  {/* Iconic Blue Circular Arrow Submit Button */}
                  <button
                    type="submit"
                    aria-label="Submit password and log on"
                    title="Log on to Windows 7 Desktop"
                    className="w-[30px] h-[30px] rounded-full flex items-center justify-center cursor-pointer border border-[#0c4a6e] shadow-[0_2px_6px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:brightness-115 hover:shadow-[0_0_12px_rgba(56,189,248,0.95)] active:scale-[0.95] transition-[transform,box-shadow,filter] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]"
                    style={{
                      background:
                        'radial-gradient(circle at 50% 85%, #67e8f9 0%, transparent 65%), linear-gradient(180deg, #bae6fd 0%, #38bdf8 46%, #0284c7 52%, #0369a1 100%)',
                    }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2.3"
                    >
                      <path
                        d="M3 8h9M8.5 4L12.5 8l-4 4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                {/* Micro-interaction Helper Actions */}
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11.5px]">
                  <button
                    type="submit"
                    className="px-3 py-1 rounded bg-white/15 hover:bg-white/25 border border-white/35 text-white font-medium backdrop-blur-sm cursor-pointer transition-transform active:scale-[0.97]"
                  >
                    Sign In to Desktop &rarr;
                  </button>
                  <button
                    type="button"
                    onClick={triggerInvalidShake}
                    className="px-2.5 py-1 rounded bg-black/25 hover:bg-black/40 border border-white/20 text-sky-100/90 cursor-pointer transition-transform active:scale-[0.97]"
                    title="Test the GSAP invalid-password shake animation"
                  >
                    Test Wrong Password Shake
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* 3. "Welcome" Spinning Aero Ring Transition View */}
        <div
          ref={welcomeBoxRef}
          className={`absolute inset-0 flex items-center justify-center gap-4 pointer-events-none ${
            isWelcoming ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Windows 7 Aero Busy Ring Spinner SVG */}
          <svg
            width="38"
            height="38"
            viewBox="0 0 40 40"
            className="animate-spin"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="w7WelcomeRing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="rgba(2,132,199,0.1)" />
              </linearGradient>
            </defs>
            <circle
              cx="20"
              cy="20"
              r="15"
              fill="none"
              stroke="url(#w7WelcomeRing)"
              strokeWidth="4.2"
              strokeLinecap="round"
            />
          </svg>
          <span
            className="text-[28px] text-white font-light tracking-wide"
            style={{
              fontFamily: '"Segoe UI", Tahoma, sans-serif',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            }}
          >
            Welcome
          </span>
        </div>
      </div>

      {/* 4. Bottom Bar: Ease of Access (Left), Windows 7 Ultimate Branding (Center), Shut Down (Right) */}
      <div className="relative z-10 w-full flex items-center justify-between">
        {/* Bottom-Left Ease of Access Button & Flyout */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            aria-label="Ease of Access"
            title="Ease of Access"
            onClick={() => {
              aeroSound.playClick();
              setShowPowerMenu(false);
              setShowEaseMenu(!showEaseMenu);
            }}
            className="h-[30px] px-2.5 rounded-[4px] border border-black/65 bg-gradient-to-b from-white/35 via-white/15 to-black/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_2px_6px_rgba(0,0,0,0.5)] hover:brightness-125 flex items-center gap-1.5 cursor-pointer active:scale-[0.97] transition-transform"
          >
            <EaseOfAccessIcon size={18} />
          </button>

          {showEaseMenu && (
            <div
              ref={easeMenuRef}
              style={{ transformOrigin: 'bottom left' }}
              className="w7-context-menu !absolute !bottom-9 !left-0 min-w-[215px]"
            >
              <button
                type="button"
                className="w7-menu-item"
                onClick={() => {
                  aeroSound.enabled = !aeroSound.enabled;
                  if (aeroSound.enabled) aeroSound.playClick();
                  setShowEaseMenu(false);
                }}
              >
                <span>{aeroSound.enabled ? '✓ ' : ''}Enable system audio cues</span>
              </button>
              <button
                type="button"
                className="w7-menu-item"
                onClick={() => {
                  updateUserProfile({ useVectorAvatar: !userProfile.useVectorAvatar });
                  setShowEaseMenu(false);
                }}
              >
                <span>{userProfile.useVectorAvatar ? '✓ ' : ''}Use high-contrast SVG avatar</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom-Center Windows 7 Ultimate Emblem */}
        <div className="flex items-center gap-2 text-white/95">
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2 3.5 C5.5 2, 8.5 2.2, 11 3.5 V11 C8.5 9.8, 5.5 9.6, 2 11 Z" fill="#f25022" />
            <path d="M12.5 3.8 C15.5 5.1, 18.5 5.1, 21.5 3.6 V11.1 C18.5 12.6, 15.5 12.6, 12.5 11.2 Z" fill="#7fba00" />
            <path d="M2 12.5 C5.5 11, 8.5 11.2, 11 12.5 V20 C8.5 18.8, 5.5 18.6, 2 20 Z" fill="#00a4ef" />
            <path d="M12.5 12.8 C15.5 14.1, 18.5 14.1, 21.5 12.6 V20.1 C18.5 21.6, 15.5 21.6, 12.5 20.2 Z" fill="#ffb900" />
          </svg>
          <div
            className="text-[14px] tracking-wide"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.85)' }}
          >
            <span className="font-semibold">Windows 7</span>{' '}
            <span className="font-light text-sky-100">Ultimate</span>
          </div>
        </div>

        {/* Bottom-Right Red Glossy Shut Down Split Button */}
        <div className="relative flex items-center" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            title="Restart Boot Sequence"
            onClick={restartSystem}
            className="h-[30px] px-2.5 rounded-l-[4px] border border-black/75 flex items-center justify-center cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_2px_6px_rgba(0,0,0,0.5)] hover:brightness-115 active:scale-[0.97] transition-transform"
            style={{
              background:
                'linear-gradient(180deg, #fca5a5 0%, #ef4444 48%, #b91c1c 52%, #991b1b 100%)',
            }}
          >
            <PowerIcon size={16} />
          </button>
          <button
            type="button"
            aria-label="Power options"
            onClick={() => {
              aeroSound.playClick();
              setShowEaseMenu(false);
              setShowPowerMenu(!showPowerMenu);
            }}
            className="h-[30px] w-[20px] rounded-r-[4px] border border-l-0 border-black/75 flex items-center justify-center text-white text-[10px] cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_2px_6px_rgba(0,0,0,0.5)] hover:brightness-115"
            style={{
              background:
                'linear-gradient(180deg, #fca5a5 0%, #ef4444 48%, #b91c1c 52%, #991b1b 100%)',
            }}
          >
            ▴
          </button>

          {showPowerMenu && (
            <div
              ref={powerMenuRef}
              style={{ transformOrigin: 'bottom right' }}
              className="w7-context-menu !absolute !bottom-9 !right-0 !left-auto min-w-[165px]"
            >
              <button
                type="button"
                className="w7-menu-item"
                onClick={() => {
                  setShowPowerMenu(false);
                  sleepSystem();
                }}
              >
                <span>Sleep</span>
              </button>
              <button
                type="button"
                className="w7-menu-item"
                onClick={() => {
                  setShowPowerMenu(false);
                  restartSystem();
                }}
              >
                <span>Restart (Replay Boot)</span>
              </button>
              <button
                type="button"
                className="w7-menu-item font-semibold"
                onClick={() => {
                  setShowPowerMenu(false);
                  handleSignIn();
                }}
              >
                <span>Enter Desktop</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
