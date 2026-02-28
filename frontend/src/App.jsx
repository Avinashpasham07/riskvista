import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoutes from './components/ProtectedRoutes';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DataEntry from './pages/DataEntry';
import Simulator from './pages/Simulator';
import Forecast from './pages/Forecast';
import Landing from './pages/Landing';

// App Base
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Phase 23 Public Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Phase 12 Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Phase 13 Dashboard Protected Routes */}
          <Route element={<ProtectedRoutes />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/data-entry" element={<DataEntry />} />
              {/* Phase 17 Simulator */}
              <Route path="/simulate" element={<Simulator />} />
              {/* Phase 18 Forecast */}
              <Route path="/forecast" element={<Forecast />} />
            </Route>
          </Route>

          {/* Default Redirect Logic */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
