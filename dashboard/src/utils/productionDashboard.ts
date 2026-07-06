export function formatQty(n: string | number): string {
  const num = typeof n === 'string' ? parseInt(n.replace(/,/g, ''), 10) : n
  if (Number.isNaN(num)) return String(n)
  return num.toLocaleString('en-GB')
}

export function parseDaysDue(days: string): number | null {
  const n = parseInt(days, 10)
  return Number.isNaN(n) ? null : n
}

export function daysDueClass(days: string): string {
  const n = parseDaysDue(days)
  if (n === null) return 'text-muted'
  if (n < 0) return 'font-bold text-red-700'
  if (n <= 7) return 'font-semibold text-amber-700'
  return 'text-ink-muted'
}

export function daysDueBadge(days: string): string {
  const n = parseDaysDue(days)
  if (n === null) return 'bg-surface text-muted ring-border'
  if (n < 0) return 'bg-red-100 text-red-800 ring-red-200'
  if (n <= 7) return 'bg-amber-100 text-amber-800 ring-amber-200'
  return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
}

export function machineGroup(machine: string): 'screen' | 'emb' | 'sam' | 'dtg' | 'other' {
  if (machine.startsWith('MHM')) return 'screen'
  if (machine.startsWith('EMB')) return 'emb'
  if (machine.startsWith('SAM')) return 'sam'
  if (machine.startsWith('DTG')) return 'dtg'
  return 'other'
}

export const MACHINE_GROUP_LABELS = {
  screen: 'Screen Print',
  emb: 'Embroidery',
  sam: 'Sampling',
  dtg: 'DTG',
  other: 'Other',
} as const

export function machineGroupColor(group: keyof typeof MACHINE_GROUP_LABELS): string {
  const colors = {
    screen: 'bg-violet-100 text-violet-800 ring-violet-200',
    emb: 'bg-sky-100 text-sky-800 ring-sky-200',
    sam: 'bg-amber-100 text-amber-800 ring-amber-200',
    dtg: 'bg-teal-100 text-teal-800 ring-teal-200',
    other: 'bg-slate-100 text-slate-600 ring-slate-200',
  }
  return colors[group]
}
