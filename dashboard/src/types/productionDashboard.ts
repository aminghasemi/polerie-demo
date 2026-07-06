export interface ProductionKpis {
  openJobs: string
  backlogQuantity: string
  jobsAtRisk: string
  newJobsToday: string
  newJobsYesterday: string
  closedToday: string
  crsToday: string
  productionInProgress: string
  dueThisWeek: string
}

export interface MachineRow {
  machine: string
  planning: string
  inProgress: string
  customer: string
  daysDue: string
  priority: string
  orderQty: string
}

export interface DispatchRow {
  slot: string
  orderNumber: string
  customer: string
  daysDue: string
  priority: string
  orderQty: string
}

export interface OrderAtRiskRow extends DispatchRow {
  jobStage: string
}

export interface CustomerOverviewRow {
  customer: string
  pendingApproval: string
  approvedJobs: string
  unitsAwaitingProduction: string
  backlogPct: string
  planning: string
  productionInProgress: string
  productionCompleted: string
  packingCompleted: string
  dispatched: string
  newlyApprovedJobs: string
  jobsDispatchedThisWeek: string
  dispatchedYtd: string
}

export interface WorkflowStep {
  step: number
  title: string
  description: string
  link?: string
}

export interface JobIntakeTools {
  deliverySplitHelper: { title: string; buttonLabel: string; url: string }
  createNewJob: { title: string; buttonLabel: string }
  duplicateJob: { title: string; selectLabel: string; sampleJobNumber: string }
}

export interface JobIntakeData {
  title: string
  intro: string
  workflowSteps: WorkflowStep[]
  tools: JobIntakeTools
}

export interface ProductionDashboardData {
  jobIntake: JobIntakeData
  title: string
  reportDate: string
  kpis: ProductionKpis
  kpiLabels?: Record<string, string>
  machines: MachineRow[]
  dispatchedToday: DispatchRow[]
  ordersAtRisk: OrderAtRiskRow[]
  customerOverview: CustomerOverviewRow[]
  operationalSummary: string
}
