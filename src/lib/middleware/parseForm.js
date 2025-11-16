// src/lib/middleware/parseForm.js
import fs from "fs";
import path from "path";
import { IncomingForm } from "formidable";

/**
 * parseForm(request)
 * - if request is multipart/form-data -> returns { fields, files }
 * - else -> returns { fields: bodyJson, files: {} }
 */
export async function parseForm(request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    return await new Promise((resolve, reject) => {
      const form = new IncomingForm({
        multiples: false,
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
      });

      // formidable.parse expects Node req/res; in Next.js request we can use .body stream
      form.parse(request, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });
  } else {
    // JSON payload
    const body = await request.json().catch(() => ({}));
    return { fields: body, files: {} };
  }
}

/**
 * saveUploadedFile(file, destFolder)
 * - moves formidable tmp file to destFolder and returns filename (not full path)
 */
export async function saveUploadedFile(file, destFolder = "uploads/masjids") {
  if (!file) return null;
  // formidable "file" shape: file.filepath (newer versions) or file.path
  const tmpPath = file.filepath || file.file || file.path || file.filepath;
  const originalName = file.originalFilename || file.name || path.basename(tmpPath);
  const ext = path.extname(originalName) || "";
  const filename = `${Date.now()}-${Math.round(Math.random()*1e6)}${ext}`;
  const destDir = path.join(process.cwd(), destFolder);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const destPath = path.join(destDir, filename);

  await fs.promises.rename(tmpPath, destPath);
  return filename;
}

/**
 * helper: remove file by filename from destFolder
 */
export function deleteLocalFile(filename, destFolder = "uploads/masjids") {
  if (!filename) return;
  const full = path.join(process.cwd(), destFolder, filename);
  if (fs.existsSync(full)) {
    try {
      fs.unlinkSync(full);
    } catch (e) {
      console.error("Failed to delete file:", full, e);
    }
  }
}
