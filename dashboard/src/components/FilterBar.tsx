import type { AgedFilter, BlockedFilter, DatePreset, Filters, Stage } from '../types'
import { ALL_STAGES, MOCK_CUSTOMERS } from '../data/mockOrders'
import { STAGE_CHART_COLORS } from './StageBadge'
import { IconChevron, IconFilter, IconSearch, IconX } from './Icons'
import { useMemo, useState } from 'react'

interface FilterBarProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

const DATE_PRESETS: { value: DatePreset; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This week' },
  { value: 'last_7', label: '7 days' },
  { value: 'last_30', label: '30 days' },
  { value: 'last_90', label: '90 days' },
]

const BLOCKED_OPTIONS: { value: BlockedFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'not_blocked', label: 'Clear' },
]

const AGED_OPTIONS: { value: AgedFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'aged', label: 'Aged' },
  { value: 'not_aged', label: 'Fresh' },
]

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex rounded-lg bg-surface p-1 ring-1 ring-inset ring-border">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            value === opt.value
              ? 'bg-card text-ink shadow-sm ring-1 ring-border'
              : 'text-muted hover:text-ink-muted'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function countActiveFilters(filters: Filters, defaults: Filters): number {
  let n = 0
  if (filters.datePreset !== defaults.datePreset) n++
  if (filters.customers.length > 0) n++
  if (filters.stages.length > 0) n++
  if (filters.blocked !== defaults.blocked) n++
  if (filters.aged !== defaults.aged) n++
  return n
}

export function ActiveFilterChips({
  filters,
  defaults,
  onChange,
  onClear,
}: {
  filters: Filters
  defaults: Filters
  onChange: (f: Filters) => void
  onClear: () => void
}) {
  const chips: { label: string; clear: () => void }[] = []

  if (filters.datePreset !== defaults.datePreset) {
    const label = DATE_PRESETS.find((p) => p.value === filters.datePreset)?.label ?? filters.datePreset
    chips.push({
      label: `Period: ${label}`,
      clear: () => onChange({ ...filters, datePreset: defaults.datePreset }),
    })
  }
  if (filters.blocked !== 'all') {
    chips.push({
      label: filters.blocked === 'blocked' ? 'Blocked only' : 'Not blocked',
      clear: () => onChange({ ...filters, blocked: 'all' }),
    })
  }
  if (filters.aged !== 'all') {
    chips.push({
      label: filters.aged === 'aged' ? 'Aged (>5d)' : 'Not aged',
      clear: () => onChange({ ...filters, aged: 'all' }),
    })
  }
  for (const c of filters.customers) {
    chips.push({
      label: c,
      clear: () => onChange({ ...filters, customers: filters.customers.filter((x) => x !== c) }),
    })
  }
  for (const s of filters.stages) {
    chips.push({
      label: s,
      clear: () => onChange({ ...filters, stages: filters.stages.filter((x) => x !== s) }),
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted">Active:</span>
      {chips.map((chip) => (
        <button
          key={chip.label}
          type="button"
          onClick={chip.clear}
          className="inline-flex items-center gap-1 rounded-full bg-accent-light py-1 pl-2.5 pr-1.5 text-xs font-medium text-accent transition-colors hover:bg-violet-200"
        >
          {chip.label}
          <IconX className="h-3 w-3 opacity-70" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="text-xs font-medium text-muted underline-offset-2 hover:text-accent hover:underline"
      >
        Clear all
      </button>
    </div>
  )
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const [expanded, setExpanded] = useState(true)
  const [customerSearch, setCustomerSearch] = useState('')

  const filteredCustomers = useMemo(() => {
    const q = customerSearch.trim().toLowerCase()
    if (!q) return MOCK_CUSTOMERS
    return MOCK_CUSTOMERS.filter((c) => c.toLowerCase().includes(q))
  }, [customerSearch])

  const toggleCustomer = (customer: string) => {
    const customers = filters.customers.includes(customer)
      ? filters.customers.filter((c) => c !== customer)
      : [...filters.customers, customer]
    onChange({ ...filters, customers })
  }

  const toggleStage = (stage: Stage) => {
    const stages = filters.stages.includes(stage)
      ? filters.stages.filter((s) => s !== stage)
      : [...filters.stages, stage]
    onChange({ ...filters, stages })
  }

  return (
    <div
      className="rounded-2xl bg-card ring-1 ring-border"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-light text-accent">
            <IconFilter className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-ink">Filters</h2>
            <p className="text-xs text-muted">Narrow demand, workload, and exceptions</p>
          </div>
        </div>
        <IconChevron
          up={expanded}
          className={`h-5 w-5 shrink-0 text-muted transition-transform ${expanded ? '' : '-rotate-180'}`}
        />
      </button>

      {expanded && (
        <div className="space-y-5 border-t border-border px-5 pb-5 pt-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Date range
            </p>
            <div className="flex flex-wrap gap-1.5">
              {DATE_PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => onChange({ ...filters, datePreset: p.value })}
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                    filters.datePreset === p.value
                      ? 'bg-accent text-white shadow-sm shadow-violet-300/40'
                      : 'bg-surface text-ink-muted ring-1 ring-inset ring-border hover:bg-surface-2'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                Blocked status
              </p>
              <SegmentedControl
                options={BLOCKED_OPTIONS}
                value={filters.blocked}
                onChange={(blocked) => onChange({ ...filters, blocked })}
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                Age status
              </p>
              <SegmentedControl
                options={AGED_OPTIONS}
                value={filters.aged}
                onChange={(aged) => onChange({ ...filters, aged })}
              />
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                Customer
              </p>
              <div className="relative mb-2">
                <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  placeholder="Search customers…"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full rounded-lg border-0 bg-surface py-2 pl-9 pr-3 text-sm text-ink ring-1 ring-inset ring-border placeholder:text-muted focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="scrollbar-thin flex max-h-28 flex-wrap gap-1.5 overflow-y-auto">
                {filteredCustomers.map((customer) => {
                  const active = filters.customers.includes(customer)
                  return (
                    <button
                      key={customer}
                      type="button"
                      onClick={() => toggleCustomer(customer)}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                        active
                          ? 'bg-accent text-white'
                          : 'bg-surface text-ink-muted ring-1 ring-inset ring-border hover:ring-accent/40'
                      }`}
                    >
                      {customer}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                Production stage
              </p>
              <div className="flex flex-wrap gap-1.5">
                {ALL_STAGES.map((stage) => {
                  const active = filters.stages.includes(stage)
                  const color = STAGE_CHART_COLORS[stage as Stage]
                  return (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => toggleStage(stage as Stage)}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ring-1 ring-inset ${
                        active
                          ? 'text-white ring-transparent'
                          : 'bg-surface text-ink-muted ring-border hover:ring-border-strong'
                      }`}
                      style={active ? { backgroundColor: color } : undefined}
                    >
                      {stage}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
