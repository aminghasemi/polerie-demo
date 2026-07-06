# User Stories — Pixelgenie DTG Dashboard MVP

**Version:** 1.0  
**Status:** Draft  
**Related:** [PRD.md](./PRD.md) | [BUILD_PLAN.md](./BUILD_PLAN.md)

---

## Story format

Each story follows:

> **As a** [persona], **I want** [capability], **so that** [outcome].

Acceptance criteria use **Given / When / Then** where helpful. Story IDs map to epics for sprint planning.

**Priority:** P0 = MVP blocker, P1 = MVP should-have, P2 = post-MVP nice-to-have

---

## Epic 1 — Discovery and data foundations

### US-1.1 — Agree operational definitions

**As an** operations manager,  
**I want** clear written rules for open, completed, aged, and blocked orders,  
**so that** everyone trusts the dashboard numbers.

**Priority:** P0  
**Depends on:** Odoo access

**Acceptance criteria:**
- [ ] Document signed off covering: open, completed, ageing date, blocked identification
- [ ] Odoo state → dashboard stage mapping table published
- [ ] Edge cases documented (cancelled, partial ship, rework)

---

### US-1.2 — Canonical order dataset

**As a** developer,  
**I want** a single canonical dataset derived from Odoo,  
**so that** every chart uses consistent logic.

**Priority:** P0  
**Depends on:** US-1.1

**Acceptance criteria:**
- [ ] Dataset includes all fields in PRD §7.2
- [ ] `is_open`, `is_aged`, `is_blocked`, `age_days`, `dashboard_stage` are computed in one place
- [ ] Sample of 50 orders validated manually against Odoo
- [ ] Dataset refresh runs on agreed schedule (default: hourly)

---

### US-1.3 — Data freshness indicator

**As a** production coordinator,  
**I want** to see when data was last updated,  
**so that** I know if I’m looking at stale information.

**Priority:** P0  
**Depends on:** US-1.2

**Acceptance criteria:**
- [ ] “Data as of {timestamp}” visible on dashboard header
- [ ] Timestamp reflects last successful sync, not page load time

---

## Epic 2 — Headline KPIs

### US-2.1 — View headline KPIs at a glance

**As an** operations manager,  
**I want** seven headline KPI cards on the top row,  
**so that** I get an instant operational pulse without scrolling.

**Priority:** P0  
**Depends on:** US-1.2

**KPIs:** Sales value, Order volume, Open orders, Processed today, Processed this week, Aged orders, Blocked orders

**Acceptance criteria:**
- [ ] All seven KPIs visible above the fold on 1440px desktop
- [ ] Values match canonical dataset queries
- [ ] Processed today/week use calendar definitions from PRD (D7)
- [ ] Open, aged, blocked are point-in-time counts

---

### US-2.2 — KPI response to date filter

**As an** operations manager,  
**I want** sales value and order volume KPIs to respect the date filter,  
**so that** I can compare different periods.

**Priority:** P0  
**Depends on:** US-2.1, US-6.1

**Acceptance criteria:**
- [ ] Changing date range updates Sales value and Order volume
- [ ] Open, aged, blocked KPIs remain point-in-time (not filtered by intake date)
- [ ] Processed today/week remain fixed to current day/week

---

## Epic 3 — Sales demand

### US-3.1 — See new order intake

**As an** operations manager,  
**I want** to see new orders today and this week,  
**so that** I understand incoming demand.

**Priority:** P0  
**Depends on:** US-1.2

**Acceptance criteria:**
- [ ] “New today” and “New this week” visible in sales section or derivable from KPIs
- [ ] Counts based on `intake_date`

---

### US-3.2 — Sales trend chart

**As a** leadership stakeholder,  
**I want** a sales/intake trend over time,  
**so that** I can spot demand patterns.

**Priority:** P0  
**Depends on:** US-6.1

**Acceptance criteria:**
- [ ] Line or bar chart shows daily order count and/or value for selected date range
- [ ] Chart updates when date filter changes
- [ ] Empty range shows “No data” state, not an error

---

### US-3.3 — Order volume by customer

**As a** production coordinator,  
**I want** to see which customers have the most new orders in a period,  
**so that** I can anticipate workload by account.

**Priority:** P0  
**Depends on:** US-6.1

**Acceptance criteria:**
- [ ] Bar chart or sortable table: customer × order count
- [ ] Respects date range filter
- [ ] Customer filter narrows to selected customer(s)

---

## Epic 4 — Production output

### US-4.1 — Daily production trend

**As an** operations manager,  
**I want** a chart of orders completed per day,  
**so that** I can see whether output is keeping pace with intake.

