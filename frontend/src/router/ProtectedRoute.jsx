import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute({ children, requiredRole, requiredRoles }) {
  const { isAuthenticated, hasRole } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Single role check
  if (requiredRole && !hasRole(requiredRole)) return <Navigate to="/dashboard" replace />;

  // Multiple roles check — user must have at least one
  if (requiredRoles && !requiredRoles.some(r => hasRole(r))) return <Navigate to="/dashboard" replace />;

  return children;
}
