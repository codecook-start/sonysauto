import { connectToDatabase } from "@/lib/mongoose";
import { CarLabel } from "@/models/Label";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { name, color, bgColor } = body as {
      name: string;
      color: string;
      bgColor: string;
    };

    if (!name) {
      return NextResponse.json(
        {
          message: "Missing required fields: name",
        },
        { status: 400 },
      );
    }

    const newCarLabel = new CarLabel({
      name,
      color,
      bgColor,
    });

    const savedCarLabel = await newCarLabel.save();

    return NextResponse.json(
      { message: "CarLabel created successfully", data: savedCarLabel },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating CarLabel:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to create CarLabel", error: errorMessage },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    const carLabels = await CarLabel.find().sort({ createdAt: -1 });

    return NextResponse.json({ data: carLabels }, { status: 200 });
  } catch (error) {
    console.error("Error fetching CarLabels:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to fetch CarLabels", error: errorMessage },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { id, name, color, bgColor } = body as {
      id: string;
      name: string;
      color: string;
      bgColor: string;
    };

    if (!id || !name) {
      return NextResponse.json(
        {
          message: "Missing required fields: id, name",
        },
        { status: 400 },
      );
    }

    const updatedCarLabel = await CarLabel.findByIdAndUpdate(
      id,
      { name, color, bgColor },
      { new: true },
    );

    return NextResponse.json(
      { message: "CarLabel updated successfully", data: updatedCarLabel },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating CarLabel:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to update CarLabel", error: errorMessage },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();

    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          message: "Missing required fields: id",
        },
        { status: 400 },
      );
    }

    await CarLabel.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "CarLabel deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting CarLabel:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to delete CarLabel", error: errorMessage },
      { status: 500 },
    );
  }
}
