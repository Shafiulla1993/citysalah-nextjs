import { connectDB } from "@/lib/db";
import { protect } from "@/middleware/auth";
import { authorizeRoles } from "@/middleware/role";
import GeneralPrayerTiming from "@/models/GeneralPrayerTiming";

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

  const timing = await GeneralPrayerTiming.findById(params.id).populate(
    "city area"
  );
  if (!timing)
    return new Response(JSON.stringify({ message: "Timing not found" }), {
      status: 404,
    });
  return new Response(JSON.stringify(timing), { status: 200 });
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
  const updated = await GeneralPrayerTiming.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  if (!updated)
    return new Response(JSON.stringify({ message: "Timing not found" }), {
      status: 404,
    });
  return new Response(JSON.stringify(updated), { status: 200 });
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

  await GeneralPrayerTiming.findByIdAndDelete(params.id);
  return new Response(JSON.stringify({ message: "Deleted" }), { status: 200 });
}
