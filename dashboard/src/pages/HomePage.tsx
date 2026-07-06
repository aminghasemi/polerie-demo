import { Link } from 'react-router-dom'
import { IconChevronRight, IconLayers, IconOrders, IconUsers } from '../components/Icons'

function AreaCard({
  to,
  title,
  description,
  icon,
  accent,
}: {
  to: string
  title: string
  description: string
  icon: React.ReactNode
  accent: 'violet' | 'teal' | 'amber'
}) {
  const accents = {
    violet: {
      ring: 'hover:ring-violet-300',
      icon: 'bg-violet-100 text-violet-700',
      label: 'text-violet-700',
    },
    teal: {
      ring: 'hover:ring-teal-300',
      icon: 'bg-teal-100 text-teal-700',
      label: 'text-teal-700',
    },
    amber: {
      ring: 'hover:ring-amber-300',
      icon: 'bg-amber-100 text-amber-700',
      label: 'text-amber-700',
    },
  }

  return (
    <Link
      to={to}
      className={`group flex flex-col rounded-2xl bg-card p-6 ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-lg ${accents[accent].ring}`}
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${accents[accent].icon}`}>
        {icon}
      </div>
      <h2 className="mt-5 text-xl font-bold text-ink">{title}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{description}</p>
      <span
        className={`mt-6 inline-flex items-center gap-1 text-sm font-semibold ${accents[accent].label}`}
      >
        Open
        <IconChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

export function HomePage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-5xl flex-col justify-center px-4 py-12 sm:px-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Pixelgenie</p>
        <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">Operations</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted">
          Choose an area to view dashboards, track jobs, and manage production workflow.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AreaCard
          to="/dtg-dashboard"
          title="DTG Dashboard"
          description="Direct-to-garment operations overview — sales, intake trends, stage breakdown, and exception orders."
          icon={<IconLayers className="h-6 w-6" />}
          accent="violet"
        />
        <AreaCard
          to="/production-dashboard"
          title="Production & Job Tracker"
          description="Screen print production dashboard, job intake, delivery tools, and the full job sheet tracker."
          icon={<IconOrders className="h-6 w-6" />}
          accent="teal"
        />
        <AreaCard
          to="/crm"
          title="CRM"
          description="Customer accounts, pipeline value, merchandiser ownership, and links through to live jobs."
          icon={<IconUsers className="h-6 w-6" />}
          accent="amber"
        />
      </div>
    </main>
  )
}
