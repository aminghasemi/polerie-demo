import type { ReactNode } from 'react'

export type KpiVariant = 'violet' | 'teal' | 'slate' | 'warning' | 'danger'

interface KpiCardProps {
  label: string
  value: string | number
  hint: string
  icon: ReactNode
  variant?: KpiVariant
}

const variantConfig: Record<KpiVariant, { ring: string; icon: string; value: string }> = {
  violet: {
    ring: 'ring-violet-100',
    icon: 'bg-violet-100 text-violet-700',
    value: 'text-ink',
  },
  teal: {
    ring: 'ring-teal-100',
    icon: 'bg-teal-100 text-teal-700',
    value: 'text-ink',
  },
  slate: {
    ring: 'ring-slate-200',
    icon: 'bg-slate-100 text-slate-600',
    value: 'text-ink',
  },
  warning: {
    ring: 'ring-amber-100',
    icon: 'bg-amber-100 text-amber-700',
    value: 'text-amber-800',
  },
  danger: {
    ring: 'ring-red-100',
    icon: 'bg-red-100 text-red-700',
    value: 'text-red-800',
  },
}

export function KpiCard({ label, value, hint, icon, variant = 'violet' }: KpiCardProps) {
  const styles = variantConfig[variant]

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl bg-card p-4 ring-1 ring-inset transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] ${styles.ring}`}
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-muted">
            {label}
          </p>
          <p className={`mt-1.5 text-2xl font-bold tabular-nums tracking-tight ${styles.value}`}>
            {value}
          </p>
          <p className="mt-1 text-xs text-muted">{hint}</p>
        </div>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
        >
          {icon}
        </div>
      </div>
    </article>
  )
}

interface PanelProps {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
  badge?: string
  id?: string
}

export function Panel({ title, subtitle, children, className = '', badge, id }: PanelProps) {
  return (
    <section
      id={id}
      className={`rounded-2xl bg-card ring-1 ring-border ${className}`}
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-ink">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
        </div>
        {badge && (
          <span className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-ink-muted">
            {badge}
          </span>
        )}
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}

interface SectionHeadingProps {
  title: string
  description?: string
}

export function SectionHeading({ title, description }: SectionHeadingProps) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
    </div>
  )
}
