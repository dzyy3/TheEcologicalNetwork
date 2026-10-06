# The Ecological Network

Interactive national registry mapping ecological and environmental organizations across the United States — where they work, what they address, how they connect, and where additional ecological support may be needed.

## Live site

**https://dzyy3.github.io/TheEcologicalNetwork/**

(Also linked from the GitHub repository homepage / About section.)

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS
- MapLibre GL JS (interactive maps)
- D3.js (network graph)
- PostgreSQL schema ready for Supabase (`supabase/schema.sql`)
- Deployed as a static site on GitHub Pages

## Pages

| Route | Purpose |
|-------|---------|
| `/` | National map, filters, list view, organization panels |
| `/network` | Node–edge ecological partnership network |
| `/need` | Ecological need layers + Ecological Support Gaps |
| `/add` | Organization submission (Pending Review) |

## Data principles

- Demo organizations and environmental intensities are **clearly labeled fictional placeholders**
- No fabricated real-world impact statistics or URLs
- Verification statuses: `REGISTERED`, `VERIFIED`, `IMPACT_DOCUMENTED`, `NETWORK_PARTNER` (+ `PENDING_REVIEW` for submissions)
- Environmental datasets are stored separately from organization records
- Gap scores are analytical indicators, not objective funding recommendations

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

Apply `supabase/schema.sql` in Supabase or any PostgreSQL 14+ instance. The app currently reads from `src/data/*` via `src/lib/data.ts` so the UI can be demonstrated without credentials. Swap that module to query Supabase when ready.
