# Pixelgenie DTG Dashboard

Lightweight operational dashboard for Pixelgenie DTG: sales demand, production output, backlog, and exceptions (aged/blocked orders).

**Phase 1 MVP** — sourced primarily from Odoo.

## Documentation

| Document | Description |
|----------|-------------|
| [docs/PRD.md](./docs/PRD.md) | Product requirements document (DTG Dashboard) |
| [docs/USER_STORIES.md](./docs/USER_STORIES.md) | Epics, user stories, and acceptance criteria (DTG) |
| [docs/CRM_PRD.md](./docs/CRM_PRD.md) | Product requirements document (CRM) |
| [docs/CRM_USER_STORIES.md](./docs/CRM_USER_STORIES.md) | Epics, user stories, and acceptance criteria (CRM) |
| [docs/BUILD_PLAN.md](./docs/BUILD_PLAN.md) | Implementation plan, phases, and milestones |
| [docs/definitions.md](./docs/definitions.md) | Workshop template for operational definitions (complete before build) |

## Demo dashboard

**Live demo:** https://aminghasemi.github.io/polerie-demo/

Deployed automatically from `main` via GitHub Actions (Settings → Pages → Source: GitHub Actions).

```bash
cd dashboard
npm install
npm run dev
```

To preview the production build locally (with the same base path as GitHub Pages):

```bash
cd dashboard
GITHUB_PAGES=true npm run build
npx vite preview --base /polerie-demo/
```

**Pages:**
- `/` — Home (choose DTG or Production & Job Tracker)
- `/crm` — CRM (customer accounts, pipeline, job activity)
- `/dtg-dashboard` — DTG Dashboard (operations overview, trends, exceptions)
- `/production-dashboard` — Screen Print Production (job intake + live dashboard from spreadsheet)
- `/job-intake` — Submit new job form (connected to Job Tracker & production KPIs)
- `/job-tracker` — Job Sheet Tracker table (374 jobs)

Job Tracker data is imported from `src/data/jobTracker.generated.json` (exported from the Google Sheet).

## Status

**Planning phase** — PRD complete; demo frontend available for stakeholder review.

## Next steps

1. Complete [definitions workshop](./docs/definitions.md) with operations and Odoo admin
2. Run BI tool spike (Metabase / Analytify) per [BUILD_PLAN.md](./docs/BUILD_PLAN.md)
3. Build canonical Odoo sync and dashboard

## Scope (Phase 1)

- Sales demand, production output, current workload, exceptions
- Filters: date, customer, stage, aged, blocked
- Out of scope: operator KPIs, printer telemetry, margins, forecasting, alerts

See [PRD.md](./docs/PRD.md) for full detail.
