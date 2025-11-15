import { connectDB } from "@/lib/db";
import { protect } from "@/middleware/auth";
import { authorizeRoles } from "@/middleware/role";
import { getAllTimingsController } from "@/server/controllers/superadmin/generalPrayerTimings.controller";

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

  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams.entries());
  const res = await getAllTimingsController({ query });
  return new Response(JSON.stringify(res.json), { status: res.status });
}
