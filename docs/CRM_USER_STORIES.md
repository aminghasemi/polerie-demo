# User Stories — Pixelgenie Merchandising CRM

**Version:** 2.0  
**Status:** Draft  
**Date updated:** 8 July 2026  
**Workshop source:** CRM requirements workshop — 8 July 2026  
**Related:** [CRM_PRD.md](./CRM_PRD.md) · [PRD.md](./PRD.md) · [BUILD_PLAN.md](./BUILD_PLAN.md)

---

## Story format

Each story follows:

> **As a** [persona], **I want** [capability], **so that** [outcome].

Acceptance criteria use **Given / When / Then** where helpful. Story IDs use the `US-C` prefix.

**Priority:** P0 = phase blocker, P1 = should-have, P2 = nice-to-have / later phase

**Phase mapping:**

| Phase | Epics |
|-------|-------|
| 1 (shipped) | C1–C7 |
| 2 | C9–C10 |
| 3 | C11 |
| 4 | C12–C13 |
| 5 | C14–C15 |
| 6 | C16–C18 |
| 7 | C19 |

---

## Epic C1 — Discovery and data foundations

### US-C1.1 — Agree CRM account definition

**As a** merchandising lead,  
**I want** a clear rule for what counts as a CRM account,  
**so that** account counts match how the business thinks about customers.

**Priority:** P0 · **Phase:** 1  
**Status:** ✅ Demo (job-name derived); 🔄 Phase 2 extends to first-class records

**Acceptance criteria:**
- [x] Account = distinct `customer_client_name` documented (Phase 1)
- [ ] Phase 2: account created by sales before first job exists
- [ ] Blank or null customer names excluded from CRM
- [ ] Known alias cases documented for cleanup

---

### US-C1.2 — Agree health and pipeline rules

**As an** operations manager,  
**I want** written rules for account health and pipeline value,  
**so that** "at risk" and pipeline £ are trusted.

**Priority:** P0 · **Phase:** 1  
**Status:** ✅ Implemented in demo

**Acceptance criteria:**
- [x] Health rules: at risk (overdue), quiet (no open jobs), active, pending approval
- [x] Open job rule: stage excludes dispatched/completed
- [x] Pipeline formula: `quantity × sell price` on open jobs only

---

### US-C1.3 — Single job data source for CRM

**As a** developer,  
**I want** CRM to read from the same job list as Job Tracker,  
**so that** account metrics never disagree with the tracker.

**Priority:** P0 · **Phase:** 1  
**Status:** ✅ Implemented

**Acceptance criteria:**
- [x] CRM and Job Tracker use one shared jobs provider/context
- [x] Jobs submitted via job intake appear in CRM without separate import
- [ ] Phase 2+: CRM account records link to jobs by job number without duplicating job rows

---

## Epic C2 — Navigation and entry

### US-C2.1 — Open CRM from home

**As a** merchandiser,  
**I want** to choose CRM from the app home page,  
**so that** I can reach customer accounts without memorising a URL.

**Priority:** P0 · **Phase:** 1 · **Status:** ✅ Implemented

**Acceptance criteria:**
- [x] Home page shows CRM card navigating to `/crm`
- [x] Visually consistent with other home area cards

---

### US-C2.2 — CRM header navigation

**As a** user inside CRM,  
**I want** clear navigation back to Home and within CRM,  
**so that** I can move between areas without using the browser back button.

**Priority:** P0 · **Phase:** 1 · **Status:** ✅ Implemented

**Acceptance criteria:**
- [x] Header shows Home and CRM links on `/crm`
- [x] CRM nav item active/highlighted on CRM page

---

## Epic C3 — Headline KPIs

### US-C3.1 — View CRM headline KPIs

**As an** account manager,  
**I want** six headline KPI cards on the CRM page,  
**so that** I get an instant view of portfolio health.

**Priority:** P0 · **Phase:** 1 · **Status:** ✅ Implemented

**KPIs:** Accounts, Active, Open jobs, Pending approval, Pipeline value, At risk

**Acceptance criteria:**
- [x] All six KPIs visible above account table
- [x] Values match CRM PRD Appendix A
- [x] Pipeline value formatted as GBP

---

### US-C3.2 — KPIs update when jobs change

