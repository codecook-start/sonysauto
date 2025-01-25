import { titleMap } from "@/data";
import { Ordering } from "@/models/Ordering";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const { name, page, pageNumber, limit, ids } = await req.json();

    if (!name || !page || !pageNumber || !limit || !Array.isArray(ids)) {
      return NextResponse.json(
        { message: "Invalid input data." },
        { status: 400 },
      );
    }

    if (pageNumber < 1 || limit < 1) {
      return NextResponse.json(
        { message: "Page number and limit must be positive integers." },
        { status: 400 },
      );
    }

    if (!Object.keys(titleMap).includes(page)) {
      return NextResponse.json(
        { message: "Cannot update ordering for this page." },
        { status: 400 },
      );
    }

    const ordering = await Ordering.findOne({
      name,
      page: page.replace(/^\//, ""),
    });

    if (!ordering) {
      return NextResponse.json(
        { message: "Cannot find ordering for this page." },
        { status: 404 },
      );
    }

    const startIndex = (pageNumber - 1) * limit;
    const endIndex = pageNumber * limit;

    const newOrdering = [
      ...ordering.ids.slice(0, startIndex),
      ...ids,
      ...ordering.ids.slice(endIndex),
    ];

    ordering.ids = newOrdering;
    await ordering.save();

    return NextResponse.json({
      message: "Ordering updated successfully.",
    });
  } catch (error) {
    console.error("Error updating ordering:", error);
    return NextResponse.json(
      { message: "An error occurred while updating ordering." },
      { status: 500 },
    );
  }
};
