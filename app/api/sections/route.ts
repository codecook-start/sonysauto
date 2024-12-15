import { connectToDatabase } from "@/lib/mongoose";
import { Ordering } from "@/models/Ordering";
import { SellerNote } from "@/models/SellerNote";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { title } = await req.json();
    const note = await SellerNote.create({ title });
    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    console.error("Error creating notes:", error);
    return NextResponse.json(
      { message: "Failed to create notes" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const { id, title } = await req.json();
    const note = await SellerNote.findByIdAndUpdate(
      id,
      { title },
      { new: true },
    );
    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    console.error("Error updating notes:", error);
    return NextResponse.json(
      { message: "Failed to update notes" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await SellerNote.findByIdAndDelete(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting notes:", error);
    return NextResponse.json(
      { message: "Failed to delete notes" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const ordering = await Ordering.findOne({
      name: "SellerNote",
    });

    let orderIds: Types.ObjectId[] = [];

    if (ordering) {
      orderIds = ordering.ids;
    }
    const notes = await SellerNote.aggregate([
      {
        $lookup: {
          from: "sellernotetexts",
          localField: "_id",
          foreignField: "noteId",
          as: "texts",
        },
      },
      {
        $addFields: {
          texts: {
            $filter: {
              input: "$texts",
              as: "text",
              cond: { $eq: ["$$text.scope", "global"] },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          texts: 1,
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
    ]);
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { message: "Failed to fetch notes" },
      { status: 500 },
    );
  }
}
