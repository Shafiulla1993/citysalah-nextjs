import connectDB from "@/lib/db";
import { protect } from "@/server/middlewares/protect";

export async function GET(request) {
  await connectDB();

  const auth = await protect(request);
  if (auth.error) {
    return Response.json({ message: auth.error }, { status: auth.status });
  }

  return Response.json({ user: auth.user });
}
