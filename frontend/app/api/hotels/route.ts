import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// GET /api/hotels — proxy to backend
export async function GET(req: NextRequest) {
  try {
    const { search } = new URL(req.url);
    const res = await fetch(`${API_BASE}/api/hotels${search}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to communicate with backend server" },
      { status: 500 }
    );
  }
}
