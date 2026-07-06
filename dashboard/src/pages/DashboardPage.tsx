import { useMemo, useState } from 'react'
import { MOCK_ORDERS, DEMO_DATA_AS_OF } from '../data/mockOrders'
import {
  ActiveFilterChips,
  FilterBar,
  countActiveFilters,
} from '../components/FilterBar'
import { Panel, SectionHeading } from '../components/KpiCard'
import {
  BacklogTrendChart,
  OpenByCustomerChart,
  ProductionTrendChart,
  SalesTrendChart,
  StageBreakdownChart,
} from '../components/Charts'
import { ExceptionTable } from '../components/ExceptionTable'
import { OrderDetailModal } from '../components/OrderDetailModal'
import { DashboardSummary } from '../components/dtg/DashboardSummary'
import { OdooProductionDashboard } from '../components/dtg/OdooProductionDashboard'
import { IconFilter } from '../components/Icons'
import type { Filters, Order } from '../types'
import {
  backlogTrend,
  computeEveningStatus,
  computeKpis,
  exceptionOrders,
  filterOpenSnapshot,
  filterOrders,
  openByCustomer,
  productionTrend,
  salesTrend,
  stageBreakdown,
} from '../utils/metrics'

const DEFAULT_FILTERS: Filters = {
  datePreset: 'last_30',
  customers: [],
  stages: [],
  blocked: 'all',
  aged: 'all',
}

type DashboardTab = 'summary' | 'production' | 'trends' | 'operations' | 'exceptions'

const TABS: { id: DashboardTab; label: string }[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'production', label: 'Production' },
  { id: 'trends', label: 'Trends' },
  { id: 'operations', label: 'Operations' },
  { id: 'exceptions', label: 'Exceptions' },
]

export function DashboardPage() {
  const [tab, setTab] = useState<DashboardTab>('summary')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const filteredIntake = useMemo(
    () => filterOrders(MOCK_ORDERS, filters),
    [filters],
  )

  const openSnapshot = useMemo(
    () => filterOpenSnapshot(MOCK_ORDERS, filters),
    [filters],
  )

  const kpis = useMemo(
    () => computeKpis(MOCK_ORDERS, filteredIntake),
    [filteredIntake],
  )

  const salesData = useMemo(() => salesTrend(filteredIntake), [filteredIntake])
  const productionData = useMemo(
    () => productionTrend(filteredIntake),
    [filteredIntake],
  )
  const backlogData = useMemo(() => backlogTrend(MOCK_ORDERS), [])
  const customerData = useMemo(() => openByCustomer(openSnapshot), [openSnapshot])
  const stageData = useMemo(() => stageBreakdown(openSnapshot), [openSnapshot])
  const exceptions = useMemo(() => exceptionOrders(openSnapshot), [openSnapshot])
  const eveningStatus = useMemo(() => computeEveningStatus(MOCK_ORDERS), [])

  const activeFilterCount = countActiveFilters(filters, DEFAULT_FILTERS)
  const exceptionCount = kpis.agedOrders + kpis.blockedOrders

  const showFilters = tab === 'trends' || tab === 'operations' || tab === 'exceptions'

  return (
    <>
      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />

      <div className="border-b border-border bg-card/80">
        <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                DTG operations
              </p>
              <h1 className="mt-1 text-2xl font-bold text-ink">Dashboard</h1>
              <p className="mt-1 text-sm text-muted">As of {DEMO_DATA_AS_OF}</p>
            </div>

            {showFilters && (
              <button
                type="button"
                onClick={() => setFiltersOpen((o) => !o)}
                className="inline-flex items-center gap-2 self-start rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-ink hover:bg-card sm:self-auto"
              >
                <IconFilter className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            )}
          </div>

          <nav className="mt-4 flex gap-1 overflow-x-auto rounded-xl bg-surface p-1 ring-1 ring-inset ring-border">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`relative shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  tab === item.id
                    ? 'bg-card text-ink shadow-sm ring-1 ring-border'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {item.label}
                {item.id === 'exceptions' && exceptionCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700">
                    {exceptionCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6">
        {showFilters && filtersOpen && (
          <section className="rounded-xl bg-card p-4 ring-1 ring-border">
            <FilterBar filters={filters} onChange={setFilters} />
            {activeFilterCount > 0 && (
              <div className="mt-3">
                <ActiveFilterChips
                  filters={filters}
                  defaults={DEFAULT_FILTERS}
                  onChange={setFilters}
                  onClear={() => setFilters(DEFAULT_FILTERS)}
                />
              </div>
            )}
          </section>
        )}

        {tab === 'summary' && (
          <DashboardSummary
            status={eveningStatus}
            kpis={kpis}
            orders={MOCK_ORDERS}
            onOpenOrder={setSelectedOrder}
            onGoToTab={(t) => setTab(t)}
          />
        )}

        {tab === 'production' && <OdooProductionDashboard />}

        {tab === 'trends' && (
          <section>
            <SectionHeading
              title="Trends"
              description="Intake vs output over your selected date range"
            />
            <div className="grid gap-5 lg:grid-cols-2">
              <Panel title="Sales & intake" subtitle="Daily order count" badge={`${salesData.length} days`}>
                <SalesTrendChart data={salesData} />
              </Panel>
              <Panel title="Production output" subtitle="Orders completed per day" badge={`${productionData.length} days`}>
                <ProductionTrendChart data={productionData} />
              </Panel>
              <Panel
                title="Backlog trend"
                subtitle="Open order count — last 30 days"
                className="lg:col-span-2"
              >
                <BacklogTrendChart data={backlogData} />
              </Panel>
            </div>
          </section>
        )}

        {tab === 'operations' && (
          <section>
            <SectionHeading title="Operations" description="Where work is sitting right now" />
            <div className="grid gap-5 lg:grid-cols-2">
              <Panel
                title="Open orders by customer"
                badge={`${customerData.length} customers`}
              >
                <OpenByCustomerChart data={customerData} />
              </Panel>
              <Panel title="Stage breakdown" badge={`${openSnapshot.length} open`}>
                <StageBreakdownChart data={stageData} />
              </Panel>
            </div>
          </section>
        )}

        {tab === 'exceptions' && (
          <section>
            <SectionHeading
              title="Exceptions"
              description="Aged and blocked orders that need attention"
            />
            <Panel
              title="Exception queue"
              badge={exceptions.length > 0 ? `${exceptions.length} items` : 'All clear'}
            >
              <ExceptionTable orders={exceptions} onOpenOrder={setSelectedOrder} />
            </Panel>
          </section>
        )}
      </main>
    </>
  )
}
