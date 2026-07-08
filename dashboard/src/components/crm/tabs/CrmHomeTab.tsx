import type { CrmCustomerProfile, OnboardingStatus } from '../../../types/crm'
import { ONBOARDING_STATUS_LABELS } from '../../../types/crm'
import { onboardingStatusStyle, PARENT_COMPANY_OPTIONS } from '../../../data/crmDefaults'
import { FormField, GhostButton, PrimaryButton, SectionCard, inputClass, selectClass } from '../crmUi'

const ONBOARDING_STEPS: OnboardingStatus[] = [
  'draft',
  'sent',
  'received',
  'credit_check',
  'verified',
]

interface CrmHomeTabProps {
  draft: CrmCustomerProfile
  dirty: boolean
  onChange: <K extends keyof CrmCustomerProfile>(key: K, value: CrmCustomerProfile[K]) => void
  onSave: () => void
  onReset: () => void
  onStatusChange: (status: OnboardingStatus) => void
}

function stepIndex(status: OnboardingStatus) {
  return ONBOARDING_STEPS.indexOf(status)
}

export function CrmHomeTab({
  draft,
  dirty,
  onChange,
  onSave,
  onReset,
  onStatusChange,
}: CrmHomeTabProps) {
  const currentStep = stepIndex(draft.onboardingStatus)

  return (
    <div className="space-y-5">
      <SectionCard
        title="Onboarding"
        description="Portfolio, Samples, and Pricing unlock once credit check is verified."
        compact
      >
        <ol className="flex flex-wrap gap-2 sm:gap-0 sm:justify-between">
          {ONBOARDING_STEPS.map((step, i) => {
            const done = i < currentStep
            const active = i === currentStep
            return (
              <li
                key={step}
                className={`flex items-center gap-2 rounded-xl px-2 py-1.5 text-xs sm:flex-1 sm:flex-col sm:px-1 ${
                  active ? 'bg-violet-50 ring-1 ring-violet-200' : ''
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    done
                      ? 'bg-emerald-500 text-white'
                      : active
                        ? 'bg-violet-600 text-white'
                        : 'bg-surface text-muted ring-1 ring-border'
                  }`}
                >
                  {done ? '✓' : i + 1}
                </span>
                <span className={`font-medium ${active ? 'text-ink' : 'text-muted'}`}>
                  {ONBOARDING_STATUS_LABELS[step]}
                </span>
              </li>
            )
          })}
        </ol>

        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <span
            className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${onboardingStatusStyle(draft.onboardingStatus)}`}
          >
            {ONBOARDING_STATUS_LABELS[draft.onboardingStatus]}
          </span>
          <select
            className={`${selectClass} max-w-[200px]`}
            value={draft.onboardingStatus}
            onChange={(e) => onStatusChange(e.target.value as OnboardingStatus)}
            aria-label="Update onboarding status"
          >
            {(Object.keys(ONBOARDING_STATUS_LABELS) as OnboardingStatus[]).map((s) => (
              <option key={s} value={s}>
                {ONBOARDING_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormField label="Onboarding form" hint="Demo stores filename only">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className={inputClass}
              onChange={(e) => {
                const file = e.target.files?.[0]
                onChange('onboardingFileName', file?.name ?? '')
                if (file && draft.onboardingStatus === 'draft') onStatusChange('received')
              }}
            />
            {draft.onboardingFileName && (
              <p className="mt-1.5 truncate text-xs text-muted">{draft.onboardingFileName}</p>
            )}
          </FormField>
          <FormField label="Credit check">
            <p className="rounded-xl bg-surface px-3 py-2.5 text-sm text-muted ring-1 ring-border">
              {draft.onboardingStatus === 'credit_check'
                ? 'With accounts — pending verification'
                : draft.onboardingStatus === 'verified'
                  ? 'Verified — proceed with orders'
                  : 'Upload signed form to continue'}
            </p>
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Company & contact" compact>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Company name">
            <input
              className={inputClass}
              value={draft.companyName}
              onChange={(e) => onChange('companyName', e.target.value)}
            />
          </FormField>
          <FormField label="Parent company" hint="e.g. Warner → artist sub-account">
            <select
              className={selectClass}
              value={draft.parentAccountName}
              onChange={(e) => onChange('parentAccountName', e.target.value)}
            >
              <option value="">— None —</option>
              {PARENT_COMPANY_OPTIONS.filter((p) => p !== '—').map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Contact name">
            <input
              className={inputClass}
              value={draft.contactName}
              onChange={(e) => onChange('contactName', e.target.value)}
            />
          </FormField>
          <FormField label="Account type">
            <input
              className={inputClass}
              value={draft.accountType}
              onChange={(e) => onChange('accountType', e.target.value)}
              placeholder="Retail, VIP, Artist…"
            />
          </FormField>
          <FormField label="Email">
            <input
              type="email"
              className={inputClass}
              value={draft.email}
              onChange={(e) => onChange('email', e.target.value)}
            />
          </FormField>
          <FormField label="Phone">
            <input
              className={inputClass}
              value={draft.phone}
              onChange={(e) => onChange('phone', e.target.value)}
            />
          </FormField>
          <FormField label="Website">
            <input
              className={inputClass}
              value={draft.website}
              onChange={(e) => onChange('website', e.target.value)}
            />
          </FormField>
          <FormField label="Internal reference">
            <input
              className={inputClass}
              value={draft.internalRef}
              onChange={(e) => onChange('internalRef', e.target.value)}
            />
          </FormField>
          <FormField label="Payment terms" className="sm:col-span-2">
            <input
              className={inputClass}
              value={draft.paymentTerms}
              onChange={(e) => onChange('paymentTerms', e.target.value)}
              placeholder="e.g. Net 30"
            />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Addresses" compact>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Delivery address">
            <textarea
              className={`${inputClass} min-h-[88px] resize-y`}
              value={draft.deliveryAddress}
              onChange={(e) => onChange('deliveryAddress', e.target.value)}
            />
          </FormField>
          <FormField label="Billing address">
            <textarea
              className={`${inputClass} min-h-[88px] resize-y`}
              value={draft.billingAddress}
              onChange={(e) => onChange('billingAddress', e.target.value)}
            />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard
        title="Client portal"
        description="Vendor portals for PO extraction or invoice upload."
        compact
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Portal URL" className="sm:col-span-2">
            <input
              className={inputClass}
              value={draft.portalUrl}
              onChange={(e) => onChange('portalUrl', e.target.value)}
              placeholder="https://vendor-portal.customer.com"
            />
          </FormField>
          <FormField label="Portal access notes" className="sm:col-span-2">
            <textarea
              className={`${inputClass} min-h-[72px] resize-y`}
              value={draft.portalNotes}
              onChange={(e) => onChange('portalNotes', e.target.value)}
              placeholder="Login reference, contact for access…"
            />
          </FormField>
        </div>
      </SectionCard>

      {dirty && (
        <div className="flex gap-2">
          <PrimaryButton onClick={onSave}>Save Home details</PrimaryButton>
          <GhostButton onClick={onReset}>Discard</GhostButton>
        </div>
      )}
    </div>
  )
}
