import { parse, isValid } from 'date-fns'
import type { Job } from '../types/jobTracker'
import type {
  CrmAccountStatus,
  CrmCustomer,
  CrmCustomerProfile,
  CrmManualAccount,
  CrmStats,
} from '../types/crm'
import { EMPTY_CRM_PROFILE } from '../types/crm'
import { isJobOverdue } from './jobTracker'

function parseUkDate(value: string): Date | null {
  if (!value) return null
  const parsed = parse(value, 'dd/MM/yyyy', new Date())
  return isValid(parsed) ? parsed : null
}

function isOpenJob(job: Job): boolean {
  const stage = (job.job_stage ?? '').toLowerCase()
  return !stage.includes('dispatched') && !stage.includes('completed')
}

function parseNumber(value: string | undefined): number {
  if (!value) return 0
  const n = parseFloat(value.replace(/,/g, ''))
  return Number.isNaN(n) ? 0 : n
}

function jobValue(job: Job): number {
  const qty = parseNumber(job.order_quantity)
  const unit = parseNumber(job.sell_price_per_unit || job.f_sell_price)
  return qty * unit
}

export function accountStatus(
  overdueJobs: number,
  pendingApproval: number,
  openJobs: number,
): CrmAccountStatus {
  if (overdueJobs > 0) return 'at-risk'
  if (pendingApproval > 0) return 'pending-approval'
  if (openJobs > 0) return 'active'
  return 'quiet'
}

export const CRM_STATUS_ORDER: CrmAccountStatus[] = [
  'pending-approval',
  'active',
  'at-risk',
  'quiet',
]

export function buildCrmCustomers(jobs: Job[]): CrmCustomer[] {
  const byName = new Map<string, Job[]>()

  for (const job of jobs) {
    const name = (job.customer_client_name ?? '').trim()
    if (!name) continue
    const list = byName.get(name) ?? []
    list.push(job)
    byName.set(name, list)
  }

  const customers: CrmCustomer[] = []

  for (const [name, customerJobs] of byName) {
    const openJobs = customerJobs.filter(isOpenJob)
    const pendingApproval = customerJobs.filter((j) =>
      (j.approval_status ?? '').toLowerCase().includes('pending'),
    )
    const overdueJobs = customerJobs.filter(isJobOverdue)

    const channels = customerJobs
      .map((j) => j.order_channel)
      .filter(Boolean)
    const primaryChannel =
      channels.sort(
        (a, b) =>
          channels.filter((c) => c === b).length - channels.filter((c) => c === a).length,
      )[0] ?? '—'

    const merchandisers = customerJobs.map((j) => j.merchandiser).filter(Boolean)
    const merchandiser =
      merchandisers.sort(
        (a, b) =>
          merchandisers.filter((m) => m === b).length -
          merchandisers.filter((m) => m === a).length,
      )[0] ?? '—'

    const activityDates = customerJobs
      .flatMap((j) => [j.date_of_request, j.requested_delivery_date, j.date_approved])
      .map(parseUkDate)
      .filter((d): d is Date => d !== null)
    const lastActivityDate =
      activityDates.length > 0
        ? activityDates.sort((a, b) => b.getTime() - a.getTime())[0]
        : null

    const recentJobs = [...customerJobs]
      .sort((a, b) => (b.job_number ?? '').localeCompare(a.job_number ?? '', undefined, { numeric: true }))
      .slice(0, 5)

    const overdueCount = overdueJobs.length
    const pendingCount = pendingApproval.length
    const openCount = openJobs.length

    customers.push({
      name,
      merchandiser,
      primaryChannel,
      totalJobs: customerJobs.length,
      openJobs: openCount,
      pendingApproval: pendingCount,
      overdueJobs: overdueCount,
      totalUnits: customerJobs.reduce((sum, j) => sum + parseNumber(j.order_quantity), 0),
      estimatedValue: openJobs.reduce((sum, j) => sum + jobValue(j), 0),
      lastActivityDate: lastActivityDate
        ? lastActivityDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : '—',
      status: accountStatus(overdueCount, pendingCount, openCount),
      recentJobs,
    })
  }

  return customers.sort((a, b) => b.estimatedValue - a.estimatedValue)
}

export function computeCrmStats(customers: CrmCustomer[]): CrmStats {
  return {
    accounts: customers.length,
    activeAccounts: customers.filter((c) => c.status === 'active').length,
    openJobs: customers.reduce((sum, c) => sum + c.openJobs, 0),
    pendingApproval: customers.reduce((sum, c) => sum + c.pendingApproval, 0),
    pipelineValue: customers.reduce((sum, c) => sum + c.estimatedValue, 0),
    atRiskAccounts: customers.filter((c) => c.status === 'at-risk').length,
    pendingApprovalAccounts: customers.filter((c) => c.status === 'pending-approval').length,
  }
}

