import { useMemo, useState } from 'react'
import { useCrm } from '../context/CrmContext'
import { useJobs } from '../context/JobsContext'
import { JobDetailModal } from '../components/job-tracker/JobDetailModal'
import { CrmAccountsSection } from '../components/crm/CrmAccountsSection'
import { CrmCustomerDetailPanel } from '../components/crm/CrmCustomerDetailPanel'
import { CrmDemoToolbar } from '../components/crm/CrmDemoToolbar'
import { CrmKpiBar } from '../components/crm/CrmKpiBar'
import { buildCrmCustomers, computeCrmStats, mergeCrmCustomers } from '../utils/crm'
import type { CrmCustomer } from '../types/crm'
import type { Job } from '../types/jobTracker'

export function CrmPage() {
  const { jobs, getJobByNumber } = useJobs()
  const { manualAccounts, getProfile, ready, loading, loadError, resetDemoData } = useCrm()
  const [selectedCustomer, setSelectedCustomer] = useState<CrmCustomer | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  const jobCustomers = useMemo(() => buildCrmCustomers(jobs), [jobs])

  const profiles = useMemo(() => {
    const names = new Set([
      ...jobCustomers.map((c) => c.name),
      ...manualAccounts.map((a) => a.name),
    ])
    const out: Record<string, ReturnType<typeof getProfile>> = {}
    for (const name of names) out[name] = getProfile(name)
    return out
  }, [jobCustomers, manualAccounts, getProfile])

  const customers = useMemo(
    () => mergeCrmCustomers(jobCustomers, manualAccounts, profiles),
    [jobCustomers, manualAccounts, profiles],
  )

  const stats = useMemo(() => computeCrmStats(customers), [customers])

  const openJob = (jobNumber: string) => {
    const job = getJobByNumber(jobNumber)
    if (job) setSelectedJob(job)
  }

  if (!ready) {
    return (
      <main className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="text-sm text-muted">Loading CRM demo data…</p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6">
      <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      <CrmCustomerDetailPanel
        customer={selectedCustomer}
        allJobs={jobs}
        onClose={() => setSelectedCustomer(null)}
        onOpenJob={openJob}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Sales</p>
          <h2 className="mt-1 text-2xl font-bold text-ink">Merchandising CRM</h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
            Onboarding through production — linked to Job Tracker by job number, not duplicate data.
          </p>
        </div>
      </div>

      <CrmDemoToolbar
        loading={loading}
        loadError={loadError}
        onReset={() => void resetDemoData()}
      />

      <CrmKpiBar stats={stats} />

      <CrmAccountsSection customers={customers} onSelectCustomer={setSelectedCustomer} />
    </main>
  )
}