**As a** merchandiser,  
**I want** CRM KPIs to update after I submit a new job via intake,  
**so that** I see the impact of new work immediately.

**Priority:** P0 · **Phase:** 1 · **Status:** ✅ Implemented

**Acceptance criteria:**
- [x] New job intake updates account/job counts in same session
- [x] Pending approval KPI includes new pending jobs
- [x] Pipeline value increases when new open job has quantity and sell price

---

## Epic C4 — Customer account table

### US-C4.1 — Browse customer accounts

**As a** customer service agent,  
**I want** a table of all customer accounts with key metrics,  
**so that** I can scan workload by customer.

**Priority:** P0 · **Phase:** 1 · **Status:** ✅ Implemented

**Acceptance criteria:**
- [x] Table shows: Customer, Merchandiser, Channel, Open jobs, Pipeline, Total jobs, Health, Last activity
- [x] Default sort: pipeline value descending
- [x] Row click opens account detail

---

### US-C4.2 — Search customer accounts

**As a** merchandiser,  
**I want** to search accounts by name, merchandiser, or channel,  
**so that** I can find a customer quickly.

**Priority:** P0 · **Phase:** 1 · **Status:** ✅ Implemented

**Acceptance criteria:**
- [x] Real-time search across customer, merchandiser, channel
- [x] Empty results show empty state

---

### US-C4.3 — Sort customer accounts

**As an** operations manager,  
**I want** to sort the account table by key columns,  
**so that** I can prioritise the largest or busiest accounts.

**Priority:** P1 · **Phase:** 1 · **Status:** ✅ Implemented

**Acceptance criteria:**
- [x] Column header toggles sort asc/desc
- [x] Sort persists while search filter applied

---

### US-C4.4 — Account health badges

**As an** operations manager,  
**I want** each account to show a health badge,  
**so that** I can spot at-risk and quiet accounts at a glance.

**Priority:** P0 · **Phase:** 1 · **Status:** ✅ Implemented

**Acceptance criteria:**
- [x] Badge shows Active, At risk, Pending approval, or Quiet
- [x] Colour coding: green / red / amber / grey

---

### US-C4.5 — Kanban view by account status

**As a** merchandiser,  
**I want** a kanban board grouped by account health,  
**so that** I can visualise portfolio status at a glance.

**Priority:** P1 · **Phase:** 1 · **Status:** ✅ Implemented

**Acceptance criteria:**
- [x] Toggle between table and kanban views
- [x] Cards grouped by health status

---

## Epic C5 — Account detail and jobs (Phase 1)

### US-C5.1 — View account detail

**As a** merchandiser,  
**I want** to open an account and see summary metrics and recent jobs,  
**so that** I understand the account without leaving CRM.

**Priority:** P0 · **Phase:** 1 · **Status:** ✅ Implemented (overview panel)

**Acceptance criteria:**
- [x] Panel shows account name, health, merchandiser, channel
- [x] Metrics: open jobs, pending approval, overdue jobs, pipeline value
- [x] Recent jobs listed with job number, description, approval status, stage
- [ ] Phase 2+: replaced by full tabbed account workspace (US-C10.1)

---

### US-C5.2 — Open job from account detail

**As a** merchandiser,  
**I want** to open a recent job from the account panel,  
**so that** I can see full job details in one click.

**Priority:** P0 · **Phase:** 1 · **Status:** ✅ Implemented

**Acceptance criteria:**
- [x] Clicking a job opens shared Job Detail modal
- [x] Job detail shows same fields as Job Tracker

---

### US-C5.3 — Jump to Job Tracker for customer

**As a** customer service agent,  
**I want** a link from the account panel to all jobs for that customer,  
**so that** I can work the full job list when needed.

**Priority:** P0 · **Phase:** 1 · **Status:** ✅ Implemented

**Acceptance criteria:**
- [x] "View all in Job Tracker" navigates to `/job-tracker?customer={name}`
- [x] Job Tracker search pre-filled with customer name

---

### US-C5.4 — Edit account profile

**As a** sales account manager,  
**I want** to store contact and address details per account,  
**so that** relationship context lives in CRM.

**Priority:** P1 · **Phase:** 1 · **Status:** ✅ Demo (localStorage); 🔄 Phase 2 persists to DB