export function formatGbp(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value)
}

export function statusLabel(status: CrmAccountStatus): string {
  switch (status) {
    case 'pending-approval':
      return 'Pending approval'
    case 'active':
      return 'Active'
    case 'at-risk':
      return 'At risk'
    case 'quiet':
      return 'Quiet'
  }
}

export function statusStyle(status: CrmAccountStatus): string {
  switch (status) {
    case 'pending-approval':
      return 'bg-amber-100 text-amber-800 ring-amber-200'
    case 'active':
      return 'bg-emerald-100 text-emerald-800 ring-emerald-200'
    case 'at-risk':
      return 'bg-red-100 text-red-800 ring-red-200'
    case 'quiet':
      return 'bg-slate-100 text-slate-600 ring-slate-200'
  }
}

export function statusColumnStyle(status: CrmAccountStatus): string {
  switch (status) {
    case 'pending-approval':
      return 'border-amber-200 bg-amber-50/50'
    case 'active':
      return 'border-emerald-200 bg-emerald-50/50'
    case 'at-risk':
      return 'border-red-200 bg-red-50/50'
    case 'quiet':
      return 'border-slate-200 bg-slate-50/50'
  }
}

/** @deprecated Use statusLabel */
export function healthLabel(status: CrmAccountStatus): string {
  return statusLabel(status)
}

/** @deprecated Use statusStyle */
export function healthStyle(status: CrmAccountStatus): string {
  return statusStyle(status)
}

export function filterCrmCustomers(
  customers: CrmCustomer[],
  search: string,
  statusFilter: CrmAccountStatus | 'all',
): CrmCustomer[] {
  const q = search.trim().toLowerCase()
  return customers.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (!q) return true
    return (
      c.name.toLowerCase().includes(q) ||
      c.merchandiser.toLowerCase().includes(q) ||
      c.primaryChannel.toLowerCase().includes(q)
    )
  })
}

export function mergeCrmCustomers(
  jobCustomers: CrmCustomer[],
  manualAccounts: CrmManualAccount[],
  profiles: Record<string, CrmCustomerProfile>,
): CrmCustomer[] {
  const byName = new Map<string, CrmCustomer>()
  for (const c of jobCustomers) {
    byName.set(c.name.toLowerCase(), c)
  }

  for (const manual of manualAccounts) {
    const key = manual.name.toLowerCase()
    if (byName.has(key)) {
      const existing = byName.get(key)!
      byName.set(key, {
        ...existing,
        isManual: true,
        parentAccountName: manual.parentAccountName || profiles[manual.name]?.parentAccountName,
        onboardingStatus: profiles[manual.name]?.onboardingStatus,
      })
    } else {
      const profile = profiles[manual.name] ?? EMPTY_CRM_PROFILE
      byName.set(key, {
        name: manual.name,
        merchandiser: '—',
        primaryChannel: '—',
        totalJobs: 0,
        openJobs: 0,
        pendingApproval: 0,
        overdueJobs: 0,
        totalUnits: 0,
        estimatedValue: 0,
        lastActivityDate: new Date(manual.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        status: 'quiet',
        recentJobs: [],
        isManual: true,
        parentAccountName: manual.parentAccountName || profile.parentAccountName,
        onboardingStatus: profile.onboardingStatus,
      })
    }
  }

  for (const [key, customer] of byName) {
    const profile = profiles[customer.name]
    const onboardingStatus =
      profile?.onboardingStatus ??
      (customer.totalJobs > 0 ? ('verified' as const) : ('draft' as const))
    byName.set(key, {
      ...customer,
      onboardingStatus,
      parentAccountName: customer.parentAccountName || profile?.parentAccountName,
    })
  }

  return [...byName.values()].sort((a, b) => {
    if (b.estimatedValue !== a.estimatedValue) return b.estimatedValue - a.estimatedValue
    return a.name.localeCompare(b.name)
  })
}

export function groupCustomersByStatus(
  customers: CrmCustomer[],
): Record<CrmAccountStatus, CrmCustomer[]> {
  const groups: Record<CrmAccountStatus, CrmCustomer[]> = {
    'pending-approval': [],
    active: [],
    'at-risk': [],
    quiet: [],
  }
  for (const customer of customers) {
    groups[customer.status].push(customer)
  }
  for (const status of CRM_STATUS_ORDER) {
    groups[status].sort((a, b) => b.estimatedValue - a.estimatedValue)
  }
  return groups
}
