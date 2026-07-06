# User Stories — Pixelgenie CRM MVP

**Version:** 1.0  
**Status:** Draft  
**Related:** [CRM_PRD.md](./CRM_PRD.md) · [PRD.md](./PRD.md) · [USER_STORIES.md](./USER_STORIES.md) · [BUILD_PLAN.md](./BUILD_PLAN.md)

---

## Story format

Each story follows:

> **As a** [persona], **I want** [capability], **so that** [outcome].

Acceptance criteria use **Given / When / Then** where helpful. Story IDs use the `US-C` prefix for CRM epics.

**Priority:** P0 = MVP blocker, P1 = MVP should-have, P2 = post-MVP nice-to-have

---

## Epic C1 — Discovery and data foundations

### US-C1.1 — Agree CRM account definition

**As a** merchandising lead,  
**I want** a clear rule for what counts as a CRM account,  
**so that** account counts match how the business thinks about customers.

**Priority:** P0  
**Depends on:** Job Tracker field map

**Acceptance criteria:**
- [ ] Account = distinct `customer_client_name` documented and signed off
- [ ] Blank or null customer names excluded from CRM
- [ ] Known alias cases documented (e.g. spelling variants) for Phase 2 cleanup

---

### US-C1.2 — Agree health and pipeline rules

**As an** operations manager,  
**I want** written rules for account health and pipeline value,  
**so that** “at risk” and pipeline £ are trusted.

**Priority:** P0  
**Depends on:** US-C1.1, Job Tracker overdue definition

**Acceptance criteria:**
- [ ] Health rules documented: at risk (overdue jobs), quiet (no open jobs), active (otherwise)
- [ ] Open job rule documented (stage excludes dispatched/completed)
- [ ] Pipeline formula documented: `quantity × sell price` on open jobs only
- [ ] Sell price field priority agreed (PRD D-C3)

---

### US-C1.3 — Single job data source for CRM

**As a** developer,  
**I want** CRM to read from the same job list as Job Tracker,  
**so that** account metrics never disagree with the tracker.

**Priority:** P0  
**Depends on:** US-C1.1

**Acceptance criteria:**
- [ ] CRM and Job Tracker use one shared jobs provider/context
- [ ] Jobs submitted via job intake appear in CRM without separate import
- [ ] No duplicate CRM-specific job store in Phase 1

---

## Epic C2 — Navigation and entry

### US-C2.1 — Open CRM from home

**As a** merchandiser,  
**I want** to choose CRM from the app home page,  
**so that** I can reach customer accounts without memorising a URL.

**Priority:** P0  
**Depends on:** App home page

**Acceptance criteria:**
- [ ] Home page shows a CRM card with title and short description
- [ ] Card navigates to `/crm`
- [ ] CRM card is visually consistent with other home area cards

---

### US-C2.2 — CRM header navigation

**As a** user inside CRM,  
**I want** clear navigation back to Home and within CRM,  
**so that** I can move between areas without using the browser back button.

**Priority:** P0  
**Depends on:** US-C2.1

**Acceptance criteria:**
- [ ] Header shows Home and CRM links when on `/crm`
- [ ] CRM nav item is active/highlighted on CRM page
- [ ] Logo/title links to Home

---

## Epic C3 — Headline KPIs

### US-C3.1 — View CRM headline KPIs

**As an** account manager,  
**I want** six headline KPI cards on the CRM page,  
**so that** I get an instant view of portfolio health.

**Priority:** P0  
**Depends on:** US-C1.3

**KPIs:** Accounts, Active, Open jobs, Pending approval, Pipeline value, At risk

**Acceptance criteria:**
- [ ] All six KPIs visible above the account table on desktop
- [ ] Values match aggregation rules in CRM PRD Appendix A
- [ ] Pipeline value formatted as GBP

---

### US-C3.2 — KPIs update when jobs change

**As a** merchandiser,  
**I want** CRM KPIs to update after I submit a new job via intake,  
**so that** I see the impact of new work immediately.

**Priority:** P0  
**Depends on:** US-C3.1, Job intake (production flow)

**Acceptance criteria:**
- [ ] Submitting a job via `/job-intake` increases account/job counts when returning to CRM
- [ ] Pending approval KPI includes new jobs with “Pending Approval” status
- [ ] Pipeline value increases when new open job has quantity and sell price

---

## Epic C4 — Customer account table

### US-C4.1 — Browse customer accounts

**As a** customer service agent,  
**I want** a table of all customer accounts with key metrics,  
**so that** I can scan workload by customer.