**Priority:** P0  
**Depends on:** US-1.2, US-6.1

**Acceptance criteria:**
- [ ] Chart shows completion count per day for selected date range
- [ ] Based on `completion_date` and `is_completed`
- [ ] Days with zero completions show as zero, not omitted (or documented otherwise)

---

### US-4.2 — Weekly production trend

**As a** leadership stakeholder,  
**I want** a weekly production trend,  
**so that** I can review output in weekly ops meetings.

**Priority:** P1  
**Depends on:** US-4.1

**Acceptance criteria:**
- [ ] Weekly aggregation visible when date range ≥ 14 days
- [ ] Week boundaries match agreed definition (Mon–Sun)

---

## Epic 5 — Current workload

### US-5.1 — Open backlog count

**As a** production coordinator,  
**I want** to see total open orders/jobs,  
**so that** I know the size of the backlog.

**Priority:** P0  
**Depends on:** US-2.1

**Acceptance criteria:**
- [ ] Open count matches KPI and workload section
- [ ] Excludes completed/shipped/cancelled per definition

---

### US-5.2 — Open orders by customer

**As a** customer service rep,  
**I want** open workload broken down by customer,  
**so that** I can answer “how much is outstanding for Customer X?”

**Priority:** P0  
**Depends on:** US-5.1

**Acceptance criteria:**
- [ ] Table or chart: customer × open count
- [ ] Sortable by count descending
- [ ] Customer filter applies

---

### US-5.3 — Production stage breakdown

**As a** production coordinator,  
**I want** to see how many open jobs are in each production stage,  
**so that** I can spot bottlenecks.

**Priority:** P0  
**Depends on:** US-1.1

**Acceptance criteria:**
- [ ] Visual breakdown across five stages + completed (completed may be hidden when viewing open-only)
- [ ] Stages match signed mapping document
- [ ] Counts sum to total open when filtered to open only

---

### US-5.4 — Backlog trend

**As an** operations manager,  
**I want** a backlog trend over time,  
**so that** I can see if work in progress is growing or shrinking.

**Priority:** P1  
**Depends on:** US-5.1

**Acceptance criteria:**
- [ ] Line chart: open order count at end of each day in range (snapshot or reconstructed)
- [ ] Method documented (daily snapshot table vs same-day calculation)

---

## Epic 6 — Exceptions

### US-6.1 — Aged orders visibility

**As a** production coordinator,  
**I want** to see orders older than 5 days that are still open,  
**so that** I can prioritise clearing aged work.

**Priority:** P0  
**Depends on:** US-1.1

**Acceptance criteria:**
- [ ] Aged count in KPI matches exception logic (`age_days > 5` AND open)
- [ ] % critically aged displayed in exceptions section
- [ ] “Aged only” filter works globally

---

### US-6.2 — Blocked orders visibility

**As an** operations manager,  
**I want** to see blocked orders grouped by reason,  
**so that** I can address systemic blockers.

**Priority:** P0  
**Depends on:** US-1.1

**Acceptance criteria:**
- [ ] Blocked count in KPI matches dataset
- [ ] Breakdown by `blocker_reason` when > 1 reason exists
- [ ] “Blocked only” filter works globally

---

### US-6.3 — Exception detail table

**As a** customer service rep,  
**I want** a table of aged and blocked orders with reference, customer, stage, age, and blocker,  
**so that** I can act on specific jobs.

**Priority:** P0  
**Depends on:** US-6.1, US-6.2

**Acceptance criteria:**
- [ ] Columns: order ref, customer, stage/status, age (days), blocker reason
- [ ] Default sort: age descending
- [ ] Pagination or scroll for large lists
- [ ] Row visible for aged-only, blocked-only, or both per filters

---

### US-6.4 — Link to Odoo order (optional)

**As a** production coordinator,  
**I want** to click an order reference to open it in Odoo,  
**so that** I can update status without searching.

**Priority:** P2  
**Depends on:** US-6.3

**Acceptance criteria:**
- [ ] Order ref is a hyperlink to Odoo record URL
- [ ] Link opens in new tab

---

## Epic 7 — Filtering

### US-7.1 — Date range filter

**As an** operations manager,  
**I want** to filter metrics by date range,  
**so that** I can focus on a specific period.

**Priority:** P0

**Acceptance criteria:**
- [ ] Presets: Today, This week, Last 7 days, Last 30 days, Custom
- [ ] Default: Last 30 days
- [ ] Trends and customer intake metrics update accordingly

---

### US-7.2 — Customer filter

