export function allowRoles(...allowed) {
  return async (req) => {
    const { user, error, status } = await protect(req);
    if (error) return { error, status };

    if (!allowed.includes(user.role)) {
      return { error: "Access denied", status: 403 };
    }

    return { user };
  };
}
