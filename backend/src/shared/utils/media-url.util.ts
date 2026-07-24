export function resolveUrl(relativePath: string | null | undefined): string | null {
  if (!relativePath) return null;
  if (/^https?:\/\//i.test(relativePath)) return relativePath;

  // Static upload files are served from the frontend (public/ directory + /uploads/* rewrite).
  // Returning the frontend URL lets both web and mobile fetch them from the same place.
  if (relativePath.startsWith('/uploads/')) {
    const frontendBase = (process.env.FRONTEND_URL || process.env.BACKEND_URL || '').replace(/\/$/, '');
    return `${frontendBase}${relativePath}`;
  }

  const base = (process.env.BACKEND_URL || '').replace(/\/$/, '');
  if (relativePath.startsWith('/api/')) return `${base}${relativePath}`;
  return `${base}/api${relativePath}`;
}
