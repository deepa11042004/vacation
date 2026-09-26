import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// GET /api/enquiries — proxy to backend
export async function GET(req: NextRequest) {
  try {
    const { search } = new URL(req.url);
    const res = await fetch(`${API_BASE}/api/enquiries${search}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to communicate with backend server" }, { status: 500 });
  }
}

// POST /api/enquiries — proxy to backend
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${API_BASE}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to communicate with backend server" }, { status: 500 });
  }
}
