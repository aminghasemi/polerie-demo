import type { CrmCustomer, CrmNote } from '../../../types/crm'
import type { CrmCustomerInsights } from '../../../types/crm'
import { formatGbp, statusLabel, statusStyle } from '../../../utils/crm'
import { SectionCard } from '../crmUi'

interface CrmActivityTabProps {
  customer: CrmCustomer
  insights: CrmCustomerInsights
  notes: CrmNote[]
  chatActivity: { body: string; author: string; createdAt: string; contextType: string }[]
  noteBody: string
  onNoteBodyChange: (v: string) => void
  onSubmitNote: () => void
  onDeleteNote: (id: string) => void
}

export function CrmActivityTab({
  customer,
  insights,
  notes,
  chatActivity,
  noteBody,
  onNoteBodyChange,
  onSubmitNote,
  onDeleteNote,
}: CrmActivityTabProps) {
  const timeline = [
    ...notes.map((n) => ({
      type: 'note' as const,
      id: n.id,
      author: n.author,
      createdAt: n.createdAt,
      body: n.body,
      context: 'Note',
    })),
    ...chatActivity.map((m, i) => ({
      type: 'chat' as const,
      id: `chat-${i}`,
      author: m.author,
      createdAt: m.createdAt,
      body: m.body,
      context: m.contextType,
    })),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric label="Open jobs" value={String(customer.openJobs)} />
        <Metric label="Pipeline" value={formatGbp(customer.estimatedValue)} />
        <Metric label="Lifetime value" value={formatGbp(insights.lifetimeValue)} />
        <Metric label="Health" value={statusLabel(customer.status)} badge={customer.status} />
      </div>

      <SectionCard title="Add note">
        <textarea
          className="w-full min-h-[80px] rounded-lg border border-border bg-surface px-3 py-2 text-sm resize-y"
          value={noteBody}
          onChange={(e) => onNoteBodyChange(e.target.value)}
          placeholder="Account update, call summary…"
        />
        <button
          type="button"
          onClick={onSubmitNote}
          disabled={!noteBody.trim()}
          className="mt-3 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
        >
          Save note
        </button>
      </SectionCard>

      <SectionCard title="Activity feed">
        {timeline.length === 0 ? (
          <p className="text-sm text-muted">No activity yet.</p>
        ) : (
          <div className="space-y-3">
            {timeline.map((item) => (
              <article
                key={item.id}
                className="rounded-lg bg-card px-4 py-3 ring-1 ring-border"
              >
                <p className="text-[10px] font-medium uppercase text-muted">
                  {item.context} · {item.author} ·{' '}
                  {new Date(item.createdAt).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-ink">{item.body}</p>
                {item.type === 'note' && (
                  <button
                    type="button"
                    onClick={() => onDeleteNote(item.id)}
                    className="mt-2 text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  )
}

function Metric({
  label,
  value,
  badge,
}: {
  label: string
  value: string
  badge?: CrmCustomer['status']
}) {
  return (
    <div className="rounded-xl bg-surface px-3 py-2 ring-1 ring-inset ring-border">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">{label}</p>
      {badge ? (
        <span
          className={`mt-1 inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusStyle(badge)}`}
        >
          {value}
        </span>
      ) : (
        <p className="mt-1 text-lg font-bold tabular-nums text-ink">{value}</p>
      )}
    </div>
  )
}
