// src/lib/middleware/withAuth.js
import connectDB from "@/lib/db";
import { protect } from "@/server/middlewares/protect";
import { allowRoles } from "@/server/middlewares/role";

export function withAuth(handler, roles = []) {
  if (typeof roles === "string") roles = [roles];

  return async function (request, context) {
    await connectDB();

    // 1. Authenticate
    const auth = await protect(request);
    if (auth.error) {
      return new Response(JSON.stringify({ message: auth.error }), {
        status: auth.status,
      });
    }

    // 2. Role check
    const check = roles.length
      ? allowRoles(...roles)(auth.user)
      : { error: false };
    if (check.error) {
      return new Response(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
      });
    }

    // 3. Call the handler with extra info
    const result = await handler(request, context, auth.user);

    // 4. Auto-wrap if controller returns {status, json}
    if (result?.status && result?.json !== undefined) {
      return new Response(JSON.stringify(result.json), {
        status: result.status,
      });
    }

    // 5. Otherwise assume user returned Response
    return result;
  };
}
