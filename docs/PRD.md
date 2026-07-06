# Product Requirements Document (PRD)

## Pixelgenie DTG Dashboard — Phase 1 MVP

| Field | Value |
|-------|-------|
| **Document title** | Pixelgenie DTG Dashboard MVP |
| **Version** | 1.0 |
| **Status** | Draft — pending stakeholder approval |
| **Creator** | Edward Lewell |
| **Date created** | 30 June 2026 |
| **Date approved** | _TBD_ |
| **Owner** | Pixelgenie Operations / Product |
| **Primary users** | DTG production team, operations managers, customer service |

---

## 1. Executive summary

Pixelgenie needs a lightweight operational dashboard that gives the DTG team a clearer, faster view of **sales demand**, **production output**, **current backlog**, and **exceptions** (aged and blocked work). The existing Odoo dashboard does not surface this information in a way the team can act on quickly.

Phase 1 delivers **one simple dashboard** fed from **one primary data source** (Odoo). The goal is usefulness and speed—not a large custom reporting platform.

**Success looks like:** A team member opens the dashboard in under 30 seconds and can answer all six core operational questions without exporting spreadsheets or clicking through multiple Odoo screens.

---

## 2. Problem statement

### 2.1 Current pain

- Demand, production, and backlog are not visible in one place.
- It is hard to see which customers carry the most open workload.
- Aged and blocked orders are discovered reactively rather than proactively.
- Odoo’s native reporting requires too many clicks and does not match DTG production stages.

### 2.2 Opportunity

A focused dashboard reduces time spent hunting for status, improves prioritisation on the production floor, and gives leadership a daily pulse on operational health—without building a full data warehouse or multi-system integration.

---

## 3. Goals and non-goals

### 3.1 Goals (Phase 1)

| # | Goal |
|---|------|
| G1 | Surface sales demand: volume, value, intake trends, customer breakdown |
| G2 | Surface production output: daily/weekly completions and trends |
| G3 | Show current workload: open jobs, stage breakdown, customer workload |
| G4 | Highlight exceptions: aged (>5 days) and blocked orders with reasons |
| G5 | Provide simple filters: date, customer, stage, aged, blocked |
| G6 | Ship fast with minimal engineering overhead |

### 3.2 Non-goals (Phase 1 — explicitly out of scope)

- Operator-level KPIs
- Printer / machine performance and telemetry
- Margin and profitability reporting
- Forecasting and capacity planning
- AI recommendations or automated alerts
- Advanced SLA logic
- Complex multi-system reconciliation (ERP + WMS + shipping carriers, etc.)

These may be revisited once Phase 1 is trusted and in daily use.

---

## 4. Users and personas

| Persona | Role | Primary needs |
|---------|------|---------------|
| **Operations Manager** | Oversees DTG floor and backlog | Headline KPIs, backlog trend, aged/blocked exceptions |
| **Production Coordinator** | Schedules and tracks jobs through stages | Stage breakdown, open workload by customer, blocked list |
| **Customer Service** | Answers customer status queries | Open orders by customer, age, blocker reason |
| **Leadership** | Weekly operational review | Sales trend, production trend, exception counts |

All personas are **internal Pixelgenie staff**. No customer-facing access in Phase 1.

---

## 5. Core questions the dashboard must answer

The dashboard exists to answer these six questions at a glance:

1. **How much work is coming in?** (sales demand)
2. **How much work is being completed?** (production output)
3. **What is currently open?** (backlog / workload)
4. **Which customers have the most workload?** (customer concentration)
5. **What is aged?** (orders/jobs older than threshold)
6. **What is blocked?** (orders/jobs with a known blocker)

---

## 6. Functional requirements

### 6.1 Headline KPIs (top row)

Fixed KPI cards, always visible above filters (or updated by global date filter where noted).

| KPI | Definition (draft — confirm with Odoo) | Filter behaviour |
|-----|----------------------------------------|------------------|
| **Sales value** | Sum of order value for orders in selected date range (intake date) | Respects date range |
| **Order volume** | Count of orders/jobs created in selected date range | Respects date range |
| **Open orders/jobs** | Count where status ≠ completed/shipped | Point-in-time; ignores date range unless “as of” mode added later |
| **Processed today** | Count completed today (completion date = today) | Fixed to today |
| **Processed this week** | Count completed Mon–Sun (or ISO week — confirm) | Fixed to current week |
| **Aged orders/jobs** | Open orders where age > 5 days | Point-in-time |
| **Blocked orders/jobs** | Open orders with blocker flag/reason populated | Point-in-time |