**As a** customer service rep,  
**I want** to filter the dashboard by customer,  
**so that** I see only relevant orders.

**Priority:** P0

**Acceptance criteria:**
- [ ] Searchable dropdown of customers from dataset
- [ ] Multi-select supported
- [ ] “All customers” default

---

### US-7.3 — Stage filter

**As a** production coordinator,  
**I want** to filter by production stage,  
**so that** I can focus on e.g. everything stuck in Printing.

**Priority:** P0

**Acceptance criteria:**
- [ ] Multi-select for five dashboard stages
- [ ] Default: all open stages (excludes completed unless explicitly selected)

---

### US-7.4 — Blocked and aged toggles

**As an** operations manager,  
**I want** quick filters for blocked and aged orders,  
**so that** I can triage exceptions fast.

**Priority:** P0

**Acceptance criteria:**
- [ ] Blocked: All / Blocked only / Not blocked
- [ ] Aged: All / Aged only / Not aged
- [ ] Filters combine with AND logic

---

### US-7.5 — Clear filters

**As any** user,  
**I want** to reset all filters with one action,  
**so that** I can return to the default view quickly.

**Priority:** P1

**Acceptance criteria:**
- [ ] “Clear filters” resets to PRD defaults
- [ ] All charts and table refresh

---

## Epic 8 — Access and launch

### US-8.1 — Secure internal access

**As an** IT owner,  
**I want** the dashboard restricted to Pixelgenie staff,  
**so that** operational data is not public.

**Priority:** P0

**Acceptance criteria:**
- [ ] Access requires authentication (SSO, VPN, or BI tool login)
- [ ] No public anonymous URL

---

### US-8.2 — Onboarding walkthrough

**As a** new dashboard user,  
**I want** a short guide to metrics and filters,  
**so that** I use the dashboard correctly on day one.

**Priority:** P1

**Acceptance criteria:**
- [ ] One-page guide or 5-minute walkthrough recording
- [ ] Defines aged, blocked, open, and stage terms
- [ ] Shared with team at launch

---

### US-8.3 — UAT sign-off

**As a** product owner,  
**I want** operations users to sign off after spot-checking data,  
**so that** we launch with confidence.

**Priority:** P0

**Acceptance criteria:**
- [ ] 20-order sample: dashboard matches Odoo ≥ 95%
- [ ] Two ops users complete timed scenario (answer 6 core questions < 5 min total)
- [ ] Sign-off recorded in PRD approval table

---

## Epic 9 — Tooling decision (spike)

### US-9.1 — Evaluate BI vs custom build

**As a** technical lead,  
**I want** to compare Alfy/Analytify, Metabase, and a minimal custom app,  
**so that** we pick the fastest path to a trusted MVP.

**Priority:** P0  
**Sprint:** 0

**Acceptance criteria:**
- [ ] Comparison matrix completed (time, cost, filter UX, maintenance)
- [ ] 2-day spike: one KPI + one chart in top candidate tool
- [ ] Decision recorded in BUILD_PLAN.md with rationale

---

## MVP release checklist (all P0 stories)

| Epic | P0 stories | Status |
|------|------------|--------|
| 1 — Data | US-1.1, US-1.2, US-1.3 | ☐ |
| 2 — KPIs | US-2.1, US-2.2 | ☐ |
| 3 — Sales | US-3.1, US-3.2, US-3.3 | ☐ |
| 4 — Production | US-4.1 | ☐ |
| 5 — Workload | US-5.1, US-5.2, US-5.3 | ☐ |
| 6 — Exceptions | US-6.1, US-6.2, US-6.3 | ☐ |
| 7 — Filters | US-7.1, US-7.2, US-7.3, US-7.4 | ☐ |
| 8 — Launch | US-8.1, US-8.3 | ☐ |
| 9 — Tooling | US-9.1 | ☐ |

**P1 stories for MVP if time permits:** US-4.2, US-5.4, US-7.5, US-8.2

---

## Sample sprint allocation (2-week sprints)

### Sprint 0 — Discovery (1 week)
US-1.1, US-9.1

### Sprint 1 — Data layer
US-1.2, US-1.3

### Sprint 2 — KPIs + filters
US-2.1, US-2.2, US-7.1, US-7.2, US-7.3, US-7.4

### Sprint 3 — Charts
US-3.1, US-3.2, US-3.3, US-4.1, US-5.1, US-5.2, US-5.3

### Sprint 4 — Exceptions + polish
US-6.1, US-6.2, US-6.3, US-8.1, US-8.3

### Sprint 5 (buffer) — P1 + launch
US-4.2, US-5.4, US-7.5, US-8.2
