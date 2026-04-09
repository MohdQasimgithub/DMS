import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './router/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DealersPage from './pages/dealers/DealersPage';
import VehiclesPage from './pages/vehicles/VehiclesPage';
import ShowroomPage from './pages/showroom/ShowroomPage';
import TestDrivesPage from './pages/testdrive/TestDrivesPage';
import EnquiriesPage from './pages/enquiry/EnquiriesPage';
import UsersPage from './pages/admin/UsersPage';
import RolesPage from './pages/admin/RolesPage';
import MenusPage from './pages/admin/MenusPage';
import ConfigsPage from './pages/admin/ConfigsPage';
import LoginHistoryPage from './pages/admin/LoginHistoryPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
  },
});

const theme = createTheme({
  palette: {
    primary:   { main: '#002C5F', light: '#1a4a7a', dark: '#001a3a', contrastText: '#fff' },
    secondary: { main: '#00AAD2', light: '#33bbdb', dark: '#007a99', contrastText: '#fff' },
    success:   { main: '#10b981', light: '#d1fae5', dark: '#059669' },
    warning:   { main: '#f59e0b', light: '#fef3c7', dark: '#d97706' },
    error:     { main: '#ef4444', light: '#fee2e2', dark: '#dc2626' },
    info:      { main: '#3b82f6', light: '#dbeafe', dark: '#2563eb' },
    background:{ default: '#f0f2f5', paper: '#ffffff' },
    text:      { primary: '#1e293b', secondary: '#64748b' },
    divider:   '#e2e8f0',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    body2: { color: '#64748b' },
  },
  shape: { borderRadius: 10 },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)',
    '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)',
    '0 20px 25px -5px rgba(0,0,0,0.08), 0 10px 10px -5px rgba(0,0,0,0.03)',
    ...Array(20).fill('0 20px 25px -5px rgba(0,0,0,0.08)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '8px 18px',
          fontSize: '0.875rem',
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 12px rgba(0,44,95,0.2)' },
        },
        contained: { '&:hover': { boxShadow: '0 4px 12px rgba(0,44,95,0.25)' } },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          border: '1px solid #f1f5f9',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 12 },
        elevation1: { boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': { borderColor: '#e2e8f0' },
            '&:hover fieldset': { borderColor: '#94a3b8' },
            '&.Mui-focused fieldset': { borderColor: '#002C5F', borderWidth: 2 },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: '0.72rem', borderRadius: 6 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', background: '#f8fafc' },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { fontWeight: 700, fontSize: '1.1rem', padding: '20px 24px 12px' },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          padding: '8px 12px',
          '&.Mui-selected': {
            background: 'rgba(0,44,95,0.08)',
            color: '#002C5F',
            '& .MuiListItemIcon-root': { color: '#002C5F' },
            '&:hover': { background: 'rgba(0,44,95,0.12)' },
          },
          '&:hover': { background: 'rgba(0,0,0,0.04)' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
      },
    },
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
            <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="dealers" element={<DealersPage />} />
              <Route path="vehicles" element={<VehiclesPage />} />
              <Route path="showroom" element={<ShowroomPage />} />
              <Route path="test-drives" element={<TestDrivesPage />} />
              <Route path="enquiries" element={<EnquiriesPage />} />
              <Route path="admin/users" element={<ProtectedRoute requiredRoles={['ADMIN', 'DEALER']}><UsersPage /></ProtectedRoute>} />
              <Route path="admin/roles" element={<ProtectedRoute requiredRole="ADMIN"><RolesPage /></ProtectedRoute>} />
              <Route path="admin/menus" element={<ProtectedRoute requiredRole="ADMIN"><MenusPage /></ProtectedRoute>} />
              <Route path="admin/configs" element={<ProtectedRoute requiredRole="ADMIN"><ConfigsPage /></ProtectedRoute>} />
              <Route path="admin/login-history" element={<ProtectedRoute requiredRole="ADMIN"><LoginHistoryPage /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          toastStyle={{ borderRadius: 10, fontSize: '0.875rem', fontFamily: 'Inter, sans-serif' }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
