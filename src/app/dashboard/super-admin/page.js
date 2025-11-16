// app/dashboard/super-admin/page.js
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import SuperAdminActions from "./SuperAdminActions";

// Mark this as a Server Component (no "use client")
export default async function SuperAdminDashboardPage() {
  // Await cookies() because it returns a promise in this context
  const cookieStore = await cookies();
  const token = cookieStore.get?.("accessToken")?.value;

  // Redirect immediately if no token
  if (!token) redirect("/login");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "super_admin") redirect("/login");
  } catch {
    redirect("/login"); // invalid or expired token
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Super Admin Dashboard</h1>
      <SuperAdminActions userId={decoded.id} />
    </div>
  );
}
