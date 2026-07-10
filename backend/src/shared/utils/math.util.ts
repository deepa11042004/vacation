export function round2(n: number): number {
  return parseFloat(n.toFixed(2));
}

export function uniqueTemp(prefix: string, maxLen: number): string {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}${Date.now()}${rand}`.slice(0, maxLen);
}
