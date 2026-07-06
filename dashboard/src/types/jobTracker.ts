export interface JobField {
  key: string
  label: string
  col: number
}

export type Job = Record<string, string>

export interface JobSection {
  title: string
  keys: string[]
}

export interface JobTrackerData {
  fields: JobField[]
  sections: [string, string[]][]
  tableColumns: string[]
  jobs: Job[]
}
