'use client';

import gsap from 'gsap';

/**
 * Emil Kowalski / Windows 7 Aero Custom Easing Curves
 * - Strong ease-out for entering/interactive UI (responsive instant start)
 * - Smooth ease-in-out for on-screen spatial movement (Aero Snap, card moves)
 */
export const AERO_EASE = {
  out: 'power3.out',
  inOut: 'power2.inOut',
  snappy: 'expo.out',
  elasticSubtle: 'back.out(1.25)',
} as const;

export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/**
 * 1. BOOT SEQUENCE GSAP TIMELINE
 * Animates 4 glowing orbs (Red, Yellow, Green, Blue) swirling along orbital paths
 * with light trails and merging into the 4-quadrant Windows 7 Aero flag.
 */
export interface BootAnimationRefs {
  container: HTMLElement | null;
  orbStage: SVGGElement | null;
  orbRed: SVGGElement | null;
  orbYellow: SVGGElement | null;
  orbGreen: SVGGElement | null;
  orbBlue: SVGGElement | null;
  trailRed: SVGPathElement | null;
  trailYellow: SVGPathElement | null;
  trailGreen: SVGPathElement | null;
  trailBlue: SVGPathElement | null;
  flagGroup: SVGGElement | null;
  flashBloom: SVGCircleElement | null;
  textGroup: HTMLElement | null;
  dots: (HTMLElement | null)[];
}

export function createBootSequenceTimeline(
  refs: BootAnimationRefs,
  onComplete: () => void
): gsap.core.Timeline {
  const tl = gsap.timeline({
    onComplete,
  });

  if (isReducedMotion()) {
    if (refs.flagGroup) gsap.set(refs.flagGroup, { opacity: 1, scale: 1 });
    if (refs.textGroup) gsap.set(refs.textGroup, { opacity: 1 });
    tl.to({}, { duration: 0.6 });
    return tl;
  }

  const orbs = [refs.orbRed, refs.orbYellow, refs.orbGreen, refs.orbBlue].filter(Boolean);
  const trails = [refs.trailRed, refs.trailYellow, refs.trailGreen, refs.trailBlue].filter(Boolean);
  const validDots = refs.dots.filter(Boolean);

  // Initial states: never scale from 0 (Emil principle: start from subtle visible presence)
  gsap.set(orbs, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' });
  gsap.set(trails, { opacity: 0, strokeDasharray: 220, strokeDashoffset: 220 });
  if (refs.flagGroup) {
    gsap.set(refs.flagGroup, { opacity: 0, scale: 0.88, transformOrigin: '50% 50%' });
  }
  if (refs.flashBloom) {
    gsap.set(refs.flashBloom, { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' });
  }
  if (refs.textGroup) {
    gsap.set(refs.textGroup, { opacity: 0, y: 8 });
  }

  // Step 1: Fade in "Starting Windows" text and begin pulsing loading dots
  if (refs.textGroup) {
    tl.to(
      refs.textGroup,
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: AERO_EASE.out,
      },
      0.1
    );
  }

  if (validDots.length > 0) {
    gsap.fromTo(
      validDots,
      { opacity: 0.25, scale: 0.85 },
      {
        opacity: 1,
        scale: 1.15,
        duration: 0.42,
        stagger: 0.12,
        repeat: 5,
        yoyo: true,
        ease: 'sine.inOut',
      }
    );
  }

  // Step 2: Spawn the 4 glowing firefly orbs at outer quadrants and swirl them inward
  if (refs.orbRed) {
    gsap.set(refs.orbRed, { x: -78, y: -56 });
  }
  if (refs.orbYellow) {
    gsap.set(refs.orbYellow, { x: 78, y: -52 });
  }
  if (refs.orbGreen) {
    gsap.set(refs.orbGreen, { x: -72, y: 58 });
  }
  if (refs.orbBlue) {
    gsap.set(refs.orbBlue, { x: 74, y: 56 });
  }

  tl.to(
    orbs,
    {
      opacity: 1,
      scale: 1,
      duration: 0.35,
      stagger: 0.06,
      ease: AERO_EASE.out,
    },
    0.2
  );

  tl.to(
    trails,
    {
      opacity: 0.85,
      strokeDashoffset: 0,
      duration: 0.95,
      stagger: 0.05,
      ease: AERO_EASE.inOut,
    },
    0.25
  );

  if (refs.orbStage) {
    tl.fromTo(
      refs.orbStage,
      { rotation: -155, scale: 1.12, transformOrigin: '120px 110px' },
      {
        rotation: 0,
        scale: 1,
        duration: 1.25,
        ease: 'power2.inOut',
      },
      0.2
    );
  }

  // Converge each orb into its corresponding quadrant of the Windows 7 flag
  if (refs.orbRed) {
    tl.to(refs.orbRed, { x: -16, y: -16, duration: 1.1, ease: 'power2.inOut' }, 0.35);
  }
  if (refs.orbGreen) {
    tl.to(refs.orbGreen, { x: 16, y: -16, duration: 1.1, ease: 'power2.inOut' }, 0.38);
  }
  if (refs.orbBlue) {
    tl.to(refs.orbBlue, { x: -16, y: 16, duration: 1.1, ease: 'power2.inOut' }, 0.41);
  }
  if (refs.orbYellow) {
    tl.to(refs.orbYellow, { x: 16, y: 16, duration: 1.1, ease: 'power2.inOut' }, 0.44);
  }

  // Step 3: Luminous merge flash & reveal of the 4-color Aero Flag
  if (refs.flashBloom) {
    tl.to(
      refs.flashBloom,
      {
        opacity: 0.95,
        scale: 1.35,
        duration: 0.28,
        ease: AERO_EASE.out,
      },
      1.25
    ).to(
      refs.flashBloom,
      {
        opacity: 0.35,
        scale: 1.05,
        duration: 0.55,
        ease: 'sine.out',
      },
      1.53
    );
  }

  if (refs.flagGroup) {
    tl.to(
      refs.flagGroup,
      {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: AERO_EASE.out,
      },
      1.28
    );
  }

  tl.to(
    [...orbs, ...trails],
    {
      opacity: 0,
      scale: 0.75,
      duration: 0.35,
      ease: AERO_EASE.out,
    },
    1.35
  );

  // Step 4: Gentle breathing pulse on the assembled Windows 7 flag, then fade out to Login
  if (refs.flagGroup) {
    tl.to(
      refs.flagGroup,
      {
        scale: 1.04,
        duration: 0.45,
        yoyo: true,
        repeat: 1,
        ease: 'sine.inOut',
      },
      1.65
    );
  }

  if (refs.container) {
    tl.to(
      refs.container,
      {
        opacity: 0,
        filter: 'blur(3px)',
        duration: 0.32,
        ease: AERO_EASE.out,
      },
      2.55
    );
  }

  return tl;
}

/**
 * 2. LOGIN SCREEN GSAP ANIMATIONS
 */
export function animateLoginScreenIn(
  container: HTMLElement | null,
  userTile: HTMLElement | null,
  controls: HTMLElement | null
): gsap.core.Timeline {
  const tl = gsap.timeline();
  if (!container) return tl;

  if (isReducedMotion()) {
    gsap.set([container, userTile, controls].filter(Boolean), { opacity: 1 });
    return tl;
  }

  tl.fromTo(
    container,
    { opacity: 0 },
    { opacity: 1, duration: 0.28, ease: AERO_EASE.out }
  );

  if (userTile) {
    tl.fromTo(
      userTile,
      { opacity: 0, scale: 0.94, y: 10, filter: 'blur(2px)' },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.26,
        ease: AERO_EASE.out,
        clearProps: 'filter',
      },
      0.06
    );
  }

  if (controls) {
    tl.fromTo(
      controls,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.22, ease: AERO_EASE.out },
      0.12
    );
  }

  return tl;
}

