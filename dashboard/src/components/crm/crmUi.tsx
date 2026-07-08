export const inputClass =
  'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20'

export const selectClass = inputClass

export function FormField({
  label,
  children,
  className = '',
  hint,
}: {
  label: string
  children: React.ReactNode
  className?: string
  hint?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-medium text-ink">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-muted">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

export function SectionCard({
  title,
  description,
  children,
  action,
}: {
  title: string
  description?: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <section className="rounded-xl bg-surface p-4 ring-1 ring-inset ring-border">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
          {description && <p className="mt-1 text-xs text-muted">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

export function SaveBar({ dirty, onSave, onReset }: { dirty: boolean; onSave: () => void; onReset: () => void }) {
  if (!dirty) return null
  return (
    <div className="sticky bottom-0 -mx-1 flex gap-2 border-t border-border bg-card/95 px-1 py-3 backdrop-blur">
      <button
        type="button"
        onClick={onSave}
        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
      >
        Save changes
      </button>
      <button
        type="button"
        onClick={onReset}
        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-surface"
      >
        Discard
      </button>
    </div>
  )
}

export function LockedTab({
  message,
  onGoHome,
}: {
  message: string
  onGoHome: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-surface px-6 py-16 text-center ring-1 ring-inset ring-border">
      <p className="max-w-sm text-sm text-muted">{message}</p>
      <button
        type="button"
        onClick={onGoHome}
        className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
      >
        Go to Home — complete onboarding
      </button>
    </div>
  )
}
