export function hotelImageUrl(
  imagePath: string | null | undefined,
  fallback = "/Img/room.png"
): string {
  if (!imagePath) return fallback;
  if (imagePath.startsWith("/") || imagePath.startsWith("http")) return imagePath;
  return `/upload/hotels/${imagePath}`;
}

export function locationImageUrl(
  imagePath: string | null | undefined,
  fallback = "/Img/mountain.png"
): string {
  if (!imagePath) return fallback;
  if (imagePath.startsWith("/") || imagePath.startsWith("http")) return imagePath;
  return `/upload/locations/${imagePath}`;
}
