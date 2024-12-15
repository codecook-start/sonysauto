import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const stylesFilePath = path.join(
  process.cwd(),
  "public",
  "uploads",
  "user-styles.css",
);

export async function POST(req: Request) {
  try {
    const { styles } = await req.json();

    if (!styles || typeof styles !== "string") {
      return NextResponse.json({ error: "Invalid styles" }, { status: 400 });
    }

    await fs.mkdir(path.dirname(stylesFilePath), { recursive: true });

    await fs.writeFile(stylesFilePath, styles, "utf8");

    return NextResponse.json({
      success: true,
      filePath: "/uploads/user-styles.css",
    });
  } catch (error) {
    console.error("Error saving styles:", error);
    return NextResponse.json(
      { error: "Failed to save styles" },
      { status: 500 },
    );
  }
}
