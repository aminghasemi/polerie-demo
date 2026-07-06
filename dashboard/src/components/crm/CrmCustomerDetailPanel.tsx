import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCrm } from '../../context/CrmContext'
import type { CrmCustomer, CrmCustomerProfile, CrmDetailTab, CrmNote } from '../../types/crm'
import { EMPTY_CRM_PROFILE } from '../../types/crm'
import type { Job } from '../../types/jobTracker'
import {
  buildCustomerInsights,
  getCustomerJobs,
  profileFieldEntries,
} from '../../utils/crmCustomerDetail'
import { formatGbp, statusLabel, statusStyle } from '../../utils/crm'
import { approvalStatusStyle, jobStageStyle } from '../../utils/jobTracker'
import { IconChevron, IconSearch, IconX } from '../Icons'

interface CrmCustomerDetailPanelProps {
  customer: CrmCustomer | null
  allJobs: Job[]
  onClose: () => void
  onOpenJob: (jobNumber: string) => void
}

const TABS: { id: CrmDetailTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'account', label: 'Account' },
  { id: 'jobs', label: 'Jobs' },
  { id: 'notes', label: 'Notes' },
]

const inputClass =
  'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20'

export function CrmCustomerDetailPanel({
  customer,
  allJobs,
  onClose,
  onOpenJob,
}: CrmCustomerDetailPanelProps) {
  const { getProfile, updateProfile, getNotes, addNote, deleteNote } = useCrm()
  const [tab, setTab] = useState<CrmDetailTab>('overview')
  const [draftProfile, setDraftProfile] = useState<CrmCustomerProfile>(EMPTY_CRM_PROFILE)
  const [profileDirty, setProfileDirty] = useState(false)
  const [noteBody, setNoteBody] = useState('')
  const [jobSearch, setJobSearch] = useState('')

  const customerJobs = useMemo(
    () => (customer ? getCustomerJobs(allJobs, customer.name) : []),
    [allJobs, customer],
  )

  const insights = useMemo(
    () => (customer ? buildCustomerInsights(customerJobs) : null),
    [customer, customerJobs],
  )

  const notes = customer ? getNotes(customer.name) : []

  useEffect(() => {
    if (!customer) return
    setTab('overview')
    setJobSearch('')
    setNoteBody('')
    setDraftProfile(getProfile(customer.name))
    setProfileDirty(false)
  }, [customer, getProfile])

  useEffect(() => {
    if (!customer) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [customer, onClose])

  if (!customer || !insights) return null

  const filteredJobs = jobSearch.trim()
    ? customerJobs.filter((j) =>
        [
          j.job_number,
          j.job_description,
          j.job_stage,
          j.approval_status,
          j.operations_required,
        ]
          .join(' ')
          .toLowerCase()
          .includes(jobSearch.trim().toLowerCase()),
      )
    : customerJobs

  const setProfileField = <K extends keyof CrmCustomerProfile>(
    key: K,
    value: CrmCustomerProfile[K],
  ) => {
    setDraftProfile((prev) => ({ ...prev, [key]: value }))
    setProfileDirty(true)
  }

  const saveProfile = () => {
    updateProfile(customer.name, draftProfile)
    setProfileDirty(false)
  }

  const submitNote = () => {
    if (!noteBody.trim()) return
    addNote(customer.name, noteBody)
    setNoteBody('')
    setTab('notes')
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close customer details"
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="crm-customer-title"
        className="relative z-10 flex h-[96vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl bg-card shadow-2xl ring-1 ring-border sm:h-auto sm:max-h-[92vh] sm:rounded-2xl"
      >
        <header className="shrink-0 border-b border-border px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                Customer account
              </p>
              <h2 id="crm-customer-title" className="mt-1 text-2xl font-bold text-ink">
                {customer.name}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusStyle(customer.status)}`}
                >
                  {statusLabel(customer.status)}
                </span>
                <span className="text-sm text-muted">
                  {customer.merchandiser} · {customer.primaryChannel}
                </span>
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

          <nav className="mt-4 flex gap-1 overflow-x-auto rounded-xl bg-surface p-1 ring-1 ring-inset ring-border">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  tab === t.id
                    ? 'bg-card text-ink shadow-sm ring-1 ring-border'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {t.label}
                {t.id === 'notes' && notes.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-accent/15 px-1.5 text-[10px] font-bold text-accent">
                    {notes.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </header>

        <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-4">
          {tab === 'overview' && (
            <OverviewTab customer={customer} insights={insights} />
          )}

          {tab === 'account' && (
            <AccountTab
              draftProfile={draftProfile}
              insights={insights}
              profileDirty={profileDirty}
              onChange={setProfileField}
              onSave={saveProfile}
              onReset={() => {
                setDraftProfile(getProfile(customer.name))
                setProfileDirty(false)
              }}
            />
          )}

          {tab === 'jobs' && (
            <JobsTab
              jobs={filteredJobs}
              total={customerJobs.length}
              jobSearch={jobSearch}
              onSearchChange={setJobSearch}
              onOpenJob={onOpenJob}
              customerName={customer.name}
              onClose={onClose}
            />
          )}

          {tab === 'notes' && (
            <NotesTab
              notes={notes}
              noteBody={noteBody}
              onNoteBodyChange={setNoteBody}
              onSubmit={submitNote}
              onDelete={deleteNote}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function OverviewTab({
  customer,
  insights,
}: {
  customer: CrmCustomer
  insights: ReturnType<typeof buildCustomerInsights>
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric label="Open jobs" value={String(customer.openJobs)} />
        <Metric label="Pending" value={String(customer.pendingApproval)} />
        <Metric label="Overdue" value={String(customer.overdueJobs)} />
        <Metric label="Pipeline" value={formatGbp(customer.estimatedValue)} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <InsightCard title="Lifetime value" value={formatGbp(insights.lifetimeValue)} />
        <InsightCard title="Lifetime units" value={insights.lifetimeUnits.toLocaleString('en-GB')} />
        <InsightCard title="Completed jobs" value={String(insights.completedJobs)} />
        <InsightCard title="Total jobs" value={String(customer.totalJobs)} />
      </div>

      <FieldSection title="Activity">
        <FieldRow label="First activity" value={insights.firstActivity} />
        <FieldRow label="Last activity" value={insights.lastActivity} />
        <FieldRow label="Primary merchandiser" value={customer.merchandiser} />
        <FieldRow label="Primary channel" value={customer.primaryChannel} />
      </FieldSection>

      {insights.channels.length > 0 && (
        <TagSection title="Channels" tags={insights.channels} />
      )}
      {insights.merchandisers.length > 1 && (
        <TagSection title="Merchandisers" tags={insights.merchandisers} />
      )}
      {insights.departments.length > 0 && (
        <TagSection title="Departments" tags={insights.departments} />
      )}
      {insights.deliveryLocations.length > 0 && (
        <TagSection title="Delivery locations" tags={insights.deliveryLocations} />
      )}
      {insights.topOperations.length > 0 && (
        <TagSection title="Common operations" tags={insights.topOperations} />
      )}
    </div>
  )
}

function AccountTab({
  draftProfile,
  insights,
  profileDirty,
  onChange,
  onSave,
  onReset,
}: {
  draftProfile: CrmCustomerProfile
  insights: ReturnType<typeof buildCustomerInsights>
  profileDirty: boolean
  onChange: <K extends keyof CrmCustomerProfile>(key: K, value: CrmCustomerProfile[K]) => void
  onSave: () => void
  onReset: () => void
}) {
  const savedFields = profileFieldEntries(draftProfile)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-ink">Contact & account details</h3>
        <p className="mt-1 text-xs text-muted">
          Saved locally for this demo. Sync to a CRM backend in production.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormField label="Contact name">
            <input
              className={inputClass}
              value={draftProfile.contactName}
              onChange={(e) => onChange('contactName', e.target.value)}
              placeholder="Primary contact"
            />
          </FormField>
          <FormField label="Account type">
            <input
              className={inputClass}
              value={draftProfile.accountType}
              onChange={(e) => onChange('accountType', e.target.value)}
              placeholder="e.g. Retail, VIP"
            />
          </FormField>
          <FormField label="Email">
            <input
              type="email"
              className={inputClass}
              value={draftProfile.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="accounts@customer.com"
            />
          </FormField>
          <FormField label="Phone">
            <input
              className={inputClass}
              value={draftProfile.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="+44 …"
            />
          </FormField>
          <FormField label="Website">
            <input
              className={inputClass}
              value={draftProfile.website}
              onChange={(e) => onChange('website', e.target.value)}
              placeholder="https://"
            />
          </FormField>
          <FormField label="Internal reference">
            <input
              className={inputClass}
              value={draftProfile.internalRef}
              onChange={(e) => onChange('internalRef', e.target.value)}
              placeholder="ERP / account code"
            />
          </FormField>
          <FormField label="Payment terms" className="sm:col-span-2">
            <input
              className={inputClass}
              value={draftProfile.paymentTerms}
              onChange={(e) => onChange('paymentTerms', e.target.value)}
              placeholder="e.g. Net 30"
            />
          </FormField>
          <FormField label="Address" className="sm:col-span-2">
            <textarea
              className={`${inputClass} min-h-[80px] resize-y`}
              value={draftProfile.address}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="Billing / head office address"
            />
          </FormField>
        </div>

        {profileDirty && (
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={onSave}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
            >
              Save details
            </button>
            <button
              type="button"
              onClick={onReset}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-surface"
            >
              Discard changes
            </button>
          </div>
        )}
      </div>

      {savedFields.length > 0 && (
        <CollapsibleSection title="Saved contact fields" count={savedFields.length}>
          <dl className="grid gap-px bg-border sm:grid-cols-2">
            {savedFields.map(({ key, label, value }) => (
              <div key={key} className="bg-card px-4 py-3">
                <dt className="text-[11px] font-medium uppercase tracking-wide text-muted">
                  {label}
                </dt>
                <dd className="mt-1 break-words text-sm font-medium text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </CollapsibleSection>
      )}

      <CollapsibleSection title="From job data" count={6} defaultOpen={false}>
        <dl className="grid gap-px bg-border sm:grid-cols-2">
          <DetailCell label="Channels" value={insights.channels.join(', ') || '—'} />
          <DetailCell label="Merchandisers" value={insights.merchandisers.join(', ') || '—'} />
          <DetailCell label="Departments" value={insights.departments.join(', ') || '—'} />
          <DetailCell
            label="Delivery locations"
            value={insights.deliveryLocations.join(', ') || '—'}
          />
          <DetailCell label="Lifetime value" value={formatGbp(insights.lifetimeValue)} />
          <DetailCell
            label="Lifetime units"
            value={insights.lifetimeUnits.toLocaleString('en-GB')}
          />
        </dl>
      </CollapsibleSection>
    </div>
  )
}

function JobsTab({
  jobs,
  total,
  jobSearch,
  onSearchChange,
  onOpenJob,
  customerName,
  onClose,
}: {
  jobs: Job[]
  total: number
  jobSearch: string
  onSearchChange: (v: string) => void
  onOpenJob: (jobNumber: string) => void
  customerName: string
  onClose: () => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {jobs.length} of {total} job{total !== 1 ? 's' : ''}
        </p>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-64">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              placeholder="Search jobs…"
              value={jobSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl border-0 bg-surface py-2 pl-9 pr-3 text-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-accent"
            />
          </div>
          <Link
            to={`/job-tracker?customer=${encodeURIComponent(customerName)}`}
            onClick={onClose}
            className="shrink-0 rounded-lg border border-border px-3 py-2 text-sm font-medium text-ink hover:bg-surface"
          >
            Job Tracker
          </Link>
        </div>
      </div>

      <div className="space-y-2">
        {jobs.length === 0 ? (
          <p className="rounded-xl bg-surface px-4 py-8 text-center text-sm text-muted ring-1 ring-inset ring-border">
            No jobs match your search.
          </p>
        ) : (
          jobs.map((job) => (
            <button
              key={job.job_number}
              type="button"
              onClick={() => onOpenJob(job.job_number ?? '')}
              className="flex w-full items-center justify-between gap-3 rounded-xl bg-surface px-4 py-3 text-left ring-1 ring-inset ring-border transition-colors hover:bg-violet-50"
            >
              <div className="min-w-0">
                <p className="font-mono text-sm font-semibold text-accent">{job.job_number}</p>
                <p className="truncate text-sm text-ink">{job.job_description}</p>
                <p className="mt-1 text-xs text-muted">
                  {job.order_quantity} units · {job.requested_delivery_date || 'No delivery date'}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                {job.approval_status && (
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${approvalStatusStyle(job.approval_status)}`}
                  >
                    {job.approval_status}
                  </span>
                )}
                {job.job_stage && (
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${jobStageStyle(job.job_stage)}`}
                  >
                    {job.job_stage}
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

function NotesTab({
  notes,
  noteBody,
  onNoteBodyChange,
  onSubmit,
  onDelete,
}: {
  notes: CrmNote[]
  noteBody: string
  onNoteBodyChange: (v: string) => void
  onSubmit: () => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-surface p-4 ring-1 ring-inset ring-border">
        <h3 className="text-sm font-semibold text-ink">Add note</h3>
        <textarea
          className={`${inputClass} mt-3 min-h-[100px] resize-y`}
          value={noteBody}
          onChange={(e) => onNoteBodyChange(e.target.value)}
          placeholder="Call summary, account update, merchandising handover…"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={!noteBody.trim()}
          className="mt-3 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
        >
          Save note
        </button>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">
          Notes history {notes.length > 0 && `(${notes.length})`}
        </h3>
        {notes.length === 0 ? (
          <p className="rounded-xl bg-surface px-4 py-8 text-center text-sm text-muted ring-1 ring-inset ring-border">
            No notes yet. Add the first note above.
          </p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <article
                key={note.id}
                className="rounded-xl bg-card px-4 py-3 ring-1 ring-border"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium text-muted">
                      {note.author} ·{' '}
                      {new Date(note.createdAt).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink">
                      {note.body}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDelete(note.id)}
                    className="shrink-0 rounded p-1 text-muted hover:bg-red-50 hover:text-red-700"
                    aria-label="Delete note"
                  >
                    <IconX className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface px-3 py-2 ring-1 ring-inset ring-border">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 text-lg font-bold tabular-nums text-ink">{value}</p>
    </div>
  )
}

function InsightCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl bg-card px-4 py-3 ring-1 ring-border">
      <p className="text-xs font-medium text-muted">{title}</p>
      <p className="mt-1 text-xl font-bold tabular-nums text-ink">{value}</p>
    </div>
  )
}

function FieldSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-xl ring-1 ring-border">
      <div className="bg-surface/80 px-4 py-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{title}</h3>
      </div>
      <dl className="divide-y divide-border bg-card">{children}</dl>
    </section>
  )
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 px-4 py-3">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-right text-sm font-medium text-ink">{value}</dd>
    </div>
  )
}

function TagSection({ title, tags }: { title: string; tags: string[] }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-lg bg-surface px-2.5 py-1 text-xs font-medium text-ink-muted ring-1 ring-inset ring-border"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  )
}

function FormField({
  label,
  children,
  className = '',
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-medium text-ink">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

function DetailCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card px-4 py-3">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium text-ink">{value}</dd>
    </div>
  )
}

function CollapsibleSection({
  title,
  count,
  defaultOpen = true,
  children,
}: {
  title: string
  count: number
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="overflow-hidden rounded-xl ring-1 ring-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between bg-surface/80 px-4 py-3 text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          {title}
        </span>
        <span className="flex items-center gap-2">
          <span className="rounded-full bg-card px-2 py-0.5 text-[11px] font-medium text-muted ring-1 ring-border">
            {count} fields
          </span>
          <IconChevron up={open} className="h-4 w-4 text-muted" />
        </span>
      </button>
      {open && children}
    </section>
  )
}