**Acceptance criteria:**
- [x] Editable fields: contact name, email, phone, address, payment terms
- [ ] Phase 2: separate delivery and billing addresses
- [ ] Phase 2: data persisted to backend, not localStorage only

---

### US-C5.5 — Internal notes per account

**As a** merchandiser,  
**I want** to add internal notes to an account,  
**so that** context is shared without email.

**Priority:** P1 · **Phase:** 1 · **Status:** ✅ Demo (localStorage); superseded by US-C16.x chat in Phase 6

**Acceptance criteria:**
- [x] Add, view, delete notes per account
- [ ] Phase 6: notes integrated into activity feed

---

## Epic C6 — Cross-module consistency

### US-C6.1 — Merchandiser and channel on accounts

**Priority:** P1 · **Phase:** 1 · **Status:** ✅ Implemented

### US-C6.2 — Last activity date

**Priority:** P1 · **Phase:** 1 · **Status:** ✅ Implemented

### US-C6.3 — CRM data freshness

**Priority:** P1 · **Phase:** 1 · **Status:** Partial (demo timestamp)

**Acceptance criteria:**
- [x] "Data as of" visible in app header
- [ ] Live sync timestamp from Odoo/sheet refresh (production)

---

## Epic C7 — Launch and quality (Phase 1)

### US-C7.1 — CRM UAT spot-check

**Priority:** P0 · **Phase:** 1 · **Status:** ☐ Pending formal UAT

### US-C7.2 — CRM scope communication

**Priority:** P1 · **Phase:** 1 · **Status:** Partial — update copy for Phase 2+ scope

---

## Epic C9 — Foundation and account creation (Phase 2)

### US-C9.1 — Backend API and database

**As a** developer,  
**I want** a PostgreSQL-backed API for CRM entities,  
**so that** account data persists beyond the browser session.

**Priority:** P0 · **Phase:** 2

**Acceptance criteria:**
- [ ] REST or GraphQL API for accounts, profiles, samples, etc.
- [ ] PostgreSQL schema per CRM PRD §8.2
- [ ] Migrations and seed data for development

---

### US-C9.2 — Authentication and role-based access

**As an** admin,  
**I want** users to sign in with Google Workspace and have assigned roles,  
**so that** only authorised staff access CRM and permissions match their job.

**Priority:** P0 · **Phase:** 2

**Roles:** Sales, Merchandiser, Accounts, Ops, Production (read-only), Admin

**Acceptance criteria:**
- [ ] Google SSO login
- [ ] Role assigned per user
- [ ] Unauthenticated users cannot access CRM routes

---

### US-C9.3 — Create new account

**As a** sales account manager,  
**I want** to create a new customer account by entering the account name,  
**so that** I can start onboarding before any jobs exist.

**Priority:** P0 · **Phase:** 2  
**Depends on:** US-C9.1, US-C9.2

**Acceptance criteria:**
- [ ] "New account" button on CRM account list
- [ ] Minimum field: account name
- [ ] New account opens Account Home tab
- [ ] Account appears in account list immediately

---

### US-C9.4 — Parent company and sub-accounts

**As a** sales account manager,  
**I want** to create sub-accounts under a parent company (e.g. Warner → artist),  
**so that** related clients are grouped without mixing their requirements.

**Priority:** P1 · **Phase:** 2  
**Depends on:** US-C9.3

**Acceptance criteria:**
- [ ] Parent account type selectable at creation
- [ ] Sub-account links to `parent_account_id`
- [ ] Account list filterable by parent company
- [ ] Sub-accounts have independent portfolio and samples

---

### US-C9.5 — Merge Job Tracker accounts with CRM accounts

**As a** merchandiser,  
**I want** the account list to show both manually created accounts and accounts derived from jobs,  
**so that** existing customers and new leads appear in one place.

**Priority:** P0 · **Phase:** 2  
**Depends on:** US-C9.3, US-C1.3

**Acceptance criteria:**
- [ ] Job-derived accounts appear when `customer_client_name` has no CRM record
- [ ] Option to link job-derived name to existing CRM account (alias merge)
- [ ] KPIs include all accounts

---

## Epic C10 — Account Home and onboarding (Phase 2)

### US-C10.1 — Account Home tab

**As a** sales account manager,  
**I want** an Account Home tab as the first page for each account,  
**so that** all core customer details live in one place.

