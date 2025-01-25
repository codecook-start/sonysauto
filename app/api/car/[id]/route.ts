/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectToDatabase } from "@/lib/mongoose";
import { Car } from "@/models/Car";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { Types } from "mongoose";
import { Feature } from "@/models/Feature";
import { SellerNote } from "@/models/SellerNote";
import { CarDetail } from "@/models/Detail";
import { Ordering } from "@/models/Ordering";
import { CarLabel } from "@/models/Label";

export const dynamic = "force-dynamic";
export const revalidate = 0;

console.log({
  Feature,
  SellerNote,
  CarDetail,
  CarLabel,
});

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDatabase();

    const sellerNoteOrdering = await Ordering.findOne({ name: "SellerNote" });
    const carDetailOrdering = await Ordering.findOne({
      name: "CarDetail",
    }).populate("ids");
    const featureOrdering = await Ordering.findOne({ name: "Feature" });

    const sellerNoteOrderIds = sellerNoteOrdering?.ids ?? [];
    const carDetailOrder = carDetailOrdering?.ids ?? [];
    const featureOrderIds = featureOrdering?.ids ?? [];

    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "Car ID is required" },
        { status: 400 },
      );
    }

    const car = await Car.findById(id)
      .populate({
        path: "features",
        model: "Feature",
      })
      .populate({
        path: "details",
        populate: [
          {
            path: "option",
            model: "CarDetailOption",
          },
        ],
      })
      .populate({
        path: "sellerNotes.note",
        model: "SellerNote",
      })
      .populate({
        path: "sellerNotes.texts",
        model: "SellerNoteText",
      })
      .populate({
        path: "label",
        model: "CarLabel",
      });

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    car.counter += 1;
    await car.save();

    car.features = car.features.sort(
      (a: any, b: any) =>
        featureOrderIds.indexOf(a._id) - featureOrderIds.indexOf(b._id),
    );
    car.details = carDetailOrder.map((carDetail) => {
      const _carDetail = car.details.find(
        (detail: any) =>
          detail.detail._id.toString() === carDetail._id.toString(),
      );
      if (!_carDetail) {
        return {
          detail: carDetail,
          option: null,
        };
      }
      _carDetail.detail = carDetail;
      return _carDetail;
    }) as any[];

    car.sellerNotes = car.sellerNotes.sort((a: any, b: any) => {
      const indexA = a.note?._id ? sellerNoteOrderIds.indexOf(a.note._id) : -1;
      const indexB = b.note?._id ? sellerNoteOrderIds.indexOf(b.note._id) : -1;
      return indexA - indexB;
    });

    return NextResponse.json(car, { status: 200 });
  } catch (error) {
    console.error("Error fetching car data:", error);
    return NextResponse.json(
      { error: "Failed to fetch car data" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDatabase();

    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "Car ID is required" },
        { status: 400 },
      );
    }

    const car = await Car.findByIdAndDelete(id);

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Car deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting car data:", error);
    return NextResponse.json(
      { error: "Failed to delete car data" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDatabase();
    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { error: "Car ID is required" },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const car = await Car.findById(id);
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    const files = formData.getAll("images") as (File | string)[];
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        if (typeof file === "string") {
          return { filename: file, path: file };
        } else {
          const fileName = `${Date.now()}-${file.name}`;
          const filePath = path.join(uploadDir, fileName);
          await fs.promises.writeFile(
            filePath,
            new Uint8Array(await file.arrayBuffer()),
          );
          return { filename: fileName, path: `api/uploads/${fileName}` };
        }
      }),
    );

    const parsedDetails = JSON.parse(formData.get("details") as string);
    const details = parsedDetails.map(
      (detail: {
        detail: string;
        option: string;
        showInDetailsPage: boolean;
        showInListPage: boolean;
      }) => ({
        detail: new Types.ObjectId(detail.detail),
        option: detail.option ? new Types.ObjectId(detail.option) : null,
        showInDetailsPage: detail.showInDetailsPage,
        showInListPage: detail.showInListPage,
      }),
    );

    const parsedFeatures = JSON.parse(formData.get("features") as string);
    const features = parsedFeatures.map(
      (_id: string) => new Types.ObjectId(_id),
    );

    const parsedSellerNotes = JSON.parse(formData.get("sellerNotes") as string);
    const sellerNotes = parsedSellerNotes.map(
      (note: { note: string; texts: string[] }) => ({
        note: new Types.ObjectId(note.note),
        texts: note.texts.map((text: string) => new Types.ObjectId(text)),
      }),
    );

    car.title = formData.get("title")?.toString() || car.title;
    car.price = formData.get("price")?.toString() || car.price;
    car.extra = formData.get("extra")?.toString() || car.extra;
    car.details = details;
    car.features = features;
    car.sellerNotes = sellerNotes;
    car.images = uploadedFiles;
    car.videos = formData.get("videos")
      ? JSON.parse(formData.get("videos") as string)
      : car.videos;
    car.pages = formData.get("pages")
      ? JSON.parse(formData.get("pages") as string)
      : car.pages;

    const label = formData.get("label");
    car.label = label ? new Types.ObjectId(label.toString()) : null;

    await car.save();

    return NextResponse.json(
      { message: "Car updated successfully", car },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating car data:", error);
    return NextResponse.json(
      { error: "Failed to update car data" },
      { status: 500 },
    );
  }
}
