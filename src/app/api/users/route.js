import { connectDB } from "@/lib/db";
import { protect } from "@/middleware/auth";
import { authorizeRoles } from "@/middleware/role";
import {
  getAllUsersController,
  createUserController,
} from "@/server/controllers/superadmin/users.controller";

export async function GET(request) {
  await connectDB();
  const auth = await protect(request);
  if (auth.error)
    return new Response(JSON.stringify({ message: auth.error }), {
      status: auth.status,
    });

  const roleCheck = authorizeRoles("super_admin")(auth.user);
  if (roleCheck.error)
    return new Response(
      JSON.stringify({ message: roleCheck.error || "Forbidden" }),
      { status: 403 }
    );

  const res = await getAllUsersController();
  return new Response(JSON.stringify(res.json), { status: res.status });
}

export async function POST(request) {
  await connectDB();
  const auth = await protect(request);
  if (auth.error)
    return new Response(JSON.stringify({ message: auth.error }), {
      status: auth.status,
    });

  const roleCheck = authorizeRoles("super_admin")(auth.user);
  if (roleCheck.error)
    return new Response(
      JSON.stringify({ message: roleCheck.error || "Forbidden" }),
      { status: 403 }
    );

  const body = await request.json();
  const res = await createUserController({ body });
  return new Response(JSON.stringify(res.json), { status: res.status });
}
