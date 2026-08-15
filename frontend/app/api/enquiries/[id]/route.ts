import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "enquiries.json");

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

function readEnquiries(): Enquiry[] {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeEnquiries(data: Enquiry[]) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// PATCH /api/enquiries/[id]  — update status and/or notes
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
  }

  const body = await req.json();
  const enquiries = readEnquiries();
  const idx = enquiries.findIndex((e) => e.id === id);

  if (idx === -1) {
    return NextResponse.json({ success: false, error: "Enquiry not found" }, { status: 404 });
  }

  if (body.status !== undefined) enquiries[idx].status = body.status;
  if (body.notes !== undefined) enquiries[idx].notes = body.notes;

  writeEnquiries(enquiries);
  return NextResponse.json({ success: true, data: enquiries[idx] });
}
