# Portfolio Data

## Overview
Structured static data stores holding verified cybersecurity credentials, academic records, professional leadership roles, and featured software engineering projects.

## Interface
- `certificationGroups`: Categorized array of 15 verified credentials across AWS, Microsoft, Google, and freeCodeCamp with direct verification links [src/data/certifications.ts:certificationGroups]
- `education`: Academic background items detailing degrees, institutions, and dates [src/data/education.ts:education]
- `Experience`: TypeScript interface for work history entries [src/data/experience.ts:Experience]
- `experiences`: Chronological career history records with achievements and skill tags [src/data/experience.ts:experiences]
- `Project`: TypeScript interface for project portfolio items [src/data/projects.ts:Project]
- `projects`: Showcase of 6 featured engineering projects including architecture summaries and live/repository links [src/data/projects.ts:projects]

## Invariants
- Credential items provide valid public verification URLs to Credly, Coursera, or freeCodeCamp [src/data/certifications.ts:certifications]

## Side Effects
- None

## Verification
- Run: `npm run lint`
