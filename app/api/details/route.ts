import { connectToDatabase } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { CarDetail } from "@/models/Detail";
import { removeQuotes } from "@/lib/utils";
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

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const name = formData.get("name") as string | null;

    if (!name) {
      return NextResponse.json(
        { message: "Missing required fields: name or image." },
        { status: 400 },
      );
    }

    const iconPath = file ? await saveFile(file) : null;

    const detail = new CarDetail({
      name,
      icon: iconPath,
    });

    await detail.save();

    return NextResponse.json(
      { message: "Car detail uploaded successfully", detail },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in uploading car detail:", error.message);
    } else {
      console.error("Error in uploading car detail:", error);
    }
    return NextResponse.json(
      { message: "Error uploading images. Please try again later." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "Missing CarDetail ID" },
      { status: 400 },
    );
  }

  try {
    await connectToDatabase();

    const detail = await CarDetail.findById(id);
    if (!detail) {
      return NextResponse.json(
        { message: "CarDetail not found" },
        { status: 404 },
      );
    }

    if (detail.icon) await deleteFile(detail.icon);

    await CarDetail.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Car detail deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting CarDetail:", error);
    return NextResponse.json(
      { message: "Failed to delete CarDetail" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "Missing CarDetail ID" },
      { status: 400 },
    );
  }

  try {
    await connectToDatabase();

    const formData = await request.formData();
    const name = removeQuotes(formData.get("name") as string);

    const existingDetail = await CarDetail.findById(id);
    if (!existingDetail) {
      return NextResponse.json(
        { message: "CarDetail not found" },
        { status: 404 },
      );
    }

    if (name) existingDetail.name = name;

    const file = formData.get("image") as File;
    if (file) {
      if (existingDetail.icon) await deleteFile(existingDetail.icon);

      const iconPath = await saveFile(file);
      existingDetail.icon = iconPath;
    }

    await existingDetail.save();

    return NextResponse.json(
      {
        message: "Car detail updated successfully",
        detail: existingDetail,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating CarDetail:", error);
    return NextResponse.json(
      { message: "Failed to update CarDetail" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    const ordering = await Ordering.findOne({
      name: "CarDetail",
    });

    let orderIds: Types.ObjectId[] = [];

    if (ordering) {
      orderIds = ordering.ids;
    }

    const detailsWithValues = await CarDetail.aggregate([
      {
        $lookup: {
          from: "cardetailoptions",
          localField: "_id",
          foreignField: "detailId",
          as: "values",
        },
      },
      {
        $project: {
          name: 1,
          icon: 1,
          values: {
            $map: {
              input: "$values",
              as: "option",
              in: {
                _id: "$$option._id",
                name: "$$option.name",
                icon: "$$option.icon",
              },
            },
          },
        },
      },
      {
        $addFields: {
          order: {
            $indexOfArray: [orderIds, "$_id"],
          },
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
      {
        $addFields: {
          values: {
            $sortArray: {
              input: "$values",
              sortBy: { name: 1 },
            },
          },
        },
      },
    ]);

    return NextResponse.json(detailsWithValues);
  } catch (error) {
    console.error(
      "Error fetching CarDetails with values using aggregation:",
      error,
    );
    return NextResponse.json(
      { message: "Failed to fetch CarDetails with values" },
      { status: 500 },
    );
  }
}
