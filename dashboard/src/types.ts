export const STAGES = [
  'Awaiting Pick',
  'Printing',
  'Sorting / Packing',
  'Ready for Shipping',
  'Shipped / Completed',
] as const

export type Stage = (typeof STAGES)[number]

export const OPEN_STAGES: Stage[] = [
  'Awaiting Pick',
  'Printing',
  'Sorting / Packing',
  'Ready for Shipping',
]

/** Operational stages used in Alfy evening reports */
export const OPS_STAGES = [
  'Planning',
  'In-production',
  'Prod-done',
  'Packing',
  'Part-dispatched',
] as const

export type OpsStage = (typeof OPS_STAGES)[number]

/** Stages considered "after production" for bottleneck analysis */
export const POST_PRODUCTION_OPS: OpsStage[] = [
  'Prod-done',
  'Packing',
  'Part-dispatched',
]

export interface Order {
  id: string
  ref: string
  customer: string
  salesValue: number
  quantity: number
  intakeDate: string
  promisedDate: string
  completionDate: string | null
  stage: Stage
  opsStage: OpsStage
  isBlocked: boolean
  blockerReason: string | null
}

export type DatePreset = 'today' | 'this_week' | 'last_7' | 'last_30' | 'last_90'

export type BlockedFilter = 'all' | 'blocked' | 'not_blocked'
export type AgedFilter = 'all' | 'aged' | 'not_aged'

export interface Filters {
  datePreset: DatePreset
  customers: string[]
  stages: Stage[]
  blocked: BlockedFilter
  aged: AgedFilter
}

export interface DailyPoint {
  date: string
  label: string
  value: number
  salesValue?: number
}

export interface NamedCount {
  name: string
  count: number
  value?: number
}

export interface Kpis {
  salesValue: number
  orderVolume: number
  openOrders: number
  processedToday: number
  processedThisWeek: number
  agedOrders: number
  blockedOrders: number
  pctCriticallyAged: number
}

export interface WorstOffender {
  ref: string
  customer: string
  daysLate: number
  quantity: number
  opsStage: OpsStage
}

export interface EveningStatus {
  reportLabel: string
  open: number
  overdue: number
  overdueDelta: number
  backlogQty: number
  backlogQtyDelta: number
  overdueByStage: NamedCount[]
  bottleneckPct: number
  bottleneckInsight: string
  worstOffender: WorstOffender | null
  intakeToday: number
  doneToday: number
  salesMtd: number
  avgDaysLate: number
  analysis: string
}
