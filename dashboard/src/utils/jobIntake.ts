import { differenceInCalendarDays, format, parseISO } from 'date-fns'
import type { Job } from '../types/jobTracker'

export interface JobIntakeFormValues {
  customerClientName: string
  merchandiser: string
  orderChannel: string
  orderNumber: string
  purchaseOrder: string
  requestedDeliveryDate: string
  jobDescription: string
  priorityLevel: string
  operationsRequired: string
  orderQuantity: string
  notes: string
}

export const ORDER_CHANNELS = ['Retail', 'Ecom', 'Tours', 'VIP'] as const

export const MERCHANDISERS = ['Chey', 'Chandni', 'Izzy', 'Natalia', 'Paulina', 'Heba'] as const

export const PRIORITY_LEVELS = ['Normal', 'High', 'Urgent (Requires Management Approval)'] as const

export const OPERATIONS_OPTIONS = [
  'Screen Print: Front',
  'Screen Print: Back',
  'Screen Print: Front, Back',
  'Screen Print: Back Neck',
  'DTG: Front',
  'DTG: Front, Back',
  'Embroidery: EMB1',
  'Embroidery: EMB1, EMB2',
  'Heat Transfer: HEAT1',
  'Screen Print: Front | Embroidery: EMB1',
  'Screen Print: Back | Embroidery: EMB1',
  'Screen Print: Front | DTG: Front',
  'PICK ORDER',
] as const

export function formatUkDate(date: Date): string {
  return format(date, 'dd/MM/yyyy')
}

export function computeDueDays(requestedDeliveryDate: string): string {
  if (!requestedDeliveryDate) return ''
  try {
    const due = parseISO(requestedDeliveryDate)
    const days = differenceInCalendarDays(due, new Date())
    return String(days)
  } catch {
    return ''
  }
}

export function formatUkDateFromIso(iso: string): string {
  if (!iso) return ''
  try {
    return formatUkDate(parseISO(iso))
  } catch {
    return ''
  }
}

export function parseJobNumberSuffix(jobNumber: string): number | null {
  const match = jobNumber.match(/^\d+-(\d+)$/)
  return match ? parseInt(match[1], 10) : null
}

export function generateNextJobNumber(existingJobs: Job[]): string {
  let max = 0
  for (const job of existingJobs) {
    const suffix = parseJobNumberSuffix(job.job_number ?? '')
    if (suffix !== null && suffix > max) max = suffix
  }
  const year = new Date().getFullYear() % 100
  return `${year}-${max + 1}`
}

export function buildJobFromForm(
  values: JobIntakeFormValues,
  jobNumber: string,
): Job {
  const today = formatUkDate(new Date())
  const deliveryUk = formatUkDateFromIso(values.requestedDeliveryDate)

  return {
    job_number: jobNumber,
    customer_client_name: values.customerClientName.trim(),
    approval_status: 'Pending Approval',
    merchandiser: values.merchandiser,
    order_number: values.orderNumber.trim(),
    purchase_order: values.purchaseOrder.trim(),
    order_channel: values.orderChannel,
    date_of_request: today,
    date_approved: '',
    requested_delivery_date: deliveryUk,
    job_description: values.jobDescription.trim(),
    priority_level: values.priorityLevel,
    due_days: computeDueDays(values.requestedDeliveryDate),
    operations_required: values.operationsRequired,
    order_quantity: values.orderQuantity.trim(),
    job_stage: 'Not Started',
    active_machine: 'Not Assigned',
    inbound_status: '',
    inbound_notes: values.notes.trim(),
    adult_apparel: 'Yes',
    total_qty: values.orderQuantity.trim(),
    source: 'job_intake_form',
  }
}

export function duplicateJobAsIntake(source: Job): JobIntakeFormValues {
  return {
    customerClientName: source.customer_client_name ?? '',
    merchandiser: source.merchandiser ?? '',
    orderChannel: source.order_channel ?? 'Retail',
    orderNumber: '',
    purchaseOrder: '',
    requestedDeliveryDate: '',
    jobDescription: source.job_description ? `${source.job_description} (copy)` : '',
    priorityLevel: source.priority_level ?? 'Normal',
    operationsRequired: source.operations_required ?? '',
    orderQuantity: source.order_quantity ?? '',
    notes: `Duplicated from ${source.job_number}`,
  }
}

export const EMPTY_JOB_INTAKE_FORM: JobIntakeFormValues = {
  customerClientName: '',
  merchandiser: '',
  orderChannel: 'Retail',
  orderNumber: '',
  purchaseOrder: '',
  requestedDeliveryDate: '',
  jobDescription: '',
  priorityLevel: 'Normal',
  operationsRequired: '',
  orderQuantity: '',
  notes: '',
}
