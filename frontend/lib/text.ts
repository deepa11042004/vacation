export function stripHtml(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/&rsquo;/gi, "'")
    .replace(/&lsquo;/gi, "'")
    .replace(/&rdquo;/gi, '"')
    .replace(/&ldquo;/gi, '"')
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/<[^>]+>/g, "")
    .trim();
}

export function decodeHtmlEntities(text: string | null | undefined): string {
  return stripHtml(text);
}
