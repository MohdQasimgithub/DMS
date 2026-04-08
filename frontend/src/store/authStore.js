import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (authData) => {
        localStorage.setItem('accessToken', authData.accessToken);
        localStorage.setItem('refreshToken', authData.refreshToken);
        set({
          user: {
            username: authData.username,
            fullName: authData.fullName,
            roles: authData.roles,          // e.g. ["DEALER"], ["EMPLOYEE"], ["ADMIN"]
          },
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },

      hasRole: (role) => {
        const state = useAuthStore.getState();
        return state.user?.roles?.includes(role) ?? false;
      },
    }),
    { name: 'dms-auth' }
  )
);
