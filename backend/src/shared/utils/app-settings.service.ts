import fs from 'fs';
import path from 'path';

/** A numbering series: `<prefix><zero-padded counter>`. */
export interface SeriesSettings {
  prefix: string;
  /** Number the series starts from; saving a new value restarts the counter here. */
  start_number: number;
  /** Next number to hand out. */
  next_number: number;
  padding: number;
}

export interface GstSlot {
  id: string;
  label: string;
  rate: number;
}

export interface GstSettings {
  slots: GstSlot[];
  default_slot_id: string;
}

export interface AppSettings {
  invoice: SeriesSettings;
  membership: SeriesSettings;
  gst: GstSettings;
}

function getSettingsPath() {
  const p1 = path.join(process.cwd(), 'data', 'app-settings.json');
  const p2 = path.join(process.cwd(), 'backend', 'data', 'app-settings.json');
  if (fs.existsSync(p1)) return p1;
  if (fs.existsSync(p2)) return p2;
  if (process.cwd().endsWith('backend')) return p1;
  return p2;
}

const DEFAULTS: AppSettings = {
  invoice: { prefix: 'INV-', start_number: 1, next_number: 1, padding: 4 },
  // Blank prefix = derive it from the package name (GOL, SIL, ...) as before.
  membership: { prefix: '', start_number: 1, next_number: 1, padding: 5 },
  gst: {
    slots: [{ id: 'gst-5', label: 'GST 5%', rate: 5 }],
    default_slot_id: 'gst-5',
  },
};

export function getAppSettings(): AppSettings {
  const p = getSettingsPath();
  try {
    const raw = JSON.parse(fs.readFileSync(p, 'utf-8'));
    return {
      invoice: { ...DEFAULTS.invoice, ...raw.invoice },
      membership: { ...DEFAULTS.membership, ...raw.membership },
      gst: {
        slots: raw.gst?.slots?.length ? raw.gst.slots : DEFAULTS.gst.slots,
        default_slot_id: raw.gst?.default_slot_id ?? DEFAULTS.gst.default_slot_id,
      },
    };
  } catch {
    return structuredClone(DEFAULTS);
  }
}

export function saveAppSettings(settings: AppSettings): void {
  const p = getSettingsPath();
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(p, JSON.stringify(settings, null, 2), 'utf-8');
}

export function formatSeriesNumber(s: SeriesSettings, n: number, prefixOverride?: string): string {
  const prefix = s.prefix || prefixOverride || '';
  return `${prefix}${String(n).padStart(s.padding, '0')}`;
}

// Serialises allocations so two simultaneous requests can't receive the same number.
let allocationLock: Promise<unknown> = Promise.resolve();

async function findFreeNumber(
  kind: 'invoice' | 'membership',
  exists: (candidate: string) => Promise<boolean>,
  prefixFallback?: string,
) {
  const series = getAppSettings()[kind];
  let n = series.next_number;
  let candidate = formatSeriesNumber(series, n, prefixFallback);
  while (await exists(candidate)) {
    n += 1;
    candidate = formatSeriesNumber(series, n, prefixFallback);
  }
  return { candidate, n };
}

/** Next number in the series without consuming it (used for previews). */
export async function peekNextNumber(
  kind: 'invoice' | 'membership',
  exists: (candidate: string) => Promise<boolean>,
  prefixFallback?: string,
): Promise<string> {
  return (await findFreeNumber(kind, exists, prefixFallback)).candidate;
}

/** Hands out the next unused number in the series and advances the counter. */
export function allocateNextNumber(
  kind: 'invoice' | 'membership',
  exists: (candidate: string) => Promise<boolean>,
  prefixFallback?: string,
): Promise<string> {
  const run = allocationLock.then(async () => {
    const { candidate, n } = await findFreeNumber(kind, exists, prefixFallback);
    const settings = getAppSettings();
    settings[kind].next_number = n + 1;
    saveAppSettings(settings);
    return candidate;
  });
  allocationLock = run.catch(() => undefined);
  return run;
}

/** Rate (in %) to apply on an invoice: the requested one if it is a configured slot, else the default slot. */
export function resolveGstRate(requested?: number | null): number {
  const { slots, default_slot_id } = getAppSettings().gst;
  if (requested != null && slots.some(s => s.rate === requested)) return requested;
  return (slots.find(s => s.id === default_slot_id) ?? slots[0]).rate;
}
