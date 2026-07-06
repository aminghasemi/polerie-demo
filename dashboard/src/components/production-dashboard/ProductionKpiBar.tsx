import type { ProductionKpis } from '../../types/productionDashboard'
import { formatQty } from '../../utils/productionDashboard'

function KpiCard({
  label,
  value,
  variant = 'default',
}: {
  label: string
  value: string
  variant?: 'default' | 'danger' | 'success' | 'warning'
}) {
  const styles = {
    default: 'ring-border bg-card',
    danger: 'ring-red-200 bg-red-50',
    success: 'ring-emerald-200 bg-emerald-50',
    warning: 'ring-amber-200 bg-amber-50',
  }
  const valueStyles = {
    default: 'text-ink',
    danger: 'text-red-800',
    success: 'text-emerald-800',
    warning: 'text-amber-800',
  }

  return (
    <div
      className={`rounded-xl px-4 py-3 ring-1 ring-inset ${styles[variant]}`}
      style={variant === 'default' ? { boxShadow: 'var(--shadow-card)' } : undefined}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${valueStyles[variant]}`}>
        {formatQty(value)}
      </p>
    </div>
  )
}

export function ProductionKpiBar({ kpis }: { kpis: ProductionKpis }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9">
      <KpiCard label="Open jobs" value={kpis.openJobs} />
      <KpiCard label="Backlog qty" value={kpis.backlogQuantity} variant="warning" />
      <KpiCard label="Jobs at risk" value={kpis.jobsAtRisk} variant="danger" />
      <KpiCard label="New today" value={kpis.newJobsToday} variant="success" />
      <KpiCard label="New yesterday" value={kpis.newJobsYesterday} />
      <KpiCard label="Closed today" value={kpis.closedToday} />
      <KpiCard label="CR's today" value={kpis.crsToday} />
      <KpiCard label="In production" value={kpis.productionInProgress} />
      <KpiCard label="Due this week" value={kpis.dueThisWeek} variant="warning" />
    </div>
  )
}
