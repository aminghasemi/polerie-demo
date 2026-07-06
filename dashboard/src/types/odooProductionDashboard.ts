export interface OdooHeadlineKpi {
  label: string
  value: string | number
  footnote?: string
}

export interface OdooPrinterThroughput {
  name: string
  count: number
  model: string
}

export interface OdooTopProduct {
  product: string
  orders: number
  qtyProduced: number
}

export interface OdooUnavailableComponent {
  component: string
  manufacturingOrder: string
  demand: number
  purchaseOrder: string
}

export interface OdooProductionDashboardData {
  headlines: OdooHeadlineKpi[]
  manufacturingStages: OdooHeadlineKpi[]
  printerThroughput: OdooPrinterThroughput[]
  topProducts: OdooTopProduct[]
  blockedOrders: number
  blockedOrdersNote: string
  unavailableComponents: OdooUnavailableComponent[]
}
