# Product Requirements Document (PRD)

## Pixelgenie CRM — Merchandising CRM

| Field | Value |
|-------|-------|
| **Document title** | Pixelgenie Merchandising CRM |
| **Version** | 2.0 |
| **Status** | Draft — pending stakeholder approval |
| **Date created** | 1 July 2026 |
| **Date updated** | 8 July 2026 |
| **Date approved** | _TBD_ |
| **Owner** | Pixelgenie Sales / Operations / Product |
| **Primary users** | Sales / account managers, merchandisers, accounts team, operations managers, customer service |
| **Workshop source** | CRM requirements workshop — 8 July 2026 (Shanza, Edward Lewell, PMO, Amin Ghasemi) |
| **Related** | [CRM_USER_STORIES.md](./CRM_USER_STORIES.md) · [PRD.md](./PRD.md) (DTG Dashboard) · [BUILD_PLAN.md](./BUILD_PLAN.md) |

---

## 1. Executive summary

Pixelgenie manages dozens of active customer accounts across screen print, DTG, embroidery, DTF, and related production workflows. Customer context today is spread across the Job Sheet Tracker, production dashboards, spreadsheets, email threads, Airtable (onboarding credit checks), and informal handoffs between sales and merchandising.

**Phase 1 (demo — shipped)** delivered a read-only account dashboard: KPIs, searchable account list, health signals, and Job Tracker cross-links.

**Phase 2+ (this PRD)** delivers a **full merchandising CRM** — the single place for customer relationship context, onboarding, portfolio requirements, sample workflows, agreed pricing, POs/invoices, and internal communication — while **Job Tracker remains the operational execution system** for production jobs.

### Core design principle

> Rather than duplicating operational data, CRM stores context and decisions. Job Tracker stores execution. Link by job number; do not re-enter.

CRM answers: **Who is this customer, what did we agree, and where are we in the pre-production journey?**  
Job Tracker answers: **Where is this job on the floor?**

### Success looks like

- A salesperson creates an account, completes onboarding, and logs sample requirements without email back-and-forth.
- A merchandiser opens a sample record and has every detail needed to create a job in Job Tracker — blank, decor, artwork, pricing, delivery locations.
- Anyone can find agreed pricing in under 10 seconds instead of searching email.
- Customer conversations and change requests are logged in-context with @mentions and notifications.
- Production jobs are linked from CRM by job number — no duplicate job data in CRM.

---

## 2. Problem statement

### 2.1 Current pain (validated in team interviews — July 2026)

| Pain | Who raised it | Impact |
|------|---------------|--------|
| No single place for customer requirements (blanks, tech packs, artwork, packaging) | Claire, Steve, Ash | Merch must ask sales repeatedly |
| Gazillion forwarded emails; hard to find information needed to proceed | Shay, Izzy | Delays, missed details |
| No track-and-trace of who spoke to the customer | All | Changes lost between handoffs |
| Changes made during process not recorded anywhere | All | Production errors, rework |
| Pricing buried in email; delays invoicing and job creation | All | Comgem/Odoo jobs blocked without sell/cost price |
| Same information entered in CRM, job sheet, and Odoo | All | Wasted time, data inconsistency |
| No sampling workflow or visibility | Ops | Samples approved/rejected with no audit trail |
| Sample costing not captured when samples are not invoiced | Sales | Hidden cost on resamples |

### 2.2 Opportunity

A merchandising CRM inside the Pixelgenie operations app gives sales and merchandising a shared workspace from first contact through sample approval and production handover — connected to Job Tracker, Airtable (onboarding), and Xero (invoicing) without replacing them.

---

## 3. Goals and non-goals

### 3.1 Goals

