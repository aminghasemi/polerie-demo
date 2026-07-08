import { parse, isValid } from 'date-fns'
import type { Job } from '../types/jobTracker'
import type { CrmCustomerInsights, CrmCustomerProfile } from '../types/crm'

function parseUkDate(value: string): Date | null {
  if (!value) return null
  const parsed = parse(value, 'dd/MM/yyyy', new Date())
  return isValid(parsed) ? parsed : null
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

function formatActivityDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function topValues(values: string[], limit = 5): string[] {
  const counts = new Map<string, number>()
  for (const v of values) {
    if (!v.trim()) continue
    counts.set(v, (counts.get(v) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([v]) => v)
}

export function getCustomerJobs(jobs: Job[], customerName: string): Job[] {
  return jobs
    .filter((j) => (j.customer_client_name ?? '').trim() === customerName)
    .sort((a, b) =>
      (b.job_number ?? '').localeCompare(a.job_number ?? '', undefined, { numeric: true }),
    )
}

export function buildCustomerInsights(customerJobs: Job[]): CrmCustomerInsights {
  const activityDates = customerJobs
    .flatMap((j) => [j.date_of_request, j.requested_delivery_date, j.date_approved])
    .map(parseUkDate)
    .filter((d): d is Date => d !== null)
    .sort((a, b) => a.getTime() - b.getTime())

  const completedJobs = customerJobs.filter((j) => {
    const stage = (j.job_stage ?? '').toLowerCase()
    return stage.includes('completed') || stage.includes('dispatched')
  }).length

  const locations = customerJobs.flatMap((j) => {
    const locs: string[] = []
    for (let i = 1; i <= 12; i++) {
      const key = `location_${i}` as keyof Job
      const val = j[key]
      if (val?.trim()) locs.push(val.trim())
    }
    return locs
  })

  return {
    channels: topValues(customerJobs.map((j) => j.order_channel ?? '')),
    merchandisers: topValues(customerJobs.map((j) => j.merchandiser ?? '')),
    departments: topValues(customerJobs.map((j) => j.department ?? '')),
    deliveryLocations: topValues(locations, 8),
    lifetimeValue: customerJobs.reduce((sum, j) => sum + jobValue(j), 0),
    lifetimeUnits: customerJobs.reduce((sum, j) => sum + parseNumber(j.order_quantity), 0),
    completedJobs,
    firstActivity: activityDates[0] ? formatActivityDate(activityDates[0]) : '—',
    lastActivity: activityDates.length
      ? formatActivityDate(activityDates[activityDates.length - 1])
      : '—',
    topOperations: topValues(customerJobs.map((j) => j.operations_required ?? ''), 4),
  }
}

export function profileFieldEntries(
  profile: CrmCustomerProfile,
): { key: string; label: string; value: string }[] {
  const labels: Record<keyof CrmCustomerProfile, string> = {
    companyName: 'Company name',
    contactName: 'Contact name',
    email: 'Email',
    phone: 'Phone',
    accountType: 'Account type',
    deliveryAddress: 'Delivery address',
    billingAddress: 'Billing address',
    website: 'Website',
    internalRef: 'Internal reference',
    paymentTerms: 'Payment terms',
    portalUrl: 'Portal URL',
    portalNotes: 'Portal notes',
    onboardingStatus: 'Onboarding status',
    onboardingFileName: 'Onboarding form',
    parentAccountName: 'Parent company',
  }
  return (Object.keys(labels) as (keyof CrmCustomerProfile)[])
    .map((key) => ({
      key,
      label: labels[key],
      value: profile[key]?.trim() ?? '',
    }))
    .filter((e) => e.value)
}
