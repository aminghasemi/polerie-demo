import { useState } from 'react'
import type { EveningStatus, Kpis, Order } from '../../types'
import { formatCurrency, formatQtyShort } from '../../utils/metrics'
import { odooProductionDashboard } from '../../data/odooProductionDashboard'
import { IconChevron } from '../Icons'

interface DashboardSummaryProps {
  status: EveningStatus
  kpis: Kpis
  orders: Order[]
  onOpenOrder: (order: Order) => void
  onGoToTab: (tab: 'production' | 'exceptions') => void
}

function Stat({ label, value, alert }: { label: string; value: string | number; alert?: boolean }) {
  return (
    <div
      className={`rounded-xl px-3 py-2.5 ring-1 ring-inset ${
        alert ? 'bg-red-50 ring-red-200' : 'bg-surface ring-border'
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className={`mt-0.5 text-xl font-bold tabular-nums ${alert ? 'text-red-800' : 'text-ink'}`}>
        {value}
      </p>
    </div>
  )
}

export function DashboardSummary({
  status,
  kpis,
  orders,
  onOpenOrder,
  onGoToTab,
}: DashboardSummaryProps) {
  const [analysisOpen, setAnalysisOpen] = useState(false)
  const odoo = odooProductionDashboard

  const openWorstOffender = () => {
    if (!status.worstOffender) return
    const order = orders.find((o) => o.ref === status.worstOffender!.ref)
    if (order) onOpenOrder(order)
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Open" value={status.open} />
        <Stat label="Overdue" value={status.overdue} alert={status.overdue > 0} />
        <Stat label="Backlog qty" value={formatQtyShort(status.backlogQty)} />
        <Stat label="Aged" value={kpis.agedOrders} alert={kpis.agedOrders > 0} />
        <Stat label="Blocked" value={kpis.blockedOrders} alert={kpis.blockedOrders > 0} />
        <Stat label="Done today" value={status.doneToday} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl bg-card p-4 ring-1 ring-border lg:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-ink">Today & period</h3>
            <span className="text-xs text-muted">{status.reportLabel}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MiniMetric label="Intake today" value={status.intakeToday} />
            <MiniMetric label="Sales (period)" value={formatCurrency(kpis.salesValue)} />
            <MiniMetric label="New orders" value={kpis.orderVolume} />
            <MiniMetric label="Processed week" value={kpis.processedThisWeek} />
          </div>
          <p className="mt-3 text-xs text-muted">
            {kpis.pctCriticallyAged}% of open orders aged · Odoo open items{' '}
            <span className="font-medium text-ink">{odoo.headlines[0].value}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => onGoToTab('production')}
          className="rounded-xl bg-violet-50 p-4 text-left ring-1 ring-inset ring-violet-200 transition-colors hover:bg-violet-100/80"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
            Production floor
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-violet-950">
            {odoo.manufacturingStages[0].value}
          </p>
          <p className="text-sm text-violet-800">awaiting pick</p>
          <p className="mt-3 text-xs font-medium text-violet-700">View full production dashboard →</p>
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {status.worstOffender ? (
          <button
            type="button"
            onClick={openWorstOffender}
            className="rounded-xl bg-red-50 p-4 text-left ring-1 ring-inset ring-red-200 hover:bg-red-100/80"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-red-800">
              Needs attention
            </p>
            <p className="mt-1 text-base font-bold text-red-950">
              {status.worstOffender.ref} · {status.worstOffender.customer}
            </p>
            <p className="mt-1 text-sm text-red-800">
              {status.worstOffender.daysLate}d late · {status.worstOffender.opsStage}
            </p>
          </button>
        ) : (
          <div className="flex items-center rounded-xl bg-emerald-50 p-4 ring-1 ring-inset ring-emerald-200">
            <p className="text-sm font-medium text-emerald-800">No critical overdue orders.</p>
          </div>
        )}

        <button
          type="button"
          onClick={() => onGoToTab('exceptions')}
          className="rounded-xl bg-card p-4 text-left ring-1 ring-border hover:bg-surface"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Exception queue
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-ink">
            {kpis.agedOrders + kpis.blockedOrders}
          </p>
          <p className="mt-1 text-sm text-muted">
            {kpis.agedOrders} aged · {kpis.blockedOrders} blocked
            {odoo.blockedOrders > 0 && ` · ${odoo.blockedOrders} Odoo blocked`}
          </p>
          <p className="mt-2 text-xs font-medium text-accent">Review exceptions →</p>
        </button>
      </div>

      <div className="overflow-hidden rounded-xl ring-1 ring-border">
        <button
          type="button"
          onClick={() => setAnalysisOpen((o) => !o)}
          className="flex w-full items-center justify-between bg-surface/80 px-4 py-3 text-left"
        >
          <span className="text-sm font-semibold text-ink">Evening analysis</span>
          <IconChevron up={analysisOpen} className="h-4 w-4 text-muted" />
        </button>
        {analysisOpen && (
          <div className="border-t border-border bg-card px-4 py-3">
            <p className="text-sm leading-relaxed text-muted">{status.analysis}</p>
            <p className="mt-2 text-xs text-amber-800">{status.bottleneckInsight}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function MiniMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-0.5 text-lg font-bold tabular-nums text-ink">{value}</p>
    </div>
  )
}