export function animateInvalidPasswordShake(target: HTMLElement | null): gsap.core.Timeline {
  const tl = gsap.timeline();
  if (!target || isReducedMotion()) return tl;

  tl.to(target, { x: -10, duration: 0.05, ease: 'power2.out' })
    .to(target, { x: 10, duration: 0.06, ease: 'power2.inOut' })
    .to(target, { x: -8, duration: 0.06, ease: 'power2.inOut' })
    .to(target, { x: 8, duration: 0.06, ease: 'power2.inOut' })
    .to(target, { x: -4, duration: 0.05, ease: 'power2.inOut' })
    .to(target, { x: 0, duration: 0.05, ease: 'power2.out', clearProps: 'transform' });

  return tl;
}

export function animateWelcomeTransition(
  loginBox: HTMLElement | null,
  welcomeBox: HTMLElement | null,
  overlayContainer: HTMLElement | null,
  onComplete: () => void
): gsap.core.Timeline {
  const tl = gsap.timeline({ onComplete });

  if (isReducedMotion()) {
    tl.to({}, { duration: 0.2 });
    return tl;
  }

  if (loginBox) {
    tl.to(loginBox, {
      opacity: 0,
      scale: 0.96,
      filter: 'blur(2px)',
      duration: 0.18,
      ease: AERO_EASE.out,
    });
  }

  if (welcomeBox) {
    tl.fromTo(
      welcomeBox,
      { opacity: 0, scale: 0.96, filter: 'blur(2px)' },
      {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.22,
        ease: AERO_EASE.out,
      },
      0.14
    );
  }

  if (overlayContainer) {
    tl.to(
      overlayContainer,
      {
        opacity: 0,
        scale: 1.015,
        filter: 'blur(3px)',
        duration: 0.28,
        ease: AERO_EASE.out,
      },
      0.72
    );
  }

  return tl;
}

/**
 * 3. WINDOW MANAGER GSAP ANIMATIONS
 * All window transitions stay under 240ms and start from scale >= 0.94 with subtle blur.
 */
