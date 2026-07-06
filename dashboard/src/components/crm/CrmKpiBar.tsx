import type { CrmStats } from '../../types/crm'
import { formatGbp } from '../../utils/crm'

function StatCard({
  label,
  value,
  sub,
  variant = 'default',
}: {
  label: string
  value: string
  sub?: string
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
    <div className={`rounded-xl px-4 py-3 ring-1 ring-inset ${styles[variant]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${valueStyles[variant]}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
    </div>
  )
}

export function CrmKpiBar({ stats }: { stats: CrmStats }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      <StatCard label="Accounts" value={String(stats.accounts)} />
      <StatCard label="Active" value={String(stats.activeAccounts)} variant="success" />
      <StatCard label="Open jobs" value={String(stats.openJobs)} />
      <StatCard
        label="Pending approval"
        value={String(stats.pendingApproval)}
        variant="warning"
      />
      <StatCard label="Pipeline value" value={formatGbp(stats.pipelineValue)} variant="success" />
      <StatCard label="At risk" value={String(stats.atRiskAccounts)} variant="danger" />
    </div>
  )
}
