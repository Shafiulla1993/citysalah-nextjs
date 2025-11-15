import bcrypt from "bcryptjs";
import User from "@/models/User";
import City from "@/models/City";
import Area from "@/models/Area";
import { generateToken } from "../utils/generateToken";

export const registerUser = async (data) => {
  const { name, email, phone, password, city, area } = data;

  if (!name || !phone || !password || !city || !area) {
    return { status: 400, json: { message: "All fields are required" } };
  }

  const exists = await User.findOne({ phone });
  if (exists) {
    return { status: 400, json: { message: "Phone already exists" } };
  }

  const cityExists = await City.findById(city);
  const areaExists = await Area.findById(area);

  if (!cityExists || !areaExists) {
    return { status: 400, json: { message: "Invalid city or area" } };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    phone,
    passwordHash,
    city,
    area,
    role: "superadmin",
  });

  const token = generateToken(user._id);

  return {
    status: 201,
    json: {
      message: "User registered",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        city,
        area,
        role: user.role,
      },
      token,
    },
  };
};

export const loginUser = async ({ phone, password }) => {
  if (!phone || !password) {
    return { status: 400, json: { message: "All fields are required" } };
  }

  const user = await User.findOne({ phone });
  if (!user) {
    return { status: 400, json: { message: "Invalid credentials" } };
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return { status: 400, json: { message: "Invalid credentials" } };
  }

  const token = generateToken(user._id);

  return {
    status: 200,
    json: {
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
      token,
    },
  };
};
