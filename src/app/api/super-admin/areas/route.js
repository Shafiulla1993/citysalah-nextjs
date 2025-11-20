// src/app/api/super-admin/areas/route.js

import {
  createAreaController,
  getAreasController,
} from "@/server/controllers/superadmin/areas.controller";

import { withAuth } from "@/lib/middleware/withAuth";

export const GET = withAuth(async () => {
  const res = await getAreasController();
  return res;
}, "super_admin");

export const POST = withAuth(async ({ request }) => {
  const body = await request.json();
  const res = await createAreaController({ body });
  return res;
}, "super_admin");