| Phase | # | Goal |
|-------|---|------|
| **1 (done)** | G1 | Show customer accounts derived from Job Tracker with KPIs, health, and pipeline value |
| **1 (done)** | G2 | Searchable account list with drill-down to jobs and Job Tracker links |
| **2** | G3 | Create and manage customer accounts as first-class records (not only job-name aggregation) |
| **2** | G4 | Account Home: contacts, addresses, onboarding form, billing/portal details |
| **3** | G5 | Customer Portfolio: blanks, tech packs, artwork, decor prefs, suppliers |
| **4** | G6 | Sample stage: per-style workflow with decor-driven fields, approval, iterations |
| **4** | G7 | Sample costing and flexible invoicing options |
| **5** | G8 | Pricing tab: agreed cost, margin, sell price per order |
| **5** | G9 | PO and invoice management with Xero link by job number |
| **6** | G10 | Per-stage chat with @mentions and email notifications |
| **6** | G11 | Role-based ownership: sales vs merchandiser handoff gates |
| **6** | G12 | Pre-fill Job Tracker intake from approved sample (reduce duplicate entry) |
| **7** | G13 | Parent company / sub-account hierarchy (e.g. Warner → artists) |

### 3.2 Non-goals

- **Production scheduling and floor operations** — stays in Job Tracker / Odoo
- **Full job field set** (271 columns) — CRM links to jobs, does not replicate
- **Invoice accounting ledger** — Xero remains system of record; CRM links and attaches
- **Customer self-service portal** — internal staff only
- **Marketing automation or campaigns**
- **Forecasting, churn scoring, or AI recommendations**
- **Replacing Comgem or Odoo** — explore integrations only where feasible

---

## 4. Users, personas, and roles

| Persona | Role | CRM responsibilities |
|---------|------|----------------------|
| **Sales / Account Manager** | Brings in leads, owns customer relationship | Create account, onboarding, portfolio, sample request, customer costing, PO upload |
| **Merchandiser** | Executes samples and production handover | Sample execution, job creation in Job Tracker, production link, change iterations |
| **Accounts Team** | Credit checks and invoicing | Onboarding verification, PO/invoice verification |
| **Operations Manager** | Portfolio health and risk | KPIs, at-risk accounts, workload overview |
| **Customer Service** | Status queries | Search, activity feed, job links |
| **Production Coordinator** | Floor scheduling | Read-only on samples; works in Job Tracker |
| **Admin** | System configuration | Parent/sub-accounts, supplier dropdowns, user management |

All personas are **internal Pixelgenie staff**. No customer-facing CRM access.

### Role handoff gates

| Gate | Owner completes | Unlocks |
|------|-----------------|---------|
| Account created | Sales | Home tab |
| Onboarding verified | Accounts | Portfolio + Samples |
| Sample spec complete | Sales | Merch can execute sample |
| Sample approved + costing | Merch / Sales | Production link + pricing lock |
| Job created in Job Tracker | Merch | In Production tab (job number link) |

---

## 5. Core questions the CRM must answer

### Phase 1 (implemented)

1. How many customer accounts do we have?
2. Which accounts are active vs quiet vs at risk?
3. What is the total pipeline value of open work by customer?
4. What are the most recent jobs for this customer?

### Phase 2+ (this PRD)

5. Who is this customer — contact, addresses, billing, portal access?
6. Has onboarding been completed and credit-checked?
7. What blanks, decor methods, artwork, and packaging does this customer use?
8. What samples are in progress, approved, or need resampling?
9. What pricing was agreed — cost, margin, sell price?
10. What POs and invoices relate to this account or job?
11. Who last spoke to the customer and what changed?
12. Which Job Tracker job number links to this sample or production order?

---

## 6. Account workspace — tab structure

Each account opens a **tabbed workspace** (replacing the current 4-tab detail panel).

| Tab | Primary user | Purpose |
|-----|--------------|---------|
| **Home** | Sales | Company details, contacts, delivery/billing addresses, onboarding form, client portal details |
| **Portfolio** | Sales, Merch | Standing requirements: blanks, tech packs, artwork, decor, packaging, suppliers |
| **Samples** | Sales → Merch | Per-style sample workflow, costing, approval, iterations |
| **In Production** | Merch | Job number links to Job Tracker only — no duplicate job data |
| **Pricing** | Sales, Accounts | Agreed cost, margin, sell price; optional Excel upload |
| **POs & Invoices** | Sales, Accounts | PO attachment, shortages, Xero invoice link |
| **Activity** | All | Notes, chat threads, status changes, @mentions |

