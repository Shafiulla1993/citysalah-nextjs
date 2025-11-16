import { connectDB } from "@/lib/db";
import { protect } from "@/lib/middleware/auth";
import { allowRoles } from "@/lib/middleware/role";
import {
  createGeneralAnnouncementController,
  getGeneralAnnouncementsController,
} from "@/server/controllers/superadmin/generalAnnouncements.controller";

export async function GET(request) {
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

  const res = await getGeneralAnnouncementsController();
  return new Response(JSON.stringify(res.json), { status: res.status });
}

export async function POST(request) {
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
  const res = await createGeneralAnnouncementController({
    body,
    user: auth.user,
  });
  return new Response(JSON.stringify(res.json), { status: res.status });
}
