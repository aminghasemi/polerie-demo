import { useEffect, useMemo, useState } from 'react'
import { useCrm } from '../../context/CrmContext'
import type { CrmCustomer, CrmCustomerProfile, CrmDetailTab, CrmPortfolio } from '../../types/crm'
import { EMPTY_CRM_PROFILE } from '../../types/crm'
import type { Job } from '../../types/jobTracker'
import { buildCustomerInsights } from '../../utils/crmCustomerDetail'
import { statusLabel, statusStyle } from '../../utils/crm'
import { IconX } from '../Icons'
import { CrmChatPanel } from './CrmChatPanel'
import { LockedTab } from './crmUi'
import { CrmActivityTab } from './tabs/CrmActivityTab'
import { CrmHomeTab } from './tabs/CrmHomeTab'
import { CrmPoInvoicesTab } from './tabs/CrmPoInvoicesTab'
import { CrmPortfolioTab } from './tabs/CrmPortfolioTab'
import { CrmPricingTab } from './tabs/CrmPricingTab'
import { CrmProductionTab } from './tabs/CrmProductionTab'
import { CrmSamplesTab } from './tabs/CrmSamplesTab'

interface CrmCustomerDetailPanelProps {
  customer: CrmCustomer | null
  allJobs: Job[]
  onClose: () => void
  onOpenJob: (jobNumber: string) => void
}

const TABS: { id: CrmDetailTab; label: string; requiresOnboarding?: boolean }[] = [
  { id: 'home', label: 'Home' },
  { id: 'portfolio', label: 'Portfolio', requiresOnboarding: true },
  { id: 'samples', label: 'Samples', requiresOnboarding: true },
  { id: 'production', label: 'In Production', requiresOnboarding: true },
  { id: 'pricing', label: 'Pricing', requiresOnboarding: true },
  { id: 'pos', label: 'POs & Invoices', requiresOnboarding: true },
  { id: 'activity', label: 'Activity' },
]

