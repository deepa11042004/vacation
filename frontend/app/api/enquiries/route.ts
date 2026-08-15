import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "enquiries.json");

function ensureFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

function readEnquiries(): Enquiry[] {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeEnquiries(data: Enquiry[]) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

interface Enquiry {
  id: number;
  name: string;
  mobile: string;
  city: string;
  age: string;
  email: string;
  status: "NEW" | "CONTACTED" | "CONVERTED" | "CLOSED";
  created_at: string;
  notes?: string;
}

// GET /api/enquiries  — list all enquiries (with optional search & status filter)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const status = searchParams.get("status") ?? "";
  const page  = parseInt(searchParams.get("page")  ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);

  let enquiries = readEnquiries();

  if (search) {
    enquiries = enquiries.filter(
      (e) =>
        e.name.toLowerCase().includes(search) ||
        e.mobile.includes(search) ||
        e.email.toLowerCase().includes(search) ||
        e.city.toLowerCase().includes(search)
    );
  }
  if (status) {
    enquiries = enquiries.filter((e) => e.status === status);
  }

  const total = enquiries.length;
  const sorted = enquiries.slice().sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const paginated = sorted.slice((page - 1) * limit, page * limit);

  return NextResponse.json({ success: true, data: { enquiries: paginated, total, page, limit } });
}

// POST /api/enquiries  — create a new enquiry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, mobile, city, age, email } = body;

    if (!name || !mobile || !email) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const enquiries = readEnquiries();
    const newId = enquiries.length > 0 ? Math.max(...enquiries.map((e) => e.id)) + 1 : 1;

    const newEnquiry: Enquiry = {
      id: newId,
      name: String(name).trim(),
      mobile: String(mobile).trim(),
      city: String(city ?? "").trim(),
      age: String(age ?? "").trim(),
      email: String(email).trim(),
      status: "NEW",
      created_at: new Date().toISOString(),
      notes: "",
    };

    enquiries.push(newEnquiry);
    writeEnquiries(enquiries);

    return NextResponse.json({ success: true, data: newEnquiry }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