Each tab (except In Production) includes an **inline or sidebar chat thread** for context-specific conversation.

---

## 7. Functional requirements

### 7.1 Phase 1 — Account dashboard (implemented in demo)

#### Navigation

| ID | Requirement | Status |
|----|-------------|--------|
| FR-C1 | CRM reachable from app home at `/crm` | ✅ |
| FR-C2 | Header navigation: Home and CRM | ✅ |
| FR-C3 | CRM page title and description | ✅ |

#### Headline KPIs

| KPI | Definition |
|-----|------------|
| Accounts | Distinct customer names with ≥1 job |
| Active | Health = active |
| Open jobs | Sum of open jobs (stage excludes dispatched/completed) |
| Pending approval | Jobs where `approval_status` contains "Pending" |
| Pipeline value | `order_quantity × sell_price` on open jobs (GBP) |
| At risk | Accounts with ≥1 overdue job |

| ID | Requirement | Status |
|----|-------------|--------|
| FR-C5 | KPIs recalculate when job data changes | ✅ |
| FR-C6 | Pipeline value in GBP | ✅ |

#### Account list

| ID | Requirement | Status |
|----|-------------|--------|
| FR-C7 | Search by customer, merchandiser, channel | ✅ |
| FR-C8 | Default sort: pipeline desc | ✅ |
| FR-C9 | Row click opens account detail | ✅ |
| FR-C10 | Kanban view by health status | ✅ |
| FR-C11 | Empty search shows friendly state | ✅ |

#### Job Tracker integration (Phase 1)

| ID | Requirement | Status |
|----|-------------|--------|
| FR-C13 | Same job list as Job Tracker | ✅ |
| FR-C14 | Job intake submissions appear in CRM | ✅ |
| FR-C15 | "View all in Job Tracker" with `?customer=` filter | ✅ |
| FR-C16 | Job Detail modal reused from Job Tracker | ✅ |

---

### 7.2 Phase 2 — Foundation and account creation

| ID | Requirement |
|----|-------------|
| FR-C20 | Backend API + PostgreSQL for CRM data |
| FR-C21 | Authentication (Google Workspace SSO) and role-based access |
| FR-C22 | "New account" action: sales creates account by name |
| FR-C23 | Account list merges Job Tracker-derived accounts with manually created accounts |
| FR-C24 | Parent company / sub-account hierarchy (parent → artist/sub-source) |
| FR-C25 | Account detail becomes full-page or wide panel with tab navigation |

---

### 7.3 Phase 2 — Account Home tab

| ID | Requirement |
|----|-------------|
| FR-C30 | Company name, contact name, email, phone |
| FR-C31 | Delivery address and billing address (separate fields) |
| FR-C32 | Payment terms |
| FR-C33 | Client invoice/PO portal URL and access notes (for large clients using vendor portals) |
| FR-C34 | Customer onboarding form: upload signed PDF |
| FR-C35 | Onboarding status workflow: `draft` → `sent` → `received` → `credit_check` → `verified` |
| FR-C36 | Airtable integration: push onboarding record for accounts credit check (Ahmed); webhook or manual status sync for MVP |
| FR-C37 | Email notification to account manager when onboarding verified |
| FR-C38 | Portfolio and Samples tabs locked until onboarding = `verified` |

**Onboarding process (as-is, digitised):**

1. Sales creates account and sends customer onboarding form to customer.
2. Customer completes and returns form (typically 1–2 hours; up to 2–3 days).
3. Sales uploads signed form to CRM Home tab.
4. Record pushed to Airtable; accounts team performs credit check.
5. Accounts marks verified; sales receives notification to proceed.

