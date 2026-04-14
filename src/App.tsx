import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EmployeeProvider, AuthProvider } from './hooks';
import { Layout, ProtectedRoute } from './components';
import { Dashboard, EmployeeDetail, OrgChart, Login, ForgotPassword } from './pages';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EmployeeProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="employee/:id" element={<EmployeeDetail />} />
                <Route path="org-chart" element={<OrgChart />} />
              </Route>
            </Route>
          </Routes>
        </EmployeeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
