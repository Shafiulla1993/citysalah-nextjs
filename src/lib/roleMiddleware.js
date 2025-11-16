export function allowRoles(user, ...allowedRoles) {
  if (!user || !allowedRoles.includes(user.role)) {
    return { error: "Access denied: insufficient permissions", status: 403 };
  }
  return { ok: true };
}
