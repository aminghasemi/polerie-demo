import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCrm } from '../../context/CrmContext'
import type { CrmCustomer, CrmCustomerProfile, CrmDetailTab, CrmPortfolio } from '../../types/crm'
import { ONBOARDING_STATUS_LABELS } from '../../types/crm'
import { EMPTY_CRM_PROFILE } from '../../types/crm'
import type { Job } from '../../types/jobTracker'
import { onboardingStatusStyle } from '../../data/crmDefaults'
import { buildCustomerInsights } from '../../utils/crmCustomerDetail'
import { formatGbp, statusLabel, statusStyle } from '../../utils/crm'
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

const TABS: {
  id: CrmDetailTab
  label: string
  hint: string
  requiresOnboarding?: boolean
}[] = [
  { id: 'home', label: 'Home', hint: 'Onboarding & contacts' },
  { id: 'portfolio', label: 'Portfolio', hint: 'Blanks & suppliers', requiresOnboarding: true },
  { id: 'samples', label: 'Samples', hint: 'Styles & costing', requiresOnboarding: true },
  { id: 'production', label: 'Production', hint: 'Job links', requiresOnboarding: true },
  { id: 'pricing', label: 'Pricing', hint: 'Agreed rates', requiresOnboarding: true },
  { id: 'pos', label: 'POs', hint: 'Invoices & POs', requiresOnboarding: true },
  { id: 'activity', label: 'Activity', hint: 'Notes & chat' },
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
  const profile = customer ? crm.getProfile(customer.name) : EMPTY_CRM_PROFILE

  useEffect(() => {
    if (!customer) return
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

  const locked = TABS.find((t) => t.id === tab)?.requiresOnboarding && !verified

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close customer details"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="crm-customer-title"
        className="relative z-10 flex h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-t-2xl bg-surface shadow-2xl ring-1 ring-border sm:h-[90vh] sm:rounded-2xl"
      >
        <header className="shrink-0 border-b border-border bg-card px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Account workspace
                </p>
                {profile.onboardingStatus && (
                  <span
                    className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${onboardingStatusStyle(profile.onboardingStatus)}`}
                  >
                    {ONBOARDING_STATUS_LABELS[profile.onboardingStatus]}
                  </span>
                )}
              </div>
              <h2 id="crm-customer-title" className="mt-1 truncate text-xl font-bold text-ink sm:text-2xl">
                {customer.name}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                <span
                  className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusStyle(customer.status)}`}
                >
                  {statusLabel(customer.status)}
                </span>
                <span>{customer.merchandiser}</span>
                <span className="hidden sm:inline">·</span>
                <span>{customer.primaryChannel}</span>
                {customer.openJobs > 0 && (
                  <>
                    <span className="hidden sm:inline">·</span>
                    <span>{customer.openJobs} open jobs</span>
                  </>
                )}
                {customer.estimatedValue > 0 && (
                  <>
                    <span className="hidden sm:inline">·</span>
                    <span className="font-medium text-ink">{formatGbp(customer.estimatedValue)} pipeline</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                to={`/job-tracker?customer=${encodeURIComponent(customer.name)}`}
                onClick={onClose}
                className="hidden rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-ink hover:bg-card sm:inline-flex"
              >
                Job Tracker
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-muted ring-1 ring-border hover:text-ink"
                aria-label="Close"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <nav className="shrink-0 overflow-x-auto border-b border-border bg-card/80 px-3 py-2 lg:w-56 lg:overflow-y-auto lg:border-b-0 lg:border-r lg:py-4">
            <ul className="flex gap-1 lg:flex-col">
              {TABS.map((t) => {
                const isLocked = t.requiresOnboarding && !verified
                const isActive = tab === t.id
                const badge =
                  t.id === 'samples' && samples.length > 0 ? samples.length : undefined

                return (
                  <li key={t.id} className="shrink-0 lg:shrink">
                    <button
                      type="button"
                      onClick={() => setTab(t.id)}
                      className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left transition-colors lg:py-3 ${
                        isActive
                          ? 'bg-violet-600 text-white shadow-sm'
                          : 'text-ink hover:bg-surface'
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-medium">{t.label}</span>
                        <span
                          className={`mt-0.5 block text-[10px] ${isActive ? 'text-violet-100' : 'text-muted'}`}
                        >
                          {t.hint}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        {badge !== undefined && (
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                              isActive ? 'bg-white/20 text-white' : 'bg-accent/15 text-accent'
                            }`}
                          >
                            {badge}
                          </span>
                        )}
                        {isLocked && (
                          <span className={isActive ? 'text-violet-200' : 'text-muted'} aria-hidden>
                            🔒
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
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
                      title="Team chat"
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
                      title="Team chat"
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
    </div>
  )
}
