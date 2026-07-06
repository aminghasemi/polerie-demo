import type { ReactNode } from 'react'
import type { EveningStatus, Kpis, Order } from '../types'
import {
  formatCurrency,
  formatQtyDelta,
  formatQtyShort,
  formatSalesK,
} from '../utils/metrics'
import { KpiCard } from './KpiCard'

interface OverviewSectionProps {
  status: EveningStatus
  kpis: Kpis
  orders: Order[]
  onOpenOrder: (order: Order) => void
  demandIcons: { sales: ReactNode; orders: ReactNode }
  productionIcon: ReactNode
}

function DeltaBadge({ delta, invert = false }: { delta: number; invert?: boolean }) {
  if (delta === 0) return null
  const isGood = invert ? delta < 0 : delta > 0
  return (
    <span
      className={`ml-1.5 text-xs font-semibold tabular-nums ${
        isGood ? 'text-emerald-600' : 'text-red-600'
      }`}
    >
      {formatQtyDelta(delta)}
    </span>
  )
}

function StatusPill({
  emoji,
  label,
  value,
  delta,
  invertDelta,
  variant = 'default',
}: {
  emoji: string
  label: string
  value: string | number
  delta?: number
  invertDelta?: boolean
  variant?: 'default' | 'danger' | 'success'
}) {
  const ring =
    variant === 'danger'
      ? 'ring-red-200 bg-red-50'
      : variant === 'success'
        ? 'ring-emerald-200 bg-emerald-50'
        : 'ring-border bg-surface'

  return (
    <div className={`flex flex-col rounded-xl px-4 py-3 ring-1 ring-inset ${ring}`}>
      <span className="text-xs font-medium text-muted">
        {emoji} {label}
      </span>
      <span className="mt-1 flex items-baseline text-2xl font-bold tabular-nums text-ink">
        {value}
        {delta !== undefined && <DeltaBadge delta={delta} invert={invertDelta} />}
      </span>
    </div>
  )
}

const OPS_STAGE_COLORS: Record<string, string> = {
  Packing: 'bg-violet-500',
  Planning: 'bg-slate-400',
  'Prod-done': 'bg-amber-500',
  'In-production': 'bg-sky-500',
  'Part-dispatched': 'bg-teal-500',
}