**Priority:** P0 · **Phase:** 2  
**Depends on:** US-C9.3

**Acceptance criteria:**
- [ ] Tab shows: company name, contact name, email, phone
- [ ] Separate delivery address and billing address fields
- [ ] Payment terms field
- [ ] Client invoice/PO portal URL and access notes
- [ ] Tab is default when opening an account

---

### US-C10.2 — Upload customer onboarding form

**As a** sales account manager,  
**I want** to upload the signed customer onboarding form,  
**so that** accounts can perform the credit check without email attachments.

**Priority:** P0 · **Phase:** 2  
**Depends on:** US-C10.1

**Acceptance criteria:**
- [ ] Upload PDF or document to Account Home
- [ ] Onboarding status: draft → sent → received → credit_check → verified
- [ ] Status visible on account list (badge or filter)
- [ ] Portfolio and Samples tabs locked until status = verified

---

### US-C10.3 — Airtable credit-check handoff

**As an** accounts team member,  
**I want** onboarding submissions to reach Airtable for credit check,  
**so that** Ahmed can process them in the existing workflow.

**Priority:** P1 · **Phase:** 2  
**Depends on:** US-C10.2

**Acceptance criteria:**
- [ ] On upload/status change, record created or updated in Airtable
- [ ] Airtable record ID stored on onboarding form
- [ ] MVP fallback: manual status toggle if API not ready

---

### US-C10.4 — Onboarding verified notification

**As a** sales account manager,  
**I want** an email when my customer's account is credit-verified,  
**so that** I know I can proceed with orders.

**Priority:** P1 · **Phase:** 2  
**Depends on:** US-C10.2

**Acceptance criteria:**
- [ ] Email sent to account owner when status changes to verified
- [ ] Email includes account name and link to CRM account

---

## Epic C11 — Customer Portfolio (Phase 3)

### US-C11.1 — Portfolio blanks and tech packs

**As a** sales account manager,  
**I want** to record which blanks and tech packs a customer uses,  
**so that** merch does not need to ask for this on every order.

**Priority:** P0 · **Phase:** 3

**Acceptance criteria:**
- [ ] Add/edit/remove blank entries: code, name, tech pack link, notes
- [ ] Multiple blanks per account supported

---

### US-C11.2 — Portfolio decor and artwork

**As a** merchandiser,  
**I want** to see a customer's decor preferences and artwork folder links,  
**so that** I can start samples without searching email.

**Priority:** P0 · **Phase:** 3

**Acceptance criteria:**
- [ ] Decor preferences: DTG, screen, embroidery, DTF, stickers, other
- [ ] Artwork folder link(s) attachable per account
- [ ] Packaging preferences: swing tags, wash/care, packaging type
- [ ] Branding notes: label removal, custom wash/care

---

### US-C11.3 — Portfolio suppliers

**As a** merchandiser,  
**I want** to record external suppliers for DTF, swing tags, blanks, and barcodes,  
**so that** ordering information is always available.

**Priority:** P0 · **Phase:** 3

**Acceptance criteria:**
- [ ] Supplier entries: category, name, phone, quantity/notes
- [ ] Categories: DTF, swing tags, blanks, barcodes
- [ ] Dropdown selectors for common suppliers (admin-maintained list)

---

### US-C11.4 — Portfolio defaults pre-fill samples

**As a** sales account manager,  
**I want** new samples to inherit portfolio defaults,  
**so that** I do not re-enter standing customer requirements.

**Priority:** P1 · **Phase:** 3  
**Depends on:** US-C11.1, US-C12.1

**Acceptance criteria:**
- [ ] Creating a sample pre-fills blank, decor, and supplier from portfolio
- [ ] Pre-filled values are overridable per sample

---

## Epic C12 — Sample workflow (Phase 4)

### US-C12.1 — Create and manage samples

**As a** sales account manager,  
**I want** to create individual sample records (Sample 1, Sample 2, …) per account,  
**so that** each style can be tracked and approved independently.

**Priority:** P0 · **Phase:** 4

**Acceptance criteria:**
- [ ] Add sample with style name and auto-incremented sample number
- [ ] Sample list on Samples tab with status badge
- [ ] Samples independent: one approved, another need resample

---

### US-C12.2 — Sample blank and decor specification

