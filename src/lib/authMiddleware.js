import jwt from "jsonwebtoken";
import { User } from "@/models/index";
import mongoose from "mongoose";

export async function protect(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return { error: "Unauthorized", status: 401 };

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-passwordHash");
    if (!user) return { error: "Invalid token", status: 401 };

    mongoose.currentUser = user;
    return { user };
  } catch (err) {
    return { error: "Invalid or expired token", status: 401 };
  }
}
