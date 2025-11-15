import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { protect } from "@/lib/middleware/auth";
import { connectDB } from "@/lib/db";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /api/upload
export async function POST(request) {
  await connectDB();

  // 🔐 Authenticate user
  const auth = await protect(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // Convert file -> buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Cloudinary upload function that returns a Promise
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "citysalah_uploads",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(buffer);
      });
    };

    const uploadResult = await uploadToCloudinary();

    return NextResponse.json(
      {
        message: "Upload successful",
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json(
      { message: "Upload failed", error: error.message },
      { status: 500 }
    );
  }
}
