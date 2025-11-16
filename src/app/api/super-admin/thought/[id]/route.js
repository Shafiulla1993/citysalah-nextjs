import connectDB from "@/lib/db";
import { protect } from "@/server/middlewares/protect";
import { allowRoles } from "@/server/middlewares/role";
import {
  getThoughtController,
  updateThoughtController,
  deleteThoughtController,
} from "@/server/controllers/superadmin/thought.controller";

export async function GET(request, { params }) {
  await connectDB();
  const auth = await protect(request);
  if (auth.error)
    return new Response(JSON.stringify({ message: auth.error }), {
      status: auth.status,
    });
  if (allowRoles("super_admin")(auth.user).error)
    return new Response(JSON.stringify({ message: "Forbidden" }), {
      status: 403,
    });

  const res = await getThoughtController({ id: params.id });
  return new Response(JSON.stringify(res.json), { status: res.status });
}

export async function PUT(request, { params }) {
  await connectDB();
  const auth = await protect(request);
  if (auth.error)
    return new Response(JSON.stringify({ message: auth.error }), {
      status: auth.status,
    });
  if (allowRoles("super_admin")(auth.user).error)
    return new Response(JSON.stringify({ message: "Forbidden" }), {
      status: 403,
    });

  const body = await request.json();
  const res = await updateThoughtController({
    id: params.id,
    body,
    user: auth.user,
  });
  return new Response(JSON.stringify(res.json), { status: res.status });
}

export async function DELETE(request, { params }) {
  await connectDB();
  const auth = await protect(request);
  if (auth.error)
    return new Response(JSON.stringify({ message: auth.error }), {
      status: auth.status,
    });
  if (allowRoles("super_admin")(auth.user).error)
    return new Response(JSON.stringify({ message: "Forbidden" }), {
      status: 403,
    });

  const res = await deleteThoughtController({ id: params.id });
  return new Response(JSON.stringify(res.json), { status: res.status });
}
