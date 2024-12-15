import { Ordering } from "@/models/Ordering";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  if (!name) {
    return NextResponse.json(
      { error: "Name query parameter is required" },
      { status: 400 },
    );
  }
  const ordering = await Ordering.findOne({ name });
  if (!ordering) {
    return NextResponse.json({ error: "Ordering not found" }, { status: 404 });
  }
  return NextResponse.json(ordering);
};
export const PATCH = async (req: NextRequest) => {
  const { name, ids } = await req.json();
  let ordering = await Ordering.findOne({ name });
  if (ordering) {
    ordering = await Ordering.findOneAndUpdate(
      { name },
      { ids },
      { new: true },
    );
  } else {
    ordering = await Ordering.create({ name, ids });
  }
  return NextResponse.json(ordering);
};
