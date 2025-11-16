// src/app/api/super-admin/masjids/[id]/route.js
import { connectDB } from "@/lib/db";
import { protect } from "@/lib/middleware/auth";
import { allowRoles } from "@/lib/middleware/role";
import { parseForm } from "@/lib/middleware/parseForm";
import {
  getMasjidController,
  updateMasjidController,
  deleteMasjidController,
} from "@/server/controllers/superadmin/masjids.controller";

// NOTE: in Next 16 dynamic api, context.params is Promise - await it
export async function GET(request, context) {
  await connectDB();
  const { id } = await context.params;

  const auth = await protect(request);
  if (auth.error) return new Response(JSON.stringify({ message: auth.error }), { status: auth.status });

  const check = allowRoles("super_admin")(auth.user);
  if (check.error) return new Response(JSON.stringify({ message: check.error }), { status: 403 });

  const res = await getMasjidController({ id });
  return new Response(JSON.stringify(res.json), { status: res.status });
}

export async function PUT(request, context) {
  await connectDB();
  const { id } = await context.params;

  const auth = await protect(request);
  if (auth.error) return new Response(JSON.stringify({ message: auth.error }), { status: auth.status });

  const check = allowRoles("super_admin")(auth.user);
  if (check.error) return new Response(JSON.stringify({ message: check.error }), { status: 403 });

  // parse fields/files
  const { fields, files } = await parseForm(request).catch((e) => ({ fields: {}, files: {} }));
  const file = files?.image || files?.file || null;

  const res = await updateMasjidController({ id, fields, file, user: auth.user });
  return new Response(JSON.stringify(res.json), { status: res.status });
}

export async function DELETE(request, context) {
  await connectDB();
  const { id } = await context.params;

  const auth = await protect(request);
  if (auth.error) return new Response(JSON.stringify({ message: auth.error }), { status: auth.status });

  const check = allowRoles("super_admin")(auth.user);
  if (check.error) return new Response(JSON.stringify({ message: check.error }), { status: 403 });

  const res = await deleteMasjidController({ id });
  return new Response(JSON.stringify(res.json), { status: res.status });
}