---

### 7.4 Phase 3 — Customer Portfolio tab

| ID | Requirement |
|----|-------------|
| FR-C40 | Blanks / styles: blank codes, tech pack link, style notes |
| FR-C41 | Decor method preferences: DTG, screen, embroidery, DTF, stickers, other |
| FR-C42 | Artwork folder link(s) per customer |
| FR-C43 | Packaging preferences: swing tags, wash/care labels, packaging type |
| FR-C44 | Branding options: remove manufacturer labels, attach custom wash/care |
| FR-C45 | Supplier directory per account: DTF, swing tags, blanks, barcodes — name, phone, quantity notes |
| FR-C46 | Dropdown selectors for common suppliers and blanks (admin-maintained lists) |
| FR-C47 | Portfolio defaults pre-fill new sample records (overridable per sample) |

---

### 7.5 Phase 4 — Samples tab

#### Sample entity

Each account supports multiple samples (Sample 1, Sample 2, …). Samples are independent — one may be approved while another needs resampling.

| ID | Requirement |
|----|-------------|
| FR-C50 | Create sample with style name and sample number |
| FR-C51 | Blank: code, name, colour |
| FR-C52 | Decor method selection: DTG, Screen, Embroidery, DTF, Stickers, Other |
| FR-C53 | **DTG sub-flow:** front only / back only / both; artwork numbers |
| FR-C54 | **Screen sub-flow:** screens set up (Y/N), number of screens, number of colours, screen artwork refs |
| FR-C55 | **Backneck:** print / heat transfer / none |
| FR-C56 | Branding: label removal, wash/care, special instructions |
| FR-C57 | Delivery: single location or multiple locations with addresses |
| FR-C58 | Approval status: `draft` / `in_progress` / `approved` / `not_approved` / `need_resample` |
| FR-C59 | Sample iterations: version history when resampling; change description and author |
| FR-C60 | Attach customer PO if received at sample stage |
| FR-C61 | Job number field: merch copies job number from Job Tracker after creating job |
| FR-C62 | Job number is clickable link to Job Tracker detail |

#### Sample costing

| ID | Requirement |
|----|-------------|
| FR-C65 | Blank cost price (from supplier) |
| FR-C66 | Margin % (sales-added) |
| FR-C67 | Calculated or manual sell price |
| FR-C68 | Front / back price breakdown where applicable |
| FR-C69 | Invoicing option: invoice now / include in production invoice / photo-only (no charge) |
| FR-C70 | Track sample cost incurred even when not invoiced (for margin analysis) |

#### Sample → production handoff

| ID | Requirement |
|----|-------------|
| FR-C71 | Approved sample unlocks "In Production" tab for job number link |
| FR-C72 | Merch creates job in Job Tracker using sample data; copies job number back to CRM |
| FR-C73 | No duplicate job fields stored in CRM — reference only |

---

### 7.6 Phase 5 — Pricing and POs & Invoices tabs

#### Pricing tab

| ID | Requirement |
|----|-------------|
| FR-C80 | Agreed pricing per order: blank cost, margin %, sell price |
| FR-C81 | Front / back breakdown |
| FR-C82 | Optional Excel pricing spreadsheet upload |
| FR-C83 | Audit: agreed date, agreed by |
| FR-C84 | Link pricing to sample and/or job number |
| FR-C85 | Pre-fill Job Tracker intake sell/cost price from agreed pricing |

#### POs & Invoices tab

| ID | Requirement |
|----|-------------|
| FR-C90 | Attach PO document; PO number field |
| FR-C91 | PO timing note: some clients send PO with order; others only after dispatch |
| FR-C92 | Log shortages and adjustments against PO |
| FR-C93 | Link to client portal (from Home billing section) |
| FR-C94 | Invoice status: draft / sent / paid (manual MVP; read from Xero in Phase 5b) |
| FR-C95 | Xero integration: link or create invoice by job number (explore API) |

---

### 7.7 Phase 6 — Communication and collaboration

