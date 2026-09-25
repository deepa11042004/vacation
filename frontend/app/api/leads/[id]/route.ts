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
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const leadId = parseInt(id, 10);
    const body = await req.json();

    const leads = readLeads();
    const index = leads.findIndex((l) => l.id === leadId);

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    if (body.status !== undefined) leads[index].status = body.status;
    if (body.notes !== undefined) leads[index].notes = body.notes;

    writeLeads(leads);

    return NextResponse.json({ success: true, data: leads[index] });
  } catch {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/leads/[id] — delete lead
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const leadId = parseInt(id, 10);

    const leads = readLeads();
    const filtered = leads.filter((l) => l.id !== leadId);

    if (filtered.length === leads.length) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    writeLeads(filtered);

    return NextResponse.json({ success: true, message: "Lead deleted successfully" });
  } catch {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
