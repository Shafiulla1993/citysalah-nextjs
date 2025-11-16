import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import City  from "@/models/City";

export async function GET() {
  try {
    await connectDB();
    const cities = await City.find().select("name slug timezone");
    return NextResponse.json(cities);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
