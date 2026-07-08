import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createEmptySample, demoSeedForAccount } from '../data/crmDefaults'
import type {
  CrmChatMessage,
  CrmCustomerProfile,
  CrmManualAccount,
  CrmNote,
  CrmPortfolio,
  CrmPricingRecord,
  CrmPurchaseOrder,
  CrmSample,
  OnboardingStatus,
} from '../types/crm'
import { EMPTY_CRM_PROFILE, EMPTY_PORTFOLIO } from '../types/crm'

const KEYS = {
  profiles: 'pixelgenie-crm-profiles-v2',
  notes: 'pixelgenie-crm-notes',
  manualAccounts: 'pixelgenie-crm-manual-accounts',
  portfolios: 'pixelgenie-crm-portfolios',
  samples: 'pixelgenie-crm-samples',
  pricing: 'pixelgenie-crm-pricing',
  pos: 'pixelgenie-crm-pos',
  chat: 'pixelgenie-crm-chat',
  seeded: 'pixelgenie-crm-demo-seeded',
} as const

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function saveJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

function migrateProfile(raw: Record<string, unknown>): CrmCustomerProfile {
  const base = { ...EMPTY_CRM_PROFILE }
  const legacy = raw as Partial<CrmCustomerProfile> & { address?: string }
  return {
    ...base,
    ...legacy,
    billingAddress: legacy.billingAddress || legacy.address || '',
    deliveryAddress: legacy.deliveryAddress || '',
    onboardingStatus: legacy.onboardingStatus ?? 'draft',
    onboardingFileName: legacy.onboardingFileName ?? '',
    portalUrl: legacy.portalUrl ?? '',
    portalNotes: legacy.portalNotes ?? '',
    parentAccountName: legacy.parentAccountName ?? '',
    companyName: legacy.companyName ?? '',
  }
}

function loadProfiles(): Record<string, CrmCustomerProfile> {
  const raw = loadJson<Record<string, unknown>>(KEYS.profiles, {})
  const out: Record<string, CrmCustomerProfile> = {}
  for (const [name, profile] of Object.entries(raw)) {
    out[name] = migrateProfile(profile as Record<string, unknown>)
  }
  return out
}

interface CrmContextValue {
  manualAccounts: CrmManualAccount[]
  createAccount: (name: string, parentAccountName?: string) => void
  getProfile: (customerName: string) => CrmCustomerProfile
  updateProfile: (customerName: string, patch: Partial<CrmCustomerProfile>) => void
  setOnboardingStatus: (customerName: string, status: OnboardingStatus) => void
  getNotes: (customerName: string) => CrmNote[]
  addNote: (customerName: string, body: string, author?: string) => CrmNote
  deleteNote: (noteId: string) => void
  getPortfolio: (customerName: string) => CrmPortfolio
  updatePortfolio: (customerName: string, portfolio: CrmPortfolio) => void
  getSamples: (customerName: string) => CrmSample[]
  addSample: (customerName: string) => CrmSample
  updateSample: (customerName: string, sample: CrmSample) => void
  deleteSample: (customerName: string, sampleId: string) => void
  getPricing: (customerName: string) => CrmPricingRecord[]
  addPricing: (customerName: string, record: Omit<CrmPricingRecord, 'id'>) => CrmPricingRecord
  updatePricing: (customerName: string, record: CrmPricingRecord) => void
  deletePricing: (customerName: string, id: string) => void
  getPurchaseOrders: (customerName: string) => CrmPurchaseOrder[]
  addPurchaseOrder: (
    customerName: string,
    record: Omit<CrmPurchaseOrder, 'id'>,
  ) => CrmPurchaseOrder
  updatePurchaseOrder: (customerName: string, record: CrmPurchaseOrder) => void
  deletePurchaseOrder: (customerName: string, id: string) => void
  getChatMessages: (customerName: string, contextType: string, contextId: string) => CrmChatMessage[]
  addChatMessage: (
    customerName: string,
    contextType: string,
    contextId: string,
    body: string,
    author?: string,
  ) => CrmChatMessage
  getAllActivity: (customerName: string) => CrmChatMessage[]
  ensureDemoSeed: (customerName: string) => void
  isOnboardingVerified: (customerName: string) => boolean
}

const CrmContext = createContext<CrmContextValue | null>(null)

