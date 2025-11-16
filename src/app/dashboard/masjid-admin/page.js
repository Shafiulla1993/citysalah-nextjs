// app/dashboard/masjid-admin/page.js
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import MasjidAdminActions from "./MasjidAdminActions";

export default async function MasjidAdminDashboardPage() {
  // Get the HTTP-only cookie
  const cookieStore = await cookies();
  const token = cookieStore.get?.("accessToken")?.value;

  // Redirect immediately if no token
  if (!token) redirect("/login");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "masjid_admin") redirect("/login"); // unauthorized
  } catch {
    redirect("/login"); // invalid or expired token
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Masjid Admin Dashboard</h1>
      <MasjidAdminActions userId={decoded.id} />
    </div>
  );
}
