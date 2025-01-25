/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const contentTypes: { [key: string]: string } = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".css": "text/css",
};

export async function GET(
  _: Request,
  { params }: { params: { filename: string } },
) {
  const filePath = path.join(process.cwd(), "public/uploads", params.filename);
  if (fs.existsSync(filePath)) {
    const ext = path.extname(params.filename).toLowerCase();
    const contentType = contentTypes[ext] || "application/octet-stream";

    const fileStream = fs.createReadStream(filePath);

    return new Response(fileStream as any, {
      status: 200,
      headers: {
        "Content-Type": contentType,
      },
    });
  }

  return new Response(new ArrayBuffer(0), {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });
}
