// src/app/api/super-admin/masjids/route.js
import connectDB from "@/lib/db";
import { protect } from "@/server/middlewares/protect";
import { allowRoles } from "@/server/middlewares/role";
import { parseForm } from "@/lib/middleware/parseForm";
import {
  createMasjidController,
  getAllMasjidsController,
} from "@/server/controllers/superadmin/masjids.controller";

// GET all
export async function GET(request) {
  await connectDB();
  const auth = await protect(request);
  if (auth.error)
    return new Response(JSON.stringify({ message: auth.error }), {
      status: auth.status,
    });

  const check = allowRoles("super_admin")(auth.user);
  if (check.error)
    return new Response(JSON.stringify({ message: check.error }), {
      status: 403,
    });

  const res = await getAllMasjidsController();
  return new Response(JSON.stringify(res.json), { status: res.status });
}

// POST create (accepts multipart/form-data or JSON)
export async function POST(request) {
  await connectDB();
  const auth = await protect(request);
  if (auth.error)
    return new Response(JSON.stringify({ message: auth.error }), {
      status: auth.status,
    });

  const check = allowRoles("super_admin")(auth.user);
  if (check.error)
    return new Response(JSON.stringify({ message: check.error }), {
      status: 403,
    });

  // parse form
  const { fields, files } = await parseForm(request).catch((e) => ({
    fields: {},
    files: {},
  }));
  const file = files?.image || files?.file || null;

  const res = await createMasjidController({ fields, file, user: auth.user });
  return new Response(JSON.stringify(res.json), { status: res.status });
}
