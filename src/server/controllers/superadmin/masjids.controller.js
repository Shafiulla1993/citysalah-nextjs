// src/server/controllers/superadmin/masjids.controller.js
import mongoose from "mongoose";
import Masjid from "@/models/Masjid";
import City from "@/models/City";
import Area from "@/models/Area";
import { generateSlug } from "@/lib/helpers/slugHelper";
import { deleteLocalFile, saveUploadedFile } from "@/lib/middleware/parseForm";

/** parse JSON-like fields if they are strings */
function parseJSONFields(obj) {
  const copy = { ...obj };
  try {
    if (copy.contacts && typeof copy.contacts === "string") copy.contacts = JSON.parse(copy.contacts);
  } catch (e) {}
  try {
    if (copy.prayerTimings && typeof copy.prayerTimings === "string") copy.prayerTimings = JSON.parse(copy.prayerTimings);
  } catch (e) {}
  try {
    if (copy.location && typeof copy.location === "string") copy.location = JSON.parse(copy.location);
  } catch (e) {}
  return copy;
}

// --------------------- CREATE ---------------------
export async function createMasjidController({ fields = {}, file, user }) {
  try {
    const b = parseJSONFields(fields);
    // save uploaded file (if any) and use filename
    let imageFilename = null;
    if (file) {
      imageFilename = await saveUploadedFile(file, "uploads/masjids");
      // store filename, but express used imageUrl = filename; Later you may store full Cloudinary url
      b.imageUrl = imageFilename;
    }

    // resolve city and area if string names provided
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

    if (!b.location || !Array.isArray(b.location.coordinates) || b.location.coordinates.length !== 2) {
      return { status: 400, json: { message: "`location.coordinates` must be an array of [lng, lat]" } };
    }

    if (!b.name) return { status: 400, json: { message: "Masjid name is required" } };

    const slug = generateSlug(b.name);
    const existingMasjid = await Masjid.findOne({ slug, area: b.area });
    if (existingMasjid) {
      // cleanup uploaded file if created
      if (imageFilename) deleteLocalFile(imageFilename, "uploads/masjids");
      return { status: 400, json: { message: "Another masjid with similar name already exists in this area" } };
    }

    const masjidData = { ...b, slug };
    if (user && user._id) masjidData.createdBy = user._id;

    const masjid = await Masjid.create(masjidData);
    return { status: 201, json: { message: "Masjid created successfully", masjid } };
  } catch (err) {
    console.error("createMasjidController:", err);
    return { status: 400, json: { message: "Create Masjid failed", error: err.message } };
  }
}

// --------------------- GET ALL ---------------------
export async function getAllMasjidsController() {
  try {
    const masjids = await Masjid.find().populate("area city");
    return { status: 200, json: masjids };
  } catch (err) {
    return { status: 500, json: { message: "Server error", error: err.message } };
  }
}

// --------------------- GET SINGLE ---------------------
export async function getMasjidController({ id }) {
  try {
    if (!mongoose.isValidObjectId(id)) return { status: 400, json: { message: "Invalid Masjid ID" } };
    const masjid = await Masjid.findById(id).populate("area city");
    if (!masjid) return { status: 404, json: { message: "Masjid not found" } };
    return { status: 200, json: masjid };
  } catch (err) {
    return { status: 500, json: { message: "Server error", error: err.message } };
  }
}

// --------------------- UPDATE ---------------------
export async function updateMasjidController({ id, fields = {}, file, user }) {
  try {
    if (!mongoose.isValidObjectId(id)) return { status: 400, json: { message: "Invalid Masjid ID" } };
    const masjid = await Masjid.findById(id);
    if (!masjid) return { status: 404, json: { message: "Masjid not found" } };

    const b = parseJSONFields(fields);

    // resolve city/area names if provided
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

    // handle uploaded new file
    if (file) {
      const newFilename = await saveUploadedFile(file, "uploads/masjids");
      // remove old local file if existed and was a local filename
      if (masjid.imageUrl) {
        deleteLocalFile(masjid.imageUrl, "uploads/masjids");
      }
      masjid.imageUrl = newFilename;
    }

    // update fields (only provided keys)
    for (const key of Object.keys(b)) {
      masjid[key] = b[key];
    }

    // slug logic
    if (b.name && b.name !== masjid.name) {
      const newSlug = generateSlug(b.name);
      const existing = await Masjid.findOne({ slug: newSlug, area: masjid.area, _id: { $ne: masjid._id } });
      if (existing) return { status: 400, json: { message: "Another masjid with similar name already exists in this area" } };
      masjid.slug = newSlug;
    }

    masjid.updatedAt = new Date();
    const updated = await masjid.save();
    return { status: 200, json: { message: "Masjid updated successfully", masjid: updated } };
  } catch (err) {
    console.error("updateMasjidController:", err);
    return { status: 400, json: { message: "Failed to update masjid", error: err.message } };
  }
}

// --------------------- DELETE ---------------------
export async function deleteMasjidController({ id }) {
  try {
    if (!mongoose.isValidObjectId(id)) return { status: 400, json: { message: "Invalid Masjid ID" } };
    const masjid = await Masjid.findById(id);
    if (!masjid) return { status: 404, json: { message: "Masjid not found" } };

    if (masjid.imageUrl) {
      deleteLocalFile(masjid.imageUrl, "uploads/masjids");
    }

    await Masjid.findByIdAndDelete(id);
    return { status: 200, json: { message: "Masjid deleted successfully" } };
  } catch (err) {
    console.error("deleteMasjidController:", err);
    return { status: 500, json: { message: "Server error", error: err.message } };
  }
}
