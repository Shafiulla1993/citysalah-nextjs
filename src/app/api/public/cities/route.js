import { NextResponse } from "next/server";
import City from "@/models/City";
import connectDB from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    const cities = await City.find().select("name slug timezone");
    return NextResponse.json(cities);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
