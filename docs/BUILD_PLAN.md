# Build Plan — Pixelgenie DTG Dashboard MVP

**Version:** 1.0  
**Status:** Draft  
**Related:** [PRD.md](./PRD.md) | [USER_STORIES.md](./USER_STORIES.md)  
**Target duration:** 4–6 weeks from definitions sign-off

---

## 1. Overview

This plan delivers Phase 1 of the Pixelgenie DTG Dashboard: a read-only operational view of sales demand, production output, backlog, and exceptions—primarily sourced from **Odoo**.

**Guiding principles:**
1. One canonical dataset; one dashboard
2. Agree definitions before writing metric logic
3. Prefer the fastest reliable delivery path (BI tool first, custom app if needed)
4. Ship something the team uses daily, then iterate

---

## 2. Recommended architecture

### Phase 1 target architecture

```
┌─────────────┐     sync (hourly)      ┌──────────────────┐
│    Odoo     │ ─────────────────────► │  Staging DB /     │
│  (source)   │   API or SQL export    │  canonical view   │
└─────────────┘                        │  dtg_dashboard_   │
                                       │  orders           │
                                       └────────┬─────────┘
                                                │
                                                ▼
                                       ┌──────────────────┐
                                       │  Dashboard UI     │
                                       │  (Metabase / App) │
                                       └──────────────────┘
```

### Component decisions (to confirm in Week 0)

| Component | Option A (fast) | Option B (custom) |
|-----------|-----------------|-------------------|
| **Ingestion** | Odoo JSON-RPC → Python script → PostgreSQL | Same |
| **Canonical layer** | PostgreSQL view + dbt/SQL migrations | TypeScript data layer in API |
| **Dashboard** | Metabase | Next.js + Recharts + TanStack Query |
| **Auth** | Metabase SSO / Google OAuth | NextAuth + Google Workspace |
| **Hosting** | Existing VM / Railway / Render | Vercel + managed Postgres |

**Default recommendation:** Option A unless the 2-day BI spike fails filter/layout requirements.

---

## 3. Phases and milestones

### Phase 0 — Discovery and tooling decision (Week 1)

**Goal:** Remove ambiguity; pick build path.

| Task | Owner | Deliverable | Days |
|------|-------|-------------|------|
| Odoo field audit | Odoo admin + Eng | Field mapping spreadsheet | 2 |
| Definitions workshop | Ops + Product | Signed PRD §7.3 decisions D1–D8 | 1 |
| Stage mapping workshop | Ops + floor lead | `odoo_stage_mapping.csv` | 1 |
| BI tool spike | Eng | Metabase/Analytify demo with 2 widgets | 2 |
| Architecture decision | Eng + Product | ADR: BI vs custom | 0.5 |

**Milestone M0:** ✅ Definitions signed + tool chosen

**Exit criteria:**
- [ ] No open blockers on open/completed/aged/blocked logic
- [ ] Odoo read access provisioned
- [ ] Tooling ADR approved

---

### Phase 1 — Data layer (Weeks 2–3)

**Goal:** Reliable canonical dataset on a schedule.

| Task | Owner | Deliverable | Days |
|------|-------|-------------|------|
| Scaffold repo / infra | Eng | Git repo, env template, CI lint | 1 |
| Odoo extraction script | Eng | `sync/odoo_extract.py` or equivalent | 3 |
| Staging schema | Eng | `dtg_dashboard_orders` table + migrations | 1 |
| Transform logic | Eng | Stage map, age, flags in SQL or code | 2 |
| Scheduled job | Eng | Cron/GitHub Action/hourly worker | 1 |
| Data validation | Ops + Eng | 50-order reconciliation report | 2 |

**Milestone M1:** ✅ Dataset refreshing hourly with <5% discrepancy vs Odoo

**Technical tasks detail:**

1. **Extraction** — Pull from Odoo `sale.order` (and related manufacturing/delivery models as needed). Minimum fields per PRD §7.2.
2. **Idempotent sync** — Upsert by `order_id`; soft-delete or flag cancelled orders.
3. **Age calculation** — `age_days = CURRENT_DATE - intake_date` for open orders only.
4. **Logging** — Sync success/failure, row count, duration; alert on failure (email/Slack optional P2).

