import type { CrmPortfolio, CrmPortfolioBlank, CrmPortfolioSupplier, DecorMethod } from '../../../types/crm'
import { DECOR_METHOD_LABELS } from '../../../types/crm'
import { SUPPLIER_OPTIONS } from '../../../data/crmDefaults'
import { FormField, SectionCard, inputClass, selectClass } from '../crmUi'

interface CrmPortfolioTabProps {
  portfolio: CrmPortfolio
  dirty: boolean
  onChange: (portfolio: CrmPortfolio) => void
  onSave: () => void
  onReset: () => void
}

export function CrmPortfolioTab({ portfolio, dirty, onChange, onSave, onReset }: CrmPortfolioTabProps) {
  const toggleDecor = (method: DecorMethod) => {
    const methods = portfolio.decorMethods.includes(method)
      ? portfolio.decorMethods.filter((m) => m !== method)
      : [...portfolio.decorMethods, method]
    onChange({ ...portfolio, decorMethods: methods })
  }

  const updateBlank = (id: string, patch: Partial<CrmPortfolioBlank>) => {
    onChange({
      ...portfolio,
      blanks: portfolio.blanks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    })
  }

  const addBlank = () => {
    onChange({
      ...portfolio,
      blanks: [
        ...portfolio.blanks,
        { id: crypto.randomUUID(), code: '', name: '', techPackLink: '', notes: '' },
      ],
    })
  }

  const removeBlank = (id: string) => {
    onChange({ ...portfolio, blanks: portfolio.blanks.filter((b) => b.id !== id) })
  }

  const updateSupplier = (id: string, patch: Partial<CrmPortfolioSupplier>) => {
    onChange({
      ...portfolio,
      suppliers: portfolio.suppliers.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    })
  }

  const addSupplier = (category: CrmPortfolioSupplier['category']) => {
    onChange({
      ...portfolio,
      suppliers: [
        ...portfolio.suppliers,
        { id: crypto.randomUUID(), category, name: '', phone: '', notes: '' },
      ],
    })
  }

  const removeSupplier = (id: string) => {
    onChange({ ...portfolio, suppliers: portfolio.suppliers.filter((s) => s.id !== id) })
  }

  const addArtworkLink = () => {
    onChange({ ...portfolio, artworkLinks: [...portfolio.artworkLinks, ''] })
  }

  return (
    <div className="space-y-6">
      <SectionCard title="Decor methods" description="Standing decor preferences for this customer.">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(DECOR_METHOD_LABELS) as DecorMethod[]).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => toggleDecor(method)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ring-1 ring-inset transition-colors ${
                portfolio.decorMethods.includes(method)
                  ? 'bg-violet-100 text-violet-800 ring-violet-200'
                  : 'bg-surface text-muted ring-border hover:text-ink'
              }`}
            >
              {DECOR_METHOD_LABELS[method]}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Blanks & tech packs"
        action={
          <button
            type="button"
            onClick={addBlank}
            className="text-xs font-semibold text-accent hover:underline"
          >
            + Add blank
          </button>
        }
      >
        {portfolio.blanks.length === 0 ? (
          <p className="text-sm text-muted">No blanks recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {portfolio.blanks.map((blank) => (
              <div
                key={blank.id}
                className="grid gap-3 rounded-lg bg-card p-3 ring-1 ring-border sm:grid-cols-2"
              >
                <FormField label="Blank code">
                  <input
                    className={inputClass}
                    value={blank.code}
                    onChange={(e) => updateBlank(blank.id, { code: e.target.value })}
                  />
                </FormField>
                <FormField label="Blank name">
                  <input
                    className={inputClass}
                    value={blank.name}
                    onChange={(e) => updateBlank(blank.id, { name: e.target.value })}
                  />
                </FormField>
                <FormField label="Tech pack link" className="sm:col-span-2">
                  <input
                    className={inputClass}
                    value={blank.techPackLink}
                    onChange={(e) => updateBlank(blank.id, { techPackLink: e.target.value })}
                    placeholder="https://"
                  />
                </FormField>
                <FormField label="Notes" className="sm:col-span-2">
                  <input
                    className={inputClass}
                    value={blank.notes}
                    onChange={(e) => updateBlank(blank.id, { notes: e.target.value })}
                  />
                </FormField>
                <button
                  type="button"
                  onClick={() => removeBlank(blank.id)}
                  className="text-xs text-red-600 hover:underline sm:col-span-2"
                >
                  Remove blank
                </button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Artwork folder"
        action={
          <button
            type="button"
            onClick={addArtworkLink}
            className="text-xs font-semibold text-accent hover:underline"
          >
            + Add link
          </button>
        }
      >
        {portfolio.artworkLinks.length === 0 ? (
          <p className="text-sm text-muted">No artwork links yet.</p>
        ) : (
          <div className="space-y-2">
            {portfolio.artworkLinks.map((link, i) => (
              <input
                key={i}
                className={inputClass}
                value={link}
                placeholder="https://drive…/artwork"
                onChange={(e) => {
                  const links = [...portfolio.artworkLinks]
                  links[i] = e.target.value
                  onChange({ ...portfolio, artworkLinks: links })
                }}
              />
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Packaging & branding">
        <div className="grid gap-4">
          <FormField label="Packaging preferences">
            <textarea
              className={`${inputClass} min-h-[72px] resize-y`}
              value={portfolio.packagingNotes}
              onChange={(e) => onChange({ ...portfolio, packagingNotes: e.target.value })}
              placeholder="Swing tags, polybags, hangers…"
            />
          </FormField>
          <FormField label="Branding notes">
            <textarea
              className={`${inputClass} min-h-[72px] resize-y`}
              value={portfolio.brandingNotes}
              onChange={(e) => onChange({ ...portfolio, brandingNotes: e.target.value })}
              placeholder="Remove manufacturer labels, wash/care…"
            />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Suppliers" description="DTF, swing tags, blanks, barcodes — use dropdowns where possible.">
        <div className="mb-3 flex flex-wrap gap-2">
          {(['dtf', 'swing_tags', 'blanks', 'barcodes'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => addSupplier(cat)}
              className="rounded-lg border border-border px-2 py-1 text-xs font-medium text-ink hover:bg-surface"
            >
              + {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
        {portfolio.suppliers.length === 0 ? (
          <p className="text-sm text-muted">No suppliers recorded.</p>
        ) : (
          <div className="space-y-3">
            {portfolio.suppliers.map((sup) => (
              <div key={sup.id} className="grid gap-2 rounded-lg bg-card p-3 ring-1 ring-border sm:grid-cols-4">
                <span className="text-xs font-semibold uppercase text-muted sm:col-span-4">
                  {sup.category.replace('_', ' ')}
                </span>
                <FormField label="Supplier">
                  <select
                    className={selectClass}
                    value={sup.name}
                    onChange={(e) => updateSupplier(sup.id, { name: e.target.value })}
                  >
                    <option value="">Select…</option>
                    {SUPPLIER_OPTIONS[sup.category].map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Phone">
                  <input
                    className={inputClass}
                    value={sup.phone}
                    onChange={(e) => updateSupplier(sup.id, { phone: e.target.value })}
                  />
                </FormField>
                <FormField label="Notes" className="sm:col-span-2">
                  <input
                    className={inputClass}
                    value={sup.notes}
                    onChange={(e) => updateSupplier(sup.id, { notes: e.target.value })}
                  />
                </FormField>
                <button
                  type="button"
                  onClick={() => removeSupplier(sup.id)}
                  className="text-xs text-red-600 hover:underline sm:col-span-4"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {dirty && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSave}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Save portfolio
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-surface"
          >
            Discard
          </button>
        </div>
      )}
    </div>
  )
}
