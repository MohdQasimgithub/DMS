import { useNotify } from './useNotify';

// ============================================
// useApiError Hook - Centralized error handling
// ============================================
// Extracts error messages from API responses and displays them
export const useApiError = () => {
  const notify = useNotify();

  const handleError = (error) => {
    // Extract error message from various response formats
    const message =
      error?.response?.data?.message ||      // Single message
      error?.response?.data?.errors ||       // Validation errors object
      error?.message ||                      // Network error
      'An unexpected error occurred';

    // Handle validation errors (object with multiple fields)
    if (typeof message === 'object') {
      Object.values(message).forEach((msg) => notify.error(msg));
    } else {
      notify.error(message);
    }
  };

  return { handleError };
};
