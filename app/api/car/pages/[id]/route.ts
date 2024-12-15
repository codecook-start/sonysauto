import { NextRequest, NextResponse } from "next/server";
import { Car } from "@/models/Car";
import { connectToDatabase } from "@/lib/mongoose";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await connectToDatabase();
  const { id } = params;

  try {
    const { pages } = await req.json();

    if (!Array.isArray(pages)) {
      return NextResponse.json(
        { message: "Pages should be an array of strings." },
        { status: 400 },
      );
    }

    const updatedCar = await Car.findByIdAndUpdate(
      id,
      { pages },
      { new: true, runValidators: true },
    );

    if (!updatedCar) {
      return NextResponse.json({ message: "Car not found." }, { status: 404 });
    }

    return NextResponse.json(updatedCar, { status: 200 });
  } catch (error) {
    console.error("Error updating car pages:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
