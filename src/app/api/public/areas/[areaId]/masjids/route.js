import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Masjid } from "@/models/Masjid";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { areaId } = params;

    const masjids = await Masjid.find({ area: areaId })
      .populate("city", "name")
      .populate("area", "name slug")
      .select("name slug address location imageUrl contacts prayerTimings");

    return NextResponse.json(masjids);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
