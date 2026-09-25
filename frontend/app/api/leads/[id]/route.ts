import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Lead } from "../route";

const DATA_FILE = path.join(process.cwd(), "data", "leads.json");

function readLeads(): Lead[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeLeads(data: Lead[]) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// PATCH /api/leads/[id] — update lead status or notes
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const idStr = resolvedParams?.id;
    if (!idStr) {
      return NextResponse.json({ success: false, error: "Missing lead ID" }, { status: 400 });
    }

    const body = await req.json();
    const leads = readLeads();
    const index = leads.findIndex((l) => String(l.id) === String(idStr));

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    if (body.status !== undefined) leads[index].status = body.status;
    if (body.notes !== undefined) leads[index].notes = body.notes;

    writeLeads(leads);

    return NextResponse.json({ success: true, data: leads[index] });
  } catch (err) {
    console.error("Error updating lead:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/leads/[id] — delete lead
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const idStr = resolvedParams?.id;
    if (!idStr) {
      return NextResponse.json({ success: false, error: "Missing lead ID" }, { status: 400 });
    }

    const leads = readLeads();
    const filtered = leads.filter((l) => String(l.id) !== String(idStr));

    if (filtered.length === leads.length) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    writeLeads(filtered);

    return NextResponse.json({ success: true, message: "Lead deleted successfully" });
  } catch (err) {
    console.error("Error deleting lead:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
