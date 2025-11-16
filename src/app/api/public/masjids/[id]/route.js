import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Masjid from "@/models/Masjid";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const filter = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { slug: id };

    const masjid = await Masjid.findOne(filter)
      .populate("city", "name timezone")
      .populate("area", "name");

    if (!masjid)
      return NextResponse.json(
        { message: "Masjid not found" },
        { status: 404 }
      );

    return NextResponse.json(masjid);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
