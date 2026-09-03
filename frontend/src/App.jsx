import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { NotificationProvider } from './context/NotificationContext'
import SmartNotification from './components/SmartNotification'
import Dashboard from './pages/Dashboard'
import Savings from './pages/Savings'
import ResilienceScorePage from './pages/ResilienceScorePage'
import Transactions from './pages/Transactions'
import Insights from './pages/Insights'
import Goals from './pages/Goals'
import GlobalNetwork from './pages/GlobalNetwork'
import Settings from './pages/Settings'
import Schemes from './pages/Schemes'
import AiLab from './pages/AiLab'
import Loans from './pages/Loans'
import Expenses from './pages/Expenses'
import BadWeek from './pages/BadWeek'
import Passport from './pages/Passport'
import ResponsibleAi from './pages/ResponsibleAi'

export default function App() {
  return (
    <AppProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bad-week" element={<BadWeek />} />
            <Route path="/passport" element={<Passport />} />
            <Route path="/responsible-ai" element={<ResponsibleAi />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/score" element={<ResilienceScorePage />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/activity" element={<Navigate to="/transactions" replace />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/lab" element={<AiLab />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/network" element={<GlobalNetwork />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {/* Smart Financial Pop-up Notifications — renders the toast stack */}
          <SmartNotification />
        </BrowserRouter>
      </NotificationProvider>
    </AppProvider>
  )
}