**As a** sales account manager,  
**I want** to specify blank code, name, colour, and decor method per sample,  
**so that** merch has complete specification before starting work.

**Priority:** P0 · **Phase:** 4  
**Depends on:** US-C12.1

**Acceptance criteria:**
- [ ] Fields: blank code, name, colour
- [ ] Decor method: DTG, Screen, Embroidery, DTF, Stickers, Other
- [ ] Backneck: print / heat transfer / none
- [ ] Branding: label removal, wash/care, special instructions

---

### US-C12.3 — Decor-method conditional fields

**As a** merchandiser,  
**I want** additional fields to appear based on decor method,  
**so that** I only see relevant questions (DTG placement vs screen colours).

**Priority:** P0 · **Phase:** 4  
**Depends on:** US-C12.2

**Acceptance criteria:**
- [ ] **DTG:** front only / back only / both; artwork numbers
- [ ] **Screen:** screens set up (Y/N), # screens, # colours, screen artwork refs
- [ ] **DTF:** supplier pre-filled from portfolio
- [ ] Fields hidden when not applicable to selected decor method

---

### US-C12.4 — Sample delivery locations

**As a** sales account manager,  
**I want** to specify single or multiple delivery locations per sample,  
**so that** production knows where to ship.

**Priority:** P1 · **Phase:** 4  
**Depends on:** US-C12.1

**Acceptance criteria:**
- [ ] Toggle: single location vs multiple locations
- [ ] Address fields per location
- [ ] Multiple locations supported (add/remove)

---

### US-C12.5 — Sample approval status

**As a** merchandiser,  
**I want** to set each sample as approved, not approved, or need resample,  
**so that** we know which samples can proceed to production.

**Priority:** P0 · **Phase:** 4  
**Depends on:** US-C12.1

**Acceptance criteria:**
- [ ] Status options: draft, in_progress, approved, not_approved, need_resample
- [ ] Status badge visible on sample list and detail
- [ ] Approved status unlocks In Production tab for job link

---

### US-C12.6 — Sample iterations and change requests

**As a** merchandiser,  
**I want** to log iterations when a sample needs resampling,  
**so that** change history is captured and visible to the team.

**Priority:** P0 · **Phase:** 4  
**Depends on:** US-C12.5

**Acceptance criteria:**
- [ ] "Need resample" creates new iteration with version number
- [ ] Each iteration records: change description, author, timestamp
- [ ] Iteration history visible on sample detail

---

### US-C12.7 — Sample costing

**As a** sales account manager,  
**I want** to record blank cost, margin, and sell price per sample,  
**so that** agreed pricing is captured before production.

**Priority:** P0 · **Phase:** 4  
**Depends on:** US-C12.1

**Acceptance criteria:**
- [ ] Fields: blank cost price, margin %, calculated sell price
- [ ] Front / back price breakdown where applicable
- [ ] Sell price overridable manually

---

### US-C12.8 — Sample invoicing options

**As a** sales account manager,  
**I want** to record whether a sample is invoiced now, bundled into production, or photo-only,  
**so that** sample costs are tracked even when not charged to the customer.

**Priority:** P1 · **Phase:** 4  
**Depends on:** US-C12.7

**Acceptance criteria:**
- [ ] Options: invoice now / include in production invoice / photo-only (no charge)
- [ ] Cost incurred tracked regardless of invoicing option

---

### US-C12.9 — Attach PO to sample

**As a** sales account manager,  
**I want** to attach a customer PO to a sample when received,  
**so that** PO reference is available before production.

**Priority:** P1 · **Phase:** 4  
**Depends on:** US-C12.1

**Acceptance criteria:**
- [ ] Upload PO document on sample record
- [ ] PO number field
- [ ] Note: some clients send PO with order; others only after dispatch

---

## Epic C13 — Production handoff (Phase 4)

### US-C13.1 — Link sample to Job Tracker job number

**As a** merchandiser,  
**I want** to copy a job number from Job Tracker into the approved sample record,  
**so that** CRM tracks which job was created from this sample without duplicating job data.

**Priority:** P0 · **Phase:** 4  
**Depends on:** US-C12.5

**Acceptance criteria:**
- [ ] Job number field on approved sample
- [ ] Job number is clickable link opening Job Tracker detail
- [ ] No duplicate job fields stored in CRM — reference only

---

### US-C13.2 — In Production tab

