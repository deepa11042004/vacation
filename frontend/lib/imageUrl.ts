const HOTEL_FALLBACKS = [
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
];

const LOCATION_FALLBACKS = [
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1533692328991-08159ff19fca?auto=format&fit=crop&w=800&q=80",
];

// Deterministic pick so the same card always renders the same fallback on
// both server and client render passes (avoids hydration mismatches) while
// still varying across different hotels/locations.
function pickFallback(pool: string[], seed?: number | string): string {
  if (seed === undefined || seed === null) return pool[0];
  const key = String(seed);
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return pool[hash % pool.length];
}

export function hotelImageFallback(seed?: number | string): string {
  return pickFallback(HOTEL_FALLBACKS, seed);
}

export function locationImageFallback(seed?: number | string): string {
  return pickFallback(LOCATION_FALLBACKS, seed);
}

// If the API returns an absolute URL for a backend upload (e.g. when BACKEND_URL
// is set in production), extract just the path so it routes through the
// Next.js /api/* rewrite proxy instead of hitting the backend domain directly.
function toProxiedPath(url: string): string {
  try {
    const pathname = new URL(url).pathname; // e.g. /api/uploads/hotels/img.jpg
    // Ensure it goes through /api/... so the frontend rewrite picks it up
    if (pathname.startsWith("/api/uploads/")) return pathname;
    if (pathname.startsWith("/uploads/")) return `/api${pathname}`;
  } catch {
    // not a valid URL, fall through
  }
  return url; // external URL (Unsplash, etc.) — use as-is
}

export function hotelImageUrl(
  imagePath: string | null | undefined,
  seed?: number | string
): string {
  if (!imagePath) return pickFallback(HOTEL_FALLBACKS, seed);
  if (imagePath.startsWith("http")) return toProxiedPath(imagePath);
  if (imagePath.startsWith("/")) return imagePath;
  return `/uploads/hotels/${encodeURIComponent(imagePath)}`;
}

export function locationImageUrl(
  imagePath: string | null | undefined,
  seed?: number | string
): string {
  if (!imagePath) return pickFallback(LOCATION_FALLBACKS, seed);
  if (imagePath.startsWith("http")) return toProxiedPath(imagePath);
  if (imagePath.startsWith("/")) return imagePath;
  return `/uploads/locations/${encodeURIComponent(imagePath)}`;
}
