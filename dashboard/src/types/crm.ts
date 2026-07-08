import type { Job } from './jobTracker'

export type CrmAccountStatus = 'pending-approval' | 'active' | 'at-risk' | 'quiet'

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
  isManual?: boolean
  parentAccountName?: string
  onboardingStatus?: OnboardingStatus
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

export type CrmDetailTab =
  | 'home'
  | 'portfolio'
  | 'samples'
  | 'production'
  | 'pricing'
  | 'pos'
  | 'activity'

export type OnboardingStatus = 'draft' | 'sent' | 'received' | 'credit_check' | 'verified'

export type DecorMethod = 'dtg' | 'screen' | 'embroidery' | 'dtf' | 'stickers' | 'other'
export type BackneckType = 'print' | 'heat_transfer' | 'none'
export type SampleApprovalStatus =
  | 'draft'
  | 'in_progress'
  | 'approved'
  | 'not_approved'
  | 'need_resample'
export type SampleInvoiceOption = 'invoice_now' | 'include_production' | 'photo_only'

export interface CrmCustomerProfile {
  companyName: string
  contactName: string
  email: string
  phone: string
  accountType: string
  deliveryAddress: string
  billingAddress: string
  website: string
  internalRef: string
  paymentTerms: string
  portalUrl: string
  portalNotes: string
  onboardingStatus: OnboardingStatus
  onboardingFileName: string
  parentAccountName: string
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

export interface CrmDtgDetails {
  placement: 'front' | 'back' | 'both' | ''
  artworkNumbers: string
}

export interface CrmScreenDetails {
  screensSetUp: boolean
  numberOfScreens: string
  numberOfColors: string
  screenArtwork: string
}

export interface CrmSampleIteration {
  version: number
  changeDescription: string
  author: string
  createdAt: string
}

export interface CrmSample {
  id: string
  sampleNumber: number
  styleName: string
  blankCode: string
  blankName: string
  blankColour: string
  decorMethod: DecorMethod | ''
  dtgDetails: CrmDtgDetails
  screenDetails: CrmScreenDetails
  backneckType: BackneckType | ''
  brandingNotes: string
  specialInstructions: string
  deliveryLocations: string[]
  approvalStatus: SampleApprovalStatus
  iterationNumber: number
  jobNumber: string
  poFileName: string
  blankCost: string
  marginPct: string
  sellPrice: string
  frontPrice: string
  backPrice: string
  invoiceOption: SampleInvoiceOption | ''
  iterations: CrmSampleIteration[]
  readyForMerch: boolean
}

export interface CrmPortfolioBlank {
  id: string
  code: string
  name: string
  techPackLink: string
  notes: string
}

export interface CrmPortfolioSupplier {
  id: string
  category: 'dtf' | 'swing_tags' | 'blanks' | 'barcodes'
  name: string
  phone: string
  notes: string
}

export interface CrmPortfolio {
  decorMethods: DecorMethod[]
  artworkLinks: string[]
  packagingNotes: string
  brandingNotes: string
  blanks: CrmPortfolioBlank[]
  suppliers: CrmPortfolioSupplier[]
}

export interface CrmPricingRecord {
  id: string
  title: string
  jobNumber: string
  sampleId: string
  blankCost: string
  marginPct: string
  sellPrice: string
  frontPrice: string
  backPrice: string
  fileName: string
  agreedAt: string
  agreedBy: string
}

export interface CrmPurchaseOrder {
  id: string
  poNumber: string
  jobNumber: string
  sampleId: string
  fileName: string
  status: 'received' | 'pending' | 'shortage'
  shortagesNotes: string
  invoiceStatus: 'draft' | 'sent' | 'paid' | ''
  xeroLink: string
}

export interface CrmChatMessage {
  id: string
  customerName: string
  contextType: string
  contextId: string
  body: string
  author: string
  createdAt: string
}

export interface CrmManualAccount {
  name: string
  parentAccountName: string
  createdAt: string
}

export const EMPTY_CRM_PROFILE: CrmCustomerProfile = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  accountType: '',
  deliveryAddress: '',
  billingAddress: '',
  website: '',
  internalRef: '',
  paymentTerms: '',
  portalUrl: '',
  portalNotes: '',
  onboardingStatus: 'draft',
  onboardingFileName: '',
  parentAccountName: '',
}

export const EMPTY_PORTFOLIO: CrmPortfolio = {
  decorMethods: [],
  artworkLinks: [],
  packagingNotes: '',
  brandingNotes: '',
  blanks: [],
  suppliers: [],
}

export const DECOR_METHOD_LABELS: Record<DecorMethod, string> = {
  dtg: 'DTG',
  screen: 'Screen print',
  embroidery: 'Embroidery',
  dtf: 'DTF (heat transfer)',
  stickers: 'Stickers',
  other: 'Other',
}

export const ONBOARDING_STATUS_LABELS: Record<OnboardingStatus, string> = {
  draft: 'Draft',
  sent: 'Form sent',
  received: 'Form received',
  credit_check: 'Credit check',
  verified: 'Verified',
}

export const SAMPLE_STATUS_LABELS: Record<SampleApprovalStatus, string> = {
  draft: 'Draft',
  in_progress: 'In progress',
  approved: 'Approved',
  not_approved: 'Not approved',
  need_resample: 'Need resample',
}
