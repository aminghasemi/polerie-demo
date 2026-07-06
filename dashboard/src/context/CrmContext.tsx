import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CrmCustomerProfile, CrmNote } from '../types/crm'
import { EMPTY_CRM_PROFILE } from '../types/crm'

const PROFILES_KEY = 'pixelgenie-crm-profiles'
const NOTES_KEY = 'pixelgenie-crm-notes'

function loadProfiles(): Record<string, CrmCustomerProfile> {
  try {
    const raw = localStorage.getItem(PROFILES_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, CrmCustomerProfile>
  } catch {
    return {}
  }
}

function loadNotes(): CrmNote[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CrmNote[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

interface CrmContextValue {
  getProfile: (customerName: string) => CrmCustomerProfile
  updateProfile: (customerName: string, patch: Partial<CrmCustomerProfile>) => void
  getNotes: (customerName: string) => CrmNote[]
  addNote: (customerName: string, body: string, author?: string) => CrmNote
  deleteNote: (noteId: string) => void
}

const CrmContext = createContext<CrmContextValue | null>(null)

export function CrmProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Record<string, CrmCustomerProfile>>(loadProfiles)
  const [notes, setNotes] = useState<CrmNote[]>(loadNotes)

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
      localStorage.setItem(PROFILES_KEY, JSON.stringify(next))
      return next
    })
  }, [])

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
      localStorage.setItem(NOTES_KEY, JSON.stringify(next))
      return next
    })
    return note
  }, [])

  const deleteNote = useCallback((noteId: string) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== noteId)
      localStorage.setItem(NOTES_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ getProfile, updateProfile, getNotes, addNote, deleteNote }),
    [getProfile, updateProfile, getNotes, addNote, deleteNote],
  )

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>
}

export function useCrm() {
  const ctx = useContext(CrmContext)
  if (!ctx) throw new Error('useCrm must be used within CrmProvider')
  return ctx
}
