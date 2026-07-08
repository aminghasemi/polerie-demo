import { useState } from 'react'
import { useCrm } from '../../context/CrmContext'

interface CrmChatPanelProps {
  customerName: string
  contextType: string
  contextId: string
  title?: string
}

export function CrmChatPanel({
  customerName,
  contextType,
  contextId,
  title = 'Conversation',
}: CrmChatPanelProps) {
  const { getChatMessages, addChatMessage } = useCrm()
  const [body, setBody] = useState('')
  const [open, setOpen] = useState(false)
  const messages = getChatMessages(customerName, contextType, contextId)

  const submit = () => {
    if (!body.trim()) return
    addChatMessage(customerName, contextType, contextId, body)
    setBody('')
  }

  return (
    <div className="mt-4 rounded-xl ring-1 ring-inset ring-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-medium text-ink">
          {title}
          {messages.length > 0 && (
            <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
              {messages.length}
            </span>
          )}
        </span>
        <span className="text-xs text-muted">{open ? 'Hide' : 'Show'}</span>
      </button>

      {open && (
        <div className="border-t border-border px-4 py-3">
          <div className="max-h-48 space-y-2 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="py-2 text-center text-xs text-muted">
                No messages yet. Tag colleagues with @name — demo stores locally.
              </p>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="rounded-lg bg-card px-3 py-2 ring-1 ring-border">
                  <p className="text-[10px] text-muted">
                    {m.author} ·{' '}
                    {new Date(m.createdAt).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-ink">{m.body}</p>
                </div>
              ))
            )}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              placeholder="Message… use @name to mention"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
            <button
              type="button"
              onClick={submit}
              disabled={!body.trim()}
              className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
