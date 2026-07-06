# Product Requirements Document (PRD)

## Pixelgenie CRM — Phase 1 MVP

| Field | Value |
|-------|-------|
| **Document title** | Pixelgenie CRM MVP |
| **Version** | 1.0 |
| **Status** | Draft — pending stakeholder approval |
| **Date created** | 1 July 2026 |
| **Date approved** | _TBD_ |
| **Owner** | Pixelgenie Sales / Operations / Product |
| **Primary users** | Merchandisers, account managers, operations managers, customer service |
| **Related** | [PRD.md](./PRD.md) (DTG Dashboard) · [CRM_USER_STORIES.md](./CRM_USER_STORIES.md) |

---

## 1. Executive summary

Pixelgenie manages dozens of active customer accounts across screen print, DTG, and related production workflows. Customer context today is spread across the Job Sheet Tracker, production dashboards, spreadsheets, and informal handoffs. Merchandisers and operations staff lack a single place to see **who the customer is**, **how much open work they have**, **who owns the relationship**, and **whether anything is at risk**.

Phase 1 CRM delivers a **lightweight customer account view** inside the Pixelgenie operations app. It aggregates job-level data from the Job Tracker (and job intake submissions) into customer-centric KPIs, a searchable account list, and drill-down to recent jobs—with links into Job Tracker and production tools.

**Success looks like:** A merchandiser or ops lead opens CRM, finds a customer in under 30 seconds, understands open workload and pipeline value, and jumps to the relevant jobs without exporting spreadsheets.

---

## 2. Problem statement

### 2.1 Current pain

- Customer workload is visible in production reports but not in a sales/account-friendly layout.
- Merchandiser ownership and order channel are buried in individual job rows.
- No single health signal for accounts with overdue jobs or stalled approvals.
- Customer service must search the full job tracker to answer “what’s open for {customer}?”
- Pipeline value (open job value) is not summarised at account level.

### 2.2 Opportunity

A CRM layer on top of existing job data improves account visibility, supports merchandising prioritisation, and connects sales-facing roles to operational truth—without building a separate Salesforce-style system in Phase 1.

---

## 3. Goals and non-goals

### 3.1 Goals (Phase 1)

| # | Goal |
|---|------|
| G1 | Show all customer accounts derived from Job Tracker data |
| G2 | Surface headline CRM KPIs: accounts, active accounts, open jobs, pending approval, pipeline value, at-risk accounts |
| G3 | Provide searchable, sortable customer account table |
| G4 | Show account health (active, at risk, quiet) based on agreed rules |
| G5 | Enable drill-down: account detail → recent jobs → full job modal |
| G6 | Link to Job Tracker filtered by customer |
| G7 | Stay in sync with job intake submissions and tracker updates |

### 3.2 Non-goals (Phase 1 — explicitly out of scope)

- Contact persons, email threads, call logs, or meeting notes
- Opportunity pipeline separate from jobs (pre-job sales leads)
- Quotes, invoicing, and payment status
- Marketing automation or email campaigns
- Customer self-service portal
- Write-back to Odoo or Google Sheets from CRM UI
- Account hierarchy (parent/child brands) unless already in job data
- Forecasting, churn scoring, or AI recommendations

These may be revisited in Phase 2 once account views are in daily use.

---

## 4. Users and personas

| Persona | Role | Primary needs |
|---------|------|---------------|
| **Merchandiser** | Owns customer jobs through approval and production handover | Account list, pending approval, link to jobs |
| **Account / Sales contact** | Manages customer relationship and order flow | Pipeline value, open jobs, last activity |
| **Operations Manager** | Oversees workload and risk | At-risk accounts, open job counts |
| **Customer Service** | Answers status queries | Quick search, recent jobs, link to tracker |
| **Production Coordinator** | Schedules floor work | Customer concentration, open workload |

All personas are **internal Pixelgenie staff**. No customer-facing CRM access in Phase 1.

---

## 5. Core questions the CRM must answer

1. **How many customer accounts do we have?**
2. **Which accounts are active vs quiet vs at risk?**
3. **What is the total pipeline value of open work by customer?**
4. **Who is the merchandiser and channel for each account?**
5. **What are the most recent jobs for this customer?**
6. **How do I jump to all jobs for this customer in Job Tracker?**

---

## 6. Functional requirements

### 6.1 Navigation and entry

| ID | Requirement |
|----|-------------|
| FR-C1 | CRM is reachable from the app home page as a dedicated area |
| FR-C2 | CRM route is `/crm` |
| FR-C3 | When inside CRM, header navigation shows Home and CRM |
| FR-C4 | CRM page title and short description explain purpose |

---

### 6.2 Headline KPIs

Six KPI cards displayed above the account table.