**FR-1:** All seven KPIs render on page load within 3 seconds (target; depends on data refresh strategy).

**FR-2:** KPI values show the numeric count/value and a short label. No drill-down required on KPI click for MVP (nice-to-have).

---

### 6.2 Sales demand

| Metric | Requirement ID | Description |
|--------|----------------|-------------|
| Total order volume | FR-SD-1 | Count of orders in date range |
| Total sales value | FR-SD-2 | Sum of sales value in date range |
| New orders today | FR-SD-3 | Count where intake date = today |
| New orders this week | FR-SD-4 | Count where intake date in current week |
| Order volume by customer | FR-SD-5 | Bar or table: customer × order count (top N or all, sortable) |
| Sales trend over time | FR-SD-6 | Line chart: daily or weekly order count and/or value over selected range |

---

### 6.3 Production output

| Metric | Requirement ID | Description |
|--------|----------------|-------------|
| Processed today | FR-PO-1 | Same as headline KPI |
| Processed this week | FR-PO-2 | Same as headline KPI |
| Daily production trend | FR-PO-3 | Line/bar: completions per day in date range |
| Weekly production trend | FR-PO-4 | Line/bar: completions per week (when range ≥ 2 weeks) |

---

### 6.4 Current workload

| Metric | Requirement ID | Description |
|--------|----------------|-------------|
| Open orders/jobs | FR-WL-1 | Total open count |
| Open by customer | FR-WL-2 | Table or bar chart: customer × open count |
| Stage breakdown | FR-WL-3 | Stacked bar or donut: count per production stage |

**Stage mapping (suggested — confirm against Odoo):**

| Dashboard stage | Description |
|-----------------|-------------|
| Awaiting Pick | Order confirmed; stock not yet picked |
| Printing | On press / in print queue |
| Sorting / Packing | Post-print fulfilment |
| Ready for Shipping | Packed; awaiting carrier collection |
| Shipped / Completed | Closed — excluded from “open” counts |

**FR-WL-4:** Stage mapping must be documented in a single reference table (Odoo state → dashboard stage) and version-controlled.

---

### 6.5 Exceptions

| Metric | Requirement ID | Description |
|--------|----------------|-------------|
| Orders older than 5 days | FR-EX-1 | Open orders where `age_days > 5` |
| % critically aged | FR-EX-2 | `aged_open / total_open × 100` |
| Blocked orders/jobs | FR-EX-3 | Open orders with blocker |
| Blocked by reason | FR-EX-4 | Grouped count or small bar chart by blocker reason |

**Exception table (FR-EX-5):**

| Column | Required | Notes |
|--------|----------|-------|
| Order/job reference | Yes | Link to Odoo record (optional MVP+) |
| Customer | Yes | |
| Current stage/status | Yes | Dashboard stage + raw Odoo status |
| Age (days) | Yes | Integer; sortable descending default |
| Blocker reason | If available | Blank if not blocked |

**FR-EX-6:** Table supports sort by age (default desc), customer, stage.

**FR-EX-7:** Table is paginated or virtualised if > 100 rows.

---

### 6.6 Filters (global)

All charts and tables (except fixed “today/this week” KPIs where specified) respect active filters.

| Filter | Requirement ID | Type | Default |
|--------|----------------|------|---------|
| Date range | FR-FL-1 | Presets: Today, This week, Last 7 days, Last 30 days, Custom | Last 30 days |
| Customer | FR-FL-2 | Single or multi-select dropdown | All |
| Status / stage | FR-FL-3 | Multi-select from 5 stages + Completed | All open stages |
| Blocked | FR-FL-4 | All / Blocked only / Not blocked | All |
| Aged | FR-FL-5 | All / Aged only (>5d) / Not aged | All |

**FR-FL-6:** Clear all filters control resets to defaults.

**FR-FL-7:** Active filter state is visible (chips or summary bar).

---

