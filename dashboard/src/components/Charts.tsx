import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DailyPoint, NamedCount, Stage } from '../types'
import { formatCurrency } from '../utils/metrics'
import { EmptyState } from './EmptyState'
import { STAGE_CHART_COLORS } from './StageBadge'

const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid #e2e8f0',
  boxShadow: '0 8px 24px rgba(15,23,42,0.1)',
  fontSize: 12,
  padding: '10px 14px',
}

function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
}: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
  valueFormatter?: (v: number, name: string) => string
}) {
  if (!active || !payload?.length) return null
  return (
    <div style={tooltipStyle} className="bg-card">
      <p className="mb-2 text-xs font-semibold text-ink">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-6 text-xs">
          <span className="flex items-center gap-1.5 text-muted">
            <span className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
            {entry.name}
          </span>
          <span className="font-semibold tabular-nums text-ink">
            {valueFormatter ? valueFormatter(entry.value, entry.name) : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export function SalesTrendChart({ data }: { data: DailyPoint[] }) {
  if (data.length === 0) {
    return <EmptyState title="No sales data" description="Try widening the date range or clearing filters." />
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e8edf4" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 11, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 11, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
          width={52}
          tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          content={
            <ChartTooltip
              valueFormatter={(v, name) =>
                name === 'Sales value' ? formatCurrency(v) : String(v)
              }
            />
          }
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="value"
          name="Orders"
          stroke="#7c3aed"
          strokeWidth={2.5}
          fill="url(#salesGrad)"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="salesValue"
          name="Sales value"
          stroke="#0d9488"
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function ProductionTrendChart({ data }: { data: DailyPoint[] }) {
  if (data.length === 0) {
    return <EmptyState title="No completions" description="No orders were completed in this period." />
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e8edf4" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
          width={36}
          allowDecimals={false}
        />
        <Tooltip content={<ChartTooltip />} />
        <Bar dataKey="value" name="Completed" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === data.length - 1 ? '#6d28d9' : '#a78bfa'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function BacklogTrendChart({ data }: { data: DailyPoint[] }) {
  if (data.length === 0) {
    return <EmptyState title="No backlog history" />
  }

  const latest = data[data.length - 1]?.value ?? 0
  const first = data[0]?.value ?? 0
  const delta = latest - first

  return (
    <div>
      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tabular-nums text-ink">{latest}</span>
        <span className="text-xs text-muted">open now</span>
        {delta !== 0 && (
          <span
            className={`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold ${
              delta > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {delta > 0 ? '+' : ''}
            {delta} vs 30d ago
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="backlogGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d97706" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#d97706" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8edf4" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            width={36}
            allowDecimals={false}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            name="Open orders"
            stroke="#d97706"
            strokeWidth={2.5}
            fill="url(#backlogGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#d97706', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function OpenByCustomerChart({ data }: { data: NamedCount[] }) {
  if (data.length === 0) {
    return <EmptyState title="No open orders" description="All clear for the selected filters." />
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 4, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e8edf4" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: '#475569' }}
          axisLine={false}
          tickLine={false}
          width={130}
        />
        <Tooltip content={<ChartTooltip />} />
        <Bar dataKey="count" name="Open orders" radius={[0, 6, 6, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === 0 ? '#6d28d9' : '#c4b5fd'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function StageBreakdownChart({ data }: { data: NamedCount[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0)

  if (total === 0) {
    return <EmptyState title="No open orders" description="Adjust filters to see stage breakdown." />
  }

  return (
    <div className="space-y-4">
      <div className="flex h-3 overflow-hidden rounded-full bg-surface">
        {data.map((item) => {
          if (item.count === 0) return null
          const pct = (item.count / total) * 100
          return (
            <div
              key={item.name}
              className="h-full transition-all"
              style={{
                width: `${pct}%`,
                backgroundColor: STAGE_CHART_COLORS[item.name as Stage],
              }}
              title={`${item.name}: ${item.count}`}
            />
          )
        })}
      </div>
      <ul className="space-y-2.5">
        {data.map((item) => {
          const pct = total ? Math.round((item.count / total) * 100) : 0
          const color = STAGE_CHART_COLORS[item.name as Stage]
          return (
            <li key={item.name} className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="min-w-0 flex-1 truncate text-sm text-ink-muted">{item.name}</span>
              <span className="text-sm font-semibold tabular-nums text-ink">{item.count}</span>
              <span className="w-10 text-right text-xs tabular-nums text-muted">{pct}%</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
