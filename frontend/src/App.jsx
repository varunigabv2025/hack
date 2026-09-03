import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Dashboard from './pages/Dashboard'
import Savings from './pages/Savings'
import ResilienceScore from './pages/ResilienceScore'
import Transactions from './pages/Transactions'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/savings" element={<Savings />} />
          <Route path="/score" element={<ResilienceScore />} />
          <Route path="/activity" element={<Transactions />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
