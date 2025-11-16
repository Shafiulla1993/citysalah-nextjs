import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Area from "@/models/Area";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { cityId } = params;

    const areas = await Area.find({ city: cityId }).select("name slug center");

    return NextResponse.json(areas);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
