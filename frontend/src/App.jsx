import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
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
import IncomeSetup from './pages/IncomeSetup'
import BadWeek from './pages/BadWeek'
import Passport from './pages/Passport'
import ResponsibleAi from './pages/ResponsibleAi'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/income-setup" element={<ProtectedRoute><IncomeSetup /></ProtectedRoute>} />
          <Route path="/bad-week" element={<ProtectedRoute><BadWeek /></ProtectedRoute>} />
          <Route path="/passport" element={<ProtectedRoute><Passport /></ProtectedRoute>} />
          <Route path="/responsible-ai" element={<ProtectedRoute><ResponsibleAi /></ProtectedRoute>} />
          <Route path="/savings" element={<ProtectedRoute><Savings /></ProtectedRoute>} />
          <Route path="/score" element={<ProtectedRoute><ResilienceScorePage /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/activity" element={<Navigate to="/transactions" replace />} />
          <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
          <Route path="/schemes" element={<ProtectedRoute><Schemes /></ProtectedRoute>} />
          <Route path="/lab" element={<ProtectedRoute><AiLab /></ProtectedRoute>} />
          <Route path="/loans" element={<ProtectedRoute><Loans /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
          <Route path="/network" element={<ProtectedRoute><GlobalNetwork /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
