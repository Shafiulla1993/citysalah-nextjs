// src/server/controllers/superadmin/masjids.controller.js
import mongoose from "mongoose";
import Masjid from "@/models/Masjid";
import City from "@/models/City";
import Area from "@/models/Area";
import { generateSlug } from "@/lib/helpers/slugHelper";

function parseJSONFields(body) {
  const copy = { ...body };
  if (copy.contacts && typeof copy.contacts === "string")
    copy.contacts = JSON.parse(copy.contacts);
  if (copy.prayerTimings && typeof copy.prayerTimings === "string")
    copy.prayerTimings = JSON.parse(copy.prayerTimings);
  if (copy.location && typeof copy.location === "string")
    copy.location = JSON.parse(copy.location);
  return copy;
}

export async function createMasjidController({ body }) {
  let b = parseJSONFields(body);
  const imageUrl = b.imageUrl || null; // expect Cloudinary URL from upload stage

  if (b.city && !mongoose.isValidObjectId(b.city)) {
    const foundCity = await City.findOne({ name: b.city });
    if (!foundCity) return { status: 404, json: { message: "City not found" } };
    b.city = foundCity._id;
  }
  if (b.area && !mongoose.isValidObjectId(b.area)) {
    const foundArea = await Area.findOne({ name: b.area });
    if (!foundArea) return { status: 404, json: { message: "Area not found" } };
    b.area = foundArea._id;
  }

  if (
    !b.location ||
    !Array.isArray(b.location.coordinates) ||
    b.location.coordinates.length !== 2
  ) {
    return {
      status: 400,
      json: {
        message: "`location.coordinates` must be an array of [lng, lat]",
      },
    };
  }

  if (!b.name)
    return { status: 400, json: { message: "Masjid name is required" } };
  const slug = generateSlug(b.name);
  const existingMasjid = await Masjid.findOne({ slug, area: b.area });
  if (existingMasjid)
    return {
      status: 400,
      json: {
        message: "Another masjid with similar name already exists in this area",
      },
    };

  const masjidData = { ...b, slug, imageUrl };
  const masjid = await Masjid.create(masjidData);
  return {
    status: 201,
    json: { message: "Masjid created successfully", masjid },
  };
}

export async function getMasjidsController() {
  const masjids = await Masjid.find().populate("area city");
  return { status: 200, json: masjids };
}

export async function getMasjidController({ id }) {
  const masjid = await Masjid.findById(id).populate("area city");
  if (!masjid) return { status: 404, json: { message: "Masjid not found" } };
  return { status: 200, json: masjid };
}

export async function updateMasjidController({ id, body }) {
  const masjid = await Masjid.findById(id);
  if (!masjid) return { status: 404, json: { message: "Masjid not found" } };

  const b = parseJSONFields(body);

  if (b.city && !mongoose.isValidObjectId(b.city)) {
    const foundCity = await City.findOne({ name: b.city });
    if (!foundCity) return { status: 404, json: { message: "City not found" } };
    b.city = foundCity._id;
  }
  if (b.area && !mongoose.isValidObjectId(b.area)) {
    const foundArea = await Area.findOne({ name: b.area });
    if (!foundArea) return { status: 404, json: { message: "Area not found" } };
    b.area = foundArea._id;
  }

  if (b.imageUrl) {
    masjid.imageUrl = b.imageUrl;
  }

  for (const key of Object.keys(b)) {
    if (["contacts", "prayerTimings", "location"].includes(key)) {
      masjid[key] = b[key];
    } else {
      masjid[key] = b[key];
    }
  }

  if (b.name && b.name !== masjid.name) {
    const newSlug = generateSlug(b.name);
    const existingMasjid = await Masjid.findOne({
      slug: newSlug,
      area: masjid.area,
      _id: { $ne: masjid._id },
    });
    if (existingMasjid)
      return {
        status: 400,
        json: {
          message:
            "Another masjid with similar name already exists in this area",
        },
      };
    masjid.slug = newSlug;
  }

  masjid.updatedAt = new Date();
  const updatedMasjid = await masjid.save();
  return {
    status: 200,
    json: { message: "Masjid updated successfully", masjid: updatedMasjid },
  };
}

export async function deleteMasjidController({ id }) {
  const masjid = await Masjid.findById(id);
  if (!masjid) return { status: 404, json: { message: "Masjid not found" } };

  // If using Cloudinary, you may want to remove image from Cloudinary here.
  await Masjid.findByIdAndDelete(id);
  return { status: 200, json: { message: "Masjid deleted successfully" } };
}
