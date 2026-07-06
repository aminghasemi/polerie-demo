import { useMemo, useState } from 'react'
import type { CrmAccountStatus, CrmCustomer, CrmViewMode } from '../../types/crm'
import { CRM_STATUS_ORDER, filterCrmCustomers, statusLabel, statusStyle } from '../../utils/crm'
import { CrmCustomerTable } from './CrmCustomerTable'
import { CrmKanbanBoard } from './CrmKanbanBoard'
import { IconSearch, IconX } from '../Icons'

interface CrmAccountsSectionProps {
  customers: CrmCustomer[]
  onSelectCustomer: (customer: CrmCustomer) => void
}

export function CrmAccountsSection({ customers, onSelectCustomer }: CrmAccountsSectionProps) {
  const [view, setView] = useState<CrmViewMode>('table')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<CrmAccountStatus | 'all'>('all')

  const filtered = useMemo(
    () => filterCrmCustomers(customers, search, statusFilter),
    [customers, search, statusFilter],
  )

  return (
    <div
      className="overflow-hidden rounded-2xl bg-card ring-1 ring-border"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="border-b border-border px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink">Customer accounts</h3>
            <p className="mt-0.5 text-xs text-muted">
              {filtered.length} account{filtered.length !== 1 ? 's' : ''} · click for details
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex rounded-xl bg-surface p-1 ring-1 ring-inset ring-border">
              <button
                type="button"
                onClick={() => setView('table')}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  view === 'table'
                    ? 'bg-card text-ink shadow-sm ring-1 ring-border'
                    : 'text-muted hover:text-ink'
                }`}
              >
                Table
              </button>
              <button
                type="button"
                onClick={() => setView('kanban')}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  view === 'kanban'
                    ? 'bg-card text-ink shadow-sm ring-1 ring-border'
                    : 'text-muted hover:text-ink'
                }`}
              >
                Kanban
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                placeholder="Search accounts…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border-0 bg-surface py-2 pl-9 pr-9 text-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-accent"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-ink"
                >
                  <IconX className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <StatusChip
            label="All"
            active={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
          />
          {CRM_STATUS_ORDER.map((status) => (
            <StatusChip
              key={status}
              label={statusLabel(status)}
              active={statusFilter === status}
              onClick={() => setStatusFilter(status)}
              className={statusFilter === status ? statusStyle(status) : ''}
            />
          ))}
        </div>
      </div>

      <div className={view === 'kanban' ? 'p-4' : ''}>
        {view === 'table' ? (
          <CrmCustomerTable customers={filtered} onSelectCustomer={onSelectCustomer} />
        ) : (
          <CrmKanbanBoard customers={filtered} onSelectCustomer={onSelectCustomer} />
        )}
      </div>
    </div>
  )
}

function StatusChip({
  label,
  active,
  onClick,
  className = '',
}: {
  label: string
  active: boolean
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1 text-xs font-medium ring-1 ring-inset transition-colors ${
        active
          ? className || 'bg-card text-ink ring-border shadow-sm'
          : 'bg-surface text-muted ring-border hover:text-ink'
      }`}
    >
      {label}
    </button>
  )
}
