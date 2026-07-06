import { useEffect, useState } from 'react'
import type { Job } from '../../types/jobTracker'
import { JOB_SECTIONS, fieldLabel } from '../../data/jobTracker'
import {
  approvalStatusStyle,
  dueDaysBadgeStyle,
  isJobOverdue,
  jobStageStyle,
  priorityStyle,
} from '../../utils/jobTracker'
import { IconChevron, IconX } from '../Icons'

interface JobDetailModalProps {
  job: Job | null
  onClose: () => void
}

function Badge({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${className}`}
    >
      {children}
    </span>
  )
}

function SectionBlock({
  title,
  entries,
  defaultOpen = true,
}: {
  title: string
  entries: { key: string; label: string; value: string }[]
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  if (entries.length === 0) return null

  return (
    <section className="overflow-hidden rounded-xl ring-1 ring-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between bg-surface/80 px-4 py-3 text-left transition-colors hover:bg-surface"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          {title}
        </span>
        <span className="flex items-center gap-2">
          <span className="rounded-full bg-card px-2 py-0.5 text-[11px] font-medium text-muted ring-1 ring-border">
            {entries.length} fields
          </span>
          <IconChevron up={open} className="h-4 w-4 text-muted" />
        </span>
      </button>
      {open && (
        <dl className="grid gap-px bg-border sm:grid-cols-2">
          {entries.map(({ key, label, value }) => (
            <div key={key} className="bg-card px-4 py-3">
              <dt className="text-[11px] font-medium uppercase tracking-wide text-muted">
                {label}
              </dt>
              <dd className="mt-1 break-words text-sm font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}

export function JobDetailModal({ job, onClose }: JobDetailModalProps) {
  useEffect(() => {
    if (!job) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [job, onClose])

  if (!job) return null

  const filledSections = JOB_SECTIONS.map((section) => ({
    ...section,
    entries: section.keys
      .map((key) => ({ key, label: fieldLabel(key), value: job[key]?.trim() ?? '' }))
      .filter((e) => e.value),
  })).filter((s) => s.entries.length > 0)

  const otherKeys = new Set(JOB_SECTIONS.flatMap((s) => s.keys))
  const otherEntries = Object.entries(job)
    .filter(([k, v]) => v?.trim() && !otherKeys.has(k))
    .map(([key, value]) => ({ key, label: fieldLabel(key), value: value.trim() }))

  const overdue = isJobOverdue(job)

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close job details"
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-detail-title"
        className="relative z-10 flex h-[96vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-card shadow-2xl ring-1 ring-border sm:h-auto sm:max-h-[92vh] sm:rounded-2xl"
      >
        <header
          className={`shrink-0 border-b px-5 py-4 ${overdue ? 'border-red-200 bg-red-50/50' : 'border-border'}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">Job sheet</p>
                {overdue && (
                  <Badge className="bg-red-100 text-red-800 ring-red-200">Overdue</Badge>
                )}
              </div>
              <h2 id="job-detail-title" className="mt-1 font-mono text-2xl font-bold text-ink">
                {job.job_number}
              </h2>
              <p className="mt-1 text-sm font-medium text-ink-muted">{job.customer_client_name}</p>
              <p className="mt-1 text-sm text-ink">{job.job_description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.approval_status && (
                  <Badge className={approvalStatusStyle(job.approval_status)}>
                    {job.approval_status}
                  </Badge>
                )}
                {job.job_stage && (
                  <Badge className={jobStageStyle(job.job_stage)}>{job.job_stage}</Badge>
                )}
                {job.priority_level && (
                  <Badge className={priorityStyle(job.priority_level)}>
                    {job.priority_level} priority
                  </Badge>
                )}
                {job.due_days && (
                  <Badge className={dueDaysBadgeStyle(job.due_days)}>
                    {job.due_days} days to due
                  </Badge>
                )}
                {job.order_quantity && (
                  <Badge className="bg-surface text-ink-muted ring-border">
                    {job.order_quantity} units
                  </Badge>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-muted ring-1 ring-border hover:text-ink"
              aria-label="Close"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-4">
          <div className="space-y-3">
            {filledSections.map((section, i) => (
              <SectionBlock
                key={section.title}
                title={section.title}
                entries={section.entries}
                defaultOpen={i < 2}
              />
            ))}
            {otherEntries.length > 0 && (
              <SectionBlock title="Additional fields" entries={otherEntries} defaultOpen={false} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
