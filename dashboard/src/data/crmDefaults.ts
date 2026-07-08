import type {
  CrmPortfolio,
  CrmSample,
  CrmSampleIteration,
  DecorMethod,
  OnboardingStatus,
  SampleApprovalStatus,
} from '../types/crm'
import { EMPTY_PORTFOLIO } from '../types/crm'

export const SUPPLIER_OPTIONS = {
  dtf: ['Transfer Express', 'Screen Transfer Co', 'Heat Press Supplies'],
  swing_tags: ['TagWorks UK', 'Label Craft', 'Swing Tag Direct'],
  blanks: ['Stanley/Stella', 'AS Colour', 'Bella+Canvas'],
  barcodes: ['Barcode Labels Ltd', 'Retail Tags UK'],
} as const

export const PARENT_COMPANY_OPTIONS = ['Warner Music', 'Sony Music', 'Universal Music', '—']

export function createEmptySample(sampleNumber: number): CrmSample {
  return {
    id: crypto.randomUUID(),
    sampleNumber,
    styleName: '',
    blankCode: '',
    blankName: '',
    blankColour: '',
    decorMethod: '',
    dtgDetails: { placement: '', artworkNumbers: '' },
    screenDetails: {
      screensSetUp: false,
      numberOfScreens: '',
      numberOfColors: '',
      screenArtwork: '',
    },
    backneckType: '',
    brandingNotes: '',
    specialInstructions: '',
    deliveryLocations: [''],
    approvalStatus: 'draft',
    iterationNumber: 1,
    jobNumber: '',
    poFileName: '',
    blankCost: '',
    marginPct: '',
    sellPrice: '',
    frontPrice: '',
    backPrice: '',
    invoiceOption: '',
    iterations: [],
    readyForMerch: false,
  }
}

export function onboardingStatusStyle(status: OnboardingStatus): string {
  switch (status) {
    case 'verified':
      return 'bg-emerald-100 text-emerald-800 ring-emerald-200'
    case 'credit_check':
      return 'bg-amber-100 text-amber-800 ring-amber-200'
    case 'received':
    case 'sent':
      return 'bg-blue-100 text-blue-800 ring-blue-200'
    default:
      return 'bg-slate-100 text-slate-600 ring-slate-200'
  }
}

export function sampleStatusStyle(status: SampleApprovalStatus): string {
  switch (status) {
    case 'approved':
      return 'bg-emerald-100 text-emerald-800 ring-emerald-200'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 ring-blue-200'
    case 'need_resample':
    case 'not_approved':
      return 'bg-red-100 text-red-800 ring-red-200'
    default:
      return 'bg-slate-100 text-slate-600 ring-slate-200'
  }
}

export function calcSellPrice(blankCost: string, marginPct: string): string {
  const cost = parseFloat(blankCost)
  const margin = parseFloat(marginPct)
  if (Number.isNaN(cost) || Number.isNaN(margin)) return ''
  return (cost * (1 + margin / 100)).toFixed(2)
}

/** Demo seed for first-time visitors — applied once per account name */
export function demoSeedForAccount(accountName: string): {
  portfolio?: CrmPortfolio
  samples?: CrmSample[]
} | null {
  const key = accountName.toLowerCase()
  if (!key.includes('warner') && !key.includes('boohoo')) return null

  const portfolio: CrmPortfolio = {
    ...EMPTY_PORTFOLIO,
    decorMethods: ['dtg', 'screen'] as DecorMethod[],
    artworkLinks: ['https://drive.example.com/artwork-folder'],
    packagingNotes: 'Polybag, no hangers. Swing tags on request.',
    brandingNotes: 'Remove Stanley/Stella labels; attach customer wash-care.',
    blanks: [
      {
        id: 'demo-blank-1',
        code: 'STTU755',
        name: 'Stanley/Stella Creator',
        techPackLink: 'https://drive.example.com/tech-pack-sttu755',
        notes: 'Organic tee — primary blank',
      },
    ],
    suppliers: [
      {
        id: 'demo-sup-1',
        category: 'dtf',
        name: 'Transfer Express',
        phone: '+44 20 1234 5678',
        notes: 'Standard DTF lead time 3 days',
      },
    ],
  }

  const sample: CrmSample = {
    ...createEmptySample(1),
    id: 'demo-sample-1',
    styleName: 'Tour Merch Tee 2026',
    blankCode: 'STTU755',
    blankName: 'Stanley/Stella Creator',
    blankColour: 'Black',
    decorMethod: 'dtg',
    dtgDetails: { placement: 'both', artworkNumbers: 'ART-001 front, ART-002 back' },
    backneckType: 'print',
    brandingNotes: 'Remove manufacturer label',
    specialInstructions: 'Match Pantone 185C on front print',
    approvalStatus: 'in_progress',
    blankCost: '4.50',
    marginPct: '40',
    sellPrice: '6.30',
    frontPrice: '3.50',
    backPrice: '2.80',
    readyForMerch: true,
    iterations: [
      {
        version: 1,
        changeDescription: 'Initial sample request from customer email',
        author: 'Sales',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      } satisfies CrmSampleIteration,
    ],
  }

  return { portfolio, samples: [sample] }
}