### 6.7 Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADLINE KPIs (7 cards)                                        │
├─────────────────────────────────────────────────────────────────┤
│  FILTERS: Date | Customer | Stage | Blocked | Aged | [Clear]     │
├──────────────────────────────┬──────────────────────────────────┤
│  Sales / intake trend        │  Production trend                │
├──────────────────────────────┼──────────────────────────────────┤
│  Backlog trend               │  Open orders by customer         │
├──────────────────────────────┼──────────────────────────────────┤
│  Stage breakdown             │  Aged / blocked exception table  │
└──────────────────────────────┴──────────────────────────────────┘
```

**FR-UI-1:** Layout is readable on a 1440px desktop browser (primary target).

**FR-UI-2:** Mobile layout is nice-to-have for Phase 1; desktop-first is acceptable.

**FR-UI-3:** Dashboard title: “Pixelgenie DTG Dashboard” with last data refresh timestamp.

---

## 7. Data requirements

### 7.1 Primary data source

**Phase 1:** Odoo (single source of truth for orders/jobs).

No secondary system joins in Phase 1 unless a field is unavailable in Odoo and agreed as a manual enrichment (discouraged).

### 7.2 Canonical dataset

Build **one canonical view or table** (`dtg_dashboard_orders`) that powers all metrics. Suggested fields:

| Field | Type | Purpose |
|-------|------|---------|
| `order_id` | string | Odoo internal ID |
| `order_ref` | string | Display reference |
| `customer_id` | string | |
| `customer_name` | string | Filter + grouping |
| `sales_value` | decimal | KPIs, trends |
| `intake_date` | date | Sales demand, ageing start (TBC) |
| `completion_date` | date nullable | Production output |
| `current_odoo_state` | string | Raw status |
| `dashboard_stage` | enum | Mapped stage |
| `is_open` | boolean | Derived |
| `is_completed` | boolean | Derived |
| `age_days` | integer | Derived from agreed ageing date |
| `is_aged` | boolean | `is_open AND age_days > 5` |
| `is_blocked` | boolean | Derived |
| `blocker_reason` | string nullable | |
| `last_updated_at` | timestamp | Sync metadata |

### 7.3 Definitions to confirm before build (blocking)

| # | Question | Proposed default | Decision owner | Status |
|---|----------|------------------|----------------|--------|
| D1 | What counts as an **open** order/job? | Odoo state not in {Shipped, Completed, Cancelled} | Ops + Odoo admin | ☐ |
| D2 | What counts as **processed/completed**? | `completion_date` set OR state = Shipped/Completed | Ops + Odoo admin | ☐ |
| D3 | Which **date** drives ageing? | `intake_date` (order confirmation) | Ops | ☐ |
| D4 | **Stage mapping** Odoo → dashboard | See §6.4 table | Ops + Odoo admin | ☐ |
| D5 | How are **blocked** orders identified? | Custom field `x_blocker_reason` OR tagged state | Odoo admin | ☐ |
| D6 | **Sales value** field in Odoo | `amount_total` on sale order | Finance/Odoo admin | ☐ |
| D7 | **Week** definition | ISO week Mon–Sun, Europe/London TZ | Ops | ☐ |
| D8 | **Refresh frequency** | Hourly during business hours | Engineering + Ops | ☐ |

**No development on metric logic should start until D1–D5 are signed off.**

### 7.4 Data freshness

| Tier | Target | Acceptable for MVP |
|------|--------|---------------------|
| KPIs and trends | ≤ 1 hour stale | Yes |
| Exception table | ≤ 1 hour stale | Yes |
| Real-time | Not required | Phase 2 |

Display **“Data as of: {timestamp}”** on every view.

---

## 8. Tooling options (Alfy or equivalent)

The scope document references **“Alfy or equivalent.”** This likely means **Analytify** (GenBI) or any lightweight BI layer. Evaluate against three paths:

### Option A — BI tool on Odoo dataset (recommended for speed)

**Candidates:** Metabase (open source), Analytify, Grafana, Looker Studio (if export to Sheets/BQ), Power BI.

| Criterion | Weight | Notes |
|-----------|--------|-------|
| Time to first dashboard | High | Metabase + PostgreSQL read replica or scheduled sync wins |
| Odoo connectivity | High | SQL view, CSV sync, or Odoo API → staging DB |
| Filter UX | Medium | Must support date, customer, stage, boolean flags |
| Cost | Medium | Prefer open source or existing licences |
| Maintenance | High | Low-code preferred for Phase 1 |

**Pros:** Fastest MVP, ops can tweak charts, less custom code.  
**Cons:** Less control over UX; Odoo deep-links may be harder.

### Option B — Lightweight custom app (this repo)

**Stack suggestion:** Next.js or React frontend + thin API + PostgreSQL staging table synced from Odoo.

**Pros:** Full UX control, embeddable in Pixelgenie tooling later.  
**Cons:** More engineering; longer time to MVP.

### Option C — Odoo-native dashboard only

Enhance Odoo views/reports without external tool.

**Pros:** Zero new infrastructure.  
**Cons:** Scope doc explicitly wants improvement *over* current Odoo dashboard; likely insufficient UX.

### Recommendation

1. **Week 1–2:** Confirm Odoo definitions; prototype canonical dataset as SQL view or nightly sync.
2. **Week 2:** Spike Metabase (or agreed BI tool) against staging data.
3. **Decision gate:** If BI tool meets FR-UI and filter requirements → ship Option A for Phase 1.
4. If BI tool UX is insufficient → Option B with minimal scope (read-only dashboard, no auth beyond VPN/Google SSO).

---

## 9. Non-functional requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-1 | Performance | Initial load < 5s on office network |
| NFR-2 | Availability | Business hours (08:00–18:00 UK); no 24/7 SLA Phase 1 |
| NFR-3 | Security | Internal-only; SSO or VPN; no PII beyond customer name |
| NFR-4 | Accessibility | WCAG 2.1 AA for custom UI; BI tool defaults otherwise |
| NFR-5 | Auditability | Metric definitions documented; dataset versioned |
| NFR-6 | Browser support | Latest Chrome and Edge |

---

## 10. Success criteria

Phase 1 is successful when:

| # | Criterion | Measurement |
|---|-----------|-------------|
| SC-1 | Team uses dashboard at least daily | Qualitative check-in at 2 weeks post-launch |
| SC-2 | All six core questions answerable in one screen flow | UAT walkthrough with 2 ops users |
| SC-3 | Aged and blocked lists match Odoo spot-checks (≥95%) | 20-order sample audit |
| SC-4 | Time to answer “customer workload” < 1 minute | Timed UAT |
| SC-5 | No critical metric disagreements unresolved after launch week | Ops sign-off |

**Priority:** Speed, simplicity, and usefulness over detailed reporting.

---

## 11. Risks and mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Odoo fields don’t support blocker/age logic | High | Medium | Early Odoo audit; add custom fields if needed |
| Stage mapping ambiguous | High | High | Workshop with floor team; publish mapping doc |
| BI tool can’t meet layout spec | Medium | Medium | Decision gate; fallback to custom app |
| Stale data erodes trust | High | Medium | Show refresh timestamp; hourly sync |
| Scope creep (margins, printers, alerts) | Medium | High | Strict Phase 1 backlog; defer to Phase 2 doc |

---

## 12. Dependencies

- Odoo admin access (read-only API or DB view)
- Operations stakeholder for definitions workshop (D1–D8)
- Edward Lewell / product owner sign-off on scope
- Hosting for BI tool or app (existing infra preferred)

---

## 13. Timeline (high level)

See [BUILD_PLAN.md](./BUILD_PLAN.md) for detailed phases.

| Phase | Duration | Outcome |
|-------|----------|---------|
| 0 — Discovery | 1 week | Signed definitions + Odoo field map |
| 1 — Data layer | 1–2 weeks | Canonical dataset refreshing on schedule |
| 2 — Dashboard build | 1–2 weeks | MVP UI with all FR sections |
| 3 — UAT & launch | 1 week | Team training + go-live |

**Target:** 4–6 weeks from definitions sign-off to production use.

---

## 14. Open questions

1. Odoo version and modules in use (Sales, MRP, Inventory, custom DTG module)?
2. Is “Alfy” specifically **Analytify**, or another internal tool?
3. Existing Metabase/Power BI/Google Workspace licences?
4. Should order reference link back to Odoo?
5. Multi-company or single Pixelgenie entity only?
6. Currency handling (GBP only?)?

---

## 15. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product / Sponsor | Edward Lewell | | |
| Operations | | | |
| Engineering | | | |
| Odoo Admin | | | |

---

## Appendix A — Metric calculation reference (draft)

```
open_count        = COUNT(*) WHERE is_open = true
aged_count        = COUNT(*) WHERE is_open AND age_days > 5
blocked_count     = COUNT(*) WHERE is_open AND is_blocked = true
pct_critically_aged = aged_count / NULLIF(open_count, 0) * 100

processed_today   = COUNT(*) WHERE is_completed AND completion_date = TODAY()
processed_week    = COUNT(*) WHERE is_completed AND completion_date IN current_week

sales_value       = SUM(sales_value) WHERE intake_date IN filter_range
order_volume      = COUNT(*) WHERE intake_date IN filter_range
```

## Appendix B — Related documents

- [USER_STORIES.md](./USER_STORIES.md) — Epics and acceptance criteria
- [CRM_PRD.md](./CRM_PRD.md) — CRM product requirements
- [CRM_USER_STORIES.md](./CRM_USER_STORIES.md) — CRM epics and acceptance criteria
- [BUILD_PLAN.md](./BUILD_PLAN.md) — Implementation plan and milestones
