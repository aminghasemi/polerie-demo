import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { SEED_JOBS } from '../data/jobTracker'
import type { Job } from '../types/jobTracker'
import {
  buildJobFromForm,
  generateNextJobNumber,
  type JobIntakeFormValues,
} from '../utils/jobIntake'

const STORAGE_KEY = 'pixelgenie-submitted-jobs'

function loadSubmittedJobs(): Job[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Job[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveSubmittedJobs(jobs: Job[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
}

interface JobsContextValue {
  jobs: Job[]
  submittedJobs: Job[]
  addJobFromForm: (values: JobIntakeFormValues) => Job
  getJobByNumber: (jobNumber: string) => Job | undefined
}

const JobsContext = createContext<JobsContextValue | null>(null)

export function JobsProvider({ children }: { children: ReactNode }) {
  const [submittedJobs, setSubmittedJobs] = useState<Job[]>(loadSubmittedJobs)

  const jobs = useMemo(
    () => [...submittedJobs, ...SEED_JOBS],
    [submittedJobs],
  )

  const getJobByNumber = useCallback(
    (jobNumber: string) => jobs.find((j) => j.job_number === jobNumber),
    [jobs],
  )

  const addJobFromForm = useCallback(
    (values: JobIntakeFormValues) => {
      const jobNumber = generateNextJobNumber(jobs)
      const job = buildJobFromForm(values, jobNumber)
      setSubmittedJobs((prev) => {
        const next = [job, ...prev]
        saveSubmittedJobs(next)
        return next
      })
      return job
    },
    [jobs],
  )

  const value = useMemo(
    () => ({ jobs, submittedJobs, addJobFromForm, getJobByNumber }),
    [jobs, submittedJobs, addJobFromForm, getJobByNumber],
  )

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>
}

export function useJobs() {
  const ctx = useContext(JobsContext)
  if (!ctx) throw new Error('useJobs must be used within JobsProvider')
  return ctx
}
