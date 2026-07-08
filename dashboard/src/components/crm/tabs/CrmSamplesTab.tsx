import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { CrmPortfolio, CrmSample, DecorMethod, SampleApprovalStatus } from '../../../types/crm'
import { DECOR_METHOD_LABELS, SAMPLE_STATUS_LABELS } from '../../../types/crm'
import { calcSellPrice, sampleStatusStyle } from '../../../data/crmDefaults'
import { FormField, SectionCard, inputClass, selectClass } from '../crmUi'
import { CrmChatPanel } from '../CrmChatPanel'

interface CrmSamplesTabProps {
  customerName: string
  samples: CrmSample[]
  portfolio: CrmPortfolio
  onAddSample: () => CrmSample
  onUpdateSample: (sample: CrmSample) => void
  onDeleteSample: (id: string) => void
}

export function CrmSamplesTab({
  customerName,
  samples,
  portfolio,
  onAddSample,
  onUpdateSample,
  onDeleteSample,
}: CrmSamplesTabProps) {
  const [selectedId, setSelectedId] = useState<string | null>(samples[0]?.id ?? null)
  const selected = samples.find((s) => s.id === selectedId) ?? samples[0]

  const patchSample = (patch: Partial<CrmSample>) => {
    if (!selected) return
    let next = { ...selected, ...patch }
    if (patch.blankCost !== undefined || patch.marginPct !== undefined) {
      const sell = calcSellPrice(next.blankCost, next.marginPct)
      if (sell) next = { ...next, sellPrice: sell }
    }
    onUpdateSample(next)
  }

  const addIteration = (description: string) => {
    if (!selected || !description.trim()) return
    const version = selected.iterations.length + 1
    onUpdateSample({
      ...selected,
      iterationNumber: version,
      iterations: [
        ...selected.iterations,
        {
          version,
          changeDescription: description.trim(),
          author: 'You',
          createdAt: new Date().toISOString(),
        },
      ],
    })
  }

  const prefillFromPortfolio = () => {
    if (!selected) return
    const blank = portfolio.blanks[0]
    patchSample({
      blankCode: blank?.code ?? selected.blankCode,
      blankName: blank?.name ?? selected.blankName,
      decorMethod: portfolio.decorMethods[0] ?? selected.decorMethod,
      brandingNotes: portfolio.brandingNotes || selected.brandingNotes,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {samples.length} sample{samples.length !== 1 ? 's' : ''} — each tracked independently
        </p>
        <button
          type="button"
          onClick={() => {
            const s = onAddSample()
            setSelectedId(s.id)
          }}
          className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700"
        >
          + New sample
        </button>
      </div>

      {samples.length === 0 ? (
        <p className="rounded-xl bg-surface px-4 py-12 text-center text-sm text-muted ring-1 ring-border">
          No samples yet. Create Sample 1 to start the workflow.
        </p>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {samples.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedId(s.id)}
                className={`shrink-0 rounded-xl px-3 py-2 text-left ring-1 ring-inset transition-colors ${
                  selected?.id === s.id
                    ? 'bg-violet-50 ring-violet-200'
                    : 'bg-surface ring-border hover:bg-card'
                }`}
              >
                <p className="text-xs font-semibold text-ink">
                  Sample {s.sampleNumber}
                  {s.styleName ? ` · ${s.styleName}` : ''}
                </p>
                <span
                  className={`mt-1 inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${sampleStatusStyle(s.approvalStatus)}`}
                >
                  {SAMPLE_STATUS_LABELS[s.approvalStatus]}
                </span>
              </button>
            ))}
          </div>

          {selected && (
            <div className="space-y-4">
              <SectionCard
                title={`Sample ${selected.sampleNumber} — specification`}
                action={
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={prefillFromPortfolio}
                      className="text-xs font-semibold text-accent hover:underline"
                    >
                      Pre-fill from portfolio
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteSample(selected.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                }
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Style name">
                    <input
                      className={inputClass}
                      value={selected.styleName}
                      onChange={(e) => patchSample({ styleName: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Approval status">
                    <select
                      className={selectClass}
                      value={selected.approvalStatus}
                      onChange={(e) =>
                        patchSample({ approvalStatus: e.target.value as SampleApprovalStatus })
                      }
                    >
                      {(Object.keys(SAMPLE_STATUS_LABELS) as SampleApprovalStatus[]).map((s) => (
                        <option key={s} value={s}>
                          {SAMPLE_STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Blank code">
                    <input
                      className={inputClass}
                      value={selected.blankCode}
                      onChange={(e) => patchSample({ blankCode: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Blank name">
                    <input
                      className={inputClass}
                      value={selected.blankName}
                      onChange={(e) => patchSample({ blankName: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Colour">
                    <input
                      className={inputClass}
                      value={selected.blankColour}
                      onChange={(e) => patchSample({ blankColour: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Decor method">
                    <select
                      className={selectClass}
                      value={selected.decorMethod}
                      onChange={(e) =>
                        patchSample({ decorMethod: e.target.value as DecorMethod | '' })
                      }
                    >
                      <option value="">Select…</option>
                      {(Object.keys(DECOR_METHOD_LABELS) as DecorMethod[]).map((m) => (
                        <option key={m} value={m}>
                          {DECOR_METHOD_LABELS[m]}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>

                {selected.decorMethod === 'dtg' && (
                  <div className="mt-4 grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
                    <FormField label="DTG placement">
                      <select
                        className={selectClass}
                        value={selected.dtgDetails.placement}
                        onChange={(e) =>
                          patchSample({
                            dtgDetails: {
                              ...selected.dtgDetails,
                              placement: e.target.value as 'front' | 'back' | 'both' | '',
                            },
                          })
                        }
                      >
                        <option value="">Select…</option>
                        <option value="front">Front only</option>
                        <option value="back">Back only</option>
                        <option value="both">Front and back</option>
                      </select>
                    </FormField>
                    <FormField label="Artwork numbers">
                      <input
                        className={inputClass}
                        value={selected.dtgDetails.artworkNumbers}
                        onChange={(e) =>
                          patchSample({
                            dtgDetails: { ...selected.dtgDetails, artworkNumbers: e.target.value },
                          })
                        }
                        placeholder="ART-001 front, ART-002 back"
                      />
                    </FormField>
                  </div>
                )}

                {selected.decorMethod === 'screen' && (
                  <div className="mt-4 grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
                    <FormField label="Screens set up?">
                      <select
                        className={selectClass}
                        value={selected.screenDetails.screensSetUp ? 'yes' : 'no'}
                        onChange={(e) =>
                          patchSample({
                            screenDetails: {
                              ...selected.screenDetails,
                              screensSetUp: e.target.value === 'yes',
                            },
                          })
                        }
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </FormField>
                    <FormField label="Number of screens">
                      <input
                        className={inputClass}
                        value={selected.screenDetails.numberOfScreens}
                        onChange={(e) =>
                          patchSample({
                            screenDetails: {
                              ...selected.screenDetails,
                              numberOfScreens: e.target.value,
                            },
                          })
                        }
                      />
                    </FormField>
                    <FormField label="Number of colours">
                      <input
                        className={inputClass}
                        value={selected.screenDetails.numberOfColors}
                        onChange={(e) =>
                          patchSample({
                            screenDetails: {
                              ...selected.screenDetails,
                              numberOfColors: e.target.value,
                            },
                          })
                        }
                      />
                    </FormField>
                    <FormField label="Screen artwork refs">
                      <input
                        className={inputClass}
                        value={selected.screenDetails.screenArtwork}
                        onChange={(e) =>
                          patchSample({
                            screenDetails: {
                              ...selected.screenDetails,
                              screenArtwork: e.target.value,
                            },
                          })
                        }
                      />
                    </FormField>
                  </div>
                )}

                <div className="mt-4 grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
                  <FormField label="Backneck">
                    <select
                      className={selectClass}
                      value={selected.backneckType}
                      onChange={(e) =>
                        patchSample({
                          backneckType: e.target.value as CrmSample['backneckType'],
                        })
                      }
                    >
                      <option value="">—</option>
                      <option value="print">Print</option>
                      <option value="heat_transfer">Heat transfer</option>
                      <option value="none">None</option>
                    </select>
                  </FormField>
                  <FormField label="Ready for merch">
                    <select
                      className={selectClass}
                      value={selected.readyForMerch ? 'yes' : 'no'}
                      onChange={(e) => patchSample({ readyForMerch: e.target.value === 'yes' })}
                    >
                      <option value="no">No — sales still editing</option>
                      <option value="yes">Yes — hand to merchandiser</option>
                    </select>
                  </FormField>
                  <FormField label="Branding / label instructions" className="sm:col-span-2">
                    <textarea
                      className={`${inputClass} min-h-[64px] resize-y`}
                      value={selected.brandingNotes}
                      onChange={(e) => patchSample({ brandingNotes: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Special instructions" className="sm:col-span-2">
                    <textarea
                      className={`${inputClass} min-h-[64px] resize-y`}
                      value={selected.specialInstructions}
                      onChange={(e) => patchSample({ specialInstructions: e.target.value })}
                    />
                  </FormField>
                </div>

                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-xs font-semibold uppercase text-muted">Delivery locations</p>
                  <div className="mt-2 space-y-2">
                    {selected.deliveryLocations.map((loc, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          className={inputClass}
                          value={loc}
                          placeholder={`Location ${i + 1}`}
                          onChange={(e) => {
                            const deliveryLocations = [...selected.deliveryLocations]
                            deliveryLocations[i] = e.target.value
                            patchSample({ deliveryLocations })
                          }}
                        />
                        {selected.deliveryLocations.length > 1 && (
                          <button
                            type="button"
                            className="shrink-0 text-xs text-red-600"
                            onClick={() =>
                              patchSample({
                                deliveryLocations: selected.deliveryLocations.filter(
                                  (_, j) => j !== i,
                                ),
                              })
                            }
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        patchSample({
                          deliveryLocations: [...selected.deliveryLocations, ''],
                        })
                      }
                      className="text-xs font-semibold text-accent hover:underline"
                    >
                      + Add location
                    </button>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Sample costing">
                <div className="grid gap-4 sm:grid-cols-3">
                  <FormField label="Blank cost (£)">
                    <input
                      className={inputClass}
                      value={selected.blankCost}
                      onChange={(e) => patchSample({ blankCost: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Margin %">
                    <input
                      className={inputClass}
                      value={selected.marginPct}
                      onChange={(e) => patchSample({ marginPct: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Sell price (£)">
                    <input
                      className={inputClass}
                      value={selected.sellPrice}
                      onChange={(e) => patchSample({ sellPrice: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Front price (£)">
                    <input
                      className={inputClass}
                      value={selected.frontPrice}
                      onChange={(e) => patchSample({ frontPrice: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Back price (£)">
                    <input
                      className={inputClass}
                      value={selected.backPrice}
                      onChange={(e) => patchSample({ backPrice: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Invoicing">
                    <select
                      className={selectClass}
                      value={selected.invoiceOption}
                      onChange={(e) =>
                        patchSample({
                          invoiceOption: e.target.value as CrmSample['invoiceOption'],
                        })
                      }
                    >
                      <option value="">—</option>
                      <option value="invoice_now">Invoice now</option>
                      <option value="include_production">Include in production invoice</option>
                      <option value="photo_only">Photo only (no charge)</option>
                    </select>
                  </FormField>
                </div>
              </SectionCard>

              <SectionCard title="Job link & PO">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    label="Job number"
                    hint="Copy from Job Tracker after merch creates the job"
                  >
                    <div className="flex gap-2">
                      <input
                        className={inputClass}
                        value={selected.jobNumber}
                        onChange={(e) => patchSample({ jobNumber: e.target.value })}
                        placeholder="e.g. J-12345"
                      />
                      {selected.jobNumber && (
                        <Link
                          to={`/job-tracker?customer=${encodeURIComponent(customerName)}`}
                          className="shrink-0 rounded-lg border border-border px-3 py-2 text-sm font-medium text-accent hover:bg-surface"
                        >
                          Open
                        </Link>
                      )}
                    </div>
                  </FormField>
                  <FormField label="Customer PO">
                    <input
                      type="file"
                      className={inputClass}
                      onChange={(e) =>
                        patchSample({ poFileName: e.target.files?.[0]?.name ?? '' })
                      }
                    />
                    {selected.poFileName && (
                      <p className="mt-1 text-xs text-muted">{selected.poFileName}</p>
                    )}
                  </FormField>
                </div>
              </SectionCard>

              <IterationsSection sample={selected} onAddIteration={addIteration} />

              <CrmChatPanel
                customerName={customerName}
                contextType="sample"
                contextId={selected.id}
                title={`Chat — Sample ${selected.sampleNumber}`}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

function IterationsSection({
  sample,
  onAddIteration,
}: {
  sample: CrmSample
  onAddIteration: (desc: string) => void
}) {
  const [desc, setDesc] = useState('')

  return (
    <SectionCard title="Iterations / change requests">
      {sample.iterations.length > 0 && (
        <div className="mb-4 space-y-2">
          {sample.iterations.map((it) => (
            <div key={it.version} className="rounded-lg bg-card px-3 py-2 ring-1 ring-border">
              <p className="text-[10px] text-muted">
                v{it.version} · {it.author} ·{' '}
                {new Date(it.createdAt).toLocaleDateString('en-GB')}
              </p>
              <p className="mt-1 text-sm text-ink">{it.changeDescription}</p>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          className={inputClass}
          placeholder="Describe change for resample…"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            onAddIteration(desc)
            setDesc('')
          }}
          disabled={!desc.trim()}
          className="shrink-0 rounded-lg bg-surface px-3 py-2 text-sm font-medium ring-1 ring-border hover:bg-card disabled:opacity-50"
        >
          Log iteration
        </button>
      </div>
    </SectionCard>
  )
}