| ID | Requirement |
|----|-------------|
| FR-C100 | Chat thread per context: Home, Portfolio, each Sample, Pricing, PO |
| FR-C101 | @mention users by role (sales, merch, accounts, production) |
| FR-C102 | Email notification on @mention and on key status changes |
| FR-C103 | Account-level activity feed: all events chronologically |
| FR-C104 | Distinguish internal vs customer-facing messages |
| FR-C105 | Replace ad-hoc "myth check" email threads with in-system audit trail |

**Future integrations (investigate, not MVP):**

- Odoo email sync (off-the-shelf module if available)
- Comgem chat integration (Lynn — feasibility TBD)

---

### 7.8 Phase 6 — Roles and automation

| ID | Requirement |
|----|-------------|
| FR-C110 | Role-based edit permissions per tab (see §4 handoff gates) |
| FR-C111 | Pre-fill job intake from approved sample: customer, blank, decor, artwork, pricing, addresses |
| FR-C112 | Pre-fill sample from portfolio defaults |
| FR-C113 | Pre-fill job intake customer name and addresses from account Home |
| FR-C114 | At-risk account alert when linked jobs go overdue (extend Phase 1 health logic) |

---

## 8. Data model

### 8.1 Phase 1 (demo — client-side)

CRM derived from Job Tracker `Job` records. Profiles and notes in `localStorage`.

### 8.2 Phase 2+ (production — PostgreSQL)

```
accounts
  id, name, parent_account_id, type (parent|sub), status, owner_user_id,
  created_at, updated_at

account_profiles
  account_id, company_name, contact_name, email, phone,
  delivery_address, billing_address, portal_url, portal_notes,
  payment_terms, website, internal_ref

onboarding_forms
  account_id, file_url, status, sent_at, received_at,
  verified_at, verified_by, airtable_record_id

portfolio_items
  account_id, category, data (JSONB), sort_order

samples
  id, account_id, sample_number, style_name, status, decor_method,
  blank_code, blank_name, blank_colour, decor_details (JSONB),
  backneck_type, branding_notes, delivery_locations (JSONB),
  approval_status, iteration_number, job_number, po_file_url,
  invoice_option, created_by, updated_at

sample_iterations
  sample_id, version, change_description, changed_by, created_at

sample_costing
  sample_id, blank_cost, margin_pct, sell_price,
  front_price, back_price, currency

pricing_agreements
  id, account_id, sample_id, job_number,
  blank_cost, margin_pct, sell_price, file_url,
  agreed_at, agreed_by

purchase_orders
  id, account_id, sample_id, job_number,
  po_number, file_url, status, shortages_notes, received_at

chat_messages
  id, account_id, context_type, context_id,
  body, author_id, mentions[], is_customer_facing, created_at

crm_notes
  id, account_id, body, author_id, created_at
```

**Job Tracker link:** `samples.job_number`, `pricing_agreements.job_number`, and `purchase_orders.job_number` are **references only** — no duplicate job row in CRM.

### 8.3 Phase 1 metric definitions (retained)

```
is_open = job_stage does NOT contain "dispatched" AND does NOT contain "completed"

job_value = order_quantity × COALESCE(sell_price_per_unit, f_sell_price, 0)

health(account):
  IF overdue_jobs > 0 THEN 'at-risk'
  ELSE IF open_jobs = 0 THEN 'quiet'
  ELSE IF pending_approval > 0 THEN 'pending-approval'
  ELSE 'active'
```

---

## 9. Integrations

| System | Phase | Approach |
|--------|-------|----------|
| **Job Tracker** | 1 | Read jobs; deep-link by job number; pre-fill intake |
| **PostgreSQL** | 2 | CRM canonical store |
| **Airtable** | 2 | Onboarding upload → credit-check row; status webhook |
| **Xero** | 5 | Invoice link/create by job ref (API exploration) |
| **Odoo** | 7+ | Email sync if off-the-shelf module exists |
| **Comgem** | 7+ | Chat integration — feasibility TBD |
| **Google Sheets** | 1 | Job Tracker import until Odoo live |

