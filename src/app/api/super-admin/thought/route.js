import { connectDB } from "@/lib/db";
import { protect } from "@/middleware/auth";
import { authorizeRoles } from "@/middleware/role";
import {
  createThoughtController,
  getThoughtsController,
} from "@/server/controllers/superadmin/thought.controller";

export async function GET(request) {
  await connectDB();
  const auth = await protect(request);
  if (auth.error)
    return new Response(JSON.stringify({ message: auth.error }), {
      status: auth.status,
    });
  if (authorizeRoles("super_admin")(auth.user).error)
    return new Response(JSON.stringify({ message: "Forbidden" }), {
      status: 403,
    });

  const res = await getThoughtsController();
  return new Response(JSON.stringify(res.json), { status: res.status });
}

export async function POST(request) {
  await connectDB();
  const auth = await protect(request);
  if (auth.error)
    return new Response(JSON.stringify({ message: auth.error }), {
      status: auth.status,
    });
  if (authorizeRoles("super_admin")(auth.user).error)
    return new Response(JSON.stringify({ message: "Forbidden" }), {
      status: 403,
    });

  const body = await request.json();
  const res = await createThoughtController({ body, user: auth.user });
  return new Response(JSON.stringify(res.json), { status: res.status });
}
