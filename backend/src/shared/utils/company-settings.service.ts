import fs from 'fs';
import path from 'path';

export interface CompanySettings {
  name: string;
  address: string;
  state: string;
  gst_number: string;
  phone: string;
  email: string;
}

function getSettingsPath() {
  const p1 = path.join(process.cwd(), 'data', 'company.json');
  const p2 = path.join(process.cwd(), 'backend', 'data', 'company.json');
  if (fs.existsSync(p1)) return p1;
  if (fs.existsSync(p2)) return p2;
  if (process.cwd().endsWith('backend')) return p1;
  return p2;
}

const DEFAULTS: CompanySettings = {
  name: 'Arena International Holidays',
  address: '101, Pratap Nagar, Mayur Vihar, Phase-1 Delhi-110091',
  state: 'Delhi',
  gst_number: '',
  phone: '',
  email: '',
};

export function getCompanySettings(): CompanySettings {
  const p = getSettingsPath();
  try {
    const raw = JSON.parse(fs.readFileSync(p, 'utf-8'));
    return { ...DEFAULTS, ...raw };
  } catch (err) {
    console.error("Failed to read settings from:", p, err);
    return { ...DEFAULTS };
  }
}

export function saveCompanySettings(settings: CompanySettings): void {
  const p = getSettingsPath();
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(p, JSON.stringify(settings, null, 2), 'utf-8');
}

