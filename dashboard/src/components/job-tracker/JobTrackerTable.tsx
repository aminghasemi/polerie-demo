import { useMemo, useState } from 'react'
import type { Job } from '../../types/jobTracker'
import {
  type QuickFilter,
  approvalStatusStyle,
  computeJobStats,
  isJobOverdue,
  jobSearchText,
  jobStageStyle,
  matchesQuickFilter,
  merchandiserInitials,
  dueDaysBadgeStyle,
  priorityStyle,
  sortJobs,
} from '../../utils/jobTracker'
import { IconChevronRight, IconFilter, IconSearch, IconX } from '../Icons'
import { EmptyState } from '../EmptyState'
import { JobTrackerStatsBar } from './JobTrackerStatsBar'

const PAGE_SIZES = [25, 50, 100] as const

type SortKey =
  | 'job_number'
  | 'customer_client_name'
  | 'job_description'
  | 'approval_status'
  | 'job_stage'
  | 'due_days'
  | 'order_quantity'
  | 'priority_level'

interface JobTrackerTableProps {
  jobs: Job[]
  onOpenJob: (job: Job) => void
  initialSearch?: string
}

function SortBtn({
  label,
  sortKey,
  activeKey,
  dir,
  onSort,
}: {
  label: string
  sortKey: SortKey
  activeKey: string
  dir: 'asc' | 'desc'
  onSort: (k: SortKey) => void
}) {
  const active = activeKey === sortKey
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={`group flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
        active ? 'text-accent' : 'text-muted hover:text-ink'
      }`}
    >
      {label}
      <span
        className={`text-[10px] ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`}
      >
        {active ? (dir === 'asc' ? '↑' : '↓') : '↕'}
      </span>
    </button>
  )
}