| KPI | Definition (Phase 1) | Notes |
|-----|----------------------|-------|
| **Accounts** | Count of distinct `customer_client_name` values with ≥1 job | Excludes blank customer |
| **Active** | Accounts where health = `active` | See §7.3 |
| **Open jobs** | Sum of open jobs across all accounts | Open = job stage not dispatched/completed |
| **Pending approval** | Sum of jobs where `approval_status` contains “Pending” | Case-insensitive |
| **Pipeline value** | Sum of estimated value for all open jobs | `order_quantity × sell_price_per_unit` (fallback `f_sell_price`) |
| **At risk** | Count of accounts where health = `at-risk` | See §7.3 |

**FR-C5:** KPIs recalculate when job data changes (including new job intake submissions).

**FR-C6:** Pipeline value displayed in GBP with whole-pound formatting for MVP.

---

### 6.3 Customer account table

| Column | Source | Sortable |
|--------|--------|----------|
| Customer | `customer_client_name` | Yes |
| Merchandiser | Mode (most frequent) across customer jobs | No |
| Channel | Mode of `order_channel` | No |
| Open jobs | Count of open jobs | Yes |
| Pipeline | Sum estimated value of open jobs | Yes (default desc) |
| Total jobs | All jobs for customer | Yes |
| Health | Computed | No |
| Last activity | Latest of request / delivery / approved dates | No |

**FR-C7:** Table supports text search across customer name, merchandiser, and channel.

**FR-C8:** Default sort is pipeline value descending.

**FR-C9:** Clicking a row opens the account detail modal.

**FR-C10:** Empty search results show a friendly empty state.

---

### 6.4 Account detail modal

When a customer row is selected:

| Field | Content |
|-------|---------|
| Account name | Customer name |
| Health badge | Active / At risk / Quiet |
| Merchandiser · Channel | Summary line |
| Metrics | Open jobs, pending approval, overdue jobs, pipeline value |
| Recent jobs | Up to 5 jobs, sorted by job number descending |
| Job row | Job number, description, approval status, job stage |
| Link | “View all in Job Tracker” with `?customer=` filter |

**FR-C11:** Clicking a recent job opens the existing Job Detail modal.

**FR-C12:** Closing account modal returns to CRM table state (search/sort preserved).

---

### 6.5 Integrations with Job Tracker and production

| ID | Requirement |
|----|-------------|
| FR-C13 | CRM reads from the same canonical job list as Job Tracker (seed data + intake submissions) |
| FR-C14 | Jobs submitted via `/job-intake` appear in CRM after submission |
| FR-C15 | Job Tracker link from account modal pre-fills customer search |
| FR-C16 | Job Detail modal reuses Job Tracker component (no duplicate job UI) |

---

## 7. Data model and definitions

### 7.1 Primary data source

Phase 1 CRM is **derived entirely from Job Tracker job records**. No separate CRM database table is required for MVP.

**Canonical job fields used:**

| Field | CRM use |
|-------|---------|
| `customer_client_name` | Account identity |
| `merchandiser` | Account owner (mode) |
| `order_channel` | Primary channel (mode) |
| `approval_status` | Pending approval counts |
| `job_stage` | Open vs closed job logic |
| `due_days` | Overdue detection (via Job Tracker util) |
| `order_quantity` | Units and pipeline |
| `sell_price_per_unit` / `f_sell_price` | Pipeline value |
| `date_of_request`, `requested_delivery_date`, `date_approved` | Last activity |
| `job_number`, `job_description` | Recent jobs list |

### 7.2 Account aggregation rules

- One **account** = one distinct non-empty `customer_client_name`.
- Jobs with blank customer are excluded from CRM.
- **Primary merchandiser** and **primary channel** = most frequently occurring value across that customer’s jobs (mode).

### 7.3 Account health

| Health | Rule (Phase 1) |
|--------|----------------|
| **At risk** | Customer has ≥1 overdue job (`due_days < 0`) |
| **Quiet** | Customer has zero open jobs |
| **Active** | All other accounts with ≥1 open job and no overdue jobs |

**D-C1 (decision):** Confirm overdue definition matches Job Tracker (due days negative).

**D-C2 (decision):** Confirm “open job” excludes stages containing “dispatched” or “completed” (case-insensitive).

### 7.4 Open job definition

```
is_open = job_stage does NOT contain "dispatched" AND does NOT contain "completed"
```

### 7.5 Pipeline value

```
job_value = order_quantity × COALESCE(sell_price_per_unit, f_sell_price, 0)
account_pipeline = SUM(job_value) for open jobs only
```

**D-C3 (decision):** Confirm sell price field priority when both populated.

---

