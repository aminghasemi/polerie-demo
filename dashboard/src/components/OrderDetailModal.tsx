import { useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import type { Order } from '../types'
import {
  formatCurrency,
  getAgeDays,
  getDaysLate,
  isAged,
  isOpen,
  isOverdue,
} from '../utils/metrics'
import { StageBadge } from './StageBadge'
import { IconX } from './Icons'

interface OrderDetailModalProps {
  order: Order | null
  onClose: () => void
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <dt className="shrink-0 text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </dt>
      <dd className="text-sm font-medium text-ink sm:text-right">{children}</dd>
    </div>
  )
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return format(parseISO(dateStr), 'd MMM yyyy')
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  useEffect(() => {
    if (!order) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [order, onClose])

  if (!order) return null

  const daysLate = getDaysLate(order)
  const ageDays = getAgeDays(order)
  const overdue = isOverdue(order)
  const aged = isAged(order)
  const open = isOpen(order)

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close order details"
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-detail-title"
        className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-card shadow-2xl ring-1 ring-border"
      >
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">Order</p>
            <h2 id="order-detail-title" className="mt-0.5 font-mono text-xl font-bold text-ink">
              {order.ref}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">{order.customer}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-ink"
            aria-label="Close"
          >
            <IconX className="h-5 w-5" />
          </button>
        </header>

        <div className="scrollbar-thin overflow-y-auto px-5 py-4">
          <div className="mb-4 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                open
                  ? 'bg-teal-50 text-teal-800 ring-teal-200'
                  : 'bg-slate-100 text-slate-600 ring-slate-200'
              }`}
            >
              {open ? 'Open' : 'Completed'}
            </span>
            {overdue && (
              <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200">
                Overdue · {daysLate}d late
              </span>
            )}
            {aged && (
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-200">
                Aged · {ageDays}d
              </span>
            )}
            {order.isBlocked && (
              <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200">
                Blocked
              </span>
            )}
          </div>

          <dl className="space-y-3.5 divide-y divide-border/60">
            <div className="space-y-3.5 pb-3.5">
              <DetailRow label="Quantity">{order.quantity.toLocaleString()}</DetailRow>
              <DetailRow label="Sales value">{formatCurrency(order.salesValue)}</DetailRow>
            </div>

            <div className="space-y-3.5 py-3.5">
              <DetailRow label="Intake date">{formatDate(order.intakeDate)}</DetailRow>
              <DetailRow label="Promised date">{formatDate(order.promisedDate)}</DetailRow>
              <DetailRow label="Completed">{formatDate(order.completionDate)}</DetailRow>
            </div>

            <div className="space-y-3.5 py-3.5">
              <DetailRow label="Ops stage">
                <span className="font-semibold">{order.opsStage}</span>
              </DetailRow>
              <DetailRow label="Production stage">
                <StageBadge stage={order.stage} />
              </DetailRow>
            </div>

            {order.isBlocked && order.blockerReason && (
              <div className="pt-3.5">
                <DetailRow label="Blocker">
                  <span className="text-danger">{order.blockerReason}</span>
                </DetailRow>
              </div>
            )}
          </dl>
        </div>

        <footer className="border-t border-border bg-surface/60 px-5 py-3">
          <p className="text-center text-xs text-muted">
            Demo — Odoo deep-link would open here in production
          </p>
        </footer>
      </div>
    </div>
  )
}
