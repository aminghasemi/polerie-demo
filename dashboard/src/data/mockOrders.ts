import { format, subDays } from 'date-fns'
import type { Order, OpsStage, Stage } from '../types'
import { OPEN_STAGES, STAGES } from '../types'

const CUSTOMERS = [
  'Merch Collective',
  'Urban Threads Co',
  'Campus Apparel Ltd',
  'Festival Gear UK',
  'Brand Studio North',
  'Retail Partners Group',
  'Sports Kit Direct',
  'Creative Print House',
  'Sandbag',
]

const BLOCKER_REASONS = [
  'Artwork approval pending',
  'Stock shortage — garment',
  'Colour match issue',
  'Customer hold',
  'Machine maintenance',
  'Missing shipping label',
]

const TODAY = new Date(2026, 5, 30, 19, 2) // 30 June 2026, 19:02

const STAGE_TO_OPS: Record<Stage, OpsStage> = {
  'Awaiting Pick': 'Planning',
  Printing: 'In-production',
  'Sorting / Packing': 'Packing',
  'Ready for Shipping': 'Part-dispatched',
  'Shipped / Completed': 'Prod-done',
}

const OPS_FOR_OPEN: OpsStage[] = [
  'Planning',
  'In-production',
  'Prod-done',
  'Packing',
  'Part-dispatched',
]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomQty(): number {
  const roll = Math.random()
  if (roll < 0.1) return 100 + Math.floor(Math.random() * 400)
  if (roll < 0.4) return 20 + Math.floor(Math.random() * 80)
  return 1 + Math.floor(Math.random() * 24)
}

function generateOrders(): Order[] {
  const orders: Order[] = []
  let seq = 1000
  const todayStart = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate())

  for (let dayOffset = 90; dayOffset >= 0; dayOffset--) {
    const intakeDate = subDays(todayStart, dayOffset)
    const dailyCount = 2 + Math.floor(Math.random() * 5)

    for (let i = 0; i < dailyCount; i++) {
      seq++
      const customer = randomItem(CUSTOMERS.filter((c) => c !== 'Sandbag'))
      const salesValue = 120 + Math.floor(Math.random() * 2800)
      const quantity = randomQty()
      const ageDays = dayOffset

      const promisedDate = subDays(intakeDate, -Math.floor(3 + Math.random() * 10))

      let stage: Stage
      let opsStage: OpsStage
      let completionDate: string | null = null
      let isBlocked = false
      let blockerReason: string | null = null

      if (ageDays > 3 && Math.random() < 0.72) {
        const completedDaysAgo = Math.floor(Math.random() * Math.min(ageDays, 14))
        completionDate = format(subDays(todayStart, completedDaysAgo), 'yyyy-MM-dd')
        stage = 'Shipped / Completed'
        opsStage = 'Prod-done'
      } else if (ageDays <= 1) {
        stage = randomItem(['Awaiting Pick', 'Printing'] as Stage[])
        opsStage = STAGE_TO_OPS[stage]
      } else if (ageDays <= 4) {
        stage = randomItem(['Printing', 'Sorting / Packing', 'Ready for Shipping'] as Stage[])
        opsStage = STAGE_TO_OPS[stage]
      } else {
        stage = randomItem(OPEN_STAGES)
        opsStage = randomItem(OPS_FOR_OPEN)
      }

      if (OPEN_STAGES.includes(stage) && Math.random() < 0.12) {
        isBlocked = true
        blockerReason = randomItem(BLOCKER_REASONS)
      }

      if (ageDays > 5 && OPEN_STAGES.includes(stage) && Math.random() < 0.4) {
        opsStage = randomItem(['Packing', 'Prod-done', 'Part-dispatched', 'Planning'] as OpsStage[])
        if (opsStage === 'Planning') stage = 'Awaiting Pick'
        else if (opsStage === 'In-production') stage = 'Printing'
        else if (opsStage === 'Packing') stage = 'Sorting / Packing'
        else if (opsStage === 'Part-dispatched') stage = 'Ready for Shipping'
        else stage = 'Sorting / Packing'
      }

      orders.push({
        id: `ord-${seq}`,
        ref: `DTG-${seq}`,
        customer,
        salesValue,
        quantity,
        intakeDate: format(intakeDate, 'yyyy-MM-dd'),
        promisedDate: format(promisedDate, 'yyyy-MM-dd'),
        completionDate,
        stage,
        opsStage,
        isBlocked,
        blockerReason,
      })
    }
  }

  // Pin critical worst-offender order (mirrors Alfy Telegram example)
  orders.push({
    id: 'ord-worst',
    ref: '26-2042',
    customer: 'Sandbag',
    salesValue: 4200,
    quantity: 250,
    intakeDate: format(subDays(todayStart, 60), 'yyyy-MM-dd'),
    promisedDate: format(subDays(todayStart, 49), 'yyyy-MM-dd'),
    completionDate: null,
    stage: 'Sorting / Packing',
    opsStage: 'Prod-done',
    isBlocked: false,
    blockerReason: null,
  })

  // Boost overdue distribution to align with evening report scale
  const openOrders = orders.filter((o) => OPEN_STAGES.includes(o.stage))
  for (const order of openOrders) {
    if (order.ref === '26-2042') continue
    const roll = Math.random()
    if (roll < 0.45) {
      order.promisedDate = format(subDays(todayStart, 1 + Math.floor(Math.random() * 20)), 'yyyy-MM-dd')
      const ops = weightedOpsStage()
      order.opsStage = ops
      order.stage = opsToDashboardStage(ops)
    }
  }

  return orders
}

function weightedOpsStage(): OpsStage {
  const r = Math.random()
  if (r < 0.34) return 'Packing'
  if (r < 0.6) return 'Planning'
  if (r < 0.78) return 'Prod-done'
  if (r < 0.9) return 'In-production'
  return 'Part-dispatched'
}

function opsToDashboardStage(ops: OpsStage): Stage {
  switch (ops) {
    case 'Planning':
      return 'Awaiting Pick'
    case 'In-production':
      return 'Printing'
    case 'Packing':
      return 'Sorting / Packing'
    case 'Part-dispatched':
      return 'Ready for Shipping'
    case 'Prod-done':
      return 'Sorting / Packing'
  }
}

export const MOCK_ORDERS: Order[] = generateOrders()
export const MOCK_CUSTOMERS = CUSTOMERS
export const DEMO_TODAY = TODAY
export const DEMO_DATA_AS_OF = format(TODAY, "EEE d MMM yyyy, HH:mm")
export const ALL_STAGES = [...STAGES]
