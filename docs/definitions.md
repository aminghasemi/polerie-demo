# Operational Definitions — Workshop Template

**Status:** Draft — complete in Phase 0 workshop  
**Related:** [PRD.md](./PRD.md) §7.3

Complete this document with operations and Odoo admin before development starts. Each row requires a **decision** and **sign-off**.

---

## D1 — Open order/job

**Question:** What counts as an open order/job?

| Option | Description | Selected? |
|--------|-------------|-----------|
| A | Sale order state not in terminal states | ☐ |
| B | Delivery not complete | ☐ |
| C | Custom DTG job model with `state != done` | ☐ |
| D | Other: _______________ | ☐ |

**Odoo states included in "open":**

```
(list states here)
```

**Odoo states excluded:**

```
(list states here)
```

**Signed off by:** _______________ **Date:** _______________

---

## D2 — Processed / completed

**Question:** What counts as processed/completed?

| Signal | Odoo field / rule | Selected? |
|--------|-------------------|-----------|
| Completion date | `________________` | ☐ |
| State equals | `________________` | ☐ |
| Delivery done | `________________` | ☐ |

**Signed off by:** _______________ **Date:** _______________

---

## D3 — Ageing date

**Question:** Which date is used to calculate age in days?

| Option | Field | Selected? |
|--------|-------|-----------|
| Order confirmation | | ☐ |
| Payment confirmation | | ☐ |
| Production start | | ☐ |
| Promised date | | ☐ |
| Other | | ☐ |

**Formula:** `age_days = TODAY - {field}` for open orders only.

**Aged threshold:** 5 days (fixed for Phase 1).

**Signed off by:** _______________ **Date:** _______________

---

## D4 — Stage mapping

**Question:** Map Odoo states/fields to dashboard stages.

| Dashboard stage | Odoo state(s) / rule |
|-----------------|----------------------|
| Awaiting Pick | |
| Printing | |
| Sorting / Packing | |
| Ready for Shipping | |
| Shipped / Completed | |

**Signed off by:** _______________ **Date:** _______________

---

## D5 — Blocked orders

**Question:** How are blocked orders identified?

| Option | Implementation | Selected? |
|--------|----------------|-----------|
| Custom field | `x_blocker_reason` on sale.order | ☐ |
| Tag | Tag name: `blocked` | ☐ |
| State | State = `blocked` or similar | ☐ |
| Other | | ☐ |

**Blocker reason field:** `________________`

**Signed off by:** _______________ **Date:** _______________

---

## D6 — Sales value

**Odoo field for order value:** `________________` (e.g. `amount_total`)

**Currency:** `________________`

**Signed off by:** _______________ **Date:** _______________

---

## D7 — Calendar

**Timezone:** Europe/London  
**Week start:** Monday ☐ / Sunday ☐  
**"This week" means:** Mon 00:00 – Sun 23:59 ☐

**Signed off by:** _______________ **Date:** _______________

---

## D8 — Data refresh

**Sync frequency:** Hourly ☐ / Every 4 hours ☐ / Daily ☐  
**Business hours only:** Yes ☐ No ☐

**Signed off by:** _______________ **Date:** _______________
