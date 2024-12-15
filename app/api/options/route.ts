import { connectToDatabase } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import { CarDetailOption } from "@/models/Option";
import fs from "fs/promises";
import path from "path";

const uploadDir = path.join(process.cwd(), "public", "uploads");

async function saveFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `car-detail-option-icon-${Date.now()}-${file.name}`;
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
    const detailId = formData.get("detailId")?.toString();
    const name = formData.get("name")?.toString();
    const file = formData.get("icon") as File;

    if (!detailId || !name) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    let carDetailOption = await CarDetailOption.findOne({
      detailId,
      name,
    });

    if (carDetailOption) {
      return NextResponse.json(
        {
          message: "CarDetailOption with this name already exists",
          option: carDetailOption,
        },
        { status: 200 },
      );
    }

    const iconPath = file ? await saveFile(file) : null;

    carDetailOption = new CarDetailOption({
      detailId,
      name,
      icon: iconPath,
    });

    await carDetailOption.save();

    return NextResponse.json(
      {
        message: "CarDetailOption created successfully",
        option: carDetailOption,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating CarDetailOption:", error);
    return NextResponse.json(
      { message: "Failed to create CarDetailOption" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "Missing CarDetailOption ID" },
      { status: 400 },
    );
  }

  try {
    await connectToDatabase();

    const carDetailOption = await CarDetailOption.findById(id);
    if (!carDetailOption) {
      return NextResponse.json(
        { message: "CarDetailOption not found" },
        { status: 404 },
      );
    }

    if (carDetailOption.icon) await deleteFile(carDetailOption.icon);

    await CarDetailOption.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "CarDetailOption deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting CarDetailOption:", error);
    return NextResponse.json(
      { message: "Failed to delete CarDetailOption" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "Missing CarDetailOption ID" },
      { status: 400 },
    );
  }

  try {
    await connectToDatabase();

    const formData = await request.formData();
    const name = formData.get("name")?.toString();
    const file = formData.get("icon") as File;

    const existingCarDetailOption = await CarDetailOption.findById(id);
    if (!existingCarDetailOption) {
      return NextResponse.json(
        { message: "CarDetailOption not found" },
        { status: 404 },
      );
    }

    if (name) existingCarDetailOption.name = name;

    if (file) {
      if (existingCarDetailOption.icon)
        await deleteFile(existingCarDetailOption.icon);

      const iconPath = await saveFile(file);
      existingCarDetailOption.icon = iconPath;
    }

    await existingCarDetailOption.save();

    return NextResponse.json(
      {
        message: "CarDetailOption updated successfully",
        carDetailOption: existingCarDetailOption,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating CarDetailOption:", error);
    return NextResponse.json(
      { message: "Failed to update CarDetailOption" },
      { status: 500 },
    );
  }
}
