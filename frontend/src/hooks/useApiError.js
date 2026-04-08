import { useNotify } from './useNotify';

export const useApiError = () => {
  const notify = useNotify();

  const handleError = (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.errors ||
      error?.message ||
      'An unexpected error occurred';

    if (typeof message === 'object') {
      Object.values(message).forEach((msg) => notify.error(msg));
    } else {
      notify.error(message);
    }
  };

  return { handleError };
};
