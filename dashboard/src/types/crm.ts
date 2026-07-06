import type { Job } from './jobTracker'

export type CrmAccountStatus = 'pending-approval' | 'active' | 'at-risk' | 'quiet'

/** @deprecated Use CrmAccountStatus */
export type CrmHealth = CrmAccountStatus | 'active' | 'at-risk' | 'quiet'

export interface CrmCustomer {
  name: string
  merchandiser: string
  primaryChannel: string
  totalJobs: number
  openJobs: number
  pendingApproval: number
  overdueJobs: number
  totalUnits: number
  estimatedValue: number
  lastActivityDate: string
  status: CrmAccountStatus
  recentJobs: Job[]
}

export interface CrmStats {
  accounts: number
  activeAccounts: number
  openJobs: number
  pendingApproval: number
  pipelineValue: number
  atRiskAccounts: number
  pendingApprovalAccounts: number
}

export type CrmViewMode = 'table' | 'kanban'

export type CrmDetailTab = 'overview' | 'account' | 'jobs' | 'notes'

export interface CrmCustomerProfile {
  contactName: string
  email: string
  phone: string
  accountType: string
  address: string
  website: string
  internalRef: string
  paymentTerms: string
}

export interface CrmNote {
  id: string
  customerName: string
  body: string
  author: string
  createdAt: string
}

export interface CrmCustomerInsights {
  channels: string[]
  merchandisers: string[]
  departments: string[]
  deliveryLocations: string[]
  lifetimeValue: number
  lifetimeUnits: number
  completedJobs: number
  firstActivity: string
  lastActivity: string
  topOperations: string[]
}

export const EMPTY_CRM_PROFILE: CrmCustomerProfile = {
  contactName: '',
  email: '',
  phone: '',
  accountType: '',
  address: '',
  website: '',
  internalRef: '',
  paymentTerms: '',
}
