import { connectDB } from "@/lib/db";
import { protect } from "@/middleware/auth";
import { authorizeRoles } from "@/middleware/role";
import {
  getUserByIdController,
  updateUserController,
  deleteUserController,
} from "@/server/controllers/superadmin/users.controller";

export async function GET(request, { params }) {
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

  const res = await getUserByIdController({ id: params.id });
  return new Response(JSON.stringify(res.json), { status: res.status });
}

export async function PUT(request, { params }) {
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
  const res = await updateUserController({ id: params.id, body });
  return new Response(JSON.stringify(res.json), { status: res.status });
}

export async function DELETE(request, { params }) {
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

  const res = await deleteUserController({ id: params.id });
  return new Response(JSON.stringify(res.json), { status: res.status });
}
