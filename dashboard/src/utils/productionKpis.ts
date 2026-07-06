import type { ProductionKpis } from '../types/productionDashboard'
import type { Job } from '../types/jobTracker'
import { formatUkDate } from './jobIntake'

function parseCount(value: string): number {
  const n = parseInt(value.replace(/,/g, ''), 10)
  return Number.isNaN(n) ? 0 : n
}

export function mergeProductionKpis(base: ProductionKpis, submittedJobs: Job[]): ProductionKpis {
  if (submittedJobs.length === 0) return base

  const today = formatUkDate(new Date())
  const extraToday = submittedJobs.filter((j) => j.date_of_request === today).length
  const extraPending = submittedJobs.filter((j) =>
    (j.approval_status ?? '').toLowerCase().includes('pending'),
  ).length
  const extraQty = submittedJobs.reduce(
    (sum, j) => sum + parseCount(j.order_quantity ?? '0'),
    0,
  )

  return {
    ...base,
    newJobsToday: String(parseCount(base.newJobsToday) + extraToday),
    openJobs: String(parseCount(base.openJobs) + extraPending),
    backlogQuantity: String(parseCount(base.backlogQuantity) + extraQty),
  }
}
