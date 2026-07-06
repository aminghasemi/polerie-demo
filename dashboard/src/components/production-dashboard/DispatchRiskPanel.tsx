import type { DispatchRow, OrderAtRiskRow } from '../../types/productionDashboard'
import { daysDueBadge, formatQty } from '../../utils/productionDashboard'
import { jobStageStyle, priorityStyle } from '../../utils/jobTracker'
import { IconChevronRight } from '../Icons'

interface DispatchRiskPanelProps {
  dispatched: DispatchRow[]
  atRisk: OrderAtRiskRow[]
  onSelectOrder?: (orderNumber: string) => void
}

function OrderRow({
  order,
  showStage,
  onSelect,
}: {
  order: DispatchRow & { jobStage?: string }
  showStage?: boolean
  onSelect?: () => void
}) {
  const clickable = !!onSelect
  return (
    <tr
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect?.()
              }
            }
          : undefined
      }
      className={`border-b border-border/40 transition-colors last:border-0 ${
        clickable ? 'group cursor-pointer hover:bg-violet-50/60' : ''
      }`}
    >
      <td className="px-3 py-2.5 font-mono text-xs font-semibold text-accent">{order.orderNumber}</td>
      <td className="px-3 py-2.5 text-xs font-medium text-ink">{order.customer}</td>
      <td className="px-3 py-2.5">
        {order.daysDue ? (
          <span
            className={`inline-flex rounded-md px-2 py-0.5 text-xs font-bold tabular-nums ring-1 ring-inset ${daysDueBadge(order.daysDue)}`}
          >
            {order.daysDue}d
          </span>
        ) : (
          '—'
        )}
      </td>
      <td className="px-3 py-2.5">
        {order.priority ? (
          <span
            className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${priorityStyle(order.priority)}`}
          >
            {order.priority}
          </span>
        ) : (
          '—'
        )}
      </td>
      <td className="px-3 py-2.5 text-xs font-semibold tabular-nums">{formatQty(order.orderQty)}</td>
      {showStage && (
        <td className="px-3 py-2.5">
          {order.jobStage ? (
            <span
              className={`inline-flex max-w-[120px] truncate rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${jobStageStyle(order.jobStage)}`}
              title={order.jobStage}
            >
              {order.jobStage}
            </span>
          ) : (
            '—'
          )}
        </td>
      )}
      {clickable && (
        <td className="px-1 py-2.5 text-muted opacity-0 group-hover:opacity-100">
          <IconChevronRight className="h-4 w-4" />
        </td>
      )}
    </tr>
  )
}

function TableShell({
  title,
  subtitle,
  badge,
  children,
  variant = 'default',
}: {
  title: string
  subtitle: string
  badge?: string
  children: React.ReactNode
  variant?: 'default' | 'danger'
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl ring-1 ${
        variant === 'danger' ? 'bg-red-50/30 ring-red-200' : 'bg-card ring-border'
      }`}
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div
        className={`flex items-center justify-between border-b px-4 py-3 ${
          variant === 'danger' ? 'border-red-200 bg-red-50/50' : 'border-border'
        }`}
      >
        <div>
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
          <p className="text-xs text-muted">{subtitle}</p>
        </div>
        {badge && (
          <span className="rounded-full bg-card px-2.5 py-0.5 text-xs font-semibold text-ink ring-1 ring-border">
            {badge}
          </span>
        )}
      </div>
      <div className="scrollbar-thin max-h-[480px] overflow-auto">{children}</div>
    </div>
  )
}

export function DispatchRiskPanel({ dispatched, atRisk, onSelectOrder }: DispatchRiskPanelProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <TableShell
        title="Dispatched today"
        subtitle="Orders scheduled for dispatch"
        badge={`${dispatched.length} orders`}
      >
        {dispatched.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">No dispatches scheduled today.</p>
        ) : (
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm">
              <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted">
                <th className="px-3 py-2.5 font-semibold">Order</th>
                <th className="px-3 py-2.5 font-semibold">Customer</th>
                <th className="px-3 py-2.5 font-semibold">Due</th>
                <th className="px-3 py-2.5 font-semibold">Priority</th>
                <th className="px-3 py-2.5 font-semibold">Qty</th>
                {onSelectOrder && <th className="w-6" />}
              </tr>
            </thead>
            <tbody>
              {dispatched.map((o) => (
                <OrderRow
                  key={o.orderNumber}
                  order={o}
                  onSelect={onSelectOrder ? () => onSelectOrder(o.orderNumber) : undefined}
                />
              ))}
            </tbody>
          </table>
        )}
      </TableShell>

      <TableShell
        title="Orders at risk"
        subtitle="Open jobs with &lt;10 days until delivery"
        badge={`${atRisk.length} orders`}
        variant="danger"
      >
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-red-50/90 backdrop-blur-sm">
            <tr className="border-b border-red-200 text-[11px] uppercase tracking-wider text-red-800/70">
              <th className="px-3 py-2.5 font-semibold">Order</th>
              <th className="px-3 py-2.5 font-semibold">Customer</th>
              <th className="px-3 py-2.5 font-semibold">Due</th>
              <th className="px-3 py-2.5 font-semibold">Priority</th>
              <th className="px-3 py-2.5 font-semibold">Qty</th>
              <th className="px-3 py-2.5 font-semibold">Stage</th>
              {onSelectOrder && <th className="w-6" />}
            </tr>
          </thead>
          <tbody>
            {atRisk.map((o) => (
              <OrderRow
                key={o.orderNumber}
                order={o}
                showStage
                onSelect={onSelectOrder ? () => onSelectOrder(o.orderNumber) : undefined}
              />
            ))}
          </tbody>
        </table>
      </TableShell>
    </div>
  )
}
