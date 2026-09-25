import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "leads.json");
const OLD_DATA_FILE = path.join(process.cwd(), "data", "applications.json");

function ensureFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    if (fs.existsSync(OLD_DATA_FILE)) {
      fs.copyFileSync(OLD_DATA_FILE, DATA_FILE);
    } else {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
    }
  }
}

export interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  mobile: string;
  email: string;
  planTier?: string;
  planTenure?: string;
  planRefCode?: string;
  roomType?: string;
  totalCost?: string;
  downPaymentPercent?: number;
  downPaymentAmount?: number;
  emiTenureMonths?: number;
  monthlyEmi?: number;
  status: "NEW" | "UNDER_REVIEW" | "CONTACTED" | "APPROVED" | "REJECTED";
  created_at: string;
  notes?: string;
}

function readLeads(): Lead[] {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeLeads(data: Lead[]) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET /api/leads — list all leads with optional search and status filter
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const status = searchParams.get("status") ?? "";
  const page  = parseInt(searchParams.get("page")  ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);

  let leads = readLeads();

  if (search) {
    leads = leads.filter(
      (l) =>
        l.name.toLowerCase().includes(search) ||
        l.firstName.toLowerCase().includes(search) ||
        l.lastName.toLowerCase().includes(search) ||
        l.mobile.includes(search) ||
        l.email.toLowerCase().includes(search) ||
        (l.planTier && l.planTier.toLowerCase().includes(search)) ||
        (l.planRefCode && l.planRefCode.toLowerCase().includes(search))
    );
  }
  if (status) {
    leads = leads.filter((l) => l.status === status);
  }

  const total = leads.length;
  const sorted = leads.slice().sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const paginated = sorted.slice((page - 1) * limit, page * limit);

  return NextResponse.json({ success: true, data: { leads: paginated, total, page, limit } });
}

// POST /api/leads — create a new lead
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      mobile,
      email,
      planTier,
      planTenure,
      planRefCode,
      roomType,
      totalCost,
      downPaymentPercent,
      downPaymentAmount,
      emiTenureMonths,
      monthlyEmi,
    } = body;

    if (!firstName || !lastName || !mobile || !email) {
      return NextResponse.json({ success: false, error: "First name, last name, mobile and email are required" }, { status: 400 });
    }

    const leads = readLeads();
    const newId = leads.length > 0 ? Math.max(...leads.map((l) => l.id)) + 1 : 1;

    const newLead: Lead = {
      id: newId,
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      name: `${String(firstName).trim()} ${String(lastName).trim()}`,
      mobile: String(mobile).trim(),
      email: String(email).trim(),
      planTier: planTier ? String(planTier).trim() : undefined,
      planTenure: planTenure ? String(planTenure).trim() : undefined,
      planRefCode: planRefCode ? String(planRefCode).trim() : undefined,
      roomType: roomType ? String(roomType).trim() : undefined,
      totalCost: totalCost ? String(totalCost).trim() : undefined,
      downPaymentPercent: typeof downPaymentPercent === "number" ? downPaymentPercent : undefined,
      downPaymentAmount: typeof downPaymentAmount === "number" ? downPaymentAmount : undefined,
      emiTenureMonths: typeof emiTenureMonths === "number" ? emiTenureMonths : undefined,
      monthlyEmi: typeof monthlyEmi === "number" ? monthlyEmi : undefined,
      status: "NEW",
      created_at: new Date().toISOString(),
      notes: "",
    };

    leads.push(newLead);
    writeLeads(leads);

    return NextResponse.json({ success: true, data: newLead }, { status: 201 });
  } catch (err) {
    console.error("Error creating lead:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
