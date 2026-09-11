import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "mandarinworldwidevacations.com";
const REDIRECT_FROM_HOSTS = new Set([
  "mwvpl.com",
  "www.mandarinworldwidevacations.com",
]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0];

  if (host && REDIRECT_FROM_HOSTS.has(host)) {
    const url = request.nextUrl.clone();
    url.hostname = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
