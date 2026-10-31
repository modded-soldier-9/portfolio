# Configuration

## Overview
Static configuration registry holding site metadata, navigation structure, author profile details, contact information, and external portfolio links.

## Interface
- `navItems`: Navigation descriptor list defining sections, display titles, and route anchors [src/config/navigation.ts:navItems]
- `siteConfig`: Centralized site settings object providing author credentials, bio tagline, canonical domain, social profiles, and direct contact details [src/config/site.ts:siteConfig]

## Invariants
- `siteConfig.url` resolves to the canonical production URL `https://mohamedelsheikh.dev` [src/config/site.ts:siteConfig]

## Side Effects
- None

## Verification
- Run: `npm run lint`
