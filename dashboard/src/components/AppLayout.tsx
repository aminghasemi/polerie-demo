import { Link, NavLink, useLocation } from 'react-router-dom'
import { DEMO_DATA_AS_OF } from '../data/mockOrders'

function isCrmRoute(pathname: string) {
  return pathname.startsWith('/crm')
}

function isProductionRoute(pathname: string) {
  return (
    pathname.startsWith('/production-dashboard') ||
    pathname.startsWith('/job-tracker') ||
    pathname.startsWith('/job-intake')
  )
}

function isDtgRoute(pathname: string) {
  return pathname.startsWith('/dtg-dashboard')
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="min-h-screen pb-12">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-card/85 backdrop-blur-xl">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 text-sm font-bold text-white shadow-md shadow-violet-300/40">
                P
              </div>
              <div>
                <h1 className="text-base font-bold leading-tight text-ink">Pixelgenie</h1>
                <p className="hidden text-xs text-muted sm:block">Operations</p>
              </div>
            </Link>

            {!isHome && (
              <nav className="flex items-center gap-1 overflow-x-auto rounded-xl bg-surface p-1 ring-1 ring-inset ring-border">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-card text-ink shadow-sm ring-1 ring-border'
                        : 'text-muted hover:text-ink'
                    }`
                  }
                >
                  Home
                </NavLink>

                {isDtgRoute(pathname) && (
                  <NavLink
                    to="/dtg-dashboard"
                    className={({ isActive }) =>
                      `shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-card text-ink shadow-sm ring-1 ring-border'
                          : 'text-muted hover:text-ink'
                      }`
                    }
                  >
                    DTG Dashboard
                  </NavLink>
                )}

                {isCrmRoute(pathname) && (
                  <NavLink
                    to="/crm"
                    className={({ isActive }) =>
                      `shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-card text-ink shadow-sm ring-1 ring-border'
                          : 'text-muted hover:text-ink'
                      }`
                    }
                  >
                    CRM
                  </NavLink>
                )}

                {isProductionRoute(pathname) && (
                  <>
                    <NavLink
                      to="/production-dashboard"
                      className={({ isActive }) =>
                        `shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-card text-ink shadow-sm ring-1 ring-border'
                            : 'text-muted hover:text-ink'
                        }`
                      }
                    >
                      Production
                    </NavLink>
                    <NavLink
                      to="/job-tracker"
                      className={({ isActive }) =>
                        `shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-card text-ink shadow-sm ring-1 ring-border'
                            : 'text-muted hover:text-ink'
                        }`
                      }
                    >
                      Job Tracker
                    </NavLink>
                  </>
                )}
              </nav>
            )}

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-[11px] text-muted">Data as of</p>
                <p className="text-xs font-medium text-ink-muted">{DEMO_DATA_AS_OF}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800 ring-1 ring-inset ring-amber-200">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                Demo
              </span>
            </div>
          </div>
        </div>
      </header>

      {children}

      <footer className="border-t border-border bg-card/60 py-5 text-center">
        <p className="text-xs text-muted">
          Phase 1 MVP demo · Mock data from Job Sheet Tracker spreadsheet
        </p>
      </footer>
    </div>
  )
}