export function OverviewSection({
  status,
  kpis,
  orders,
  onOpenOrder,
  demandIcons,
  productionIcon,
}: OverviewSectionProps) {
  const maxOverdue = Math.max(...status.overdueByStage.map((s) => s.count), 1)

  const openWorstOffender = () => {
    if (!status.worstOffender) return
    const order = orders.find((o) => o.ref === status.worstOffender!.ref)
    if (order) onOpenOrder(order)
  }

  return (
    <div
      className="overflow-hidden rounded-2xl bg-card ring-1 ring-border"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold text-ink">Overview</h2>
        <p className="mt-0.5 text-sm text-muted">
          Operational snapshot · {status.reportLabel}
        </p>
      </div>

      <div className="space-y-6 p-5">
        {/* Live snapshot */}
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatusPill emoji="🟢" label="Open" value={status.open} variant="success" />
          <StatusPill
            emoji="🔴"
            label="Overdue"
            value={status.overdue}
            delta={status.overdueDelta}
            invertDelta
            variant="danger"
          />
          <StatusPill
            emoji="📦"
            label="Backlog"
            value={formatQtyShort(status.backlogQty)}
            delta={status.backlogQtyDelta}
          />
          <StatusPill emoji="⚠️" label="Aged" value={kpis.agedOrders} variant="danger" />
          <StatusPill
            emoji="⛔"
            label="Blocked"
            value={kpis.blockedOrders}
            variant="danger"
          />
        </div>
        <p className="-mt-3 text-xs text-muted">
          {kpis.pctCriticallyAged}% of open orders are aged (&gt;5 days)
        </p>

        {/* Today + period KPIs */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-violet-600">
              Demand
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <KpiCard
                label="Sales value"
                value={formatCurrency(kpis.salesValue)}
                hint="In selected period"
                icon={demandIcons.sales}
                variant="violet"
              />
              <KpiCard
                label="Order volume"
                value={kpis.orderVolume}
                hint="New orders in period"
                icon={demandIcons.orders}
                variant="violet"
              />
            </div>
          </div>

          <div>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-teal-600">
              Production
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-surface p-4 ring-1 ring-inset ring-border">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                  Today
                </p>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm font-medium text-ink">
                  <span>📥 {status.intakeToday} in</span>
                  <span className="text-muted">·</span>
                  <span>✅ {status.doneToday} done</span>
                </div>
                <p className="mt-2 text-xs text-muted">
                  💷 {formatSalesK(status.salesMtd)} month to date
                </p>
              </div>
              <KpiCard
                label="Processed this week"
                value={kpis.processedThisWeek}
                hint="Mon – Sun"
                icon={productionIcon}
                variant="teal"
              />
            </div>
          </div>
        </div>

        {/* Overdue breakdown + worst offender */}
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-xl bg-surface p-4 ring-1 ring-inset ring-border">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
              <span aria-hidden>⛔</span> Overdue stuck at
            </h3>
            {status.overdueByStage.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No overdue orders — all on track.</p>
            ) : (
              <ul className="mt-3 space-y-2.5">
                {status.overdueByStage.map((item) => (
                  <li key={item.name} className="flex items-center gap-3">
                    <span className="w-10 shrink-0 text-sm font-semibold tabular-nums text-ink">
                      {item.count}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="truncate text-sm text-ink-muted">{item.name}</span>
                        <span className="text-xs tabular-nums text-muted">
                          {Math.round((item.count / status.overdue) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full ${OPS_STAGE_COLORS[item.name] ?? 'bg-slate-400'}`}
                          style={{ width: `${(item.count / maxOverdue) * 100}%` }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-amber-800">
              <span aria-hidden>→</span>
              {status.bottleneckInsight}
            </p>
            <p className="mt-1 text-xs text-muted">
              Avg {status.avgDaysLate.toFixed(1)} days late across {status.overdue} overdue orders
            </p>
          </div>

          {status.worstOffender ? (
            <button
              type="button"
              onClick={openWorstOffender}
              className="w-full rounded-xl bg-red-50 p-4 text-left ring-1 ring-inset ring-red-200 transition-colors hover:bg-red-100/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <h3 className="flex items-center gap-2 text-sm font-semibold text-red-900">
                <span aria-hidden>🔥</span> Worst offender
              </h3>
              <p className="mt-2 text-base font-bold text-red-950">
                {status.worstOffender.ref}{' '}
                <span className="font-semibold text-red-800">{status.worstOffender.customer}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-sm text-red-800">
                <span className="rounded-md bg-red-100 px-2 py-0.5 font-semibold tabular-nums ring-1 ring-red-200">
                  {status.worstOffender.daysLate}d late
                </span>
                <span className="rounded-md bg-red-100 px-2 py-0.5 font-medium tabular-nums ring-1 ring-red-200">
                  {status.worstOffender.quantity} qty
                </span>
                <span className="rounded-md bg-red-100 px-2 py-0.5 font-medium ring-1 ring-red-200">
                  {status.worstOffender.opsStage}
                </span>
              </div>
              <p className="mt-3 text-xs font-medium text-red-700/80">Click to view details →</p>
            </button>
          ) : (
            <div className="flex items-center justify-center rounded-xl bg-surface p-4 ring-1 ring-inset ring-border">
              <p className="text-sm text-muted">No overdue orders requiring escalation.</p>
            </div>
          )}
        </div>

        {/* Analysis */}
        <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-violet-900">
            <span aria-hidden>🧭</span> Analysis
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-violet-950/90">{status.analysis}</p>
        </div>
      </div>
    </div>
  )
}
