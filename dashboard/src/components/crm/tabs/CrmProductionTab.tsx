import { Link } from 'react-router-dom'
import type { CrmSample } from '../../../types/crm'
import { SAMPLE_STATUS_LABELS } from '../../../types/crm'
import { sampleStatusStyle } from '../../../data/crmDefaults'
import { SectionCard } from '../crmUi'

interface CrmProductionTabProps {
  customerName: string
  samples: CrmSample[]
  onOpenJob: (jobNumber: string) => void
}

export function CrmProductionTab({
  customerName,
  samples,
  onOpenJob,
}: CrmProductionTabProps) {
  const linked = samples.filter((s) => s.jobNumber.trim())
  const approved = samples.filter((s) => s.approvalStatus === 'approved')

  return (
    <div className="space-y-6">
      <SectionCard
        title="In production"
        description="Job numbers only — full job data lives in Job Tracker. Copy the job number from Job Tracker after merch creates the job."
      >
        {linked.length === 0 ? (
          <p className="text-sm text-muted">
            No job links yet. Approve a sample and add its job number on the Samples tab.
          </p>
        ) : (
          <div className="space-y-2">
            {linked.map((s) => (
              <div
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-card px-4 py-3 ring-1 ring-border"
              >
                <div>
                  <p className="text-sm font-medium text-ink">
                    Sample {s.sampleNumber}
                    {s.styleName ? ` — ${s.styleName}` : ''}
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenJob(s.jobNumber)}
                    className="mt-1 font-mono text-sm font-semibold text-accent hover:underline"
                  >
                    {s.jobNumber}
                  </button>
                </div>
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${sampleStatusStyle(s.approvalStatus)}`}
                >
                  {SAMPLE_STATUS_LABELS[s.approvalStatus]}
                </span>
              </div>
            ))}
          </div>
        )}

        <Link
          to={`/job-tracker?customer=${encodeURIComponent(customerName)}`}
          className="mt-4 inline-flex rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-surface"
        >
          View all jobs in Job Tracker →
        </Link>
      </SectionCard>

      {approved.length > 0 && linked.length < approved.length && (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">
          {approved.length - linked.length} approved sample
          {approved.length - linked.length !== 1 ? 's' : ''} without a job number link yet.
        </p>
      )}
    </div>
  )
}