**Exit criteria:**
- [ ] Hourly sync running in staging/prod environment
- [ ] `last_updated_at` exposed to dashboard
- [ ] Reconciliation report signed by ops

---

### Phase 2 — Dashboard build (Weeks 3–5)

**Goal:** Full MVP layout per PRD §6.7.

#### Track A — Metabase (if chosen)

| Task | Days |
|------|------|
| Connect Metabase to staging DB | 0.5 |
| Create saved questions for each KPI | 1 |
| Build dashboard layout (7 KPIs + 6 charts/table) | 2 |
| Configure filter widgets (date, customer, stage, booleans) | 2 |
| Styling and descriptions | 0.5 |
| Permissions / collection access | 0.5 |

#### Track B — Custom app (if chosen)

| Task | Days |
|------|------|
| Next.js scaffold + API routes | 1 |
| KPI endpoint + cards component | 1 |
| Trend charts (sales, production, backlog) | 2 |
| Workload charts (customer, stage) | 1 |
| Exception table with sort/pagination | 2 |
| Filter bar + query param state | 1 |
| Auth middleware | 1 |
| Deploy to staging | 0.5 |

**Milestone M2:** ✅ Feature-complete dashboard in staging

**Exit criteria:**
- [ ] All P0 user stories implemented
- [ ] Layout matches PRD wireframe
- [ ] Filters work in combination (AND logic)

---

### Phase 3 — UAT and launch (Week 5–6)

**Goal:** Team trust and daily adoption.

| Task | Owner | Days |
|------|-------|------|
| UAT script (6 core questions) | Product | 0.5 |
| 20-order Odoo spot-check | Ops | 1 |
| Fix data/logic bugs | Eng | 2 |
| User guide / walkthrough | Product | 0.5 |
| Production deploy | Eng | 0.5 |
| Launch comms to team | Product | 0.5 |
| 2-week check-in | Product + Ops | — |

**Milestone M3:** ✅ Production launch + ops sign-off (US-8.3)

**Exit criteria:**
- [ ] SC-1 through SC-5 from PRD met
- [ ] Dashboard URL shared with DTG team
- [ ] Phase 2 backlog doc started (optional)

---

## 4. Work breakdown structure

```
pixelgenie/
├── docs/
│   ├── PRD.md
│   ├── USER_STORIES.md
│   ├── BUILD_PLAN.md
│   ├── definitions.md          # Phase 0 output
│   └── odoo_field_mapping.md   # Phase 0 output
├── sync/
│   ├── odoo_client.py
│   ├── extract_orders.py
│   ├── transform.py
│   └── run_sync.py
├── db/
│   └── migrations/
│       └── 001_dtg_dashboard_orders.sql
├── dashboard/                  # If custom app track
│   ├── app/
│   ├── components/
│   └── lib/queries/
└── scripts/
    └── validate_sample.py
```

---

## 5. Resource plan

| Role | Allocation | Responsibilities |
|------|------------|------------------|
| **Product (Edward)** | 0.25 FTE | Definitions, UAT, launch |
| **Operations** | 0.25 FTE Weeks 0–1, 5 | Workshops, validation |
| **Odoo admin** | 0.25 FTE Week 0–1 | Field access, mapping |
| **Engineer** | 0.5–1 FTE Weeks 1–5 | Sync, dashboard, deploy |
| **Designer** | Optional | Layout polish if custom app |

**Minimum team:** 1 engineer + ops stakeholder + Odoo admin access.

---

## 6. Tool evaluation matrix (Week 0)

Score 1–5 (5 = best). Fill during US-9.1 spike.

| Criterion | Metabase | Analytify | Custom Next.js | Odoo-only |
|-----------|----------|-----------|----------------|-----------|
| Time to MVP | | | | |
| Filter UX | | | | |
| Layout flexibility | | | | |
| Odoo connectivity | | | | |
| Ongoing maintenance | | | | |
| Cost | | | | |
| Team can self-serve edits | | | | |
| **Weighted total** | | | | |

