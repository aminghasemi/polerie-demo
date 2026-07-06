import { useMemo, useState } from 'react'
import type { CustomerOverviewRow } from '../../types/productionDashboard'
import { formatQty } from '../../utils/productionDashboard'
import { IconSearch, IconX } from '../Icons'
import { EmptyState } from '../EmptyState'

interface CustomerOverviewPanelProps {
  customers: CustomerOverviewRow[]
  onSelectCustomer?: (name: string) => void
}

type SortKey = 'customer' | 'approvedJobs' | 'unitsAwaitingProduction' | 'backlogPct'

export function CustomerOverviewPanel({ customers, onSelectCustomer }: CustomerOverviewPanelProps) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('unitsAwaitingProduction')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = q
      ? customers.filter((c) => c.customer.toLowerCase().includes(q))
      : [...customers]

    list.sort((a, b) => {
      if (sortKey === 'customer') {
        const cmp = a.customer.localeCompare(b.customer)
        return sortDir === 'asc' ? cmp : -cmp
      }
      const parse = (v: string) => parseFloat(v.replace(/[,%]/g, '')) || 0
      const cmp = parse(a[sortKey]) - parse(b[sortKey])
      return sortDir === 'asc' ? cmp : -cmp
    })
    return list
  }, [customers, search, sortKey, sortDir])

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

  return (
    <div
      className="overflow-hidden rounded-2xl bg-card ring-1 ring-border"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="border-b border-border px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink">Customer overview</h3>
            <p className="mt-0.5 text-xs text-muted">
              Workload by customer — live stations and backlog
            </p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              placeholder="Search customer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border-0 bg-surface py-2 pl-9 pr-9 text-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-accent"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
              >
                <IconX className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No customers match" description="Try a different search term." />
      ) : (
        <div className="scrollbar-thin overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/80">
                <SortTh label="Customer" k="customer" />
                <th className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
                  Pending
                </th>
                <SortTh label="Approved" k="approvedJobs" />
                <SortTh label="Units waiting" k="unitsAwaitingProduction" />
                <SortTh label="% backlog" k="backlogPct" />
                <th className="px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted">
                  Planning
                </th>
                <th className="px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted">
                  In prod
                </th>
                <th className="px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted">
                  Prod done
                </th>
                <th className="px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted">
                  Packed
                </th>
                <th className="px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted">
                  Dispatched
                </th>
                <th className="px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted">
                  New this wk
                </th>
                <th className="px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted">
                  Disp. wk
                </th>
                <th className="px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted">
                  YTD
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const backlog = parseFloat(c.backlogPct) || 0
                const highBacklog = backlog >= 10
                return (
                  <tr
                    key={c.customer}
                    role={onSelectCustomer ? 'button' : undefined}
                    tabIndex={onSelectCustomer ? 0 : undefined}
                    onClick={onSelectCustomer ? () => onSelectCustomer(c.customer) : undefined}
                    className={`border-b border-border/40 transition-colors ${
                      onSelectCustomer ? 'cursor-pointer hover:bg-violet-50/50' : ''
                    } ${highBacklog ? 'bg-amber-50/30' : i % 2 === 0 ? 'bg-card' : 'bg-surface/30'}`}
                  >
                    <td className="sticky left-0 z-10 bg-inherit px-3 py-2.5 font-medium text-ink">
                      {c.customer}
                    </td>
                    <td className="px-3 py-2.5 text-center tabular-nums text-xs text-ink-muted">
                      {c.pendingApproval || '0'}
                    </td>
                    <td className="px-3 py-2.5 text-center tabular-nums text-xs font-medium">
                      {c.approvedJobs || '0'}
                    </td>
                    <td className="px-3 py-2.5 text-center text-xs font-semibold tabular-nums text-ink">
                      {formatQty(c.unitsAwaitingProduction)}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums ring-1 ring-inset ${
                          highBacklog
                            ? 'bg-amber-100 text-amber-800 ring-amber-200'
                            : 'bg-surface text-muted ring-border'
                        }`}
                      >
                        {c.backlogPct || '0%'}
                      </span>
                    </td>
                    {(
                      [
                        'planning',
                        'productionInProgress',
                        'productionCompleted',
                        'packingCompleted',
                        'dispatched',
                        'newlyApprovedJobs',
                        'jobsDispatchedThisWeek',
                        'dispatchedYtd',
                      ] as const
                    ).map((field) => (
                      <td
                        key={field}
                        className="px-3 py-2.5 text-center text-xs tabular-nums text-ink-muted"
                      >
                        {c[field] || '0'}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
