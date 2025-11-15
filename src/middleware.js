import { NextResponse } from "next/server";
import { publicLimiter } from "./middleware/publicRateLimiter";

export async function middleware(req) {
  const path = req.nextUrl.pathname;

  // Apply limiter only to /api/public routes
  if (path.startsWith("/api/public")) {
    try {
      await publicLimiter.check(req, 100); // 100 requests per interval
      return NextResponse.next();
    } catch (err) {
      return NextResponse.json(
        { message: "Too many requests, please try again later." },
        { status: 429 }
      );
    }
  }

  // All other routes not affected
  return NextResponse.next();
}

// export const config = {
//   matcher: ["/api/public/:path*"],
// };
