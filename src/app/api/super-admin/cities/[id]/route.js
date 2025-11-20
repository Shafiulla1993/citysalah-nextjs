// src/app/api/super-admin/cities/[id]/route.js

import {
  getCityController,
  updateCityController,
  deleteCityController,
} from "@/server/controllers/superadmin/cities.controller";

import { withAuth } from "@/lib/middleware/withAuth";

export const GET = withAuth(async ({ params }) => {
  const res = await getCityController({ id: params.id });
  return res;
}, "super_admin");

export const PUT = withAuth(async ({ request, params }) => {
  const body = await request.json();
  const res = await updateCityController({ id: params.id, body });
  return res;
}, "super_admin");

export const DELETE = withAuth(async ({ params }) => {
  const res = await deleteCityController({ id: params.id });
  return res;
}, "super_admin");
