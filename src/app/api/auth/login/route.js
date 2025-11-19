import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { loginUser } from "@/server/controllers/authController";

export async function POST(req) {
  await connectDB();
  const { phone, password } = await req.json();

  const loginResult = await loginUser({ phone, password });

  if (!loginResult || !loginResult.json?.user) {
    return NextResponse.json(
      { message: loginResult?.json?.message || "Invalid credentials" },
      { status: loginResult?.status || 401 }
    );
  }

  const res = NextResponse.json(loginResult.json);

  // ---- SET ACCESS TOKEN ----
  if (loginResult.cookies?.accessToken) {
    res.cookies.set("accessToken", loginResult.cookies.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/", // 👈 IMPORTANT
      maxAge: 60 * 15,
    });
  }

  // ---- SET REFRESH TOKEN ----
  if (loginResult.cookies?.refreshToken) {
    res.cookies.set("refreshToken", loginResult.cookies.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth/refresh", // 👈 refresh only
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return res;
}