**As a** merchandiser,  
**I want** an In Production tab showing job number links for this account,  
**so that** I can track which samples have moved to production.

**Priority:** P0 · **Phase:** 4  
**Depends on:** US-C13.1

**Acceptance criteria:**
- [ ] Tab lists samples with linked job numbers
- [ ] Each entry links to Job Tracker
- [ ] No job data duplicated — links only

---

### US-C13.3 — Sales-to-merch handoff gate

**As a** merchandiser,  
**I want** to see when a sample spec is complete and ready for my action,  
**so that** I know when to start sample work without email chasing.

**Priority:** P1 · **Phase:** 4  
**Depends on:** US-C12.2

**Acceptance criteria:**
- [ ] Sales marks sample as "Ready for merch" (or status = in_progress)
- [ ] Merchandiser receives notification
- [ ] Sample spec fields validated as complete before handoff

---

## Epic C14 — Pricing (Phase 5)

### US-C14.1 — Agreed pricing per order

**As a** sales account manager,  
**I want** a Pricing tab with agreed cost, margin, and sell price per order,  
**so that** anyone can find pricing without searching email.

**Priority:** P0 · **Phase:** 5

**Acceptance criteria:**
- [ ] Fields: blank cost, margin %, sell price, front/back breakdown
- [ ] Link to sample and/or job number
- [ ] Audit: agreed date, agreed by
- [ ] Pricing findable in < 10 s (UAT)

---

### US-C14.2 — Upload pricing spreadsheet

**As a** sales account manager,  
**I want** to upload an Excel pricing spreadsheet to the Pricing tab,  
**so that** I can use my existing costing workflow.

**Priority:** P1 · **Phase:** 5  
**Depends on:** US-C14.1

**Acceptance criteria:**
- [ ] Upload Excel file to pricing record
- [ ] File downloadable by other users
- [ ] Same pattern as Odoo document attachment

---

### US-C14.3 — Pre-fill job intake from agreed pricing

**As a** merchandiser,  
**I want** sell and cost price pre-filled in job intake from CRM pricing,  
**so that** I do not re-enter prices when creating a job.

**Priority:** P0 · **Phase:** 5  
**Depends on:** US-C14.1, US-C13.1

**Acceptance criteria:**
- [ ] Job intake form pre-fills `sell_price_per_unit` and `cost_price_per_unit` from CRM
- [ ] Pre-fill triggered when job number or sample is linked

---

## Epic C15 — POs and Invoices (Phase 5)

### US-C15.1 — PO management

**As a** sales account manager,  
**I want** a POs & Invoices tab to attach and track purchase orders,  
**so that** PO references are centralised per account.

**Priority:** P0 · **Phase:** 5

**Acceptance criteria:**
- [ ] Upload PO document; PO number field
- [ ] Link PO to sample and/or job number
- [ ] Log shortages and adjustments
- [ ] Link to client portal URL from Account Home

---

### US-C15.2 — Invoice status tracking

**As an** accounts team member,  
**I want** to track invoice status per job in CRM,  
**so that** sales and merch know if an order has been invoiced.

**Priority:** P1 · **Phase:** 5  
**Depends on:** US-C15.1

**Acceptance criteria:**
- [ ] Invoice status: draft / sent / paid (manual MVP)
- [ ] Status linked to job number
- [ ] Visible on account POs & Invoices tab

---

### US-C15.3 — Xero invoice link

**As an** accounts team member,  
**I want** CRM invoices linked to Xero by job number,  
**so that** invoicing stays in Xero but is visible from CRM.

**Priority:** P2 · **Phase:** 5b  
**Depends on:** US-C15.2

**Acceptance criteria:**
- [ ] Xero API explored and integration approach documented
- [ ] Invoice in Xero linkable from CRM by job reference
- [ ] MVP: manual link URL if API not ready

---

## Epic C16 — Communication and collaboration (Phase 6)

### US-C16.1 — Per-stage chat threads

**As an** account manager,  
**I want** a chat thread on each CRM tab (Home, Portfolio, Sample, Pricing),  
**so that** conversations stay in context instead of email.

**Priority:** P0 · **Phase:** 6

**Acceptance criteria:**
- [ ] Chat thread per context (tab or sample)
- [ ] Messages timestamped with author name
- [ ] Thread visible alongside tab content (sidebar or inline)

