import { useState } from 'react'
import { odooProductionDashboard } from '../../data/odooProductionDashboard'
import { IconChevron } from '../Icons'

function MetricTile({
  label,
  value,
  footnote,
  tone,
}: {
  label: string
  value: string | number
  footnote?: string
  tone: 'blue' | 'pink' | 'yellow'
}) {
  const tones = {
    blue: 'bg-sky-50 ring-sky-200/70',
    pink: 'bg-rose-50 ring-rose-200/70',
    yellow: 'bg-amber-50 ring-amber-200/70',
  }

  return (
    <div className={`rounded-lg px-3 py-3 ring-1 ring-inset ${tones[tone]}`}>
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-ink">{value}</p>
      {footnote && <p className="mt-1 text-[10px] text-muted">{footnote}</p>}
    </div>
  )
}

function CollapsibleBlock({
  title,
  subtitle,
  defaultOpen = true,
  children,
}: {
  title: string
  subtitle?: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="overflow-hidden rounded-xl ring-1 ring-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 bg-surface/60 px-4 py-3 text-left"
      >
        <div>
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
        </div>
        <IconChevron up={open} className="h-4 w-4 shrink-0 text-muted" />
      </button>
      {open && <div className="border-t border-border p-4">{children}</div>}
    </section>
  )
}

export function OdooProductionDashboard() {
  const data = odooProductionDashboard

  return (
    <div className="space-y-4">
      <CollapsibleBlock title="Production headlines" subtitle="Volume and ageing" defaultOpen>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {data.headlines.map((kpi) => (
            <MetricTile
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              footnote={kpi.footnote}
              tone="blue"
            />
          ))}
        </div>
      </CollapsibleBlock>

      <CollapsibleBlock
        title="Manufacturing & printers"
        subtitle="Stage counts and daily printer throughput"
        defaultOpen={false}
      >
        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {data.manufacturingStages.map((kpi) => (
              <MetricTile key={kpi.label} label={kpi.label} value={kpi.value} tone="pink" />
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {data.printerThroughput.map((printer) => (
              <div
                key={printer.name}
                className="rounded-lg bg-amber-50 px-3 py-3 ring-1 ring-inset ring-amber-200/70"
              >
                <p className="text-xs font-medium text-muted">{printer.name}</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-ink">{printer.count}</p>
                <p className="mt-1 text-[10px] text-muted">{printer.model}</p>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleBlock>

      <CollapsibleBlock
        title="Products & supply"
        subtitle="Top products, blocked orders, unavailable components"
        defaultOpen={false}
      >
        <div className="grid gap-4 xl:grid-cols-[1fr_auto_1fr]">
          <div className="overflow-hidden rounded-lg ring-1 ring-border">
            <div className="border-b border-border bg-surface/60 px-3 py-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
                Top products
              </h4>
            </div>
            <div className="max-h-64 overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 border-b border-border bg-card text-[10px] uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Product</th>
                    <th className="px-3 py-2 font-semibold">Orders</th>
                    <th className="px-3 py-2 font-semibold">Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.topProducts.map((row, i) => (
                    <tr key={`${row.product}-${i}`}>
                      <td className="max-w-[140px] truncate px-3 py-2 text-ink-muted">{row.product}</td>
                      <td className="px-3 py-2 tabular-nums">{row.orders}</td>
                      <td className="px-3 py-2 tabular-nums">{row.qtyProduced.toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full rounded-lg bg-violet-100 px-5 py-6 text-center ring-1 ring-inset ring-violet-200 xl:w-44">
              <p className="text-xs font-medium text-violet-800">Blocked orders</p>
              <p className="mt-2 text-4xl font-bold tabular-nums text-violet-950">
                {data.blockedOrders}
              </p>
              <p className="mt-2 text-[10px] text-violet-700/80">{data.blockedOrdersNote}</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg ring-1 ring-border">
            <div className="border-b border-border bg-surface/60 px-3 py-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
                Unavailable components
              </h4>
            </div>
            <div className="max-h-64 overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 border-b border-border bg-card text-[10px] uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Component</th>
                    <th className="px-3 py-2 font-semibold">MO</th>
                    <th className="px-3 py-2 font-semibold">Demand</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.unavailableComponents.map((row, i) => (
                    <tr key={`${row.manufacturingOrder}-${i}`}>
                      <td className="max-w-[120px] truncate px-3 py-2 text-ink-muted">
                        {row.component}
                      </td>
                      <td className="px-3 py-2 font-mono text-[10px]">{row.manufacturingOrder}</td>
                      <td className="px-3 py-2 tabular-nums">{row.demand.toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CollapsibleBlock>
    </div>
  )
}
