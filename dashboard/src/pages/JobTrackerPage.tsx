import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useJobs } from '../context/JobsContext'
import { JobDetailModal } from '../components/job-tracker/JobDetailModal'
import { JobTrackerTable } from '../components/job-tracker/JobTrackerTable'
import { computeJobStats } from '../utils/jobTracker'
import type { Job } from '../types/jobTracker'

export function JobTrackerPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const customerFilter = searchParams.get('customer') ?? ''
  const jobParam = searchParams.get('job')
  const { jobs } = useJobs()
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const stats = useMemo(() => computeJobStats(jobs), [jobs])

  useEffect(() => {
    if (!jobParam) return
    const job = jobs.find((j) => j.job_number === jobParam)
    if (job) setSelectedJob(job)
  }, [jobParam, jobs])

  const closeModal = () => {
    setSelectedJob(null)
    if (jobParam) {
      const next = new URLSearchParams(searchParams)
      next.delete('job')
      setSearchParams(next, { replace: true })
    }
  }

  return (
    <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6">
      <JobDetailModal job={selectedJob} onClose={closeModal} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Production
          </p>
          <h2 className="mt-1 text-2xl font-bold text-ink">Job Tracker</h2>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted">
            Live view of the Job Sheet Tracker. New jobs start as{' '}
            <span className="font-medium text-ink-muted">Pending Approval</span> — merchandisers
            approve when ready for production.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
          <Link
            to="/job-intake"
            className="rounded-lg bg-violet-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-violet-700"
          >
            Submit new job
          </Link>
          <div className="flex gap-4 rounded-xl bg-card px-4 py-3 ring-1 ring-border">
            <div className="text-center">
              <p className="text-2xl font-bold tabular-nums text-ink">{stats.total}</p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Total jobs</p>
            </div>
            <div className="w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold tabular-nums text-red-700">{stats.overdue}</p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Overdue</p>
            </div>
          </div>
        </div>
      </div>

      <JobTrackerTable
        jobs={jobs}
        onOpenJob={setSelectedJob}
        initialSearch={customerFilter}
      />
    </main>
  )
}
