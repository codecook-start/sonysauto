import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DATA_DIR = path.join(process.cwd(), "data");

export async function GET(request: NextRequest) {
  const title = request.nextUrl.searchParams.get("title");
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const filePath = path.join(
    DATA_DIR,
    `${title.toLowerCase().replace(/ /g, "-")}.json`,
  );

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    return NextResponse.json({ title, data });
  } catch (error) {
    console.error("Error reading json data:", error);
    return NextResponse.json(
      { error: "Failed to read json data" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const { title, data } = await request.json();

  if (!title || !data) {
    return NextResponse.json(
      { error: "Title and data are required" },
      { status: 400 },
    );
  }

  const filePath = path.join(
    DATA_DIR,
    `${title.toLowerCase().replace(/ /g, "-")}.json`,
  );

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ message: "Data saved successfully" });
  } catch (error) {
    console.error("Error saving carousel data:", error);
    return NextResponse.json(
      { error: "Failed to save carousel data" },
      { status: 500 },
    );
  }
}
