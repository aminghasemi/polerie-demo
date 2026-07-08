export const inputClass =
  'w-full rounded-xl border-0 bg-surface px-3 py-2.5 text-sm text-ink ring-1 ring-inset ring-border placeholder:text-muted/70 focus:ring-2 focus:ring-accent/30 focus:outline-none'

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
      {hint && <span className="mt-0.5 block text-xs leading-relaxed text-muted">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

export function SectionCard({
  title,
  description,
  children,
  action,
  compact,
}: {
  title: string
  description?: string
  children: React.ReactNode
  action?: React.ReactNode
  compact?: boolean
}) {
  return (
    <section
      className={`rounded-2xl bg-card ring-1 ring-border ${compact ? 'p-4' : 'p-5'}`}
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className={`flex items-start justify-between gap-3 ${compact ? 'mb-3' : 'mb-4'}`}>
        <div>
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
          {description && (
            <p className="mt-1 text-xs leading-relaxed text-muted">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <p className="mt-4 max-w-sm text-sm text-muted">{message}</p>
      <button
        type="button"
        onClick={onGoHome}
        className="mt-5 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
      >
        Complete onboarding on Home
      </button>
    </div>
  )
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  className = '',
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

export function GhostButton({
  children,
  onClick,
  disabled,
  className = '',
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}
