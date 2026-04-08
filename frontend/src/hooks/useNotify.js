import { toast } from 'react-toastify';

export const useNotify = () => ({
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
  warn: (msg) => toast.warn(msg),
  info: (msg) => toast.info(msg),
});
