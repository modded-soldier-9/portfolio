# Application Shell & Routing

## Overview
Next.js App Router root layout, global stylesheet, viewport and metadata definitions, search engine indexing manifests (`robots.ts`, `sitemap.ts`), and the primary route entry point hosting the Windows 7 desktop experience.

## Interface
- `viewport`: Next.js Viewport configuration defining the light color scheme and theme color `#1e81d6` [src/app/layout.tsx:viewport]
- `metadata`: Next.js Metadata object specifying title templates, OpenGraph tags, Twitter cards, and author information [src/app/layout.tsx:metadata]
- `RootLayout`: Root layout React component rendering document structure, JSON-LD structured data, and Vercel Analytics [src/app/layout.tsx:RootLayout]
- `Home`: Default page component mounting the `<AeroDesktop />` client environment [src/app/page.tsx:Home]
- `robots()`: Route generator returning indexing permissions and sitemap URLs for web crawlers [src/app/robots.ts:robots]
- `sitemap()`: Route generator producing XML sitemap listings with change frequencies and priorities [src/app/sitemap.ts:sitemap]

## Invariants
- Canonical base URL is strictly pinned to `https://mohamedelsheikh.dev` across all metadata and sitemap outputs [src/app/layout.tsx:metadataBase]
- The root `html` tag applies `suppressHydrationWarning` to prevent mismatch warnings caused by dynamic client CSS variables [src/app/layout.tsx:RootLayout]

## Side Effects
- Mounts Vercel Web Analytics tracking beacons via `<Analytics />` [src/app/layout.tsx:Analytics]

## Verification
- Run: `npm run build`
