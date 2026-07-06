import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useJobs } from '../context/JobsContext'
import {
  EMPTY_JOB_INTAKE_FORM,
  MERCHANDISERS,
  OPERATIONS_OPTIONS,
  ORDER_CHANNELS,
  PRIORITY_LEVELS,
  duplicateJobAsIntake,
  formatUkDate,
  type JobIntakeFormValues,
} from '../utils/jobIntake'

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  hint?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      {hint && <span className="mt-0.5 block text-xs text-muted">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

const inputClass =
  'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20'

export function JobIntakeFormPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const duplicateFrom = searchParams.get('duplicate')
  const { addJobFromForm, getJobByNumber } = useJobs()

  const [values, setValues] = useState<JobIntakeFormValues>(() => {
    if (duplicateFrom) {
      const source = getJobByNumber(duplicateFrom)
      if (source) return duplicateJobAsIntake(source)
    }
    return { ...EMPTY_JOB_INTAKE_FORM }
  })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const set = <K extends keyof JobIntakeFormValues>(key: K, value: JobIntakeFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const validate = (): string | null => {
    if (!values.customerClientName.trim()) return 'Customer name is required.'
    if (!values.merchandiser) return 'Please select a merchandiser.'
    if (!values.requestedDeliveryDate) return 'Requested delivery date is required.'
    if (!values.jobDescription.trim()) return 'Job description is required.'
    if (!values.operationsRequired) return 'Operations required is required.'
    if (!values.orderQuantity.trim() || parseInt(values.orderQuantity, 10) <= 0) {
      return 'Order quantity must be greater than zero.'
    }
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const job = addJobFromForm(values)
      navigate(`/job-tracker?job=${encodeURIComponent(job.job_number)}`)
    } catch {
      setError('Could not submit job. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6">
      <div>
        <Link
          to="/production-dashboard"
          className="text-sm font-medium text-accent hover:text-accent/80"
        >
          ← Back to production
        </Link>
        <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-accent">
          Job intake
        </p>
        <h2 className="mt-1 text-2xl font-bold text-ink">Submit new job</h2>
        <p className="mt-1.5 text-sm text-muted">
          New jobs are added to the Job Tracker as{' '}
          <span className="font-medium text-ink-muted">Pending Approval</span> and reflected in
          production reporting.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-2xl bg-card p-5 ring-1 ring-border sm:p-6"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <section className="space-y-4">
          <h3 className="border-b border-border pb-2 text-sm font-semibold text-ink">
            Order details
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Customer / client name" required>
              <input
                className={inputClass}
                value={values.customerClientName}
                onChange={(e) => set('customerClientName', e.target.value)}
                placeholder="e.g. BoohooMAN"
              />
            </Field>
            <Field label="Merchandiser" required>
              <select
                className={inputClass}
                value={values.merchandiser}
                onChange={(e) => set('merchandiser', e.target.value)}
              >
                <option value="">Select merchandiser</option>
                {MERCHANDISERS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Order channel" required>
              <select
                className={inputClass}
                value={values.orderChannel}
                onChange={(e) => set('orderChannel', e.target.value)}
              >
                {ORDER_CHANNELS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Date of request">
              <input className={`${inputClass} bg-surface/60`} value={formatUkDate(new Date())} readOnly />
            </Field>
            <Field label="Order number">
              <input
                className={inputClass}
                value={values.orderNumber}
                onChange={(e) => set('orderNumber', e.target.value)}
                placeholder="Optional"
              />
            </Field>
            <Field label="Purchase order">
              <input
                className={inputClass}
                value={values.purchaseOrder}
                onChange={(e) => set('purchaseOrder', e.target.value)}
                placeholder="Optional"
              />
            </Field>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="border-b border-border pb-2 text-sm font-semibold text-ink">Job details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Requested delivery date" required>
              <input
                type="date"
                className={inputClass}
                value={values.requestedDeliveryDate}
                onChange={(e) => set('requestedDeliveryDate', e.target.value)}
              />
            </Field>
            <Field label="Priority level" required>
              <select
                className={inputClass}
                value={values.priorityLevel}
                onChange={(e) => set('priorityLevel', e.target.value)}
              >
                {PRIORITY_LEVELS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Job description" required>
            <textarea
              className={`${inputClass} min-h-[88px] resize-y`}
              value={values.jobDescription}
              onChange={(e) => set('jobDescription', e.target.value)}
              placeholder="Garment, print locations, style reference…"
            />
          </Field>
          <Field label="Operations required" required>
            <select
              className={inputClass}
              value={values.operationsRequired}
              onChange={(e) => set('operationsRequired', e.target.value)}
            >
              <option value="">Select operations</option>
              {OPERATIONS_OPTIONS.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </Field>
        </section>

        <section className="space-y-4">
          <h3 className="border-b border-border pb-2 text-sm font-semibold text-ink">Quantity</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Order quantity" required hint="Total units for this job">
              <input
                type="number"
                min={1}
                className={inputClass}
                value={values.orderQuantity}
                onChange={(e) => set('orderQuantity', e.target.value)}
              />
            </Field>
          </div>
          <Field label="Additional notes">
            <textarea
              className={`${inputClass} min-h-[72px] resize-y`}
              value={values.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Stock, delivery, or merchandising notes"
            />
          </Field>
        </section>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-inset ring-red-200">
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end">
          <Link
            to="/production-dashboard"
            className="rounded-lg border border-border px-4 py-2.5 text-center text-sm font-medium text-ink hover:bg-surface"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Submit new job'}
          </button>
        </div>
      </form>
    </main>
  )
}