export function animateWindowOpen(el: HTMLElement | null): gsap.core.Tween | null {
  if (!el || isReducedMotion()) return null;
  gsap.killTweensOf(el);
  return gsap.fromTo(
    el,
    {
      opacity: 0,
      scale: 0.95,
      y: 8,
      filter: 'blur(2px)',
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.2,
      ease: AERO_EASE.out,
      clearProps: 'transform,filter',
    }
  );
}

export function animateWindowRestore(el: HTMLElement | null): gsap.core.Tween | null {
  if (!el || isReducedMotion()) return null;
  gsap.killTweensOf(el);
  return gsap.fromTo(
    el,
    {
      opacity: 0,
      scale: 0.93,
      y: 18,
      filter: 'blur(2px)',
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.19,
      ease: AERO_EASE.out,
      clearProps: 'transform,filter',
    }
  );
}

export function animateWindowMinimize(
  el: HTMLElement | null,
  onComplete: () => void
): gsap.core.Tween | null {
  if (!el || isReducedMotion()) {
    onComplete();
    return null;
  }
  gsap.killTweensOf(el);
  return gsap.to(el, {
    opacity: 0,
    scale: 0.88,
    y: 26,
    filter: 'blur(2px)',
    duration: 0.16,
    ease: AERO_EASE.out,
    onComplete: () => {
      gsap.set(el, { clearProps: 'transform,filter,opacity' });
      onComplete();
    },
  });
}

export function animateWindowClose(
  el: HTMLElement | null,
  onComplete: () => void
): gsap.core.Tween | null {
  if (!el || isReducedMotion()) {
    onComplete();
    return null;
  }
  gsap.killTweensOf(el);
  return gsap.to(el, {
    opacity: 0,
    scale: 0.95,
    y: 4,
    filter: 'blur(2px)',
    duration: 0.14,
    ease: AERO_EASE.out,
    onComplete: () => {
      gsap.set(el, { clearProps: 'transform,filter,opacity' });
      onComplete();
    },
  });
}

export function animateWindowSnapChange(el: HTMLElement | null): gsap.core.Tween | null {
  if (!el || isReducedMotion()) return null;
  gsap.killTweensOf(el);
  return gsap.fromTo(
    el,
    { scale: 0.985, opacity: 0.92 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.16,
      ease: AERO_EASE.out,
      clearProps: 'transform,opacity',
    }
  );
}

/**
 * 4. SHELL & START MENU GSAP ANIMATIONS
 */
export function animateStartMenuOpen(el: HTMLElement | null): gsap.core.Tween | null {
  if (!el || isReducedMotion()) return null;
  gsap.killTweensOf(el);
  return gsap.fromTo(
    el,
    {
      opacity: 0,
      y: 10,
      scale: 0.97,
      transformOrigin: 'bottom left',
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.16,
      ease: AERO_EASE.out,
      clearProps: 'transform',
    }
  );
}

export function animateFlyoutOpen(
  el: HTMLElement | null,
  origin: string = 'bottom center'
): gsap.core.Tween | null {
  if (!el || isReducedMotion()) return null;
  gsap.killTweensOf(el);
  return gsap.fromTo(
    el,
    {
      opacity: 0,
      y: 6,
      scale: 0.96,
      transformOrigin: origin,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.14,
      ease: AERO_EASE.out,
    }
  );
}

/**
 * 5. GAMES GSAP ANIMATION PRESETS (Minesweeper, Solitaire, Hearts)
 */
export function animateMinesweeperReveal(cells: HTMLElement[]): gsap.core.Tween | null {
  if (!cells.length || isReducedMotion()) return null;
  return gsap.fromTo(
    cells,
    { scale: 0.92, opacity: 0.5 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.15,
      stagger: 0.008,
      ease: AERO_EASE.out,
      clearProps: 'transform,opacity',
    }
  );
}

export function animateBoardShake(boardEl: HTMLElement | null): gsap.core.Timeline {
  const tl = gsap.timeline();
  if (!boardEl || isReducedMotion()) return tl;
  tl.to(boardEl, { x: -6, y: 3, duration: 0.04 })
    .to(boardEl, { x: 6, y: -3, duration: 0.05 })
    .to(boardEl, { x: -5, y: -2, duration: 0.05 })
    .to(boardEl, { x: 4, y: 2, duration: 0.05 })
    .to(boardEl, { x: 0, y: 0, duration: 0.05, clearProps: 'transform' });
  return tl;
}

export function animateCardsDeal(cardEls: HTMLElement[]): gsap.core.Tween | null {
  if (!cardEls.length || isReducedMotion()) return null;
  return gsap.fromTo(
    cardEls,
    { opacity: 0, y: -18, scale: 0.95 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.2,
      stagger: 0.018,
      ease: AERO_EASE.out,
      clearProps: 'transform,opacity',
    }
  );
}

export function animateCardPulse(cardEl: HTMLElement | null): gsap.core.Tween | null {
  if (!cardEl || isReducedMotion()) return null;
  return gsap.fromTo(
    cardEl,
    { scale: 0.94 },
    { scale: 1, duration: 0.16, ease: AERO_EASE.elasticSubtle, clearProps: 'transform' }
  );
}
