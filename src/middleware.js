import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/middleware/mongoRateLimiter";

export async function middleware(req) {
  const path = req.nextUrl.pathname;

  // Limit only public routes
  if (path.startsWith("/api/public")) {
    const result = await rateLimit(req, {
      keyPrefix: "public",
      limit: 100,      // 100 requests
      windowSec: 60,   // per minute
    });

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Too many requests, please try again later.",
          retryAfter: result.retryAfter,
        },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/public/:path*"],
};
