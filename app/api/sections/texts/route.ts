import { connectToDatabase } from "@/lib/mongoose";
import { SellerNoteText } from "@/models/SellerText";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { noteId, title, text, scope } = await req.json();
    const sellerText = await SellerNoteText.create({
      noteId,
      title,
      text,
      scope,
    });
    return NextResponse.json(sellerText, { status: 200 });
  } catch (error) {
    console.error("Error creating text:", error);
    return NextResponse.json(
      { message: "Failed to create text" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const { _id, title, text, scope } = await req.json();
    const sellerText = await SellerNoteText.findByIdAndUpdate(
      _id,
      { title, text, scope },
      { new: true },
    );
    return NextResponse.json(sellerText, { status: 200 });
  } catch (error) {
    console.error("Error updating text:", error);
    return NextResponse.json(
      { message: "Failed to update text" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await SellerNoteText.findByIdAndDelete(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting text:", error);
    return NextResponse.json(
      { message: "Failed to delete text" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const scope = url.searchParams.get("scope");
    const noteId = url.searchParams.get("noteId");
    await connectToDatabase();
    let query = {};
    if (scope) {
      query = { scope };
    }
    if (noteId) {
      query = { ...query, noteId };
    }
    const sellerText = await SellerNoteText.find(query);
    return NextResponse.json(sellerText, { status: 200 });
  } catch (error) {
    console.error("Error fetching text:", error);
    return NextResponse.json(
      { message: "Failed to fetch text" },
      { status: 500 },
    );
  }
}
