import type { CrmCustomerProfile, OnboardingStatus } from '../../../types/crm'
import { ONBOARDING_STATUS_LABELS } from '../../../types/crm'
import { onboardingStatusStyle, PARENT_COMPANY_OPTIONS } from '../../../data/crmDefaults'
import { FormField, SectionCard, inputClass, selectClass } from '../crmUi'

interface CrmHomeTabProps {
  draft: CrmCustomerProfile
  dirty: boolean
  onChange: <K extends keyof CrmCustomerProfile>(key: K, value: CrmCustomerProfile[K]) => void
  onSave: () => void
  onReset: () => void
  onStatusChange: (status: OnboardingStatus) => void
}

export function CrmHomeTab({
  draft,
  dirty,
  onChange,
  onSave,
  onReset,
  onStatusChange,
}: CrmHomeTabProps) {
  return (
    <div className="space-y-6">
      <SectionCard
        title="Onboarding"
        description="Customer onboarding form and credit-check workflow. Portfolio and Samples unlock when verified."
      >
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${onboardingStatusStyle(draft.onboardingStatus)}`}
          >
            {ONBOARDING_STATUS_LABELS[draft.onboardingStatus]}
          </span>
          <select
            className={`${selectClass} max-w-xs`}
            value={draft.onboardingStatus}
            onChange={(e) => onStatusChange(e.target.value as OnboardingStatus)}
          >
            {(Object.keys(ONBOARDING_STATUS_LABELS) as OnboardingStatus[]).map((s) => (
              <option key={s} value={s}>
                {ONBOARDING_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormField label="Onboarding form" hint="Upload signed PDF (demo: filename only)">
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
              <p className="mt-1 text-xs text-muted">Attached: {draft.onboardingFileName}</p>
            )}
          </FormField>
          <FormField label="Airtable credit check" hint="Demo: advance status manually above">
            <p className="rounded-lg bg-card px-3 py-2 text-sm text-muted ring-1 ring-border">
              {draft.onboardingStatus === 'credit_check'
                ? 'Pending Ahmed / accounts team'
                : draft.onboardingStatus === 'verified'
                  ? 'Credit verified — proceed with orders'
                  : 'Upload form to start credit check'}
            </p>
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Company & contact">
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

      <SectionCard title="Addresses">
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
        description="For larger clients using vendor portals to submit invoices or extract POs."
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
          <button
            type="button"
            onClick={onSave}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Save Home details
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
