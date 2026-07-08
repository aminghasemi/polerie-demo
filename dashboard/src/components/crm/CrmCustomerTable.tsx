import { useMemo, useState } from 'react'
import type { CrmCustomer } from '../../types/crm'
import { ONBOARDING_STATUS_LABELS } from '../../types/crm'
import { onboardingStatusStyle } from '../../data/crmDefaults'
import { formatGbp, statusLabel, statusStyle } from '../../utils/crm'
import { EmptyState } from '../EmptyState'

type SortKey = 'name' | 'openJobs' | 'estimatedValue' | 'totalJobs' | 'status'

interface CrmCustomerTableProps {
  customers: CrmCustomer[]
  onSelectCustomer: (customer: CrmCustomer) => void
}

const STATUS_SORT_ORDER: Record<CrmCustomer['status'], number> = {
  'at-risk': 0,
  'pending-approval': 1,
  active: 2,
  quiet: 3,
}

export function CrmCustomerTable({ customers, onSelectCustomer }: CrmCustomerTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('estimatedValue')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const sorted = useMemo(() => {
    const list = [...customers]
    list.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name)
      else if (sortKey === 'status') cmp = STATUS_SORT_ORDER[a.status] - STATUS_SORT_ORDER[b.status]
      else cmp = a[sortKey] - b[sortKey]
      return sortDir === 'asc' ? cmp : -cmp
    })
    return list
  }, [customers, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const SortTh = ({ label, k }: { label: string; k: SortKey }) => (
    <th className="px-3 py-3 font-semibold">
      <button
        type="button"
        onClick={() => toggleSort(k)}
        className={`flex items-center gap-1 text-[11px] uppercase tracking-wider ${
          sortKey === k ? 'text-accent' : 'text-muted hover:text-ink'
        }`}
      >
        {label}
        {sortKey === k && <span>{sortDir === 'asc' ? '↑' : '↓'}</span>}
      </button>
    </th>
  )

  if (sorted.length === 0) {
    return <EmptyState title="No accounts found" description="Try a different search or status filter." />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[960px] text-left text-sm">
        <thead className="border-b border-border bg-surface/60 text-muted">
          <tr>
            <SortTh label="Customer" k="name" />
            <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider">
              Merchandiser
            </th>
            <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider">Channel</th>
            <SortTh label="Status" k="status" />
            <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider">
              Onboarding
            </th>
            <SortTh label="Open jobs" k="openJobs" />
            <SortTh label="Pipeline" k="estimatedValue" />
            <SortTh label="Total jobs" k="totalJobs" />
            <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider">
              Last activity
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sorted.map((customer) => (
            <tr
              key={customer.name}
              onClick={() => onSelectCustomer(customer)}
              className="cursor-pointer transition-colors hover:bg-violet-50/50"
            >
              <td className="px-3 py-3 font-medium text-ink">{customer.name}</td>
              <td className="px-3 py-3 text-ink-muted">{customer.merchandiser}</td>
              <td className="px-3 py-3 text-ink-muted">{customer.primaryChannel}</td>
              <td className="px-3 py-3">
                <span
                  className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusStyle(customer.status)}`}
                >
                  {statusLabel(customer.status)}
                </span>
              </td>
              <td className="px-3 py-3">
                {customer.onboardingStatus ? (
                  <span
                    className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${onboardingStatusStyle(customer.onboardingStatus)}`}
                  >
                    {ONBOARDING_STATUS_LABELS[customer.onboardingStatus]}
                  </span>
                ) : (
                  <span className="text-xs text-muted">—</span>
                )}
              </td>
              <td className="px-3 py-3 tabular-nums text-ink">{customer.openJobs}</td>
              <td className="px-3 py-3 tabular-nums font-medium text-ink">
                {formatGbp(customer.estimatedValue)}
              </td>
              <td className="px-3 py-3 tabular-nums text-ink-muted">{customer.totalJobs}</td>
              <td className="px-3 py-3 text-ink-muted">{customer.lastActivityDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
