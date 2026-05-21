// ============================================================================
// PROTECTED ROUTE - Route guard for authentication and role-based access
// ============================================================================
// Usage: <ProtectedRoute requiredRoles={['ADMIN', 'DEALER']}><Page /></ProtectedRoute>
// ============================================================================

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute({ children, requiredRole, requiredRoles }) {
  const { isAuthenticated, hasRole } = useAuthStore();

  // Check 1: User must be authenticated (has valid token)
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Check 2: Single role check (legacy support)
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check 3: Multiple roles check - user must have at least one of the required roles
  if (requiredRoles && !requiredRoles.some(r => hasRole(r))) {
    return <Navigate to="/dashboard" replace />;
  }

  // All checks passed - render the protected component
  return children;
}
