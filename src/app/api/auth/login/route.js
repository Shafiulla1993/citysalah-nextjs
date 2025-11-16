import connectDB from "@/lib/db";
import { loginUser } from "@/server/controllers/authController";

export async function POST(request) {
  await connectDB();

  const body = await request.json();
  const result = await loginUser(body);

  const response = Response.json(result.json, { status: result.status });

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
}
