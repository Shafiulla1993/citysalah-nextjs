import { connectDB } from "@/lib/db";
import { protect } from "@/middleware/auth";
import { authorizeRoles } from "@/middleware/role";
import {
  getGeneralAnnouncementController,
  updateGeneralAnnouncementController,
  deleteGeneralAnnouncementController,
} from "@/server/controllers/superadmin/generalAnnouncements.controller";

export async function GET(request, { params }) {
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

  const res = await getGeneralAnnouncementController({ id: params.id });
  return new Response(JSON.stringify(res.json), { status: res.status });
}

export async function PUT(request, { params }) {
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
  const res = await updateGeneralAnnouncementController({
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
  if (authorizeRoles("super_admin")(auth.user).error)
    return new Response(JSON.stringify({ message: "Forbidden" }), {
      status: 403,
    });

  const res = await deleteGeneralAnnouncementController({ id: params.id });
  return new Response(JSON.stringify(res.json), { status: res.status });
}
