export function stripHtml(text: string | null | undefined): string {
  if (!text) return "";
  return text.replace(/&[a-z]+;/gi, " ").replace(/<[^>]+>/g, "").trim();
}
