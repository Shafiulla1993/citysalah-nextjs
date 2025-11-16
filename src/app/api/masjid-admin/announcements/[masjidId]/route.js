import connectDB from "@/lib/db";
import MasjidAnnouncement from "@/models/MasjidAnnouncement";
import { protect } from "@/lib/middleware/authMiddleware";
import { role } from "@/lib/middleware/roleMiddleware";

export async function DELETE(req, { params }) {
  await connectDB();

  const auth = await protect(req);
  if (auth.error)
    return Response.json({ message: auth.error }, { status: auth.status });

  if (!role(auth.user, ["masjid_admin"])) {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }

  const announcement = await MasjidAnnouncement.findById(params.id);
  if (!announcement)
    return Response.json(
      { message: "Announcement not found" },
      { status: 404 }
    );

  // Admin can delete only own masjid's announcements
  if (!auth.user.masjidId.includes(announcement.masjidId.toString())) {
    return Response.json({ message: "Not allowed" }, { status: 403 });
  }

  await announcement.deleteOne();

  return Response.json({ message: "Announcement deleted" });
}
