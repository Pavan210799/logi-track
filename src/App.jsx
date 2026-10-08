import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout.jsx'
import AuthLayout from './components/auth/AuthLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Vehicles from './pages/Vehicles.jsx'
import Drivers from './pages/Drivers.jsx'
import Shipments from './pages/Shipments.jsx'
import Tracking from './pages/Tracking.jsx'
import Notifications from './pages/Notifications.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import SignupSuccess from './pages/SignupSuccess.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup-success" element={<SignupSuccess />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
