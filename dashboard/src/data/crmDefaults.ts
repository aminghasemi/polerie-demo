import type { CrmSample, OnboardingStatus, SampleApprovalStatus } from '../types/crm'

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
