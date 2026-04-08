import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './router/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DealersPage from './pages/dealers/DealersPage';
import VehiclesPage from './pages/vehicles/VehiclesPage';
import UsersPage from './pages/admin/UsersPage';
import RolesPage from './pages/admin/RolesPage';
import MenusPage from './pages/admin/MenusPage';
import ConfigsPage from './pages/admin/ConfigsPage';
import LogsPage from './pages/admin/LogsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
  },
});

const theme = createTheme({
  palette: {
    primary: { main: '#002C5F' },   // Hyundai blue
    secondary: { main: '#00AAD2' },
  },
  typography: { fontFamily: '"Inter", "Roboto", sans-serif' },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 8 } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 12 } } },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="dealers" element={<DealersPage />} />
              <Route path="vehicles" element={<VehiclesPage />} />
              <Route path="admin/users" element={<ProtectedRoute requiredRole="ADMIN"><UsersPage /></ProtectedRoute>} />
              <Route path="admin/roles" element={<ProtectedRoute requiredRole="ADMIN"><RolesPage /></ProtectedRoute>} />
              <Route path="admin/menus" element={<ProtectedRoute requiredRole="ADMIN"><MenusPage /></ProtectedRoute>} />
              <Route path="admin/configs" element={<ProtectedRoute requiredRole="ADMIN"><ConfigsPage /></ProtectedRoute>} />
              <Route path="admin/logs" element={<ProtectedRoute requiredRole="ADMIN"><LogsPage /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
