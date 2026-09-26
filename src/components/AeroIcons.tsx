import React, { useId } from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Glowing Aero Start Orb Icon (4-color luminous wave shield inside glass sphere)
 */
export const StartOrbIcon: React.FC<{ state?: 'normal' | 'hover' | 'active' }> = ({ state = 'normal' }) => {
  const uid = useId().replace(/:/g, '');
  const glowOpacity = state === 'hover' ? 0.95 : state === 'active' ? 1 : 0.65;
  return (
    <svg viewBox="0 0 44 44" className="w-full h-full select-none pointer-events-none" aria-hidden="true">
      <defs>
        <radialGradient id={`orbOuterGlow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6be5ff" stopOpacity={glowOpacity} />
          <stop offset="65%" stopColor="#1b80d4" stopOpacity={glowOpacity * 0.6} />
          <stop offset="100%" stopColor="#0a3266" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`orbSphere-${uid}`} cx="50%" cy="82%" r="75%">
          <stop offset="0%" stopColor="#43d9ff" />
          <stop offset="38%" stopColor="#1268b8" />
          <stop offset="78%" stopColor="#092954" />
          <stop offset="100%" stopColor="#04152e" />
        </radialGradient>
        <linearGradient id={`orbTopGloss-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.88" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="52%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`q1-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff8a5c" />
          <stop offset="100%" stopColor="#e03c11" />
        </linearGradient>
        <linearGradient id={`q2-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b4f556" />
          <stop offset="100%" stopColor="#58b312" />
        </linearGradient>
        <linearGradient id={`q3-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5cd6ff" />
          <stop offset="100%" stopColor="#1277d6" />
        </linearGradient>
        <linearGradient id={`q4-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe761" />
          <stop offset="100%" stopColor="#f0a800" />
        </linearGradient>
      </defs>
      {/* Outer halo */}
      <circle cx="22" cy="22" r="21" fill={`url(#orbOuterGlow-${uid})`} />
      {/* Metallic outer ring */}
      <circle cx="22" cy="22" r="18" fill="#09254a" stroke="rgba(255,255,255,0.65)" strokeWidth="1.2" />
      {/* Deep glass sphere */}
      <circle cx="22" cy="22" r="16.8" fill={`url(#orbSphere-${uid})`} />
      {/* 4-color wavy emblem */}
      <g transform="translate(11.5, 11.5) scale(0.95)">
        <path d="M1 2.2 C4.2 0.6, 7.2 0.8, 10 2.3 L10 10.2 C7.2 8.8, 4.2 8.6, 1 10.1 Z" fill={`url(#q1-${uid})`} />
        <path d="M11.6 2.6 C14.6 4.1, 17.6 4.1, 20.6 2.5 L20.6 10.4 C17.6 12, 14.6 12, 11.6 10.5 Z" fill={`url(#q2-${uid})`} />
        <path d="M1 11.7 C4.2 10.2, 7.2 10.4, 10 11.9 L10 19.8 C7.2 18.4, 4.2 18.2, 1 19.7 Z" fill={`url(#q3-${uid})`} />
        <path d="M11.6 12.1 C14.6 13.6, 17.6 13.6, 20.6 12 L20.6 19.9 C17.6 21.5, 14.6 21.5, 11.6 20 Z" fill={`url(#q4-${uid})`} />
      </g>
      {/* Top specular glass dome highlight */}
      <ellipse cx="22" cy="14.5" rx="14" ry="8.5" fill={`url(#orbTopGloss-${uid})`} />
      {/* Bottom cyan rim reflection */}
      <path d="M9 30 A15 15 0 0 0 35 30 A15.5 13 0 0 1 9 30 Z" fill="rgba(120, 235, 255, 0.45)" />
    </svg>
  );
};

/**
 * Computer / System Monitor Icon (Glossy Aero LCD Display)
 */
export const ComputerIcon: React.FC<IconProps> = ({ className = '', size = 32 }) => {
  const uid = useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`compBezel-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6a7582" />
          <stop offset="50%" stopColor="#353d47" />
          <stop offset="100%" stopColor="#1b2026" />
        </linearGradient>
        <linearGradient id={`compScreen-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6ee2ff" />
          <stop offset="45%" stopColor="#1d8be0" />
          <stop offset="100%" stopColor="#093873" />
        </linearGradient>
        <linearGradient id={`compStand-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
      </defs>
      {/* Stand base */}
      <ellipse cx="24" cy="41.5" rx="11" ry="3" fill={`url(#compStand-${uid})`} stroke="#475569" strokeWidth="1" />
      {/* Stand neck */}
      <rect x="20" y="34" width="8" height="7" rx="1" fill={`url(#compStand-${uid})`} stroke="#475569" strokeWidth="1" />
      {/* Monitor frame */}
      <rect x="4" y="6" width="40" height="29" rx="3.5" fill={`url(#compBezel-${uid})`} stroke="#cbd5e1" strokeWidth="1.2" />
      {/* Screen */}
      <rect x="7" y="9" width="34" height="22" rx="1.5" fill={`url(#compScreen-${uid})`} />
      {/* Screen glass diagonal sheen */}
      <path d="M7 9 L28 9 L16 31 L7 31 Z" fill="rgba(255,255,255,0.26)" />
      {/* Power LED */}
      <circle cx="24" cy="33" r="1" fill="#38bdf8" />
    </svg>
  );
};

/**
 * Library / File Explorer Icon (Golden Folder inside Blue Library Clip)
 */
export const ExplorerIcon: React.FC<IconProps> = ({ className = '', size = 32 }) => {
  const uid = useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`expBack-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe57f" />
          <stop offset="100%" stopColor="#d99b16" />
        </linearGradient>
        <linearGradient id={`expFront-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff099" />
          <stop offset="45%" stopColor="#f7c232" />
          <stop offset="100%" stopColor="#cf870a" />
        </linearGradient>
        <linearGradient id={`expClip-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4fc3f7" />
          <stop offset="100%" stopColor="#0277bd" />
        </linearGradient>
      </defs>
      {/* Back folder tab */}
      <path d="M7 10 H19 L22 14 H41 C42.1 14 43 14.9 43 16 V38 C43 39.1 42.1 40 41 40 H7 C5.9 40 5 39.1 5 38 V12 C5 10.9 5.9 10 7 10 Z" fill={`url(#expBack-${uid})`} stroke="#a67108" strokeWidth="1.2" />
      {/* Inner paper sheet */}
      <rect x="9" y="13" width="30" height="20" rx="1" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
      {/* Front folder flap */}
      <path d="M5 19 H43 L41.5 39 C41.4 40 40.5 40.5 39.5 40.5 H8.5 C7.5 40.5 6.6 40 6.5 39 L5 19 Z" fill={`url(#expFront-${uid})`} stroke="#b47b09" strokeWidth="1.2" />
      {/* Glossy highlight on folder */}
      <path d="M6 20 H42 L41.5 26 H6.5 Z" fill="rgba(255,255,255,0.38)" />
      {/* Blue Explorer bottom clip */}
      <path d="M13 31 H35 L34 42 H14 Z" fill={`url(#expClip-${uid})`} stroke="#01579b" strokeWidth="1.2" rx="2" />
      <rect x="17" y="34" width="14" height="5" rx="1" fill="rgba(255,255,255,0.3)" />
    </svg>
  );
};

/**
 * Classic Aero Golden Folder Icon (with peeking content preview)
 */
export const FolderIcon: React.FC<IconProps & { badgeColor?: string }> = ({
  className = '',
  size = 32,
  badgeColor = '#2b88d8',
}) => {
  const uid = useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`fldBack-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde073" />
          <stop offset="100%" stopColor="#d19010" />
        </linearGradient>
        <linearGradient id={`fldFront-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff3a1" />
          <stop offset="50%" stopColor="#f6bf27" />
          <stop offset="100%" stopColor="#c97f06" />
        </linearGradient>
      </defs>
      {/* Folder Back */}
      <path d="M6 9 H18 L21 13 H40 C41.5 13 42.5 14 42.5 15.5 V38.5 C42.5 40 41.5 41 40 41 H6 C4.5 41 3.5 40 3.5 38.5 V11.5 C3.5 10 4.5 9 6 9 Z" fill={`url(#fldBack-${uid})`} stroke="#9e6905" strokeWidth="1.2" />
      {/* Peeking document */}
      <rect x="10" y="12" width="26" height="22" rx="1.5" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" transform="rotate(-2 23 23)" />
      <rect x="13" y="15" width="18" height="4" rx="1" fill={badgeColor} opacity="0.85" />
      {/* Folder Front */}
      <path d="M4 19 H44 L42 39.5 C41.8 40.5 41 41 40 41 H6 C5 41 4.2 40.5 4 39.5 L4 19 Z" fill={`url(#fldFront-${uid})`} stroke="#a86e04" strokeWidth="1.2" />
      {/* Top Specular Edge */}
      <path d="M5 20 H43 L42.5 25 H5.5 Z" fill="rgba(255,255,255,0.42)" />
    </svg>
  );
};

/**
 * Security Shield Icon (4-color Action Center / Defender Shield)
 */
export const SecurityShieldIcon: React.FC<IconProps> = ({ className = '', size = 32 }) => {
  const uid = useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`shRim-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="50%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>
      {/* Outer metallic shield */}
      <path d="M24 4 L41 10 V23 C41 34 33.5 41.5 24 44 C14.5 41.5 7 34 7 23 V10 L24 4 Z" fill={`url(#shRim-${uid})`} stroke="#1e293b" strokeWidth="1.4" />
      {/* 4 Quadrants */}
      <path d="M24 7 L10 12 V23 H24 V7 Z" fill="#ef4444" />
      <path d="M24 7 L38 12 V23 H24 V7 Z" fill="#22c55e" />
      <path d="M10 23 C10 32 16 38.5 24 41 V23 H10 Z" fill="#3b82f6" />
      <path d="M38 23 C38 32 32 38.5 24 41 V23 H38 Z" fill="#eab308" />
      {/* Glass gloss overlay */}
      <path d="M24 6.5 L38.5 11.5 V21 C30 23 18 23 9.5 21 V11.5 L24 6.5 Z" fill="rgba(255,255,255,0.38)" />
      {/* Inner cross bevel */}
      <line x1="24" y1="7" x2="24" y2="41" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
      <line x1="10" y1="23" x2="38" y2="23" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
    </svg>
  );
};

/**
 * Briefcase / Experience Icon
 */
export const BriefcaseIcon: React.FC<IconProps> = ({ className = '', size = 32 }) => {
  const uid = useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`caseBody-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <linearGradient id={`caseFlap-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      {/* Handle */}
      <path d="M18 12 V8 C18 6.8 19 6 20.2 6 H27.8 C29 6 30 6.8 30 8 V12" fill="none" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
      {/* Case body */}
      <rect x="5" y="12" width="38" height="29" rx="3.5" fill={`url(#caseBody-${uid})`} stroke="#451a03" strokeWidth="1.3" />
      {/* Top flap */}
      <path d="M5 15.5 C5 13.5 6.5 12 8.5 12 H39.5 C41.5 12 43 13.5 43 15.5 V24 C43 25.5 41.5 26.5 40 26.5 H8 C6.5 26.5 5 25.5 5 24 Z" fill={`url(#caseFlap-${uid})`} stroke="#78350f" strokeWidth="1" />
      {/* Gloss */}
      <rect x="7" y="13.5" width="34" height="5" rx="1.5" fill="rgba(255,255,255,0.28)" />
      {/* Brass buckles */}
      <rect x="13" y="23" width="5" height="7" rx="1" fill="#fde047" stroke="#854d0e" strokeWidth="1" />
      <rect x="30" y="23" width="5" height="7" rx="1" fill="#fde047" stroke="#854d0e" strokeWidth="1" />
    </svg>
  );
};

/**
 * Certificate / Credentials Ribbon Icon
 */
export const CertificateIcon: React.FC<IconProps> = ({ className = '', size = 32 }) => {
  const uid = useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`certPaper-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id={`certSeal-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
      <rect x="5" y="7" width="38" height="29" rx="2.5" fill={`url(#certPaper-${uid})`} stroke="#64748b" strokeWidth="1.4" />
      <rect x="8" y="10" width="32" height="23" fill="none" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 1" />
      <line x1="12" y1="15" x2="30" y2="15" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="20" x2="36" y2="20" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="12" y1="24" x2="26" y2="24" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round" />
      {/* Ribbons */}
      <path d="M31 32 L28 44 L32.5 41 L35 44 L34 32 Z" fill="#dc2626" />
      <path d="M34 32 L36 44 L39 41 L42 43 L38 32 Z" fill="#b91c1c" />
      {/* Gold Seal */}
      <circle cx="34" cy="29" r="6.5" fill={`url(#certSeal-${uid})`} stroke="#854d0e" strokeWidth="1.2" />
      <circle cx="34" cy="29" r="4" fill="none" stroke="#fef08a" strokeWidth="0.8" />
    </svg>
  );
};

/**
 * Contact / Mail & WhatsApp Aero Icon
 */
export const ContactMailIcon: React.FC<IconProps> = ({ className = '', size = 32 }) => {
  const uid = useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`mailBg-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dbeafe" />
        </linearGradient>
        <linearGradient id={`mailFlap-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <rect x="4" y="10" width="36" height="26" rx="2.5" fill={`url(#mailBg-${uid})`} stroke="#2563eb" strokeWidth="1.3" />
      <path d="M4 35 L18 22 M40 35 L26 22" stroke="#93c5fd" strokeWidth="1.3" />
      <path d="M4 11 L22 25 L40 11 Z" fill={`url(#mailFlap-${uid})`} stroke="#1d4ed8" strokeWidth="1.1" strokeLinejoin="round" />
      {/* Green communication orb badge */}
      <circle cx="36" cy="33" r="8.5" fill="#22c55e" stroke="#15803d" strokeWidth="1.3" />
      <path d="M32.5 33 L35 35.5 L39.5 30.5" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/**
 * Command Prompt (cmd.exe) Icon
 */
export const CmdIcon: React.FC<IconProps> = ({ className = '', size = 32 }) => {
  const uid = useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`cmdFrame-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>
      <rect x="4" y="7" width="40" height="34" rx="3" fill={`url(#cmdFrame-${uid})`} stroke="#0f172a" strokeWidth="1.4" />
      {/* Title bar */}
      <rect x="6" y="9" width="36" height="5" rx="1" fill="rgba(255,255,255,0.45)" />
      {/* Black terminal screen */}
      <rect x="6" y="15" width="36" height="24" fill="#0c0c0c" stroke="#475569" strokeWidth="1" />
      {/* C:\_ prompt */}
      <text x="9" y="27" fill="#e2e8f0" fontFamily="Consolas, monospace" fontSize="11" fontWeight="bold">C:\&gt;_</text>
    </svg>
  );
};

/**
 * Notepad / Resume Document Icon
 */
export const NotepadIcon: React.FC<IconProps> = ({ className = '', size = 32 }) => {
  const uid = useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`padCover-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      {/* Cyan backing */}
      <rect x="9" y="6" width="31" height="37" rx="2" fill={`url(#padCover-${uid})`} stroke="#0369a1" strokeWidth="1.3" />
      {/* White page */}
      <rect x="11" y="9" width="27" height="31" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
      {/* Ruled lines */}
      <line x1="14" y1="15" x2="34" y2="15" stroke="#93c5fd" strokeWidth="1.3" />
      <line x1="14" y1="20" x2="34" y2="20" stroke="#93c5fd" strokeWidth="1.3" />
      <line x1="14" y1="25" x2="34" y2="25" stroke="#93c5fd" strokeWidth="1.3" />
      <line x1="14" y1="30" x2="28" y2="30" stroke="#93c5fd" strokeWidth="1.3" />
      {/* Top spiral rings */}
      <rect x="13" y="4" width="2.5" height="5" rx="1" fill="#64748b" />
      <rect x="19" y="4" width="2.5" height="5" rx="1" fill="#64748b" />
      <rect x="25" y="4" width="2.5" height="5" rx="1" fill="#64748b" />
      <rect x="31" y="4" width="2.5" height="5" rx="1" fill="#64748b" />
    </svg>
  );
};

/**
 * Personalization / Theme Icon (Monitor + Aero Brush Palette in unified 48x48 viewBox)
 */
export const PersonalizeIcon: React.FC<IconProps> = ({ className = '', size = 32 }) => {
  const uid = useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`persBezel-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6a7582" />
          <stop offset="50%" stopColor="#353d47" />
          <stop offset="100%" stopColor="#1b2026" />
        </linearGradient>
        <linearGradient id={`persScreen-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6ee2ff" />
          <stop offset="45%" stopColor="#1d8be0" />
          <stop offset="100%" stopColor="#093873" />
        </linearGradient>
        <linearGradient id={`persStand-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
      </defs>
      {/* Stand base */}
      <ellipse cx="22" cy="41" rx="10" ry="2.8" fill={`url(#persStand-${uid})`} stroke="#475569" strokeWidth="1" />
      {/* Stand neck */}
      <rect x="18.5" y="33.5" width="7" height="7" rx="1" fill={`url(#persStand-${uid})`} stroke="#475569" strokeWidth="1" />
      {/* Monitor frame */}
      <rect x="3" y="6" width="38" height="28" rx="3.5" fill={`url(#persBezel-${uid})`} stroke="#cbd5e1" strokeWidth="1.2" />
      {/* Screen */}
      <rect x="6" y="9" width="32" height="21" rx="1.5" fill={`url(#persScreen-${uid})`} />
      <path d="M6 9 L26 9 L15 30 L6 30 Z" fill="rgba(255,255,255,0.26)" />
      {/* Color palette overlay */}
      <circle cx="35.5" cy="33.5" r="9.5" fill="#ffffff" stroke="#475569" strokeWidth="1.3" />
      <circle cx="32.5" cy="30.5" r="2.3" fill="#ef4444" />
      <circle cx="37.5" cy="30" r="2.3" fill="#3b82f6" />
      <circle cx="39.5" cy="34.5" r="2.3" fill="#22c55e" />
      <circle cx="34.5" cy="37" r="2.3" fill="#eab308" />
    </svg>
  );
};

/**
 * Project Application Icon (Aero Window + Code Brackets)
 */
export const ProjectAppIcon: React.FC<IconProps & { accent?: string }> = ({
  className = '',
  size = 32,
  accent = '#2563eb',
}) => {
  const uid = useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`appWin-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eff6ff" />
          <stop offset="100%" stopColor="#bfdbfe" />
        </linearGradient>
      </defs>
      <rect x="5" y="7" width="38" height="34" rx="3.5" fill={`url(#appWin-${uid})`} stroke="#1e40af" strokeWidth="1.4" />
      <rect x="5" y="7" width="38" height="8" rx="3" fill={accent} />
      <circle cx="38" cy="11" r="1.5" fill="#fca5a5" />
      <circle cx="33.5" cy="11" r="1.5" fill="#93c5fd" />
      <rect x="9" y="18" width="30" height="19" rx="1.5" fill="#ffffff" stroke="#93c5fd" strokeWidth="1" />
      <path d="M16 25 L13 27.5 L16 30 M26 25 L29 27.5 L26 30 M22 23.5 L20 31.5" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