export function JobTrackerTable({ jobs, onOpenJob, initialSearch = '' }: JobTrackerTableProps) {
  const [search, setSearch] = useState(initialSearch)
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all')
  const [stageFilter, setStageFilter] = useState('all')
  const [sortKey, setSortKey] = useState<SortKey>('job_number')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(25)
  const [showStageFilter, setShowStageFilter] = useState(false)

  const stats = useMemo(() => computeJobStats(jobs), [jobs])

  const stages = useMemo(
    () => [...new Set(jobs.map((j) => j.job_stage).filter(Boolean))].sort(),
    [jobs],
  )

  const hasExtraFilters = stageFilter !== 'all'

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = jobs
    if (quickFilter !== 'all') list = list.filter((j) => matchesQuickFilter(j, quickFilter))
    if (stageFilter !== 'all') list = list.filter((j) => j.job_stage === stageFilter)
    if (q) list = list.filter((j) => jobSearchText(j).includes(q))
    return sortJobs(list, sortKey, sortDir)
  }, [jobs, search, quickFilter, stageFilter, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages - 1)
  const pageJobs = filtered.slice(safePage * pageSize, (safePage + 1) * pageSize)
  const rangeStart = filtered.length === 0 ? 0 : safePage * pageSize + 1
  const rangeEnd = Math.min((safePage + 1) * pageSize, filtered.length)

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir(key === 'due_days' ? 'asc' : 'desc')
    }
    setPage(0)
  }

  const clearFilters = () => {
    setSearch('')
    setQuickFilter('all')
    setStageFilter('all')
    setPage(0)
  }

  const isFiltered = search || quickFilter !== 'all' || hasExtraFilters

  return (
    <div className="space-y-5">
      <JobTrackerStatsBar
        stats={stats}
        activeFilter={quickFilter}
        onFilter={(f) => {
          setQuickFilter(f as QuickFilter)
          setPage(0)
        }}
      />

      {/* Toolbar */}
      <div
        className="rounded-2xl bg-card p-4 ring-1 ring-border"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              placeholder="Search job number, customer, description, merchandiser…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(0)
              }}
              className="w-full rounded-xl border-0 bg-surface py-2.5 pl-10 pr-10 text-sm text-ink ring-1 ring-inset ring-border placeholder:text-muted focus:ring-2 focus:ring-accent"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setPage(0)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted hover:bg-card hover:text-ink"
                aria-label="Clear search"
              >
                <IconX className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowStageFilter((s) => !s)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium ring-1 ring-inset transition-colors ${
                hasExtraFilters
                  ? 'bg-accent-light text-accent ring-accent/30'
                  : 'bg-surface text-ink-muted ring-border hover:text-ink'
              }`}
            >
              <IconFilter className="h-4 w-4" />
              Stage
              {hasExtraFilters && (
                <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
                  1
                </span>
              )}
            </button>

            {isFiltered && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:text-accent"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {showStageFilter && (
          <div className="mt-3 border-t border-border pt-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Job stage
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setStageFilter('all')
                  setPage(0)
                }}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                  stageFilter === 'all'
                    ? 'bg-accent text-white'
                    : 'bg-surface text-ink-muted ring-1 ring-inset ring-border'
                }`}
              >
                All stages
              </button>
              {stages.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setStageFilter(s)
                    setPage(0)
                  }}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                    stageFilter === s
                      ? 'bg-accent text-white'
                      : 'bg-surface text-ink-muted ring-1 ring-inset ring-border hover:ring-accent/40'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No jobs found"
          description="Try a different quick filter, clear your search, or pick another stage."
        />
      ) : (
        <>
          <div
            className="overflow-hidden rounded-2xl bg-card ring-1 ring-border"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div className="flex items-center justify-between border-b border-border bg-surface/50 px-4 py-2.5">
              <p className="text-sm text-ink-muted">
                <span className="font-semibold text-ink">{filtered.length}</span> jobs
                {isFiltered && ' · filtered'}
              </p>
              <p className="text-xs text-muted">Click a row to view full job sheet</p>
            </div>

            <div className="scrollbar-thin overflow-x-auto">
              <table className="w-full min-w-[960px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border bg-surface/90">
                    <th className="sticky left-0 z-20 min-w-[148px] bg-surface/95 px-4 py-3 backdrop-blur-sm after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border">
                      <SortBtn
                        label="Job"
                        sortKey="job_number"
                        activeKey={sortKey}
                        dir={sortDir}
                        onSort={toggleSort}
                      />
                    </th>
                    <th className="min-w-[200px] px-4 py-3">
                      <SortBtn
                        label="Description"
                        sortKey="job_description"
                        activeKey={sortKey}
                        dir={sortDir}
                        onSort={toggleSort}
                      />
                    </th>
                    <th className="min-w-[108px] px-4 py-3">
                      <SortBtn
                        label="Approval"
                        sortKey="approval_status"
                        activeKey={sortKey}
                        dir={sortDir}
                        onSort={toggleSort}
                      />
                    </th>
                    <th className="min-w-[130px] px-4 py-3">
                      <SortBtn
                        label="Stage"
                        sortKey="job_stage"
                        activeKey={sortKey}
                        dir={sortDir}
                        onSort={toggleSort}
                      />
                    </th>
                    <th className="min-w-[72px] px-4 py-3">
                      <SortBtn
                        label="Priority"
                        sortKey="priority_level"
                        activeKey={sortKey}
                        dir={sortDir}
                        onSort={toggleSort}
                      />
                    </th>
                    <th className="min-w-[100px] px-4 py-3">
                      <SortBtn
                        label="Due"
                        sortKey="due_days"
                        activeKey={sortKey}
                        dir={sortDir}
                        onSort={toggleSort}
                      />
                    </th>
                    <th className="min-w-[52px] px-4 py-3">
                      <SortBtn
                        label="Qty"
                        sortKey="order_quantity"
                        activeKey={sortKey}
                        dir={sortDir}
                        onSort={toggleSort}
                      />
                    </th>
                    <th className="min-w-[140px] px-4 py-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                        Operations
                      </span>
                    </th>
                    <th className="w-10 px-2 py-3" aria-hidden />
                  </tr>
                </thead>
                <tbody>
                  {pageJobs.map((job) => {
                    const overdue = isJobOverdue(job)
                    return (
                      <tr
                        key={job.job_number}
                        role="button"
                        tabIndex={0}
                        onClick={() => onOpenJob(job)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            onOpenJob(job)
                          }
                        }}
                        className={`group cursor-pointer border-b border-border/40 transition-colors last:border-0 hover:bg-violet-50/60 ${
                          overdue ? 'bg-red-50/30 hover:bg-red-50/50' : ''
                        }`}
                      >
                        {/* Sticky job cell */}
                        <td className="sticky left-0 z-10 bg-card px-4 py-3 group-hover:bg-violet-50/60 after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border/60">
                          <div className="flex items-center gap-2.5">
                            {job.merchandiser && (
                              <span
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-light text-[10px] font-bold text-accent ring-1 ring-inset ring-violet-200"
                                title={job.merchandiser}
                              >
                                {merchandiserInitials(job.merchandiser)}
                              </span>
                            )}
                            <div className="min-w-0">
                              <p className="font-mono text-sm font-bold text-accent">{job.job_number}</p>
                              <p className="truncate text-xs font-medium text-ink-muted">
                                {job.customer_client_name || '—'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <p
                            className="line-clamp-2 text-sm font-medium text-ink"
                            title={job.job_description}
                          >
                            {job.job_description || '—'}
                          </p>
                          {job.order_channel && (
                            <p className="mt-0.5 text-[11px] text-muted">{job.order_channel}</p>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {job.approval_status ? (
                            <span
                              className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${approvalStatusStyle(job.approval_status)}`}
                            >
                              {job.approval_status}
                            </span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {job.job_stage ? (
                            <span
                              className={`inline-flex max-w-[130px] truncate rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${jobStageStyle(job.job_stage)}`}
                              title={job.job_stage}
                            >
                              {job.job_stage}
                            </span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {job.priority_level ? (
                            <span
                              className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${priorityStyle(job.priority_level)}`}
                            >
                              {job.priority_level}
                            </span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-0.5">
                            {job.due_days ? (
                              <span
                                className={`inline-flex w-fit rounded-md px-2 py-0.5 text-xs font-bold tabular-nums ring-1 ring-inset ${dueDaysBadgeStyle(job.due_days)}`}
                              >
                                {job.due_days}d
                              </span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                            {job.requested_delivery_date && (
                              <span className="text-[11px] tabular-nums text-muted">
                                {job.requested_delivery_date}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold tabular-nums text-ink">
                            {job.order_quantity || '—'}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          {job.operations_required ? (
                            <span
                              className="line-clamp-2 text-xs leading-relaxed text-ink-muted"
                              title={job.operations_required}
                            >
                              {job.operations_required}
                            </span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>

                        <td className="px-2 py-3 text-muted opacity-0 transition-opacity group-hover:opacity-100">
                          <IconChevronRight className="h-4 w-4" />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              Showing{' '}
              <span className="font-medium text-ink">
                {rangeStart}–{rangeEnd}
              </span>{' '}
              of <span className="font-medium text-ink">{filtered.length}</span>
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-muted">
                Rows
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value) as (typeof PAGE_SIZES)[number])
                    setPage(0)
                  }}
                  className="rounded-lg bg-card px-2 py-1.5 text-sm text-ink ring-1 ring-border"
                >
                  {PAGE_SIZES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={safePage === 0}
                  onClick={() => setPage(0)}
                  className="rounded-lg bg-card px-2.5 py-1.5 text-sm text-ink ring-1 ring-border disabled:opacity-40"
                  aria-label="First page"
                >
                  «
                </button>
                <button
                  type="button"
                  disabled={safePage === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg bg-card px-3 py-1.5 text-sm font-medium text-ink ring-1 ring-border disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="min-w-[80px] text-center text-sm tabular-nums text-ink-muted">
                  {safePage + 1} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={safePage >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg bg-card px-3 py-1.5 text-sm font-medium text-ink ring-1 ring-border disabled:opacity-40"
                >
                  Next
                </button>
                <button
                  type="button"
                  disabled={safePage >= totalPages - 1}
                  onClick={() => setPage(totalPages - 1)}
                  className="rounded-lg bg-card px-2.5 py-1.5 text-sm text-ink ring-1 ring-border disabled:opacity-40"
                  aria-label="Last page"
                >
                  »
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
