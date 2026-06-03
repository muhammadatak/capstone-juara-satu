import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { TicketProvider } from './context/TicketContext'
import { ProtectedRoute } from './components/ProtectedRoute'

import ArtikelPage from './pages/nasabah/ArtikelPage'
import ArticleDetailPage from './pages/nasabah/ArticleDetailPage'
import LaporanPage from './pages/nasabah/LaporanPage'
import LandingPage from './pages/nasabah/LandingPage'
import CekStatusPage from './pages/nasabah/CekStatusPage'
import LoginPage from './pages/admin/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import TicketingPage from './pages/admin/TicketingPage'
import TicketDetailPage from './pages/admin/TicketDetailPage'

export default function App() {
  return (
    <AuthProvider>
      <TicketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/artikel" element={<ArtikelPage />} />
            <Route path="/artikel/:slug" element={<ArticleDetailPage />} />
            <Route path="/laporan" element={<LaporanPage />} />
            <Route path="/cek-status/:ticketUuid?" element={<CekStatusPage />} />
            <Route path="/admin" element={<LoginPage />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/admin/ticketing" element={<ProtectedRoute><TicketingPage /></ProtectedRoute>} />
            <Route path="/admin/ticketing/:id" element={<ProtectedRoute><TicketDetailPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TicketProvider>
    </AuthProvider>
  )
}
