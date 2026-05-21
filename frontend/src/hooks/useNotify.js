import { toast } from 'react-toastify';

// ============================================
// useNotify Hook - Toast notification wrapper
// ============================================
// Provides consistent notification methods across the app
export const useNotify = () => ({
  success: (msg) => toast.success(msg),  // Green success toast
  error: (msg) => toast.error(msg),      // Red error toast
  warn: (msg) => toast.warn(msg),        // Yellow warning toast
  info: (msg) => toast.info(msg),        // Blue info toast
});
