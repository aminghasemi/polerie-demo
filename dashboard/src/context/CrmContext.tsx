import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  CRM_DB_VERSION,
  clearCrmLocalStorage,
  fetchCrmDatabase,
  getStoredDbVersion,
  hydrateCrmState,
  isLocalCrmEmpty,
  markDbVersion,
  type CrmHydratedState,
} from '../api/crmDb'
import { createEmptySample } from '../data/crmDefaults'
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

function applyHydratedState(state: CrmHydratedState) {
  saveJson(KEYS.profiles, state.profiles)
  saveJson(KEYS.notes, state.notes)
  saveJson(KEYS.manualAccounts, state.manualAccounts)
  saveJson(KEYS.portfolios, state.portfolios)
  saveJson(KEYS.samples, state.samples)
  saveJson(KEYS.pricing, state.pricing)
  saveJson(KEYS.pos, state.pos)
  saveJson(KEYS.chat, state.chat)
  markDbVersion(CRM_DB_VERSION)
}

interface CrmContextValue {
  ready: boolean
  loading: boolean
  loadError: string | null
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
  isOnboardingVerified: (customerName: string) => boolean
  resetDemoData: () => Promise<void>
}

const CrmContext = createContext<CrmContextValue | null>(null)

export function CrmProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [profiles, setProfiles] = useState<Record<string, CrmCustomerProfile>>({})
  const [notes, setNotes] = useState<CrmNote[]>([])
  const [manualAccounts, setManualAccounts] = useState<CrmManualAccount[]>([])
  const [portfolios, setPortfolios] = useState<Record<string, CrmPortfolio>>({})
  const [samples, setSamples] = useState<Record<string, CrmSample[]>>({})
  const [pricing, setPricing] = useState<Record<string, CrmPricingRecord[]>>({})
  const [pos, setPos] = useState<Record<string, CrmPurchaseOrder[]>>({})
  const [chat, setChat] = useState<CrmChatMessage[]>([])

  const loadFromStorage = useCallback(() => {
    setProfiles(loadProfiles())
    setNotes(loadJson(KEYS.notes, []))
    setManualAccounts(loadJson(KEYS.manualAccounts, []))
    setPortfolios(loadJson(KEYS.portfolios, {}))
    setSamples(loadJson(KEYS.samples, {}))
    setPricing(loadJson(KEYS.pricing, {}))
    setPos(loadJson(KEYS.pos, {}))
    setChat(loadJson(KEYS.chat, []))
  }, [])

  const hydrateFromDb = useCallback(async (force = false) => {
    setLoading(true)
    setLoadError(null)
    try {
      const shouldSeed =
        force || isLocalCrmEmpty() || getStoredDbVersion() !== CRM_DB_VERSION
      if (shouldSeed) {
        const db = await fetchCrmDatabase()
        const state = hydrateCrmState(db)
        applyHydratedState(state)
        loadFromStorage()
      } else {
        loadFromStorage()
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load demo data')
      loadFromStorage()
    } finally {
      setLoading(false)
      setReady(true)
    }
  }, [loadFromStorage])

  useEffect(() => {
    void hydrateFromDb()
  }, [hydrateFromDb])

  const resetDemoData = useCallback(async () => {
    clearCrmLocalStorage()
    await hydrateFromDb(true)
  }, [hydrateFromDb])

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

  const createAccount = useCallback(
    (name: string, parentAccountName = '') => {
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
    },
    [updateProfile],
  )

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

  const isOnboardingVerified = useCallback(
    (customerName: string) => getProfile(customerName).onboardingStatus === 'verified',
    [getProfile],
  )

  const value = useMemo(
    () => ({
      ready,
      loading,
      loadError,
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
      isOnboardingVerified,
      resetDemoData,
    }),
    [
      ready,
      loading,
      loadError,
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
      isOnboardingVerified,
      resetDemoData,
    ],
  )

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>
}

export function useCrm() {
  const ctx = useContext(CrmContext)
  if (!ctx) throw new Error('useCrm must be used within CrmProvider')
  return ctx
}