---

## 10. Non-functional requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-C1 | CRM account list load | < 3 s desktop |
| NFR-C2 | Search/filter | Immediate (client-side or indexed server-side) |
| NFR-C3 | Data consistency with Job Tracker | Job numbers resolve correctly |
| NFR-C4 | Access control | Role-based; internal staff only |
| NFR-C5 | Currency | GBP |
| NFR-C6 | File uploads | Secure storage (S3/GCS); max 20 MB per document |
| NFR-C7 | Audit trail | Status changes and chat messages timestamped with author |
| NFR-C8 | Availability | Same SLA as internal ops tools |

---

## 11. UX requirements

| ID | Requirement |
|----|-------------|
| UX-C1 | Visual style consistent with DTG Dashboard, Production, and Job Tracker |
| UX-C2 | Health badges: green (active), amber (pending approval), red (at risk), grey (quiet) |
| UX-C3 | Account workspace tabs clearly labelled; active tab highlighted |
| UX-C4 | Decor-method selection drives conditional form fields (progressive disclosure) |
| UX-C5 | Sample list shows approval status badges per sample |
| UX-C6 | Job number links open Job Tracker in same or new tab |
| UX-C7 | Chat sidebar collapsible; does not block form entry |
| UX-C8 | "Data as of" timestamp visible when Job Tracker data is sheet-sourced |
| UX-C9 | CRM designed for dedicated screen — primary daily tool for sales and merch |

---

## 12. Success criteria

| ID | Criterion | Phase | Measurement |
|----|-----------|-------|-------------|
| SC-C1 | Find customer account in < 30 s | 1 | Timed UAT ✅ demo |
| SC-C2 | Pipeline value accuracy | 1 | ≥ 95% on 5 accounts |
| SC-C3 | New account → onboarding tracked in CRM | 2 | Zero email-only onboarding for new clients |
| SC-C4 | Sample spec → merch job with zero back-and-forth | 4 | UAT with Claire/Izzy workflow |
| SC-C5 | Pricing lookup | 5 | < 10 s vs email search |
| SC-C6 | Production samples have job number in CRM | 4 | 100% of approved samples in production |
| SC-C7 | Job intake pre-fill from approved sample | 6 | ≥ 80% of fields auto-populated |
| SC-C8 | Team adoption | 6 | CRM open on dedicated screen daily (sales + merch) |

---

## 13. Delivery phases and timeline

| Phase | Weeks | Focus | Key deliverables |
|-------|-------|-------|------------------|
| **1** | — | Account dashboard | KPIs, table, kanban, job links — **demo shipped** |
| **2a** | 1–2 | Foundation | API, DB, auth, account CRUD |
| **2b** | 3–4 | Account Home | Create account, profile, onboarding upload + status |
| **3** | 5–6 | Portfolio | Blanks, artwork, suppliers, dropdowns |
| **4a** | 7–9 | Samples core | Sample CRUD, decor conditional forms, approval |
| **4b** | 10 | Samples handoff | Costing, job link, multi-location delivery |
| **5a** | 11–12 | Pricing & PO | Pricing tab, PO attach, shortages |
| **5b** | 13 | Xero spike | Invoice link by job number |
| **6a** | 14 | Comms | Chat, @mentions, notifications, activity feed |
| **6b** | 15–16 | Roles & automation | RBAC gates, job intake pre-fill, UAT |

**Estimated total:** 14–16 weeks from Phase 2a start.

---

