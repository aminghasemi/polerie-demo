import { useState } from 'react'
import type { CrmPricingRecord } from '../../../types/crm'
import { calcSellPrice } from '../../../data/crmDefaults'
import { formatGbp } from '../../../utils/crm'
import { FormField, SectionCard, inputClass } from '../crmUi'
import { CrmChatPanel } from '../CrmChatPanel'

interface CrmPricingTabProps {
  customerName: string
  records: CrmPricingRecord[]
  onAdd: (record: Omit<CrmPricingRecord, 'id'>) => void
  onDelete: (id: string) => void
}

const emptyDraft = (): Omit<CrmPricingRecord, 'id'> => ({
  title: '',
  jobNumber: '',
  sampleId: '',
  blankCost: '',
  marginPct: '',
  sellPrice: '',
  frontPrice: '',
  backPrice: '',
  fileName: '',
  agreedAt: new Date().toISOString().slice(0, 10),
  agreedBy: 'You',
})

export function CrmPricingTab({
  customerName,
  records,
  onAdd,
  onDelete,
}: CrmPricingTabProps) {
  const [draft, setDraft] = useState(emptyDraft)
  const [showForm, setShowForm] = useState(records.length === 0)

  const submit = () => {
    if (!draft.title.trim()) return
    const sell =
      draft.sellPrice || calcSellPrice(draft.blankCost, draft.marginPct) || ''
    onAdd({ ...draft, sellPrice: sell })
    setDraft(emptyDraft())
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="Agreed pricing"
        description="Cost, margin, and sell price per order — avoids searching email when creating jobs or invoices."
        action={
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="text-xs font-semibold text-accent hover:underline"
          >
            {showForm ? 'Cancel' : '+ Add pricing'}
          </button>
        }
      >
        {showForm && (
          <div className="mb-6 grid gap-4 border-b border-border pb-6 sm:grid-cols-2">
            <FormField label="Title / order ref" className="sm:col-span-2">
              <input
                className={inputClass}
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="e.g. Tour merch run Q3"
              />
            </FormField>
            <FormField label="Job number">
              <input
                className={inputClass}
                value={draft.jobNumber}
                onChange={(e) => setDraft({ ...draft, jobNumber: e.target.value })}
              />
            </FormField>
            <FormField label="Blank cost (£)">
              <input
                className={inputClass}
                value={draft.blankCost}
                onChange={(e) => {
                  const blankCost = e.target.value
                  const sellPrice = calcSellPrice(blankCost, draft.marginPct)
                  setDraft({ ...draft, blankCost, sellPrice: sellPrice || draft.sellPrice })
                }}
              />
            </FormField>
            <FormField label="Margin %">
              <input
                className={inputClass}
                value={draft.marginPct}
                onChange={(e) => {
                  const marginPct = e.target.value
                  const sellPrice = calcSellPrice(draft.blankCost, marginPct)
                  setDraft({ ...draft, marginPct, sellPrice: sellPrice || draft.sellPrice })
                }}
              />
            </FormField>
            <FormField label="Sell price (£)">
              <input
                className={inputClass}
                value={draft.sellPrice}
                onChange={(e) => setDraft({ ...draft, sellPrice: e.target.value })}
              />
            </FormField>
            <FormField label="Pricing spreadsheet">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className={inputClass}
                onChange={(e) =>
                  setDraft({ ...draft, fileName: e.target.files?.[0]?.name ?? '' })
                }
              />
            </FormField>
            <button
              type="button"
              onClick={submit}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 sm:col-span-2"
            >
              Save pricing
            </button>
          </div>
        )}

        {records.length === 0 ? (
          <p className="text-sm text-muted">No pricing records yet.</p>
        ) : (
          <div className="space-y-3">
            {records.map((r) => (
              <div
                key={r.id}
                className="rounded-xl bg-card px-4 py-3 ring-1 ring-border"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-ink">{r.title}</p>
                    <p className="mt-1 text-sm text-muted">
                      Cost {r.blankCost ? `£${r.blankCost}` : '—'} · Margin {r.marginPct || '—'}%
                      · Sell{' '}
                      {r.sellPrice
                        ? formatGbp(parseFloat(r.sellPrice))
                        : '—'}
                      {r.jobNumber && ` · Job ${r.jobNumber}`}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Agreed {r.agreedAt} by {r.agreedBy}
                      {r.fileName && ` · ${r.fileName}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDelete(r.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <CrmChatPanel
        customerName={customerName}
        contextType="pricing"
        contextId="main"
        title="Chat — Pricing"
      />
    </div>
  )
}
