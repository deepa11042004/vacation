import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Application } from "../route";

const DATA_FILE = path.join(process.cwd(), "data", "applications.json");

function readApplications(): Application[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeApplications(data: Application[]) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// PATCH /api/applications/[id] — update application status or notes
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const appId = parseInt(id, 10);
    const body = await req.json();

    const applications = readApplications();
    const index = applications.findIndex((a) => a.id === appId);

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    if (body.status !== undefined) applications[index].status = body.status;
    if (body.notes !== undefined) applications[index].notes = body.notes;

    writeApplications(applications);

    return NextResponse.json({ success: true, data: applications[index] });
  } catch {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/applications/[id] — delete application
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const appId = parseInt(id, 10);

    const applications = readApplications();
    const filtered = applications.filter((a) => a.id !== appId);

    if (filtered.length === applications.length) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    writeApplications(filtered);

    return NextResponse.json({ success: true, message: "Application deleted successfully" });
  } catch {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
