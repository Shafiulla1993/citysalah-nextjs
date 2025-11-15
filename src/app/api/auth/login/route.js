import { connectDB } from "@/lib/db";
import { loginUser } from "@/server/controllers/authController";

export async function POST(request) {
  await connectDB();

  const body = await request.json();
  const result = await loginUser(body);

  return Response.json(result.json, { status: result.status });
}
