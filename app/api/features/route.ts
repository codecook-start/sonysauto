import { connectToDatabase } from "@/lib/mongoose";
import { Feature } from "@/models/Feature";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { Ordering } from "@/models/Ordering";
import { Types } from "mongoose";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const uploadDir = path.join(process.cwd(), "public", "uploads");

async function saveFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `car-detail-icon-${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(filePath, new Uint8Array(buffer));

  return `api/uploads/${fileName}`;
}

async function deleteFile(filePath: string): Promise<void> {
  filePath = filePath.replace("api/", "");
  const absolutePath = path.join(process.cwd(), "public", filePath);
  try {
    await fs.unlink(absolutePath);
  } catch (error) {
    console.error(`Failed to delete file at ${absolutePath}:`, error);
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    const ordering = await Ordering.findOne({
      name: "Feature",
    });

    let orderIds: Types.ObjectId[] = [];

    if (ordering) {
      orderIds = ordering.ids;
    }

    const features = await Feature.aggregate([
      {
        $addFields: {
          order: { $indexOfArray: [orderIds, "$_id"] },
        },
      },
      {
        $sort: {
          order: 1,
        },
      },
      {
        $project: {
          order: 0,
        },
      },
    ]);

    return NextResponse.json(features);
  } catch (error) {
    console.error("Error fetching unique features with ordering:", error);
    return NextResponse.json(
      { message: "Failed to fetch unique features" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await request.formData();
    const name = formData.get("name");
    const iconFile = formData.get("icon") as File;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const iconPath = iconFile ? await saveFile(iconFile) : null;

    const feature = new Feature({
      name: name as string,
      icon: iconPath,
    });

    await feature.save();

    const ordering = await Ordering.findOne({
      name: "Feature",
    });

    if (ordering) {
      ordering.ids.push(feature._id as Types.ObjectId);
      await ordering.save();
    } else {
      const newOrdering = new Ordering({
        name: "Feature",
        ids: [feature._id],
      });

      await newOrdering.save();
    }

    return NextResponse.json(
      { message: "Feature created successfully", feature },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating feature:", error);
    return NextResponse.json(
      { message: "Failed to create feature" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await request.formData();
    const id = formData.get("id") as string | null;
    const name = formData.get("name") as string | null;
    const iconFile = formData.get("icon") as File | null;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const feature = await Feature.findById(id);
    if (!feature) {
      return NextResponse.json({ error: "Feature not found" }, { status: 404 });
    }

    let iconPath = feature.icon;
    if (iconFile) {
      if (feature.icon) {
        await deleteFile(feature.icon);
      }
      iconPath = await saveFile(iconFile);
    }

    feature.name = name?.trim() || feature.name;
    feature.icon = iconPath;

    await feature.save();

    return NextResponse.json(
      { message: "Feature updated successfully", feature },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating feature:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update feature" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();

    const url = new URL(request.url);

    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const feature = await Feature.findById(id);
    if (!feature) {
      return NextResponse.json(
        { message: "Feature not found" },
        { status: 404 },
      );
    }

    if (feature.icon) {
      await deleteFile(feature.icon);
    }

    await feature.deleteOne();

    return NextResponse.json({ message: "Feature deleted successfully" });
  } catch (error) {
    console.error("Error deleting feature:", error);
    return NextResponse.json(
      { message: "Failed to delete feature" },
      { status: 500 },
    );
  }
}
