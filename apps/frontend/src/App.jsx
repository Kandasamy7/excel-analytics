import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UnauthorizedPage from './pages/UnauthorizedPage'

import UploadPage from './pages/UploadPage'
import HistoryPage from './pages/HistoryPage'
import ChartPage from './pages/ChartPage'
import UserChartPage from './pages/UserChartPage'
import DashboardPage from './pages/DashboardPage'

import AdminDashboard from './pages/AdminDashboard'
import AdminUploadPage from './pages/AdminUploadPage'

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/uploads" element={<AdminUploadPage />} />
        </Route>

        {/* Authenticated User Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/chart/:id" element={<ChartPage />} />
          <Route path="/user-charts" element={<UserChartPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
