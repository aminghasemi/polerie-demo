import type { CrmCustomer } from '../../types/crm'
import {
  CRM_STATUS_ORDER,
  formatGbp,
  groupCustomersByStatus,
  statusColumnStyle,
  statusLabel,
  statusStyle,
} from '../../utils/crm'

interface CrmKanbanBoardProps {
  customers: CrmCustomer[]
  onSelectCustomer: (customer: CrmCustomer) => void
}

export function CrmKanbanBoard({ customers, onSelectCustomer }: CrmKanbanBoardProps) {
  const groups = groupCustomersByStatus(customers)

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
      {CRM_STATUS_ORDER.map((status) => {
        const column = groups[status]
        const columnPipeline = column.reduce((sum, c) => sum + c.estimatedValue, 0)

        return (
          <div
            key={status}
            className={`flex w-[min(100%,280px)] shrink-0 flex-col rounded-2xl border ${statusColumnStyle(status)}`}
          >
            <div className="border-b border-inherit px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusStyle(status)}`}
                >
                  {statusLabel(status)}
                </span>
                <span className="text-xs font-medium tabular-nums text-muted">{column.length}</span>
              </div>
              <p className="mt-1.5 text-xs text-muted">{formatGbp(columnPipeline)} pipeline</p>
            </div>

            <div className="flex max-h-[min(70vh,640px)] flex-col gap-2 overflow-y-auto p-3 scrollbar-thin">
              {column.length === 0 ? (
                <p className="rounded-xl bg-card/60 px-3 py-6 text-center text-xs text-muted ring-1 ring-inset ring-border/60">
                  No accounts
                </p>
              ) : (
                column.map((customer) => (
                  <button
                    key={customer.name}
                    type="button"
                    onClick={() => onSelectCustomer(customer)}
                    className="rounded-xl bg-card p-3 text-left ring-1 ring-border transition-all hover:-translate-y-0.5 hover:shadow-md"
                    style={{ boxShadow: 'var(--shadow-card)' }}
                  >
                    <p className="font-semibold text-ink">{customer.name}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {customer.merchandiser} · {customer.primaryChannel}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted">
                      <span className="rounded-md bg-surface px-2 py-0.5 ring-1 ring-inset ring-border">
                        {customer.openJobs} open
                      </span>
                      {customer.pendingApproval > 0 && (
                        <span className="rounded-md bg-amber-50 px-2 py-0.5 text-amber-800 ring-1 ring-inset ring-amber-200">
                          {customer.pendingApproval} pending
                        </span>
                      )}
                      {customer.overdueJobs > 0 && (
                        <span className="rounded-md bg-red-50 px-2 py-0.5 text-red-800 ring-1 ring-inset ring-red-200">
                          {customer.overdueJobs} overdue
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-semibold tabular-nums text-ink">
                      {formatGbp(customer.estimatedValue)}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted">Last activity {customer.lastActivityDate}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
