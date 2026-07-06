import type { Stage } from '../types'

const STAGE_STYLES: Record<Stage, string> = {
  'Awaiting Pick': 'bg-slate-100 text-slate-700 ring-slate-200',
  Printing: 'bg-violet-100 text-violet-800 ring-violet-200',
  'Sorting / Packing': 'bg-sky-100 text-sky-800 ring-sky-200',
  'Ready for Shipping': 'bg-teal-100 text-teal-800 ring-teal-200',
  'Shipped / Completed': 'bg-emerald-100 text-emerald-800 ring-emerald-200',
}

export const STAGE_CHART_COLORS: Record<Stage, string> = {
  'Awaiting Pick': '#94a3b8',
  Printing: '#7c3aed',
  'Sorting / Packing': '#0ea5e9',
  'Ready for Shipping': '#0d9488',
  'Shipped / Completed': '#10b981',
}

export function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STAGE_STYLES[stage]}`}
    >
      {stage}
    </span>
  )
}

export function AgeBadge({ days }: { days: number }) {
  if (days <= 3) {
    return (
      <span className="inline-flex min-w-[2rem] justify-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold tabular-nums text-emerald-700 ring-1 ring-inset ring-emerald-200">
        {days}d
      </span>
    )
  }
  if (days <= 5) {
    return (
      <span className="inline-flex min-w-[2rem] justify-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold tabular-nums text-amber-700 ring-1 ring-inset ring-amber-200">
        {days}d
      </span>
    )
  }
  return (
    <span className="inline-flex min-w-[2rem] justify-center rounded-md bg-red-50 px-2 py-0.5 text-xs font-bold tabular-nums text-red-700 ring-1 ring-inset ring-red-200">
      {days}d
    </span>
  )
}
