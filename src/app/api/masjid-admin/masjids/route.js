import connectDB from "@/lib/db";
import Masjid from "@/models/Masjid";
import { protect } from "@/lib/middleware/authMiddleware";
import { role } from "@/lib/middleware/roleMiddleware";

export async function GET(req) {
  await connectDB();

  const auth = await protect(req);
  if (auth.error)
    return Response.json({ message: auth.error }, { status: auth.status });

  // Allow only masjid admin
  if (!role(auth.user, ["masjid_admin"])) {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }

  const masjids = await Masjid.find({
    _id: { $in: auth.user.masjidId },
  }).populate("city area");

  return Response.json({ masjids });
}