## 14. Risks and mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Scope creep vs Phase 1 demo expectations | High | High | Phased delivery; Phase 1 remains usable throughout |
| Duplicate data entry persists | High | Medium | Pre-fill automation as Phase 6 priority; link don't copy |
| Sample form complexity (decor sub-flows) | High | High | Early prototype with Claire/Izzy; progressive disclosure UI |
| Customer name inconsistencies | High | Medium | Customer master in Phase 2; alias merge backlog |
| Airtable / Xero / Comgem integration delays | Medium | Medium | Manual status toggle MVP; integrate incrementally |
| Role boundaries unclear (sales vs merch) | Medium | High | Role-definition session before Phase 4 build |
| Stale Job Tracker data | High | Medium | Show data-as-of; Odoo sync long-term |
| Team resists new tool | Medium | Low | Team interviews showed strong appetite; involve users in UAT |

---

## 15. Dependencies

- Shanza follow-up document: pipeline tab names, field list, role matrix, supplier dropdowns
- Job Tracker canonical dataset (Google Sheet export / future Odoo sync)
- Job intake form (`/job-intake`) for pre-fill target
- Airtable schema for credit-check workflow
- Xero API access and existing invoice workflow
- Odoo / Comgem integration feasibility (Edward + dev team)
- Operational definitions ([definitions.md](./definitions.md))

---

## 16. Open questions

1. Canonical repo: `pixelgenie` vs `polerie-demo`?
2. Job Tracker: continue Sheets import or wait for Odoo?
3. Sample job creation: extend `/job-intake` or separate merch flow?
4. Parent/sub-account: confirm Warner → artists model with sales
5. Should quiet accounts hide from default list view?
6. When Odoo goes live, is `customer_client_name` or CRM `accounts.id` the canonical key?
7. Comgem chat: API available or manual link only?
8. Sample invoicing: who approves write-off for photo-only samples?

---

## 17. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product / Sponsor | | | |
| Merchandising lead (Shanza) | | | |
| Operations (Edward Lewell) | | | |
| Engineering (Amin Ghasemi) | | | |

---

## Appendix A — Phase 1 metric calculation reference

```
accounts           = COUNT(DISTINCT customer_client_name) WHERE name != ''
open_jobs          = COUNT(jobs) WHERE is_open(job)
pending_approval   = COUNT(jobs) WHERE approval_status ILIKE '%pending%'
pipeline_value     = SUM(job_value(job)) WHERE is_open(job)
active_accounts    = COUNT(accounts) WHERE health = 'active'
at_risk_accounts   = COUNT(accounts) WHERE health = 'at-risk'
```

## Appendix B — Sample decor conditional fields

| Decor method | Additional fields |
|--------------|-------------------|
| DTG | Placement (front/back/both), artwork numbers |
| Screen | Screens set up, # screens, # colours, screen artwork refs |
| Embroidery | Placement, artwork ref |
| DTF | Supplier (from portfolio), artwork ref |
| Stickers | Placement, artwork ref |
| Other | Free-text specification |

**Backneck (all methods):** print / heat transfer / none  
**Branding (all methods):** label removal, wash/care, special instructions

## Appendix C — Related documents

- [CRM_USER_STORIES.md](./CRM_USER_STORIES.md) — Epics and acceptance criteria
- [PRD.md](./PRD.md) — DTG Dashboard PRD
- [BUILD_PLAN.md](./BUILD_PLAN.md) — DTG implementation plan
- [definitions.md](./definitions.md) — Operational definitions workshop

## Appendix D — Demo implementation reference (Phase 1)

| Area | Path | Status |
|------|------|--------|
| CRM page | `dashboard/src/pages/CrmPage.tsx` | ✅ |
| KPI bar | `dashboard/src/components/crm/CrmKpiBar.tsx` | ✅ |
| Account table / kanban | `dashboard/src/components/crm/CrmAccountsSection.tsx` | ✅ |
| Account detail panel | `dashboard/src/components/crm/CrmCustomerDetailPanel.tsx` | ✅ Partial |
| Aggregation logic | `dashboard/src/utils/crm.ts` | ✅ |
| CRM context (profiles, notes) | `dashboard/src/context/CrmContext.tsx` | ✅ localStorage |
| Shared job data | `dashboard/src/context/JobsContext.tsx` | ✅ |
