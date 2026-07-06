import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { JobIntakeData } from '../../types/productionDashboard'

interface JobIntakeSectionProps {
  intake: JobIntakeData
  jobNumbers: string[]
  onSelectJob: (jobNumber: string) => void
}

export function JobIntakeSection({ intake, jobNumbers, onSelectJob }: JobIntakeSectionProps) {
  const [duplicateJob, setDuplicateJob] = useState(intake.tools.duplicateJob.sampleJobNumber)

  const sortedJobNumbers = useMemo(
    () => [...jobNumbers].sort((a, b) => b.localeCompare(a, undefined, { numeric: true })),
    [jobNumbers],
  )

  return (
    <section className="rounded-xl bg-card p-4 ring-1 ring-border sm:p-5">
      <h3 className="text-sm font-semibold text-ink">{intake.title}</h3>
      <p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted">{intake.intro}</p>

      <div className="mt-4 flex flex-col gap-4 border-t border-border pt-4 lg:flex-row lg:items-end lg:gap-6">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <span className="text-xs font-medium text-muted">{intake.tools.deliverySplitHelper.title}</span>
          <a
            href={intake.tools.deliverySplitHelper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-violet-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-violet-700"
          >
            {intake.tools.deliverySplitHelper.buttonLabel}
          </a>
        </div>

        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <span className="text-xs font-medium text-muted">{intake.tools.createNewJob.title}</span>
          <Link
            to="/job-intake"
            className="rounded-lg bg-violet-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-violet-700"
          >
            {intake.tools.createNewJob.buttonLabel}
          </Link>
        </div>

        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <span className="text-xs font-medium text-muted">{intake.tools.duplicateJob.title}</span>
          <select
            value={duplicateJob}
            onChange={(e) => setDuplicateJob(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink"
          >
            {sortedJobNumbers.slice(0, 100).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onSelectJob(duplicateJob)}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-surface"
          >
            View
          </button>
          <Link
            to={`/job-intake?duplicate=${encodeURIComponent(duplicateJob)}`}
            className="rounded-lg bg-violet-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-violet-700"
          >
            Duplicate
          </Link>
        </div>
      </div>
    </section>
  )
}
