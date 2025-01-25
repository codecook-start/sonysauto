import { NextRequest, NextResponse } from "next/server";
import { Car } from "@/models/Car";
import { connectToDatabase } from "@/lib/mongoose";
import path from "path";
import fs from "fs";
import { Types } from "mongoose";
import { titleMap } from "@/data";
import { Ordering } from "@/models/Ordering";
import { createCarPipeline } from "@/pipeline/filterCars";
import { CarDetail } from "@/models/Detail";

export const preferredRegion = "home";
export const maxDuration = 60;

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await request.formData();
    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const files = formData.getAll("images") as File[];
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, fileName);
        await fs.promises.writeFile(
          filePath,
          new Uint8Array(await file.arrayBuffer()),
        );
        return {
          filename: fileName,
          path: "api/uploads/" + fileName,
        };
      }),
    );

    const carDetails: { _id: Types.ObjectId }[] = await CarDetail.find(
      {},
      { _id: 1 },
    );

    const parsedDetails = JSON.parse(formData.get("details") as string);
    const details = carDetails.map((detail) => {
      const found = parsedDetails.find(
        (parsedDetail: { detail: string }) =>
          parsedDetail.detail === detail._id.toString(),
      );
      try {
        return {
          detail: detail._id,
          option:
            found && found.option
              ? new Types.ObjectId(found.option as string)
              : null,
        };
      } catch (error) {
        console.error("Error converting ObjectId(option):", error);
        return {
          detail: detail._id,
          option: null,
        };
      }
    });

    const parsedFeatures = JSON.parse(formData.get("features") as string);
    const features = parsedFeatures.map(
      (_id: string) => new Types.ObjectId(_id),
    );

    const pages = JSON.parse(formData.get("pages") as string) as string[];

    const carDocument = new Car({
      title: formData.get("title")?.toString() || "",
      price: formData.get("price")?.toString() || "",
      extra: formData.get("extra")?.toString() || "",
      details,
      features,
      videos: formData.get("videos")
        ? JSON.parse(formData.get("videos") as string)
        : [],
      images: uploadedFiles,
      pages,
      sellerNotes: JSON.parse(formData.get("sellerNotes") as string).map(
        (note: { note: string; texts: string[] }) => {
          try {
            return {
              note: new Types.ObjectId(note.note),
              texts: note.texts.map((text: string) => new Types.ObjectId(text)),
            };
          } catch (error) {
            console.error("Error converting ObjectId(seller notes):", error);
            return {
              note: null,
              texts: [],
            };
          }
        },
      ),
      label: formData.get("label")
        ? new Types.ObjectId(formData.get("label") as string)
        : null,
    });

    await carDocument.save();

    const bulkOperations = pages.map((page) => ({
      updateOne: {
        filter: { name: "Car", page },
        update: {
          $push: { ids: { $each: [carDocument._id], $position: 0 } },
        },
        upsert: true,
      },
    }));

    await Ordering.bulkWrite(bulkOperations);

    return NextResponse.json(
      {
        message: "Car data uploaded successfully",
        car: carDocument,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Failed to process the car data" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const referer = request.headers.get("referer");
    let { origin, pathname } = new URL(referer || "http://localhost:3000");
    origin = origin?.replace(/^https?:\/\//, "");
    pathname = pathname?.replace(/\/$/g, "");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "24", 10);

    console.log({
      origin,
      pathname,
    });

    if (
      !pathname.includes("inventory") &&
      !Object.keys(titleMap).includes(pathname)
    ) {
      return NextResponse.json(
        {
          data: [],
          pagination: {
            currentPage: page || 1,
            totalPages: 0,
            limit: limit || 32,
            totalItems: 0,
          },
        },
        { status: 400 },
      );
    }

    pathname = pathname.includes("inventory")
      ? "inventory"
      : pathname.replace(/^\//, "");
    const search = searchParams.get("search") || "";
    const detailsParam = searchParams.get("details");
    let detailsFilter: {
      name: string;
      values: string[];
    }[] = [];

    const selectedFeatures = searchParams.get("features");
    let featuresFilter: string[] = [];
    if (selectedFeatures) {
      featuresFilter = selectedFeatures.split(",");
    }

    if (detailsParam) {
      detailsFilter = detailsParam
        .split(";")
        .map((detail) => {
          const [name, values] = detail.split(":");
          return { name, values: values ? values.split(",") : [] };
        })
        .filter(({ values }) => values.length > 0);
    }

    const sortByParam = searchParams.get("sortBy");
    let sortStage: { [key: string]: 1 | -1 } = { carOrder: 1 };

    if (sortByParam) {
      sortStage = {};
      const sortByFilter = sortByParam.split(",").map((sort) => {
        const [name, order] = sort.split(":");
        return { name, order: order === "asc" ? 1 : -1 };
      });

      sortByFilter.forEach(({ name, order }) => {
        const sortFieldMap: { [key: string]: string } = {
          price: "numericPrice",
          year: "numericYear",
          mileage: "numericMileage",
          size: "numericSize",
          weight: "numericWeight",
        };

        if (sortFieldMap[name]) {
          sortStage[sortFieldMap[name]] = order as 1 | -1;
        }
      });
    }

    if (Object.keys(sortStage).length === 0) {
      sortStage = {
        carOrder: 1,
      };
    }

    const carDetailOrdering = await Ordering.findOne({ name: "CarDetail" });
    const carDetailOrderIds = carDetailOrdering?.ids ?? [];

    const carOrdering = await Ordering.findOne({ name: "Car", page: pathname });
    const carOrderIds = carOrdering?.ids ?? [];

    const skip = (page - 1) * limit;

    const pipeline = createCarPipeline(
      pathname,
      search,
      detailsFilter,
      featuresFilter,
      sortStage,
      skip,
      limit,
      carDetailOrderIds,
      carOrderIds,
    );

    const [result] = await Car.aggregate(pipeline);
    const { cars, totalCars, priceRange } = result || {
      cars: [],
      totalCars: 0,
      priceRange: { min: 0, max: 0 },
    };
    const totalPages = Math.ceil(totalCars / limit);

    return NextResponse.json(
      {
        data: cars,
        pagination: {
          currentPage: page,
          totalPages,
          limit,
          totalItems: totalCars,
          priceRange,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching car data:", error);
    return NextResponse.json(
      { error: "Failed to fetch car data" },
      { status: 500 },
    );
  }
}
