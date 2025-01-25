import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const file = formData.get("file") as File;
  const fileName = uuidv4();
  const filePath = path.join(uploadDir, fileName);
  await fs.promises.writeFile(
    filePath,
    new Uint8Array(await file.arrayBuffer()),
  );
  return NextResponse.json({
    success: true,
    message: "File uploaded successfully",
    data: {
      file: fileName,
      url: `api/uploads/${fileName}`,
    },
  });
}
