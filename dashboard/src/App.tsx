import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { JobsProvider } from './context/JobsContext'
import { CrmProvider } from './context/CrmContext'
import { CrmPage } from './pages/CrmPage'
import { DashboardPage } from './pages/DashboardPage'
import { HomePage } from './pages/HomePage'
import { JobIntakeFormPage } from './pages/JobIntakeFormPage'
import { JobTrackerPage } from './pages/JobTrackerPage'
import { ProductionDashboardPage } from './pages/ProductionDashboardPage'

export default function App() {
  return (
    <BrowserRouter>
      <JobsProvider>
        <CrmProvider>
          <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/crm" element={<CrmPage />} />
            <Route path="/dtg-dashboard" element={<DashboardPage />} />
            <Route path="/production-dashboard" element={<ProductionDashboardPage />} />
            <Route path="/job-intake" element={<JobIntakeFormPage />} />
            <Route path="/job-tracker" element={<JobTrackerPage />} />
          </Routes>
          </AppLayout>
        </CrmProvider>
      </JobsProvider>
    </BrowserRouter>
  )
}