export function CrmProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Record<string, CrmCustomerProfile>>(loadProfiles)
  const [notes, setNotes] = useState<CrmNote[]>(() => loadJson(KEYS.notes, []))
  const [manualAccounts, setManualAccounts] = useState<CrmManualAccount[]>(() =>
    loadJson(KEYS.manualAccounts, []),
  )
  const [portfolios, setPortfolios] = useState<Record<string, CrmPortfolio>>(() =>
    loadJson(KEYS.portfolios, {}),
  )
  const [samples, setSamples] = useState<Record<string, CrmSample[]>>(() =>
    loadJson(KEYS.samples, {}),
  )
  const [pricing, setPricing] = useState<Record<string, CrmPricingRecord[]>>(() =>
    loadJson(KEYS.pricing, {}),
  )
  const [pos, setPos] = useState<Record<string, CrmPurchaseOrder[]>>(() => loadJson(KEYS.pos, {}))
  const [chat, setChat] = useState<CrmChatMessage[]>(() => loadJson(KEYS.chat, []))
  const [seededAccounts, setSeededAccounts] = useState<Set<string>>(
    () => new Set(loadJson<string[]>(KEYS.seeded, [])),
  )

  const getProfile = useCallback(
    (customerName: string) => profiles[customerName] ?? { ...EMPTY_CRM_PROFILE },
    [profiles],
  )

  const updateProfile = useCallback((customerName: string, patch: Partial<CrmCustomerProfile>) => {
    setProfiles((prev) => {
      const next = {
        ...prev,
        [customerName]: { ...EMPTY_CRM_PROFILE, ...prev[customerName], ...patch },
      }
      saveJson(KEYS.profiles, next)
      return next
    })
  }, [])

  const setOnboardingStatus = useCallback(
    (customerName: string, status: OnboardingStatus) => {
      updateProfile(customerName, { onboardingStatus: status })
    },
    [updateProfile],
  )

  const createAccount = useCallback((name: string, parentAccountName = '') => {
    const trimmed = name.trim()
    if (!trimmed) return
    setManualAccounts((prev) => {
      if (prev.some((a) => a.name.toLowerCase() === trimmed.toLowerCase())) return prev
      const account: CrmManualAccount = {
        name: trimmed,
        parentAccountName,
        createdAt: new Date().toISOString(),
      }
      const next = [account, ...prev]
      saveJson(KEYS.manualAccounts, next)
      return next
    })
    updateProfile(trimmed, {
      companyName: trimmed,
      parentAccountName,
      onboardingStatus: 'draft',
    })
  }, [updateProfile])

  const getNotes = useCallback(
    (customerName: string) =>
      notes
        .filter((n) => n.customerName === customerName)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [notes],
  )

  const addNote = useCallback((customerName: string, body: string, author = 'You') => {
    const note: CrmNote = {
      id: crypto.randomUUID(),
      customerName,
      body: body.trim(),
      author,
      createdAt: new Date().toISOString(),
    }
    setNotes((prev) => {
      const next = [note, ...prev]
      saveJson(KEYS.notes, next)
      return next
    })
    return note
  }, [])

  const deleteNote = useCallback((noteId: string) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== noteId)
      saveJson(KEYS.notes, next)
      return next
    })
  }, [])

  const getPortfolio = useCallback(
    (customerName: string) => portfolios[customerName] ?? { ...EMPTY_PORTFOLIO },
    [portfolios],
  )

  const updatePortfolio = useCallback((customerName: string, portfolio: CrmPortfolio) => {
    setPortfolios((prev) => {
      const next = { ...prev, [customerName]: portfolio }
      saveJson(KEYS.portfolios, next)
      return next
    })
  }, [])

  const getSamples = useCallback(
    (customerName: string) => samples[customerName] ?? [],
    [samples],
  )

  const addSample = useCallback((customerName: string) => {
    let created!: CrmSample
    setSamples((prev) => {
      const existing = prev[customerName] ?? []
      const sample = createEmptySample(existing.length + 1)
      created = sample
      const next = { ...prev, [customerName]: [...existing, sample] }
      saveJson(KEYS.samples, next)
      return next
    })
    return created
  }, [])

  const updateSample = useCallback((customerName: string, sample: CrmSample) => {
    setSamples((prev) => {
      const list = (prev[customerName] ?? []).map((s) => (s.id === sample.id ? sample : s))
      const next = { ...prev, [customerName]: list }
      saveJson(KEYS.samples, next)
      return next
    })
  }, [])

  const deleteSample = useCallback((customerName: string, sampleId: string) => {
    setSamples((prev) => {
      const list = (prev[customerName] ?? []).filter((s) => s.id !== sampleId)
      const next = { ...prev, [customerName]: list }
      saveJson(KEYS.samples, next)
      return next
    })
  }, [])

  const getPricing = useCallback(
    (customerName: string) => pricing[customerName] ?? [],
    [pricing],
  )

  const addPricing = useCallback(
    (customerName: string, record: Omit<CrmPricingRecord, 'id'>) => {
      const item: CrmPricingRecord = { ...record, id: crypto.randomUUID() }
      setPricing((prev) => {
        const next = { ...prev, [customerName]: [...(prev[customerName] ?? []), item] }
        saveJson(KEYS.pricing, next)
        return next
      })
      return item
    },
    [],
  )

  const updatePricing = useCallback((customerName: string, record: CrmPricingRecord) => {
    setPricing((prev) => {
      const list = (prev[customerName] ?? []).map((p) => (p.id === record.id ? record : p))
      const next = { ...prev, [customerName]: list }
      saveJson(KEYS.pricing, next)
      return next
    })
  }, [])

  const deletePricing = useCallback((customerName: string, id: string) => {
    setPricing((prev) => {
      const list = (prev[customerName] ?? []).filter((p) => p.id !== id)
      const next = { ...prev, [customerName]: list }
      saveJson(KEYS.pricing, next)
      return next
    })
  }, [])

  const getPurchaseOrders = useCallback(
    (customerName: string) => pos[customerName] ?? [],
    [pos],
  )

  const addPurchaseOrder = useCallback(
    (customerName: string, record: Omit<CrmPurchaseOrder, 'id'>) => {
      const item: CrmPurchaseOrder = { ...record, id: crypto.randomUUID() }
      setPos((prev) => {
        const next = { ...prev, [customerName]: [...(prev[customerName] ?? []), item] }
        saveJson(KEYS.pos, next)
        return next
      })
      return item
    },
    [],
  )

  const updatePurchaseOrder = useCallback((customerName: string, record: CrmPurchaseOrder) => {
    setPos((prev) => {
      const list = (prev[customerName] ?? []).map((p) => (p.id === record.id ? record : p))
      const next = { ...prev, [customerName]: list }
      saveJson(KEYS.pos, next)
      return next
    })
  }, [])

  const deletePurchaseOrder = useCallback((customerName: string, id: string) => {
    setPos((prev) => {
      const list = (prev[customerName] ?? []).filter((p) => p.id !== id)
      const next = { ...prev, [customerName]: list }
      saveJson(KEYS.pos, next)
      return next
    })
  }, [])

  const getChatMessages = useCallback(
    (customerName: string, contextType: string, contextId: string) =>
      chat
        .filter(
          (m) =>
            m.customerName === customerName &&
            m.contextType === contextType &&
            m.contextId === contextId,
        )
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [chat],
  )

  const addChatMessage = useCallback(
    (
      customerName: string,
      contextType: string,
      contextId: string,
      body: string,
      author = 'You',
    ) => {
      const msg: CrmChatMessage = {
        id: crypto.randomUUID(),
        customerName,
        contextType,
        contextId,
        body: body.trim(),
        author,
        createdAt: new Date().toISOString(),
      }
      setChat((prev) => {
        const next = [...prev, msg]
        saveJson(KEYS.chat, next)
        return next
      })
      return msg
    },
    [],
  )

  const getAllActivity = useCallback(
    (customerName: string) =>
      chat
        .filter((m) => m.customerName === customerName)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [chat],
  )

  const ensureDemoSeed = useCallback(
    (customerName: string) => {
      if (seededAccounts.has(customerName)) return
      const seed = demoSeedForAccount(customerName)
      if (!seed) return

      if (seed.portfolio && !(customerName in portfolios)) {
        updatePortfolio(customerName, seed.portfolio)
      }
      if (seed.samples && !(customerName in samples)) {
        setSamples((prev) => {
          const next = { ...prev, [customerName]: seed.samples! }
          saveJson(KEYS.samples, next)
          return next
        })
      }

      setSeededAccounts((prev) => {
        const next = new Set(prev)
        next.add(customerName)
        saveJson(KEYS.seeded, [...next])
        return next
      })
    },
    [portfolios, samples, seededAccounts, updatePortfolio],
  )

  const isOnboardingVerified = useCallback(
    (customerName: string) => getProfile(customerName).onboardingStatus === 'verified',
    [getProfile],
  )

  const value = useMemo(
    () => ({
      manualAccounts,
      createAccount,
      getProfile,
      updateProfile,
      setOnboardingStatus,
      getNotes,
      addNote,
      deleteNote,
      getPortfolio,
      updatePortfolio,
      getSamples,
      addSample,
      updateSample,
      deleteSample,
      getPricing,
      addPricing,
      updatePricing,
      deletePricing,
      getPurchaseOrders,
      addPurchaseOrder,
      updatePurchaseOrder,
      deletePurchaseOrder,
      getChatMessages,
      addChatMessage,
      getAllActivity,
      ensureDemoSeed,
      isOnboardingVerified,
    }),
    [
      manualAccounts,
      createAccount,
      getProfile,
      updateProfile,
      setOnboardingStatus,
      getNotes,
      addNote,
      deleteNote,
      getPortfolio,
      updatePortfolio,
      getSamples,
      addSample,
      updateSample,
      deleteSample,
      getPricing,
      addPricing,
      updatePricing,
      deletePricing,
      getPurchaseOrders,
      addPurchaseOrder,
      updatePurchaseOrder,
      deletePurchaseOrder,
      getChatMessages,
      addChatMessage,
      getAllActivity,
      ensureDemoSeed,
      isOnboardingVerified,
    ],
  )

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>
}

export function useCrm() {
  const ctx = useContext(CrmContext)
  if (!ctx) throw new Error('useCrm must be used within CrmProvider')
  return ctx
}