export function CrmCustomerDetailPanel({
  customer,
  allJobs,
  onClose,
  onOpenJob,
}: CrmCustomerDetailPanelProps) {
  const crm = useCrm()
  const [tab, setTab] = useState<CrmDetailTab>('home')
  const [draftProfile, setDraftProfile] = useState<CrmCustomerProfile>(EMPTY_CRM_PROFILE)
  const [profileDirty, setProfileDirty] = useState(false)
  const [draftPortfolio, setDraftPortfolio] = useState<CrmPortfolio | null>(null)
  const [portfolioDirty, setPortfolioDirty] = useState(false)
  const [noteBody, setNoteBody] = useState('')

  const customerJobs = useMemo(
    () =>
      customer
        ? allJobs.filter((j) => (j.customer_client_name ?? '').trim() === customer.name)
        : [],
    [allJobs, customer],
  )

  const insights = useMemo(
    () => (customerJobs.length ? buildCustomerInsights(customerJobs) : null),
    [customerJobs],
  )

  const verified = customer ? crm.isOnboardingVerified(customer.name) : false

  useEffect(() => {
    if (!customer) return
    crm.ensureDemoSeed(customer.name)
    setTab('home')
    setNoteBody('')
    setDraftProfile(crm.getProfile(customer.name))
    setDraftPortfolio(crm.getPortfolio(customer.name))
    setProfileDirty(false)
    setPortfolioDirty(false)
  }, [customer, crm])

  useEffect(() => {
    if (!customer) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [customer, onClose])

  if (!customer) return null

  const samples = crm.getSamples(customer.name)
  const pricing = crm.getPricing(customer.name)
  const pos = crm.getPurchaseOrders(customer.name)
  const notes = crm.getNotes(customer.name)
  const chatActivity = crm.getAllActivity(customer.name)

  const setProfileField = <K extends keyof CrmCustomerProfile>(
    key: K,
    value: CrmCustomerProfile[K],
  ) => {
    setDraftProfile((prev) => ({ ...prev, [key]: value }))
    setProfileDirty(true)
  }

  const saveProfile = () => {
    crm.updateProfile(customer.name, draftProfile)
    setProfileDirty(false)
  }

  const savePortfolio = () => {
    if (draftPortfolio) {
      crm.updatePortfolio(customer.name, draftPortfolio)
      setPortfolioDirty(false)
    }
  }

  const locked =
    TABS.find((t) => t.id === tab)?.requiresOnboarding && !verified

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close customer details"
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="crm-customer-title"
        className="relative z-10 flex h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-t-2xl bg-card shadow-2xl ring-1 ring-border sm:h-auto sm:max-h-[92vh] sm:rounded-2xl"
      >
        <header className="shrink-0 border-b border-border px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                Customer account
              </p>
              <h2 id="crm-customer-title" className="mt-1 text-2xl font-bold text-ink">
                {customer.name}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusStyle(customer.status)}`}
                >
                  {statusLabel(customer.status)}
                </span>
                {customer.parentAccountName && (
                  <span className="text-xs text-muted">under {customer.parentAccountName}</span>
                )}
                <span className="text-sm text-muted">
                  {customer.merchandiser} · {customer.primaryChannel}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-muted ring-1 ring-border hover:text-ink"
              aria-label="Close"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>

          <nav className="mt-4 flex gap-1 overflow-x-auto rounded-xl bg-surface p-1 ring-1 ring-inset ring-border">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  tab === t.id
                    ? 'bg-card text-ink shadow-sm ring-1 ring-border'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {t.label}
                {t.id === 'samples' && samples.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-accent/15 px-1.5 text-[10px] font-bold text-accent">
                    {samples.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </header>

        <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-4">
          {locked ? (
            <LockedTab
              message="Complete customer onboarding and credit verification on the Home tab before accessing this section."
              onGoHome={() => setTab('home')}
            />
          ) : (
            <>
              {tab === 'home' && (
                <>
                  <CrmHomeTab
                    draft={draftProfile}
                    dirty={profileDirty}
                    onChange={setProfileField}
                    onSave={saveProfile}
                    onReset={() => {
                      setDraftProfile(crm.getProfile(customer.name))
                      setProfileDirty(false)
                    }}
                    onStatusChange={(status) => {
                      crm.setOnboardingStatus(customer.name, status)
                      setDraftProfile((p) => ({ ...p, onboardingStatus: status }))
                    }}
                  />
                  <CrmChatPanel
                    customerName={customer.name}
                    contextType="home"
                    contextId="main"
                    title="Chat — Home"
                  />
                </>
              )}

              {tab === 'portfolio' && draftPortfolio && (
                <>
                  <CrmPortfolioTab
                    portfolio={draftPortfolio}
                    dirty={portfolioDirty}
                    onChange={(p) => {
                      setDraftPortfolio(p)
                      setPortfolioDirty(true)
                    }}
                    onSave={savePortfolio}
                    onReset={() => {
                      setDraftPortfolio(crm.getPortfolio(customer.name))
                      setPortfolioDirty(false)
                    }}
                  />
                  <CrmChatPanel
                    customerName={customer.name}
                    contextType="portfolio"
                    contextId="main"
                    title="Chat — Portfolio"
                  />
                </>
              )}

              {tab === 'samples' && (
                <CrmSamplesTab
                  customerName={customer.name}
                  samples={samples}
                  portfolio={draftPortfolio ?? crm.getPortfolio(customer.name)}
                  onAddSample={() => crm.addSample(customer.name)}
                  onUpdateSample={(s) => crm.updateSample(customer.name, s)}
                  onDeleteSample={(id) => crm.deleteSample(customer.name, id)}
                />
              )}

              {tab === 'production' && (
                <CrmProductionTab
                  customerName={customer.name}
                  samples={samples}
                  onOpenJob={onOpenJob}
                />
              )}

              {tab === 'pricing' && (
                <CrmPricingTab
                  customerName={customer.name}
                  records={pricing}
                  onAdd={(r) => crm.addPricing(customer.name, r)}
                  onDelete={(id) => crm.deletePricing(customer.name, id)}
                />
              )}

              {tab === 'pos' && (
                <CrmPoInvoicesTab
                  customerName={customer.name}
                  profile={draftProfile}
                  records={pos}
                  onAdd={(r) => crm.addPurchaseOrder(customer.name, r)}
                  onUpdate={(r) => crm.updatePurchaseOrder(customer.name, r)}
                  onDelete={(id) => crm.deletePurchaseOrder(customer.name, id)}
                />
              )}

              {tab === 'activity' && insights && (
                <CrmActivityTab
                  customer={customer}
                  insights={insights}
                  notes={notes}
                  chatActivity={chatActivity}
                  noteBody={noteBody}
                  onNoteBodyChange={setNoteBody}
                  onSubmitNote={() => {
                    if (!noteBody.trim()) return
                    crm.addNote(customer.name, noteBody)
                    setNoteBody('')
                  }}
                  onDeleteNote={crm.deleteNote}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
