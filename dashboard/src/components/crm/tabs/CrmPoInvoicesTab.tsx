import { useState } from 'react'
import type { CrmCustomerProfile, CrmPurchaseOrder } from '../../../types/crm'
import { FormField, SectionCard, inputClass, selectClass } from '../crmUi'
import { CrmChatPanel } from '../CrmChatPanel'

interface CrmPoInvoicesTabProps {
  customerName: string
  profile: CrmCustomerProfile
  records: CrmPurchaseOrder[]
  onAdd: (record: Omit<CrmPurchaseOrder, 'id'>) => void
  onUpdate: (record: CrmPurchaseOrder) => void
  onDelete: (id: string) => void
}

const emptyPo = (): Omit<CrmPurchaseOrder, 'id'> => ({
  poNumber: '',
  jobNumber: '',
  sampleId: '',
  fileName: '',
  status: 'pending',
  shortagesNotes: '',
  invoiceStatus: '',
  xeroLink: '',
})

export function CrmPoInvoicesTab({
  customerName,
  profile,
  records,
  onAdd,
  onUpdate,
  onDelete,
}: CrmPoInvoicesTabProps) {
  const [draft, setDraft] = useState(emptyPo)
  const [showForm, setShowForm] = useState(records.length === 0)

  const submit = () => {
    if (!draft.poNumber.trim()) return
    onAdd(draft)
    setDraft(emptyPo())
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      {profile.portalUrl && (
        <SectionCard title="Client portal">
          <a
            href={profile.portalUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-accent hover:underline"
          >
            {profile.portalUrl}
          </a>
          {profile.portalNotes && (
            <p className="mt-2 text-sm text-muted">{profile.portalNotes}</p>
          )}
        </SectionCard>
      )}

      <SectionCard
        title="Purchase orders"
        description="Some clients send PO with the order; others only after dispatch."
        action={
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="text-xs font-semibold text-accent hover:underline"
          >
            {showForm ? 'Cancel' : '+ Add PO'}
          </button>
        }
      >
        {showForm && (
          <div className="mb-6 grid gap-4 border-b border-border pb-6 sm:grid-cols-2">
            <FormField label="PO number">
              <input
                className={inputClass}
                value={draft.poNumber}
                onChange={(e) => setDraft({ ...draft, poNumber: e.target.value })}
              />
            </FormField>
            <FormField label="Job number">
              <input
                className={inputClass}
                value={draft.jobNumber}
                onChange={(e) => setDraft({ ...draft, jobNumber: e.target.value })}
              />
            </FormField>
            <FormField label="Status">
              <select
                className={selectClass}
                value={draft.status}
                onChange={(e) =>
                  setDraft({ ...draft, status: e.target.value as CrmPurchaseOrder['status'] })
                }
              >
                <option value="pending">Pending</option>
                <option value="received">Received</option>
                <option value="shortage">Shortage</option>
              </select>
            </FormField>
            <FormField label="PO document">
              <input
                type="file"
                className={inputClass}
                onChange={(e) =>
                  setDraft({ ...draft, fileName: e.target.files?.[0]?.name ?? '' })
                }
              />
            </FormField>
            <FormField label="Shortages / adjustments" className="sm:col-span-2">
              <textarea
                className={`${inputClass} min-h-[64px] resize-y`}
                value={draft.shortagesNotes}
                onChange={(e) => setDraft({ ...draft, shortagesNotes: e.target.value })}
              />
            </FormField>
            <button
              type="button"
              onClick={submit}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 sm:col-span-2"
            >
              Save PO
            </button>
          </div>
        )}

        {records.length === 0 ? (
          <p className="text-sm text-muted">No POs recorded.</p>
        ) : (
          <div className="space-y-3">
            {records.map((r) => (
              <div key={r.id} className="rounded-xl bg-card px-4 py-3 ring-1 ring-border">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono font-semibold text-ink">{r.poNumber}</p>
                    <p className="mt-1 text-sm text-muted">
                      {r.status} · {r.jobNumber ? `Job ${r.jobNumber}` : 'No job link'}
                      {r.fileName && ` · ${r.fileName}`}
                    </p>
                    {r.shortagesNotes && (
                      <p className="mt-1 text-xs text-amber-800">{r.shortagesNotes}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onDelete(r.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 border-t border-border pt-3">
                  <FormField label="Invoice status (Xero)">
                    <select
                      className={selectClass}
                      value={r.invoiceStatus}
                      onChange={(e) =>
                        onUpdate({
                          ...r,
                          invoiceStatus: e.target.value as CrmPurchaseOrder['invoiceStatus'],
                        })
                      }
                    >
                      <option value="">—</option>
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="paid">Paid</option>
                    </select>
                  </FormField>
                  <FormField label="Xero link" className="min-w-[200px] flex-1">
                    <input
                      className={inputClass}
                      value={r.xeroLink}
                      placeholder="https://go.xero.com/…"
                      onChange={(e) => onUpdate({ ...r, xeroLink: e.target.value })}
                    />
                  </FormField>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <CrmChatPanel
        customerName={customerName}
        contextType="pos"
        contextId="main"
        title="Chat — POs & Invoices"
      />
    </div>
  )
}
