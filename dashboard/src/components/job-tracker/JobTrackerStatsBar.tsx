import type { JobTrackerStats } from '../../utils/jobTracker'

interface JobTrackerStatsBarProps {
  stats: JobTrackerStats
  activeFilter: string
  onFilter: (filter: string) => void
}

function StatCard({
  label,
  value,
  sub,
  active,
  onClick,
  accent,
}: {
  label: string
  value: number
  sub?: string
  active: boolean
  onClick: () => void
  accent?: 'violet' | 'amber' | 'red' | 'teal' | 'slate'
}) {
  const accents = {
    violet: 'ring-violet-300 bg-violet-50',
    amber: 'ring-amber-300 bg-amber-50',
    red: 'ring-red-300 bg-red-50',
    teal: 'ring-teal-300 bg-teal-50',
    slate: 'ring-slate-300 bg-slate-50',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-[120px] flex-1 flex-col rounded-xl px-4 py-3 text-left ring-1 ring-inset transition-all hover:-translate-y-0.5 hover:shadow-md ${
        active
          ? `${accents[accent ?? 'violet']} ring-2`
          : 'bg-card ring-border hover:ring-border-strong'
      }`}
      style={active ? undefined : { boxShadow: 'var(--shadow-card)' }}
    >
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</span>
      <span className="mt-1 text-2xl font-bold tabular-nums text-ink">{value}</span>
      {sub && <span className="mt-0.5 text-xs text-muted">{sub}</span>}
    </button>
  )
}

export function JobTrackerStatsBar({ stats, activeFilter, onFilter }: JobTrackerStatsBarProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      <StatCard
        label="All jobs"
        value={stats.total}
        active={activeFilter === 'all'}
        onClick={() => onFilter('all')}
        accent="violet"
      />
      <StatCard
        label="Pending"
        value={stats.pending}
        sub="Needs approval"
        active={activeFilter === 'pending'}
        onClick={() => onFilter('pending')}
        accent="amber"
      />
      <StatCard
        label="Approved"
        value={stats.approved}
        active={activeFilter === 'approved'}
        onClick={() => onFilter('approved')}
        accent="teal"
      />
      <StatCard
        label="On hold"
        value={stats.onHold}
        active={activeFilter === 'on_hold'}
        onClick={() => onFilter('on_hold')}
        accent="slate"
      />
      <StatCard
        label="Overdue"
        value={stats.overdue}
        sub="Due days &lt; 0"
        active={activeFilter === 'overdue'}
        onClick={() => onFilter('overdue')}
        accent="red"
      />
      <StatCard
        label="High priority"
        value={stats.highPriority}
        active={activeFilter === 'high_priority'}
        onClick={() => onFilter('high_priority')}
        accent="red"
      />
    </div>
  )
}
