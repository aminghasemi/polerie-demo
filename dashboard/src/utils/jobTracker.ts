import type { Job } from '../types/jobTracker'

export function approvalStatusStyle(status: string): string {
  const s = status.toLowerCase()
  if (s.includes('approved')) return 'bg-emerald-100 text-emerald-800 ring-emerald-200'
  if (s.includes('pending')) return 'bg-amber-100 text-amber-800 ring-amber-200'
  if (s.includes('hold')) return 'bg-slate-200 text-slate-700 ring-slate-300'
  if (s.includes('cancel')) return 'bg-red-100 text-red-800 ring-red-200'
  return 'bg-surface text-ink-muted ring-border'
}

export function jobStageStyle(stage: string): string {
  const s = stage.toLowerCase()
  if (s.includes('completed') || s.includes('dispatched'))
    return 'bg-teal-100 text-teal-800 ring-teal-200'
  if (s.includes('production') || s.includes('progress'))
    return 'bg-violet-100 text-violet-800 ring-violet-200'
  if (s.includes('packing')) return 'bg-sky-100 text-sky-800 ring-sky-200'
  if (s.includes('not started') || s.includes('planning'))
    return 'bg-slate-100 text-slate-600 ring-slate-200'
  return 'bg-surface text-ink-muted ring-border'
}

export function priorityStyle(priority: string): string {
  const s = priority.toLowerCase()
  if (s === 'high') return 'bg-red-100 text-red-800 ring-red-200'
  if (s === 'normal') return 'bg-slate-100 text-slate-700 ring-slate-200'
  if (s === 'low') return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
  return 'bg-surface text-ink-muted ring-border'
}

export function dueDaysBadgeStyle(days: string): string {
  const n = parseInt(days, 10)
  if (Number.isNaN(n)) return 'bg-surface text-muted ring-border'
  if (n < 0) return 'bg-red-100 text-red-800 ring-red-200'
  if (n <= 3) return 'bg-amber-100 text-amber-800 ring-amber-200'
  return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
}

export function parseDueDays(days: string): number | null {
  const n = parseInt(days, 10)
  return Number.isNaN(n) ? null : n
}

export function isJobOverdue(job: Job): boolean {
  const n = parseDueDays(job.due_days ?? '')
  return n !== null && n < 0
}

export type QuickFilter = 'all' | 'pending' | 'approved' | 'on_hold' | 'overdue' | 'high_priority'

export function matchesQuickFilter(job: Job, filter: QuickFilter): boolean {
  const status = (job.approval_status ?? '').toLowerCase()
  switch (filter) {
    case 'all':
      return true
    case 'pending':
      return status.includes('pending')
    case 'approved':
      return status.includes('approved')
    case 'on_hold':
      return status.includes('hold')
    case 'overdue':
      return isJobOverdue(job)
    case 'high_priority':
      return (job.priority_level ?? '').toLowerCase() === 'high'
  }
}

export function jobSearchText(job: Job): string {
  return [
    job.job_number,
    job.customer_client_name,
    job.job_description,
    job.merchandiser,
    job.order_number,
    job.job_stage,
    job.operations_required,
    job.order_channel,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export function sortJobs(jobs: Job[], key: string, dir: 'asc' | 'desc'): Job[] {
  return [...jobs].sort((a, b) => {
    const av = (a[key] ?? '').toLowerCase()
    const bv = (b[key] ?? '').toLowerCase()
    const an = parseFloat(av)
    const bn = parseFloat(bv)
    let cmp: number
    if (!Number.isNaN(an) && !Number.isNaN(bn) && av !== '' && bv !== '') {
      cmp = an - bn
    } else {
      cmp = av.localeCompare(bv, undefined, { numeric: true })
    }
    return dir === 'asc' ? cmp : -cmp
  })
}

export interface JobTrackerStats {
  total: number
  pending: number
  approved: number
  onHold: number
  overdue: number
  highPriority: number
}

export function computeJobStats(jobs: Job[]): JobTrackerStats {
  return {
    total: jobs.length,
    pending: jobs.filter((j) => matchesQuickFilter(j, 'pending')).length,
    approved: jobs.filter((j) => matchesQuickFilter(j, 'approved')).length,
    onHold: jobs.filter((j) => matchesQuickFilter(j, 'on_hold')).length,
    overdue: jobs.filter((j) => isJobOverdue(j)).length,
    highPriority: jobs.filter((j) => matchesQuickFilter(j, 'high_priority')).length,
  }
}

export function merchandiserInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
