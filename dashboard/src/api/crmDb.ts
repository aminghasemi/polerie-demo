import type {
  CrmChatMessage,
  CrmCustomerProfile,
  CrmManualAccount,
  CrmNote,
  CrmPortfolio,
  CrmPricingRecord,
  CrmPurchaseOrder,
  CrmSample,
} from '../types/crm'

export const CRM_DB_VERSION = '1'

export interface CrmProfileRow extends CrmCustomerProfile {
  id: string
  customerName: string
}

export interface CrmPortfolioRow extends CrmPortfolio {
  id: string
  customerName: string
}

export interface CrmSampleRow extends CrmSample {
  customerName: string
}

export interface CrmPricingRow extends CrmPricingRecord {
  customerName: string
}

export interface CrmPurchaseOrderRow extends CrmPurchaseOrder {
  customerName: string
}

export interface CrmDatabase {
  crmProfiles: CrmProfileRow[]
  crmManualAccounts: CrmManualAccount[]
  crmNotes: CrmNote[]
  crmPortfolios: CrmPortfolioRow[]
  crmSamples: CrmSampleRow[]
  crmPricing: CrmPricingRow[]
  crmPurchaseOrders: CrmPurchaseOrderRow[]
  crmChatMessages: CrmChatMessage[]
}

export interface CrmHydratedState {
  profiles: Record<string, CrmCustomerProfile>
  notes: CrmNote[]
  manualAccounts: CrmManualAccount[]
  portfolios: Record<string, CrmPortfolio>
  samples: Record<string, CrmSample[]>
  pricing: Record<string, CrmPricingRecord[]>
  pos: Record<string, CrmPurchaseOrder[]>
  chat: CrmChatMessage[]
}

const API_BASE = import.meta.env.VITE_CRM_API_URL as string | undefined

export function isCrmApiEnabled(): boolean {
  return Boolean(API_BASE?.trim())
}

export async function fetchCrmDatabase(): Promise<CrmDatabase> {
  if (isCrmApiEnabled()) {
    const base = API_BASE!.replace(/\/$/, '')
    const res = await fetch(`${base}/`)
    if (!res.ok) throw new Error(`CRM API unavailable (${res.status})`)
    return (await res.json()) as CrmDatabase
  }

  const res = await fetch(`${import.meta.env.BASE_URL}db.json`)
  if (!res.ok) throw new Error('Could not load db.json')
  return (await res.json()) as CrmDatabase
}

export function hydrateCrmState(db: CrmDatabase): CrmHydratedState {
  const profiles: Record<string, CrmCustomerProfile> = {}
  for (const row of db.crmProfiles) {
    const { id: _id, customerName, ...profile } = row
    profiles[customerName] = profile
  }

  const portfolios: Record<string, CrmPortfolio> = {}
  for (const row of db.crmPortfolios) {
    const { id: _id, customerName, ...portfolio } = row
    portfolios[customerName] = portfolio
  }

  const samples: Record<string, CrmSample[]> = {}
  for (const row of db.crmSamples) {
    const { customerName, ...sample } = row
    const list = samples[customerName] ?? []
    list.push(sample)
    samples[customerName] = list
  }

  const pricing: Record<string, CrmPricingRecord[]> = {}
  for (const row of db.crmPricing) {
    const { customerName, ...record } = row
    const list = pricing[customerName] ?? []
    list.push(record)
    pricing[customerName] = list
  }

  const pos: Record<string, CrmPurchaseOrder[]> = {}
  for (const row of db.crmPurchaseOrders) {
    const { customerName, ...record } = row
    const list = pos[customerName] ?? []
    list.push(record)
    pos[customerName] = list
  }

  return {
    profiles,
    notes: db.crmNotes,
    manualAccounts: db.crmManualAccounts,
    portfolios,
    samples,
    pricing,
    pos,
    chat: db.crmChatMessages,
  }
}

export function isLocalCrmEmpty(): boolean {
  const keys = [
    'pixelgenie-crm-profiles-v2',
    'pixelgenie-crm-notes',
    'pixelgenie-crm-manual-accounts',
    'pixelgenie-crm-portfolios',
    'pixelgenie-crm-samples',
    'pixelgenie-crm-pricing',
    'pixelgenie-crm-pos',
    'pixelgenie-crm-chat',
  ]
  return keys.every((key) => !localStorage.getItem(key))
}

export function getStoredDbVersion(): string | null {
  return localStorage.getItem('pixelgenie-crm-db-version')
}

export function markDbVersion(version: string) {
  localStorage.setItem('pixelgenie-crm-db-version', version)
}

export function clearCrmLocalStorage() {
  const keys = [
    'pixelgenie-crm-profiles-v2',
    'pixelgenie-crm-notes',
    'pixelgenie-crm-manual-accounts',
    'pixelgenie-crm-portfolios',
    'pixelgenie-crm-samples',
    'pixelgenie-crm-pricing',
    'pixelgenie-crm-pos',
    'pixelgenie-crm-chat',
    'pixelgenie-crm-db-version',
    'pixelgenie-crm-demo-seeded',
  ]
  for (const key of keys) localStorage.removeItem(key)
}