**Priority:** P0  
**Depends on:** US-C1.3

**Acceptance criteria:**
- [ ] Table shows: Customer, Merchandiser, Channel, Open jobs, Pipeline, Total jobs, Health, Last activity
- [ ] Default sort is pipeline value descending
- [ ] Row click opens account detail (US-C5.1)

---

### US-C4.2 — Search customer accounts

**As a** merchandiser,  
**I want** to search accounts by name, merchandiser, or channel,  
**so that** I can find a customer quickly in a long list.

**Priority:** P0  
**Depends on:** US-C4.1

**Acceptance criteria:**
- [ ] Search box filters table in real time
- [ ] Search matches customer name, merchandiser, and channel (case-insensitive)
- [ ] Clear control resets search
- [ ] Empty results show empty state message

---

### US-C4.3 — Sort customer accounts

**As an** operations manager,  
**I want** to sort the account table by customer, open jobs, pipeline, or total jobs,  
**so that** I can prioritise the largest or busiest accounts.

**Priority:** P1  
**Depends on:** US-C4.1

**Acceptance criteria:**
- [ ] Clicking column header toggles sort asc/desc
- [ ] Active sort column is visually indicated
- [ ] Sort persists while search filter is applied

---

### US-C4.4 — Account health badges

**As an** operations manager,  
**I want** each account to show a health badge,  
**so that** I can spot at-risk and quiet accounts at a glance.

**Priority:** P0  
**Depends on:** US-C1.2, US-C4.1

**Acceptance criteria:**
- [ ] Badge shows Active, At risk, or Quiet per PRD rules
- [ ] At risk = customer has ≥1 overdue job
- [ ] Quiet = customer has zero open jobs
- [ ] Colour coding: green / red / grey

---

## Epic C5 — Account detail and jobs

### US-C5.1 — View account detail

**As a** merchandiser,  
**I want** to open an account and see summary metrics and recent jobs,  
**so that** I understand the account without leaving CRM.

**Priority:** P0  
**Depends on:** US-C4.1

**Acceptance criteria:**
- [ ] Modal shows account name, health, merchandiser, channel
- [ ] Metrics: open jobs, pending approval, overdue jobs, pipeline value
- [ ] Up to 5 recent jobs listed with job number, description, approval status, stage
- [ ] Modal closes without losing table search/sort state

---

### US-C5.2 — Open job from account detail

**As a** merchandiser,  
**I want** to open a recent job from the account modal,  
**so that** I can see full job details in one click.

**Priority:** P0  
**Depends on:** US-C5.1, Job Tracker detail modal

**Acceptance criteria:**
- [ ] Clicking a recent job opens the shared Job Detail modal
- [ ] Account modal closes when job detail opens (or stacks cleanly)
- [ ] Job detail shows same fields as Job Tracker modal

---

### US-C5.3 — Jump to Job Tracker for customer

**As a** customer service agent,  
**I want** a link from the account modal to all jobs for that customer in Job Tracker,  
**so that** I can work the full job list when needed.

**Priority:** P0  
**Depends on:** US-C5.1, Job Tracker customer filter

**Acceptance criteria:**
- [ ] “View all in Job Tracker” link visible in account modal
- [ ] Link navigates to `/job-tracker?customer={name}`
- [ ] Job Tracker search is pre-filled with customer name
- [ ] Filtered results include only matching customer jobs

---

## Epic C6 — Cross-module consistency

### US-C6.1 — Merchandiser and channel on accounts

**As a** merchandiser,  
**I want** each account to show the primary merchandiser and channel,  
**so that** I know who owns the relationship and how orders typically arrive.

**Priority:** P1  
**Depends on:** US-C4.1

**Acceptance criteria:**
- [ ] Merchandiser = mode across customer’s jobs
- [ ] Channel = mode across customer’s jobs
- [ ] Display “—” when no values present

---

### US-C6.2 — Last activity date

**As an** account manager,  
**I want** to see when each account last had job activity,  
**so that** I can identify dormant accounts.

**Priority:** P1  
**Depends on:** US-C4.1

**Acceptance criteria:**
- [ ] Last activity = latest of date of request, requested delivery, date approved
- [ ] Dates parsed as UK format (dd/MM/yyyy)
- [ ] Display formatted for en-GB locale

---

### US-C6.3 — CRM data freshness

**As a** user,  
**I want** to see when underlying data was last updated,  
**so that** I know if CRM reflects the latest sheet sync.

**Priority:** P1  
**Depends on:** App header data-as-of (shared with other modules)

