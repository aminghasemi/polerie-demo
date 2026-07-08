import { useMemo, useState } from 'react'
import { useCrm } from '../context/CrmContext'
import { useJobs } from '../context/JobsContext'
import { JobDetailModal } from '../components/job-tracker/JobDetailModal'
import { CrmAccountsSection } from '../components/crm/CrmAccountsSection'
import { CrmCustomerDetailPanel } from '../components/crm/CrmCustomerDetailPanel'
import { CrmKpiBar } from '../components/crm/CrmKpiBar'
import { buildCrmCustomers, computeCrmStats, mergeCrmCustomers } from '../utils/crm'
import type { CrmCustomer } from '../types/crm'
import type { Job } from '../types/jobTracker'

export function CrmPage() {
  const { jobs, getJobByNumber } = useJobs()
  const { manualAccounts, getProfile } = useCrm()
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

  return (
    <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6">
      <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      <CrmCustomerDetailPanel
        customer={selectedCustomer}
        allJobs={jobs}
        onClose={() => setSelectedCustomer(null)}
        onOpenJob={openJob}
      />

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Sales</p>
        <h2 className="mt-1 text-2xl font-bold text-ink">CRM</h2>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted">
          Merchandising CRM — onboarding, portfolio, samples, pricing, and POs linked to Job
          Tracker. Open an account for the full tabbed workspace.
        </p>
      </div>

      <CrmKpiBar stats={stats} />

      <CrmAccountsSection customers={customers} onSelectCustomer={setSelectedCustomer} />
    </main>
  )
}
