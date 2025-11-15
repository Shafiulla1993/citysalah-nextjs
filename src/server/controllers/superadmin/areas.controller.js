// src/server/controllers/superadmin/areas.controller.js
import mongoose from "mongoose";
import Area from "@/models/Area";
import City from "@/models/City";
import { generateSlug } from "@/lib/helpers/slugHelper";

export async function createAreaController({ body }) {
  let areasData = Array.isArray(body) ? body : [body];
  const createdAreas = [];

  for (let area of areasData) {
    if (!area.name || !area.city)
      return { status: 400, json: { message: "Name and city are required" } };

    if (typeof area.city === "string" && !mongoose.isValidObjectId(area.city)) {
      const foundCity = await City.findOne({
        name: { $regex: `^${area.city}$`, $options: "i" },
      });
      if (!foundCity)
        return {
          status: 404,
          json: { message: `City not found for ${area.name}` },
        };
      area.city = foundCity._id;
    }

    const slug = generateSlug(area.name);
    const existingSlug = await Area.findOne({ slug, city: area.city });
    if (existingSlug)
      return {
        status: 400,
        json: {
          message: `Another area with similar name already exists in this city (${area.name})`,
        },
      };

    const newArea = await Area.create({ ...area, slug });
    createdAreas.push(newArea);
  }

  return {
    status: 201,
    json: { message: "Areas created successfully", data: createdAreas },
  };
}

export async function getAreaController({ id }) {
  const area = await Area.findById(id);
  if (!area) return { status: 404, json: { message: "Area not found" } };
  return { status: 200, json: area };
}

export async function getAreasController() {
  const areas = await Area.find().populate("city");
  return { status: 200, json: areas };
}

export async function updateAreaController({ id, body }) {
  const { name, city, center } = body;
  const area = await Area.findById(id);
  if (!area) return { status: 404, json: { message: "Area not found" } };

  if (name && name !== area.name) {
    const slug = generateSlug(name);
    const existingSlug = await Area.findOne({
      slug,
      city: city || area.city,
      _id: { $ne: id },
    });
    if (existingSlug)
      return {
        status: 400,
        json: {
          message: "Another area with this name already exists in this city",
        },
      };
    area.name = name;
    area.slug = slug;
  }

  if (city) area.city = city;
  if (center) area.center = center;

  await area.save();
  return { status: 200, json: { message: "Area updated successfully", area } };
}

export async function deleteAreaController({ id }) {
  await Area.findByIdAndDelete(id);
  return { status: 200, json: { message: "Area deleted" } };
}
