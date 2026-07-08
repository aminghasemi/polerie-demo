import { isCrmApiEnabled } from '../../api/crmDb'

interface CrmDemoToolbarProps {
  loading: boolean
  loadError: string | null
  onReset: () => void
}

export function CrmDemoToolbar({ loading, loadError, onReset }: CrmDemoToolbarProps) {
  const apiMode = isCrmApiEnabled()

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-violet-200/80 bg-gradient-to-r from-violet-50/90 to-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">
          Demo data from <code className="rounded bg-white/80 px-1.5 py-0.5 text-xs">db.json</code>
          {apiMode && (
            <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 ring-1 ring-emerald-200">
              json-server
            </span>
          )}
        </p>
        <p className="mt-0.5 text-xs text-muted">
          Seed accounts: <strong className="font-medium text-ink">BoohooMAN</strong> (full workflow)
          and <strong className="font-medium text-ink">Bravado</strong> (onboarding in progress).
          Edits save in your browser until you reset.
        </p>
        {loadError && (
          <p className="mt-1 text-xs text-red-700">Could not load db.json — using local data. {loadError}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onReset}
        disabled={loading}
        className="shrink-0 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-ink shadow-sm hover:bg-surface disabled:opacity-50"
      >
        {loading ? 'Loading…' : 'Reset demo data'}
      </button>
    </div>
  )
}
