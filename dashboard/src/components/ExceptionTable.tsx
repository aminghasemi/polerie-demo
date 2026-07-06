import { useMemo, useState } from 'react'
import type { Order } from '../types'
import { getAgeDays, getDaysLate, isOverdue } from '../utils/metrics'
import { AgeBadge } from './StageBadge'
import { IconEmpty, IconSearch } from './Icons'
import { EmptyState } from './EmptyState'

interface ExceptionTableProps {
  orders: Order[]
  onOpenOrder: (order: Order) => void
}

type SortKey = 'late' | 'customer' | 'ref'
type Tab = 'all' | 'aged' | 'blocked' | 'overdue'

export function ExceptionTable({ orders, onOpenOrder }: ExceptionTableProps) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('late')
  const [tab, setTab] = useState<Tab>('all')

  const filtered = useMemo(() => {
    let list = [...orders]

    if (tab === 'aged') list = list.filter((o) => getAgeDays(o) > 5)
    if (tab === 'blocked') list = list.filter((o) => o.isBlocked)
    if (tab === 'overdue') list = list.filter((o) => isOverdue(o))

    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (o) =>
          o.ref.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.blockerReason?.toLowerCase().includes(q) ||
          o.opsStage.toLowerCase().includes(q),
      )
    }

    list.sort((a, b) => {
      if (sortKey === 'late') return getDaysLate(b) - getDaysLate(a)
      if (sortKey === 'customer') return a.customer.localeCompare(b.customer)
      return a.ref.localeCompare(b.ref)
    })

    return list
  }, [orders, search, sortKey, tab])

  const agedCount = orders.filter((o) => getAgeDays(o) > 5).length
  const blockedCount = orders.filter((o) => o.isBlocked).length
  const overdueCount = orders.filter((o) => isOverdue(o)).length

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No exceptions"
        description="No aged, overdue, or blocked orders match your filters. That's good news."
        icon={<IconEmpty className="h-6 w-6" />}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex flex-wrap gap-1 rounded-lg bg-surface p-1 ring-1 ring-inset ring-border">
          {(
            [
              ['all', `All (${orders.length})`],
              ['overdue', `Overdue (${overdueCount})`],
              ['aged', `Aged (${agedCount})`],
              ['blocked', `Blocked (${blockedCount})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                tab === key
                  ? 'bg-card text-ink shadow-sm ring-1 ring-border'
                  : 'text-muted hover:text-ink-muted'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder="Search ref, customer, blocker…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border-0 bg-surface py-2 pl-9 pr-3 text-sm text-ink ring-1 ring-inset ring-border placeholder:text-muted focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl ring-1 ring-border">
        <div className="scrollbar-thin max-h-[420px] overflow-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-surface/95 backdrop-blur-sm">
              <tr className="border-b border-border text-xs">
                <th className="px-4 py-3 font-semibold text-muted">
                  <button type="button" onClick={() => setSortKey('ref')} className="hover:text-ink">
                    Reference {sortKey === 'ref' && '↓'}
                  </button>
                </th>
                <th className="px-4 py-3 font-semibold text-muted">
                  <button type="button" onClick={() => setSortKey('customer')} className="hover:text-ink">
                    Customer {sortKey === 'customer' && '↓'}
                  </button>
                </th>
                <th className="px-4 py-3 font-semibold text-muted">Ops stage</th>
                <th className="px-4 py-3 font-semibold text-muted">Qty</th>
                <th className="px-4 py-3 font-semibold text-muted">
                  <button type="button" onClick={() => setSortKey('late')} className="hover:text-ink">
                    Days late {sortKey === 'late' && '↓'}
                  </button>
                </th>
                <th className="px-4 py-3 font-semibold text-muted">Blocker</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted">
                    No rows match your search.
                  </td>
                </tr>
              ) : (
                filtered.slice(0, 50).map((order, i) => {
                  const daysLate = getDaysLate(order)
                  return (
                    <tr
                      key={order.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => onOpenOrder(order)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onOpenOrder(order)
                        }
                      }}
                      className={`cursor-pointer border-b border-border/60 transition-colors hover:bg-violet-50/80 ${
                        i % 2 === 0 ? 'bg-card' : 'bg-surface/40'
                      } ${order.ref === '26-2042' ? 'bg-red-50/60 hover:bg-red-50' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-semibold text-accent underline-offset-2 group-hover:underline">
                          {order.ref}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-ink-muted">{order.customer}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-ink-muted">{order.opsStage}</span>
                      </td>
                      <td className="px-4 py-3 tabular-nums text-ink-muted">{order.quantity}</td>
                      <td className="px-4 py-3">
                        {daysLate > 0 ? (
                          <span className="inline-flex min-w-[2.5rem] justify-center rounded-md bg-red-50 px-2 py-0.5 text-xs font-bold tabular-nums text-red-700 ring-1 ring-inset ring-red-200">
                            {daysLate}d
                          </span>
                        ) : (
                          <AgeBadge days={getAgeDays(order)} />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {order.isBlocked ? (
                          <span className="inline-flex max-w-[180px] items-center rounded-lg bg-danger-light px-2.5 py-1 text-xs font-medium text-danger ring-1 ring-inset ring-red-200">
                            {order.blockerReason}
                          </span>
                        ) : (
                          <span className="text-xs text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length > 50 && (
        <p className="text-center text-xs text-muted">
          Showing 50 of {filtered.length} rows — refine search to narrow results
        </p>
      )}
    </div>
  )
}
