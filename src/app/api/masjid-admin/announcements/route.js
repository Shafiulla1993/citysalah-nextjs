import connectDB from "@/lib/db";
import MasjidAnnouncement from "@/models/MasjidAnnouncement";
import { protect } from "@/lib/middleware/authMiddleware";
import { role } from "@/lib/middleware/roleMiddleware";

export async function GET(req) {
  await connectDB();

  const auth = await protect(req);
  if (auth.error)
    return Response.json({ message: auth.error }, { status: auth.status });

  if (!role(auth.user, ["masjid_admin"])) {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }

  const announcements = await MasjidAnnouncement.find({
    masjidId: { $in: auth.user.masjidId },
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } },
    ],
  }).sort({ createdAt: -1 });

  return Response.json({ announcements });
}

export async function POST(req) {
  await connectDB();

  const auth = await protect(req);
  if (auth.error)
    return Response.json({ message: auth.error }, { status: auth.status });

  if (!role(auth.user, ["masjid_admin"])) {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  if (!auth.user.masjidId.includes(body.masjidId)) {
    return Response.json(
      { message: "Not allowed for this masjid" },
      { status: 403 }
    );
  }

  const announcement = await MasjidAnnouncement.create({
    ...body,
    expiresAt: body.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000), // Default 24 hrs
  });

  return Response.json({ message: "Announcement created", announcement });
}
