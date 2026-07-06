import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJobs } from '../context/JobsContext'
import { productionDashboard } from '../data/productionDashboard'
import { JobDetailModal } from '../components/job-tracker/JobDetailModal'
import { JobIntakeSection } from '../components/production-dashboard/JobIntakeSection'
import { ProductionKpiBar } from '../components/production-dashboard/ProductionKpiBar'
import { MachinesPanel } from '../components/production-dashboard/MachinesPanel'
import { DispatchRiskPanel } from '../components/production-dashboard/DispatchRiskPanel'
import { CustomerOverviewPanel } from '../components/production-dashboard/CustomerOverviewPanel'
import { mergeProductionKpis } from '../utils/productionKpis'
import type { Job } from '../types/jobTracker'

export function ProductionDashboardPage() {
  const navigate = useNavigate()
  const { jobs, submittedJobs, getJobByNumber } = useJobs()
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const data = productionDashboard

  const jobNumbers = useMemo(
    () => jobs.map((j) => j.job_number).filter(Boolean),
    [jobs],
  )

  const liveKpis = useMemo(
    () => mergeProductionKpis(data.kpis, submittedJobs),
    [data.kpis, submittedJobs],
  )

  const openOrder = (orderNumber: string) => {
    const job = getJobByNumber(orderNumber)
    if (job) setSelectedJob(job)
  }

  const openJobByNumber = (jobNumber: string) => {
    const job = getJobByNumber(jobNumber)
    if (job) setSelectedJob(job)
  }

  const filterCustomerOnTracker = (customer: string) => {
    navigate(`/job-tracker?customer=${encodeURIComponent(customer)}`)
  }

  return (
    <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6">
      <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />

      <JobIntakeSection
        intake={data.jobIntake}
        jobNumbers={jobNumbers}
        onSelectJob={openJobByNumber}
      />

      <div>
        <h2 className="text-xl font-bold text-ink">{data.title}</h2>
        <p className="mt-1 text-sm text-muted">
          As of <span className="font-medium text-ink-muted">{data.reportDate}</span>
        </p>
      </div>

      <ProductionKpiBar kpis={liveKpis} />

      <MachinesPanel machines={data.machines} />

      <DispatchRiskPanel
        dispatched={data.dispatchedToday}
        atRisk={data.ordersAtRisk}
        onSelectOrder={openOrder}
      />

      <CustomerOverviewPanel
        customers={data.customerOverview}
        onSelectCustomer={filterCustomerOnTracker}
      />

      {data.operationalSummary && (
        <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 p-5">
          <h3 className="text-sm font-semibold text-violet-900">Operational summary</h3>
          <p className="mt-2 text-sm leading-relaxed text-violet-950/90">
            {data.operationalSummary}
          </p>
        </div>
      )}
    </main>
  )
}
