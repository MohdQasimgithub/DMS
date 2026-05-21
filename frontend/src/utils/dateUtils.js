/**
 * Formats a date value that may come as:
 * - Array: [year, month, day, hour, minute, second] from Java LocalDateTime
 * - String: ISO date string
 * - null/undefined
 */
export function formatDateTime(value) {
  if (!value) return '-';
  try {
    let date;
    if (Array.isArray(value)) {
      const [y, mo, d, h = 0, mi = 0, s = 0] = value;
      date = new Date(y, mo - 1, d, h, mi, s);
    } else {
      date = new Date(value);
    }
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  } catch {
    return '-';
  }
}

export function formatDate(value) {
  if (!value) return '-';
  try {
    let date;
    if (Array.isArray(value)) {
      const [y, mo, d] = value;
      date = new Date(y, mo - 1, d);
    } else {
      date = new Date(value);
    }
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '-';
  }
}
