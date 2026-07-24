/**
 * Converts a stored relative media path to a fully-qualified URL.
 *
 * Stored paths come in two forms:
 *   /uploads/hotels/file.jpg        → needs /api prefix
 *   /api/uploads/call-recordings/x  → already has /api prefix
 *
 * Returns null for null/undefined/empty inputs so callers can skip null-checks.
 */
export function resolveUrl(relativePath: string | null | undefined): string | null {
  if (!relativePath) return null;
  if (/^https?:\/\//i.test(relativePath)) return relativePath; // already absolute

  const base = (process.env.BACKEND_URL || '').replace(/\/$/, '');

  // Paths saved by older code that already include /api
  if (relativePath.startsWith('/api/')) {
    return `${base}${relativePath}`;
  }

  // Paths saved without /api (e.g. /uploads/hotels/...)
  return `${base}/api${relativePath}`;
}