---

### US-C16.2 — @mention colleagues

**As a** merchandiser,  
**I want** to @mention colleagues in a chat message,  
**so that** the right person is notified without forwarding emails.

**Priority:** P0 · **Phase:** 6  
**Depends on:** US-C16.1

**Acceptance criteria:**
- [ ] @mention autocomplete for team members
- [ ] Mentioned user receives email notification
- [ ] Mentioned user can click link to exact chat thread

---

### US-C16.3 — Account activity feed

**As an** operations manager,  
**I want** a chronological activity feed per account,  
**so that** I can see all status changes, messages, and uploads in one place.

**Priority:** P1 · **Phase:** 6  
**Depends on:** US-C16.1

**Acceptance criteria:**
- [ ] Activity tab shows: status changes, chat messages, file uploads, job links
- [ ] Newest first
- [ ] Filterable by event type

---

### US-C16.4 — Status change notifications

**As a** sales account manager,  
**I want** email notifications on key status changes (onboarding verified, sample approved),  
**so that** I stay informed without checking CRM constantly.

**Priority:** P1 · **Phase:** 6

**Acceptance criteria:**
- [ ] Email on: onboarding verified, sample approved, sample need resample
- [ ] Email includes account name, event, and CRM link

---

## Epic C17 — Roles and automation (Phase 6)

### US-C17.1 — Role-based tab permissions

**As an** admin,  
**I want** edit permissions enforced per role and tab,  
**so that** sales and merch boundaries are clear in the system.

**Priority:** P0 · **Phase:** 6  
**Depends on:** US-C9.2

**Acceptance criteria:**
- [ ] Sales can edit: Home, Portfolio, Samples (spec), Pricing, PO upload
- [ ] Merch can edit: Samples (execution, approval), In Production link
- [ ] Accounts can edit: onboarding verification, invoice status
- [ ] Production: read-only on all CRM tabs
- [ ] Unauthorized edits blocked with clear message

---

### US-C17.2 — Pre-fill job intake from approved sample

**As a** merchandiser,  
**I want** job intake pre-filled from an approved sample,  
**so that** I do not re-enter customer, blank, decor, artwork, pricing, and addresses.

**Priority:** P0 · **Phase:** 6  
**Depends on:** US-C12.5, US-C14.3

**Acceptance criteria:**
- [ ] "Create job from sample" action on approved sample
- [ ] Job intake pre-fills: customer, blank, decor, artwork refs, pricing, delivery addresses
- [ ] ≥ 80% of intake fields auto-populated (UAT)
- [ ] Merch reviews and submits; no auto-submit

---

### US-C17.3 — At-risk account alerts

**As a** merchandiser,  
**I want** to be notified when an account becomes at risk,  
**so that** I can act before jobs miss delivery.

**Priority:** P2 · **Phase:** 6  
**Depends on:** US-C1.2

**Acceptance criteria:**
- [ ] Email or in-app notification when account health changes to at-risk
- [ ] Notification includes account name and overdue job count

---

## Epic C18 — Integrations (Phase 7)

### US-C18.1 — Odoo email sync exploration

**As a** developer,  
**I want** to assess whether Odoo can sync customer emails into CRM,  
**so that** we know if email integration is feasible.

**Priority:** P2 · **Phase:** 7

**Acceptance criteria:**
- [ ] Odoo off-the-shelf email module assessed
- [ ] Integration approach documented with effort estimate

---

### US-C18.2 — Comgem chat integration exploration

**As a** developer,  
**I want** to assess whether Comgem chat can link to CRM,  
**so that** customer chat is visible alongside internal threads.

**Priority:** P2 · **Phase:** 7

**Acceptance criteria:**
- [ ] Comgem API or export assessed
- [ ] Integration approach documented with effort estimate

---

### US-C18.3 — Account alias merging

**As an** operations manager,  
**I want** duplicate customer spellings merged into one account,  
**so that** workload is not split across name variants.

**Priority:** P2 · **Phase:** 7  
**Depends on:** US-C9.5

**Acceptance criteria:**
- [ ] Admin can merge two accounts
- [ ] Jobs, samples, and notes move to surviving account
- [ ] Merged alias redirects in search

---

## Release checklists

### Phase 1 — Account dashboard (demo)