**Decision rule:** Highest weighted score wins unless a P0 requirement cannot be met.

---

## 7. Odoo integration approach

### Preferred order of attempt

1. **Odoo external API (JSON-RPC)** — Read-only service account; no direct DB access required.
2. **Odoo SQL view / report export** — If API is slow or incomplete.
3. **Direct PostgreSQL read replica** — Only if already available and approved by IT.

### Spike questions for Odoo admin

- Which model represents a DTG “job”? (`sale.order`, `mrp.production`, custom `x_dtg_job`?)
- Where is blocker reason stored?
- Which datetime field = order confirmation (intake)?
- Which datetime/state = completion?
- List of all production-related states in use today

---

## 8. Testing strategy

| Layer | Approach |
|-------|----------|
| **Data** | 50-order reconciliation; unit tests for age/stage/blocked derivations |
| **Metrics** | SQL snapshot tests: fixed fixture → expected KPI values |
| **UI** | Manual UAT script; optional Playwright smoke for custom app |
| **Regression** | Re-run reconciliation after Odoo workflow changes |

### UAT script (6 core questions)

1. How much work came in last 7 days? → Check sales trend + volume KPI
2. How much completed this week? → Processed this week KPI + production chart
3. What is open right now? → Open KPI + stage breakdown
4. Which customer has most open work? → Open by customer chart
5. How many aged? → Aged KPI + filter aged only
6. What is blocked and why? → Blocked KPI + exception table

**Pass:** Ops user completes in < 5 minutes without assistance.

---

## 9. Deployment and operations

| Item | Recommendation |
|------|----------------|
| **Environments** | `staging` (dev Odoo or snapshot), `production` |
| **Secrets** | Odoo API keys in env vars / secret manager |
| **Sync schedule** | Hourly 08:00–18:00 UK; optional nightly full refresh |
| **Monitoring** | Sync job success log; alert on 2 consecutive failures |
| **Backup** | Staging DB daily snapshot (if self-hosted) |

---

## 10. Risks, dependencies, and buffers

| Item | Plan |
|------|------|
| Odoo customisation needed for blocker field | Budget 2 days in Phase 1 |
| BI tool layout insufficient | Switch to Track B; +1.5 weeks |
| Definition disagreements | Escalate to Edward; block Phase 1 dev |
| **Schedule buffer** | Sprint 5 (1 week) for P1 stories and fixes |

---

## 11. Phase 2 preview (not in scope — for planning only)

Once Phase 1 is trusted (4+ weeks daily use):

- Odoo deep-links from exception table (US-6.4)
- Daily backlog snapshots for accurate backlog trend
- Slack/email digest for aged/blocked counts (not full alerting platform)
- Mobile-responsive layout
- Printer/station breakdown
- Export to CSV

Capture requests in a `PHASE_2_BACKLOG.md` after launch.

---

## 12. Immediate next actions

| # | Action | Owner | Due |
|---|--------|-------|-----|
| 1 | Schedule 60-min definitions workshop | Edward | Week 0 Day 1 |
| 2 | Provision Odoo read-only API credentials | Odoo admin | Week 0 Day 2 |
| 3 | Complete Odoo field audit template | Eng + Odoo admin | Week 0 Day 3 |
| 4 | Run Metabase 2-day spike | Eng | Week 0 Day 4–5 |
| 5 | Sign PRD §7.3 definition table | Ops + Product | Week 0 Day 5 |
| 6 | Initialize `pixelgenie` repo (sync + db) | Eng | Week 1 Day 1 |

---

## 13. Definition of done (project)

Phase 1 is **done** when:

- [ ] Dashboard live and linked in team comms
- [ ] All P0 user stories checked off
- [ ] PRD success criteria SC-1–SC-5 met
- [ ] Ops sign-off on data accuracy
- [ ] Runbook for sync job and common failures documented
- [ ] Phase 2 backlog triaged (optional)
