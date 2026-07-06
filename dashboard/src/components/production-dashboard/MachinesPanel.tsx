import { Fragment } from 'react'
import type { MachineRow } from '../../types/productionDashboard'
import {
  MACHINE_GROUP_LABELS,
  daysDueBadge,
  machineGroup,
  machineGroupColor,
} from '../../utils/productionDashboard'
import { jobStageStyle } from '../../utils/jobTracker'

interface MachinesPanelProps {
  machines: MachineRow[]
}

export function MachinesPanel({ machines }: MachinesPanelProps) {
  const grouped = machines.reduce(
    (acc, m) => {
      const g = machineGroup(m.machine)
      if (!acc[g]) acc[g] = []
      acc[g].push(m)
      return acc
    },
    {} as Record<string, MachineRow[]>,
  )

  return (
    <div
      className="overflow-hidden rounded-2xl bg-card ring-1 ring-border"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-ink">Machines</h3>
        <p className="mt-0.5 text-xs text-muted">Live station planning and active jobs</p>
      </div>
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface/80 text-[11px] uppercase tracking-wider text-muted">
              <th className="px-4 py-3 font-semibold">Machine</th>
              <th className="px-4 py-3 font-semibold">Planning</th>
              <th className="px-4 py-3 font-semibold">In progress</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Days due</th>
              <th className="px-4 py-3 font-semibold">Priority</th>
              <th className="px-4 py-3 font-semibold">Qty</th>
            </tr>
          </thead>
          <tbody>
            {(Object.keys(MACHINE_GROUP_LABELS) as (keyof typeof MACHINE_GROUP_LABELS)[]).map(
              (group) => {
                const rows = grouped[group]
                if (!rows?.length) return null
                return (
                  <Fragment key={group}>
                    <tr className="bg-surface/60">
                      <td
                        colSpan={7}
                        className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted"
                      >
                        {MACHINE_GROUP_LABELS[group]}
                      </td>
                    </tr>
                    {rows.map((m) => {
                      const active = m.inProgress !== 'No Active Job'
                      return (
                        <tr
                          key={m.machine}
                          className={`border-b border-border/40 transition-colors ${
                            active ? 'bg-violet-50/40' : 'hover:bg-surface/50'
                          }`}
                        >
                          <td className="px-4 py-2.5">
                            <span
                              className={`inline-flex rounded-md px-2 py-0.5 font-mono text-xs font-bold ring-1 ring-inset ${machineGroupColor(group)}`}
                            >
                              {m.machine}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-xs text-ink-muted">{m.planning || '—'}</td>
                          <td className="px-4 py-2.5">
                            {active ? (
                              <span
                                className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${jobStageStyle(m.inProgress)}`}
                              >
                                {m.inProgress}
                              </span>
                            ) : (
                              <span className="text-xs text-muted">{m.inProgress || '—'}</span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-xs font-medium text-ink">
                            {m.customer || '—'}
                          </td>
                          <td className="px-4 py-2.5">
                            {m.daysDue ? (
                              <span
                                className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums ring-1 ring-inset ${daysDueBadge(m.daysDue)}`}
                              >
                                {m.daysDue}d
                              </span>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-xs text-ink-muted">{m.priority || '—'}</td>
                          <td className="px-4 py-2.5 text-xs font-semibold tabular-nums">
                            {m.orderQty || '—'}
                          </td>
                        </tr>
                      )
                    })}
                  </Fragment>
                )
              },
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
