import type { ReactNode } from 'react'
import { IconEmpty } from './Icons'

export function EmptyState({
  title,
  description,
  icon,
}: {
  title: string
  description?: string
  icon?: ReactNode
}) {
  return (
    <div className="flex h-[260px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface/60 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-muted">
        {icon ?? <IconEmpty className="h-6 w-6" />}
      </div>
      <div>
        <p className="text-sm font-medium text-ink-muted">{title}</p>
        {description && <p className="mt-1 max-w-xs text-xs text-muted">{description}</p>}
      </div>
    </div>
  )
}