| Epic | P0 stories | Status |
|------|------------|--------|
| C1 — Data | US-C1.1, US-C1.2, US-C1.3 | ✅ Demo |
| C2 — Navigation | US-C2.1, US-C2.2 | ✅ |
| C3 — KPIs | US-C3.1, US-C3.2 | ✅ |
| C4 — Accounts | US-C4.1, US-C4.2, US-C4.4 | ✅ |
| C5 — Detail | US-C5.1, US-C5.2, US-C5.3 | ✅ |
| C7 — Launch | US-C7.1 | ☐ UAT pending |

### Phase 2 — Foundation + Account Home

| Epic | P0 stories | Status |
|------|------------|--------|
| C9 — Foundation | US-C9.1, US-C9.2, US-C9.3, US-C9.5 | ☐ |
| C10 — Home | US-C10.1, US-C10.2 | ☐ |

### Phase 3 — Portfolio

| Epic | P0 stories | Status |
|------|------------|--------|
| C11 — Portfolio | US-C11.1, US-C11.2, US-C11.3 | ☐ |

### Phase 4 — Samples + Production handoff

| Epic | P0 stories | Status |
|------|------------|--------|
| C12 — Samples | US-C12.1–US-C12.3, US-C12.5–US-C12.7 | ☐ |
| C13 — Handoff | US-C13.1, US-C13.2 | ☐ |

### Phase 5 — Pricing + POs

| Epic | P0 stories | Status |
|------|------------|--------|
| C14 — Pricing | US-C14.1, US-C14.3 | ☐ |
| C15 — POs | US-C15.1 | ☐ |

### Phase 6 — Comms + Automation

| Epic | P0 stories | Status |
|------|------------|--------|
| C16 — Comms | US-C16.1, US-C16.2 | ☐ |
| C17 — Roles | US-C17.1, US-C17.2 | ☐ |

---

## Sprint allocation (Phase 2+)

| Sprint | Weeks | Stories |
|--------|-------|---------|
| **S0** | 1–2 | US-C9.1, US-C9.2, US-C9.3, US-C9.5 |
| **S1** | 3–4 | US-C10.1, US-C10.2, US-C10.3, US-C10.4 |
| **S2** | 5–6 | US-C11.1, US-C11.2, US-C11.3, US-C11.4 |
| **S3** | 7–9 | US-C12.1–US-C12.7, US-C12.9 |
| **S4** | 10 | US-C12.4, US-C12.8, US-C13.1, US-C13.2, US-C13.3 |
| **S5** | 11–12 | US-C14.1, US-C14.2, US-C14.3, US-C15.1, US-C15.2 |
| **S6** | 13 | US-C15.3 (Xero spike) |
| **S7** | 14 | US-C16.1, US-C16.2, US-C16.3, US-C16.4 |
| **S8** | 15–16 | US-C17.1, US-C17.2, US-C9.4, US-C7.1 (full UAT) |

---

## Traceability — demo implementation (Phase 1)

| Story | Status | Implementation |
|-------|--------|----------------|
| US-C2.1 | ✅ | `HomePage.tsx` |
| US-C2.2 | ✅ | `AppLayout.tsx` |
| US-C3.1 | ✅ | `CrmKpiBar.tsx` |
| US-C3.2 | ✅ | `JobsContext.tsx` + `crm.ts` |
| US-C4.1 | ✅ | `CrmCustomerTable.tsx` |
| US-C4.2 | ✅ | Table search |
| US-C4.3 | ✅ | Column sort |
| US-C4.4 | ✅ | `statusStyle` in `crm.ts` |
| US-C4.5 | ✅ | `CrmKanbanBoard.tsx` |
| US-C5.1 | ✅ | `CrmCustomerDetailPanel.tsx` |
| US-C5.2 | ✅ | `JobDetailModal` |
| US-C5.3 | ✅ | `/job-tracker?customer=` |
| US-C5.4 | ✅ | Account tab in detail panel (localStorage) |
| US-C5.5 | ✅ | Notes tab in detail panel (localStorage) |
| US-C6.1 | ✅ | `buildCrmCustomers` mode logic |
| US-C6.2 | ✅ | `lastActivityDate` in `crm.ts` |

**Phase 2+ stories:** Not yet implemented — require backend (US-C9.1).
