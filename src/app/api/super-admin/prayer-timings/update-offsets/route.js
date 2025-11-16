import { connectDB } from "@/lib/db";
import { protect } from "@/lib/middleware/auth";
import { allowRoles } from "@/lib/middleware/role";
import { updateOffsetsController } from "@/server/controllers/superadmin/generalPrayerTimings.controller";

export async function PATCH(request) {
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
  const res = await updateOffsetsController({ body });
  return new Response(JSON.stringify(res.json), { status: res.status });
}