**Acceptance criteria:**
- [ ] “Data as of” timestamp visible in app header on CRM page
- [ ] Timestamp matches Job Tracker / production modules

---

## Epic C7 — Launch and quality

### US-C7.1 — CRM UAT spot-check

**As a** product owner,  
**I want** merchandising and ops to sign off CRM metrics,  
**so that** we launch with confidence.

**Priority:** P0  
**Depends on:** US-C3.1, US-C4.1, US-C5.1

**Acceptance criteria:**
- [ ] 5 accounts: pipeline value manually verified ≥ 95% accuracy
- [ ] 10 accounts: health badge matches overdue/open rules
- [ ] 2 users complete “find customer and open job” in < 30 s each

---

### US-C7.2 — CRM scope communication

**As a** new CRM user,  
**I want** clear copy that Phase 1 is account view over jobs—not a full sales CRM,  
**so that** I use the tool correctly.

**Priority:** P1  
**Depends on:** US-C2.1

**Acceptance criteria:**
- [ ] CRM page subtitle mentions link to Job Tracker and production
- [ ] Phase 1 limitations documented in CRM PRD non-goals
- [ ] Optional: one-page CRM guide shared at launch

---

## Epic C8 — Phase 2 backlog (not MVP)

Stories below are **P2** — capture intent but do not block Phase 1 release.

### US-C8.1 — Customer master and contacts

**As a** sales lead,  
**I want** to store contacts and notes per account,  
**so that** relationship context lives outside job rows.

**Priority:** P2

---

### US-C8.2 — Pre-job opportunities pipeline

**As a** sales lead,  
**I want** to track opportunities before they become jobs,  
**so that** pipeline includes work not yet in Job Tracker.

**Priority:** P2

---

### US-C8.3 — Account alias merging

**As an** operations manager,  
**I want** duplicate customer spellings merged into one account,  
**so that** workload is not split across name variants.

**Priority:** P2

---

### US-C8.4 — At-risk alerts

**As a** merchandiser,  
**I want** to be notified when an account becomes at risk,  
**so that** I can act before jobs miss delivery.

**Priority:** P2

---

## MVP release checklist (CRM P0 stories)

| Epic | P0 stories | Status |
|------|------------|--------|
| C1 — Data | US-C1.1, US-C1.2, US-C1.3 | ☐ |
| C2 — Navigation | US-C2.1, US-C2.2 | ☐ |
| C3 — KPIs | US-C3.1, US-C3.2 | ☐ |
| C4 — Accounts | US-C4.1, US-C4.2, US-C4.4 | ☐ |
| C5 — Detail | US-C5.1, US-C5.2, US-C5.3 | ☐ |
| C7 — Launch | US-C7.1 | ☐ |

**P1 stories for MVP if time permits:** US-C4.3, US-C6.1, US-C6.2, US-C6.3, US-C7.2

---

## Sample sprint allocation (CRM add-on)

Assumes Job Tracker and shared job context already exist (production demo).

### Sprint A — CRM foundations (1 week)
US-C1.1, US-C1.2, US-C1.3, US-C2.1, US-C2.2

### Sprint B — CRM core UI (1 week)
US-C3.1, US-C4.1, US-C4.2, US-C4.4, US-C5.1

### Sprint C — CRM integrations (3–5 days)
US-C3.2, US-C5.2, US-C5.3, US-C7.1

### Sprint D (buffer) — Polish
US-C4.3, US-C6.1, US-C6.2, US-C6.3, US-C7.2

---

## Traceability — demo implementation

| Story | Demo status | Implementation |
|-------|-------------|----------------|
| US-C2.1 | Implemented | `HomePage.tsx` CRM card |
| US-C2.2 | Implemented | `AppLayout.tsx` CRM nav |
| US-C3.1 | Implemented | `CrmKpiBar.tsx` |
| US-C3.2 | Implemented | `JobsContext.tsx` + `crm.ts` |
| US-C4.1 | Implemented | `CrmCustomerTable.tsx` |
| US-C4.2 | Implemented | Table search |
| US-C4.3 | Implemented | Column sort |
| US-C4.4 | Implemented | `healthStyle` in `crm.ts` |
| US-C5.1 | Implemented | `CrmCustomerModal.tsx` |
| US-C5.2 | Implemented | `JobDetailModal` from CRM |
| US-C5.3 | Implemented | Link to `/job-tracker?customer=` |

**Not yet in demo (production backend):** US-C1.1 sign-off, US-C1.2 sign-off, US-C6.3 live sync timestamp from Odoo, US-C7.1 formal UAT
