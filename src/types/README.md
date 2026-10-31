# Shared Types

## Overview
Shared TypeScript domain interfaces modeling navigation menu structures, academic education items, and verified professional certification groupings.

## Interface
- `NavItem`: Navigation descriptor specifying label, route anchor, and optional icon [src/types/index.ts:NavItem]
- `EducationItem`: Academic qualification record specifying degree, institution, and dates [src/types/index.ts:EducationItem]
- `CertificationGroup`: Certification category grouping containing title, icon, and certification lists [src/types/index.ts:CertificationGroup]
- `Certification`: Credential schema detailing name, issuer, issue date, skills covered, and verification URL [src/types/index.ts:Certification]

## Invariants
- None

## Side Effects
- None

## Verification
- Run: `npx tsc --noEmit`
