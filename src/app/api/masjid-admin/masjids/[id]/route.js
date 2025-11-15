import { connectDB } from "@/lib/db";
import Masjid from "@/models/Masjid";
import { protect } from "@/lib/middleware/authMiddleware";
import { role } from "@/lib/middleware/roleMiddleware";

export async function GET(req, { params }) {
  await connectDB();

  const auth = await protect(req);
  if (auth.error)
    return Response.json({ message: auth.error }, { status: auth.status });

  if (!role(auth.user, ["masjid_admin"])) {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }

  // Ensure this masjid belongs to admin
  if (!auth.user.masjidId.includes(params.id)) {
    return Response.json(
      { message: "Not allowed to access this masjid" },
      { status: 403 }
    );
  }

  const masjid = await Masjid.findById(params.id).populate("city area");

  if (!masjid)
    return Response.json({ message: "Masjid not found" }, { status: 404 });

  return Response.json({ masjid });
}

export async function PUT(req, { params }) {
  await connectDB();
  const body = await req.json();

  const auth = await protect(req);
  if (auth.error)
    return Response.json({ message: auth.error }, { status: auth.status });

  if (!role(auth.user, ["masjid_admin"])) {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }

  // Check permissions
  if (!auth.user.masjidId.includes(params.id)) {
    return Response.json(
      { message: "Not allowed to modify this masjid" },
      { status: 403 }
    );
  }

  const updated = await Masjid.findByIdAndUpdate(
    params.id,
    { ...body, updatedAt: new Date() },
    { new: true }
  );

  if (!updated)
    return Response.json({ message: "Masjid not found" }, { status: 404 });

  return Response.json({ message: "Masjid updated", masjid: updated });
}
