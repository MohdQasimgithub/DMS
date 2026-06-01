// ============================================================================
// AUTH STORE - Global authentication state using Zustand
// ============================================================================
// Manages: user info, tokens, authentication status, role-based access
// Persists to localStorage for page refresh
// ============================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ========== STATE ==========
      user: null,              // User info (username, fullName, roles)
      accessToken: null,       // JWT access token (24 hours)
      refreshToken: null,      // JWT refresh token (7 days)
      isAuthenticated: false,  // Authentication status

      // ========== ACTIONS ==========
      
      // Set authentication data after login
      setAuth: (authData) => {
        // Store tokens in localStorage (for axios interceptor)
        localStorage.setItem('accessToken', authData.accessToken);
        localStorage.setItem('refreshToken', authData.refreshToken);
        
        // Update Zustand state
        set({
          user: {
            username: authData.username,
            fullName: authData.fullName,
            roles: authData.roles,  // e.g. ["DEALER"], ["EMPLOYEE"], ["ADMIN"]
          },
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          isAuthenticated: true,
        });
      },

      // Clear authentication data on logout
      logout: () => {
        // Clear localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Reset Zustand state
        set({ 
          user: null, 
          accessToken: null, 
          refreshToken: null, 
          isAuthenticated: false 
        });
      },

      // Check if user has specific role (for role-based access control)
      hasRole: (role) => {
        const state = get();
        return state.user?.roles?.includes(role) ?? false;
      },

      // Check if user has any of the specified roles
      hasAnyRole: (roles) => {
        const state = get();
        return roles.some(role => state.user?.roles?.includes(role)) ?? false;
      },
    }),
    { 
      name: 'dms-auth',  // localStorage key
    }
  )
);
