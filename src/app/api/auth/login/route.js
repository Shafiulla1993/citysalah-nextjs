import connectDB from "@/lib/db";
import { loginUser } from "@/server/controllers/authController";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const result = await loginUser(body);

    // Ensure result.json exists
    if (!result || !result.json) {
      return new Response(JSON.stringify({ message: "Login failed" }), {
        status: 500,
      });
    }

    const response = new Response(JSON.stringify(result.json), {
      status: result.status || 200,
    });

    if (result.cookies) {
      response.headers.append(
        "Set-Cookie",
        `accessToken=${result.cookies.accessToken}; HttpOnly; Secure; Path=/; Max-Age=900; SameSite=Strict`
      );
      response.headers.append(
        "Set-Cookie",
        `refreshToken=${result.cookies.refreshToken}; HttpOnly; Secure; Path=/api/auth/refresh; Max-Age=604800; SameSite=Strict`
      );
    }

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return new Response(
      JSON.stringify({ message: err.message || "Internal server error" }),
      { status: 500 }
    );
  }
}
