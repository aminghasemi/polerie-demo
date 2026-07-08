import { useMemo, useState } from 'react'
import { useCrm } from '../../context/CrmContext'
import type { CrmAccountStatus, CrmCustomer, CrmViewMode } from '../../types/crm'
import { PARENT_COMPANY_OPTIONS } from '../../data/crmDefaults'
import { CRM_STATUS_ORDER, filterCrmCustomers, statusLabel, statusStyle } from '../../utils/crm'
import { CrmCustomerTable } from './CrmCustomerTable'
import { CrmKanbanBoard } from './CrmKanbanBoard'
import { IconSearch, IconX } from '../Icons'
import { FormField, inputClass, selectClass } from './crmUi'

interface CrmAccountsSectionProps {
  customers: CrmCustomer[]
  onSelectCustomer: (customer: CrmCustomer) => void
}

export function CrmAccountsSection({ customers, onSelectCustomer }: CrmAccountsSectionProps) {
  const { createAccount } = useCrm()
  const [view, setView] = useState<CrmViewMode>('table')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<CrmAccountStatus | 'all'>('all')
  const [showNewAccount, setShowNewAccount] = useState(false)
  const [newName, setNewName] = useState('')
  const [newParent, setNewParent] = useState('')

  const filtered = useMemo(
    () => filterCrmCustomers(customers, search, statusFilter),
    [customers, search, statusFilter],
  )

  const handleCreate = () => {
    const name = newName.trim()
    if (!name) return
    createAccount(name, newParent)
    setNewName('')
    setNewParent('')
    setShowNewAccount(false)
    onSelectCustomer({
      name,
      merchandiser: '—',
      primaryChannel: '—',
      totalJobs: 0,
      openJobs: 0,
      pendingApproval: 0,
      overdueJobs: 0,
      totalUnits: 0,
      estimatedValue: 0,
      lastActivityDate: '—',
      status: 'quiet',
      recentJobs: [],
      isManual: true,
      parentAccountName: newParent,
      onboardingStatus: 'draft',
    })
  }

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
              {filtered.length} account{filtered.length !== 1 ? 's' : ''} · click for workspace
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setShowNewAccount(true)}
              className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700"
            >
              + New account
            </button>

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

      {showNewAccount && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close"
            onClick={() => setShowNewAccount(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-card p-6 shadow-xl ring-1 ring-border">
            <h3 className="text-lg font-bold text-ink">New account</h3>
            <p className="mt-1 text-sm text-muted">
              Create a customer account to start onboarding before the first job exists.
            </p>
            <div className="mt-4 space-y-4">
              <FormField label="Account name" hint="Required">
                <input
                  className={inputClass}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Customer or artist name"
                  autoFocus
                />
              </FormField>
              <FormField label="Parent company" hint="Optional — e.g. Warner → artist">
                <select
                  className={selectClass}
                  value={newParent}
                  onChange={(e) => setNewParent(e.target.value)}
                >
                  <option value="">— None —</option>
                  {PARENT_COMPANY_OPTIONS.filter((p) => p !== '—').map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewAccount(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
              >
                Create account
              </button>
            </div>
          </div>
        </div>
      )}
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
