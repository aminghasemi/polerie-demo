import {
  endOfWeek,
  format,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from 'date-fns'
import type {
  AgedFilter,
  BlockedFilter,
  DailyPoint,
  EveningStatus,
  Filters,
  Kpis,
  NamedCount,
  Order,
  OpsStage,
  Stage,
} from '../types'
import { OPEN_STAGES, OPS_STAGES, POST_PRODUCTION_OPS } from '../types'
import { DEMO_TODAY } from '../data/mockOrders'

const AGED_THRESHOLD_DAYS = 5
const TODAY = startOfDay(DEMO_TODAY)

export function getAgeDays(order: Order): number {
  const intake = startOfDay(parseISO(order.intakeDate))
  return Math.floor((TODAY.getTime() - intake.getTime()) / (1000 * 60 * 60 * 24))
}

export function getDaysLate(order: Order): number {
  const promised = startOfDay(parseISO(order.promisedDate))
  const diff = Math.floor((TODAY.getTime() - promised.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

export function isOpen(order: Order): boolean {
  return OPEN_STAGES.includes(order.stage)
}

export function isOverdue(order: Order): boolean {
  return isOpen(order) && getDaysLate(order) > 0
}

export function isAged(order: Order): boolean {
  return isOpen(order) && getAgeDays(order) > AGED_THRESHOLD_DAYS
}

export function getDateRange(preset: Filters['datePreset']): { start: Date; end: Date } {
  const end = TODAY
  switch (preset) {
    case 'today':
      return { start: TODAY, end }
    case 'this_week':
      return { start: startOfWeek(TODAY, { weekStartsOn: 1 }), end }
    case 'last_7':
      return { start: subDays(TODAY, 6), end }
    case 'last_30':
      return { start: subDays(TODAY, 29), end }
    case 'last_90':
      return { start: subDays(TODAY, 89), end }
  }
}

function matchesBlocked(order: Order, filter: BlockedFilter): boolean {
  if (filter === 'all') return true
  if (filter === 'blocked') return order.isBlocked && isOpen(order)
  return !order.isBlocked || !isOpen(order)
}

function matchesAged(order: Order, filter: AgedFilter): boolean {
  if (filter === 'all') return true
  if (filter === 'aged') return isAged(order)
  return !isAged(order)
}

export function filterOrders(orders: Order[], filters: Filters): Order[] {
  const { start, end } = getDateRange(filters.datePreset)

  return orders.filter((order) => {
    const intake = parseISO(order.intakeDate)
    const inRange = isWithinInterval(intake, { start, end })
    return inRange && matchesDetailFilters(order, filters)
  })
}

export function filterOpenSnapshot(orders: Order[], filters: Filters): Order[] {
  return orders.filter((order) => isOpen(order) && matchesDetailFilters(order, filters))
}

function matchesDetailFilters(order: Order, filters: Filters): boolean {
  const customerMatch =
    filters.customers.length === 0 || filters.customers.includes(order.customer)
  const stageMatch = filters.stages.length === 0 || filters.stages.includes(order.stage)
  const blockedMatch = matchesBlocked(order, filters.blocked)
  const agedMatch = matchesAged(order, filters.aged)
  return customerMatch && stageMatch && blockedMatch && agedMatch
}

export function computeKpis(allOrders: Order[], filteredIntake: Order[]): Kpis {
  const openOrders = allOrders.filter(isOpen)
  const weekStart = startOfWeek(TODAY, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(TODAY, { weekStartsOn: 1 })
  const todayStr = format(TODAY, 'yyyy-MM-dd')

  const processedToday = allOrders.filter((o) => o.completionDate === todayStr).length

  const processedThisWeek = allOrders.filter((o) => {
    if (!o.completionDate) return false
    const d = parseISO(o.completionDate)
    return isWithinInterval(d, { start: weekStart, end: weekEnd })
  }).length

  const agedOrders = openOrders.filter(isAged).length
  const blockedOrders = openOrders.filter((o) => o.isBlocked).length

  return {
    salesValue: filteredIntake.reduce((sum, o) => sum + o.salesValue, 0),
    orderVolume: filteredIntake.length,
    openOrders: openOrders.length,
    processedToday,
    processedThisWeek,
    agedOrders,
    blockedOrders,
    pctCriticallyAged: openOrders.length
      ? Math.round((agedOrders / openOrders.length) * 100)
      : 0,
  }
}

function sumOpenQty(orders: Order[]): number {
  return orders.filter(isOpen).reduce((sum, o) => sum + o.quantity, 0)
}

function countOverdue(orders: Order[]): number {
  return orders.filter(isOverdue).length
}

function overdueByOpsStage(orders: Order[]): NamedCount[] {
  const counts = new Map<OpsStage, number>()
  for (const stage of OPS_STAGES) counts.set(stage, 0)

  for (const order of orders.filter(isOverdue)) {
    counts.set(order.opsStage, (counts.get(order.opsStage) ?? 0) + 1)
  }

  return OPS_STAGES.map((name) => ({ name, count: counts.get(name) ?? 0 }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count)
}

function formatQtyShort(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

function buildAnalysis(
  overdue: number,
  avgDaysLate: number,
  topStage: NamedCount | undefined,
  bottleneckPct: number,
  worst: EveningStatus['worstOffender'],
): string {
  const parts: string[] = []

  parts.push(
    `We have ${overdue} orders overdue by an average of ${avgDaysLate.toFixed(1)} days`,
  )

  if (topStage) {
    parts.push(
      `with the binding constraint in ${topStage.name} (${topStage.count} orders stuck)`,
    )
  }

  if (worst) {
    parts.push(
      `Order ${worst.ref} is critically delayed at ${worst.daysLate} days`,
    )
  }

  if (bottleneckPct >= 50) {
    parts.push(
      `Immediate action: audit ${topStage?.name.toLowerCase() ?? 'downstream'} capacity and clear completed-but-unpacked orders today to prevent further aging`,
    )
  } else {
    parts.push(
      'Focus on upstream planning and production to prevent overdue orders accumulating',
    )
  }

  return parts.join('. ') + '.'
}

/** Evening status report — mirrors Alfy Telegram format */
export function computeEveningStatus(orders: Order[]): EveningStatus {
  const open = orders.filter(isOpen)
  const overdueOrders = orders.filter(isOverdue)
  const overdue = overdueOrders.length
  const backlogQty = sumOpenQty(orders)

  // Deltas vs simulated prior evening (shift promised dates +1 day for yesterday snapshot)
  const yesterdayOrders = orders.map((o) => ({
    ...o,
    promisedDate: format(subDays(parseISO(o.promisedDate), 1), 'yyyy-MM-dd'),
  }))
  const overdueYesterday = countOverdue(yesterdayOrders)
  const backlogQtyYesterday = sumOpenQty(yesterdayOrders)

  const overdueDelta = overdue - overdueYesterday
  const backlogQtyDelta = backlogQty - backlogQtyYesterday

  const byStage = overdueByOpsStage(orders)
  const postProdOverdue = overdueOrders.filter((o) =>
    POST_PRODUCTION_OPS.includes(o.opsStage),
  ).length
  const bottleneckPct = overdue ? Math.round((postProdOverdue / overdue) * 100) : 0

  const topStage = byStage[0]
  const bottleneckInsight =
    bottleneckPct >= 50
      ? `${bottleneckPct}% after production · dispatch bottleneck`
      : `${bottleneckPct}% after production · upstream constraint`

  const worst = overdueOrders
    .slice()
    .sort((a, b) => getDaysLate(b) - getDaysLate(a))[0]

  const worstOffender = worst
    ? {
        ref: worst.ref,
        customer: worst.customer,
        daysLate: getDaysLate(worst),
        quantity: worst.quantity,
        opsStage: worst.opsStage,
      }
    : null

  const todayStr = format(TODAY, 'yyyy-MM-dd')
  const monthStart = startOfMonth(TODAY)

  const intakeToday = orders.filter((o) => o.intakeDate === todayStr).length
  const doneToday = orders.filter((o) => o.completionDate === todayStr).length
  const salesMtd = orders
    .filter((o) => isWithinInterval(parseISO(o.intakeDate), { start: monthStart, end: TODAY }))
    .reduce((sum, o) => sum + o.salesValue, 0)

  const avgDaysLate = overdue
    ? overdueOrders.reduce((s, o) => s + getDaysLate(o), 0) / overdue
    : 0

  return {
    reportLabel: format(DEMO_TODAY, 'EEE HH:mm'),
    open: open.length,
    overdue,
    overdueDelta,
    backlogQty,
    backlogQtyDelta,
    overdueByStage: byStage,
    bottleneckPct,
    bottleneckInsight,
    worstOffender,
    intakeToday,
    doneToday,
    salesMtd,
    avgDaysLate,
    analysis: buildAnalysis(overdue, avgDaysLate, topStage, bottleneckPct, worstOffender),
  }
}

export function formatQtyDelta(n: number): string {
  const sign = n > 0 ? '▲' : n < 0 ? '▼' : '—'
  const abs = Math.abs(n)
  const formatted = abs >= 1000 ? `${(abs / 1000).toFixed(1)}k` : String(abs)
  return `${sign}${formatted}`
}

export { formatQtyShort }

export function salesTrend(orders: Order[]): DailyPoint[] {
  const byDate = new Map<string, { count: number; salesValue: number }>()

  for (const order of orders) {
    const existing = byDate.get(order.intakeDate) ?? { count: 0, salesValue: 0 }
    existing.count += 1
    existing.salesValue += order.salesValue
    byDate.set(order.intakeDate, existing)
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { count, salesValue }]) => ({
      date,
      label: format(parseISO(date), 'd MMM'),
      value: count,
      salesValue,
    }))
}

export function productionTrend(orders: Order[]): DailyPoint[] {
  const byDate = new Map<string, number>()

  for (const order of orders) {
    if (!order.completionDate) continue
    byDate.set(order.completionDate, (byDate.get(order.completionDate) ?? 0) + 1)
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({
      date,
      label: format(parseISO(date), 'd MMM'),
      value,
    }))
}

export function backlogTrend(allOrders: Order[]): DailyPoint[] {
  const { start, end } = getDateRange('last_30')
  const points: DailyPoint[] = []

  for (let d = start; d <= end; d = addDay(d)) {
    const openCount = allOrders.filter((o) => {
      const intake = parseISO(o.intakeDate)
      if (intake > d) return false
      if (!o.completionDate) return true
      return parseISO(o.completionDate) > d
    }).length

    points.push({
      date: format(d, 'yyyy-MM-dd'),
      label: format(d, 'd MMM'),
      value: openCount,
    })
  }

  return points
}

function addDay(date: Date): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + 1)
  return next
}

export function openByCustomer(orders: Order[]): NamedCount[] {
  const counts = new Map<string, number>()

  for (const order of orders) {
    counts.set(order.customer, (counts.get(order.customer) ?? 0) + 1)
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export function stageBreakdown(orders: Order[]): NamedCount[] {
  const counts = new Map<Stage, number>()

  for (const order of orders) {
    counts.set(order.stage, (counts.get(order.stage) ?? 0) + 1)
  }

  return OPEN_STAGES.map((name) => ({
    name,
    count: counts.get(name) ?? 0,
  }))
}

export function exceptionOrders(orders: Order[]): Order[] {
  return orders
    .filter((o) => isOpen(o) && (isAged(o) || o.isBlocked || isOverdue(o)))
    .sort((a, b) => getDaysLate(b) - getDaysLate(a))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatSalesK(value: number): string {
  if (value >= 1000) return `£${(value / 1000).toFixed(0)}k`
  return formatCurrency(value)
}