## 8. Non-functional requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-C1 | CRM page load with KPIs and table | < 3 s on desktop (demo data scale) |
| NFR-C2 | Search/filter response | Immediate (client-side) |
| NFR-C3 | Data consistency with Job Tracker | Same job array source |
| NFR-C4 | Access control | Internal staff only (same as rest of app) |
| NFR-C5 | Currency | GBP for Phase 1 |

---

## 9. UX requirements

| ID | Requirement |
|----|-------------|
| UX-C1 | Visual style consistent with DTG Dashboard and Production areas |
| UX-C2 | Health badges colour-coded: green (active), red (at risk), grey (quiet) |
| UX-C3 | Table horizontally scrollable on narrow viewports |
| UX-C4 | Account modal scrollable when content exceeds viewport |
| UX-C5 | Demo badge and “data as of” visible in app header |

---

## 10. Success criteria

| ID | Criterion | Measurement |
|----|-----------|-------------|
| SC-C1 | Merchandiser finds customer account in < 30 s | Timed UAT |
| SC-C2 | Pipeline value spot-check matches manual calc for 5 accounts | ≥ 95% accuracy |
| SC-C3 | Health labels match overdue/open rules for 10 sample accounts | 100% match |
| SC-C4 | Job Tracker link returns correct filtered jobs | UAT per account |
| SC-C5 | New intake job visible in CRM within same session | Submit + verify |

---

## 11. Risks and mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Customer name inconsistencies (“BoohooMAN” vs “Boohoo Man”) | High | Medium | Phase 2: customer master; Phase 1: document naming convention |
| Missing sell price on jobs | Medium | High | Show pipeline £0; flag data quality in ops review |
| CRM confused with full sales CRM | Medium | Medium | Clear Phase 1 scope in UI copy and training |
| Stale job data | High | Medium | Shared refresh with Job Tracker; show data-as-of timestamp |
| Overdue logic differs from production dashboard | Medium | Medium | Single shared `isJobOverdue` implementation |

---

## 12. Dependencies

- Job Tracker canonical dataset (Google Sheet export / future Odoo sync)
- Job intake form submissions (`JobsContext` / local persistence in demo)
- Job Detail modal component
- Operational definitions for open/overdue (align with [definitions.md](./definitions.md))

---

## 13. Phase 2 considerations (backlog)

- Dedicated customer master record (contacts, addresses, notes)
- Opportunities pipeline before job creation
- Activity log (calls, emails, merchandiser notes)
- Account-level documents and contracts
- Odoo customer sync and write-back
- Alerts when account becomes at-risk
- Revenue YTD and dispatched value from Completed Job History

---

## 14. Open questions

1. Should accounts merge aliases (e.g. brand vs legal entity)?
2. Is pipeline value based on sell price, cost price, or quoted value?
3. Should “quiet” accounts hide from default table view?
4. Who can edit merchandiser assignment—CRM UI or job sheet only?
5. When Odoo goes live, is `customer_client_name` the canonical account key?

---

## 15. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product / Sponsor | | | |
| Merchandising lead | | | |
| Operations | | | |
| Engineering | | | |

---

## Appendix A — Metric calculation reference

```
accounts           = COUNT(DISTINCT customer_client_name) WHERE name != ''
open_jobs          = COUNT(jobs) WHERE is_open(job)
pending_approval   = COUNT(jobs) WHERE approval_status ILIKE '%pending%'
pipeline_value     = SUM(job_value(job)) WHERE is_open(job)
active_accounts    = COUNT(accounts) WHERE health = 'active'
at_risk_accounts   = COUNT(accounts) WHERE health = 'at-risk'

health(account):
  IF overdue_jobs > 0 THEN 'at-risk'
  ELSE IF open_jobs = 0 THEN 'quiet'
  ELSE 'active'
```

## Appendix B — Related documents

- [CRM_USER_STORIES.md](./CRM_USER_STORIES.md) — Epics and acceptance criteria
- [PRD.md](./PRD.md) — DTG Dashboard PRD
- [USER_STORIES.md](./USER_STORIES.md) — DTG Dashboard user stories
- [BUILD_PLAN.md](./BUILD_PLAN.md) — Implementation plan
- [definitions.md](./definitions.md) — Operational definitions workshop

## Appendix C — Demo implementation reference

The current demo frontend implements this PRD at:

| Area | Path |
|------|------|
| CRM page | `dashboard/src/pages/CrmPage.tsx` |
| KPI bar | `dashboard/src/components/crm/CrmKpiBar.tsx` |
| Account table | `dashboard/src/components/crm/CrmCustomerTable.tsx` |
| Account modal | `dashboard/src/components/crm/CrmCustomerModal.tsx` |
| Aggregation logic | `dashboard/src/utils/crm.ts` |
| Shared job data | `dashboard/src/context/JobsContext.tsx` |
