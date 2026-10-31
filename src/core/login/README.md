# Login Screen

## Overview
Recreation of the Windows 7 Welcome / Logon Screen featuring an authentic vector Aero botanical background, user tile with glossy glass frame, password input with focus glow, submit arrow button, invalid-password shake micro-interaction, Ease of Access menu, and red power flyout.

## Interface
- `LoginScreen`: Main React component managing login authentication flow, user profile editing, and desktop transition [src/core/login/index.tsx:LoginScreen]

## Invariants
- Submitting test error keywords (`wrong`, `invalid`, `error`) triggers a GSAP horizontal shake animation without navigating [src/core/login/index.tsx:handleSignIn]
- Successful submission activates the spinning Aero ring "Welcome" phase before completing transition [src/core/login/index.tsx:animateWelcomeTransition]

## Side Effects
- Mutates user profile information and session phase in `useOS()` [src/core/login/index.tsx:useOS]
- Triggers sound effects via `aeroSound.playClick()` and `aeroSound.playChime()` [src/core/login/index.tsx:aeroSound]

## Verification
- Run: `npm run lint`
