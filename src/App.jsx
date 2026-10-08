import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Vehicles from './pages/Vehicles.jsx'
import Drivers from './pages/Drivers.jsx'
import Shipments from './pages/Shipments.jsx'
import Tracking from './pages/Tracking.jsx'
import Notifications from './pages/Notifications.jsx'

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}

export default App
