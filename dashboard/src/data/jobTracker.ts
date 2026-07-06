import raw from './jobTracker.generated.json'
import type { JobTrackerData } from '../types/jobTracker'

export const jobTrackerData = raw as unknown as JobTrackerData

export const JOB_FIELDS = jobTrackerData.fields
export const JOB_SECTIONS: { title: string; keys: string[] }[] = jobTrackerData.sections.map(
  (section) => {
    const [title, keys] = section as [string, string[]]
    return { title, keys }
  },
)
export const JOB_TABLE_COLUMNS = [
  'job_number',
  'customer_client_name',
  'job_description',
  'approval_status',
  'merchandiser',
  'order_channel',
  'requested_delivery_date',
  'priority_level',
  'due_days',
  'order_quantity',
  'job_stage',
  'operations_required',
  'inbound_status',
]
export const SEED_JOBS = jobTrackerData.jobs

/** @deprecated Use useJobs() from JobsContext */
export const JOBS = SEED_JOBS

const labelMap = new Map(JOB_FIELDS.map((f) => [f.key, f.label]))

export function fieldLabel(key: string): string {
  return labelMap.get(key) ?? key.replace(/_/g, ' ')
}
