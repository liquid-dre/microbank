import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// 🔹 In-memory rate-limit store
const rateLimitStore = new Map<
  string,
  { count: number; lastRequest: number }
>();

// 🔹 Configurable limits
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 10; // 10 requests/minute

// 🔹 Helper: Get IP safely
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

export async function middleware(request: NextRequest) {
  const ip = getClientIp(request);
  const now = Date.now();

  // ✅ Rate limit logic
  const record = rateLimitStore.get(ip) || { count: 0, lastRequest: now };

  // Reset if time window passed
  if (now - record.lastRequest > WINDOW_MS) {
    record.count = 0;
    record.lastRequest = now;
  }

  record.count++;
  record.lastRequest = now;
  rateLimitStore.set(ip, record);

  // ✅ Check if limit exceeded
  if (record.count > MAX_REQUESTS) {
    return NextResponse.json(
      {
        error: "Too many requests",
        message: "You are clicking too fast! Please slow down for a minute.",
      },
      { status: 429 }
    );
  }

  // 🔹 Authentication check
  const token = request.cookies.get("token")?.value;
  if (!token) return NextResponse.redirect(new URL("/client/login", request.url));

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/client/login", request.url));
  }
}

export const config = {
  matcher: ["/client/dashboard/:path*", "/client/admin/:path*"],
};