// src/app/api/auth/me/route.js
import { verifyToken } from "@/server/utils/createTokens";
import { NextResponse } from "next/server";

export async function GET(req) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) return NextResponse.json({ loggedIn: false });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ loggedIn: false });

  return NextResponse.json({
    loggedIn: true,
    userId: decoded.userId,
    role: decoded.role,
  });
}
