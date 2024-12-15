/* eslint-disable @typescript-eslint/no-explicit-any */
import { titleMap } from "@/data";
import { connectToDatabase } from "@/lib/mongoose";
import { Car } from "@/models/Car";
import { NextRequest, NextResponse } from "next/server";

type DetailFilter = { name: string; values: string[] };

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const detailsParam = searchParams.get("details");

    const referer = request.headers.get("referer");
    let { origin, pathname } = new URL(referer || "http://localhost:3000");

    origin = origin?.replace(/^https?:\/\//, "");
    pathname = pathname?.replace(/\/$/g, "");
    if (!Object.keys(titleMap).includes(pathname)) {
      pathname = "";
    }
    pathname = pathname ? pathname.replace(/^\//, "") : "";

    console.log({
      origin,
    });

    const detailsFilter: DetailFilter[] = detailsParam
      ? detailsParam
          .split(";")
          .map((detail) => {
            const [name, values] = detail.split(":");
            return { name, values: values ? values.split(",") : [] };
          })
          .filter(({ values }) => {
            return values.length > 0;
          })
      : [];
    const pipeline = [
      {
        $match: {
          ...(pathname
            ? { $or: [{ pages: pathname }, { pages: { $size: 0 } }] }
            : {}),
        },
      },
      {
        $lookup: {
          from: "cardetails",
          localField: "details.detail",
          foreignField: "_id",
          as: "detailsWithDetail",
        },
      },
      {
        $lookup: {
          from: "cardetailoptions",
          localField: "details.option",
          foreignField: "_id",
          as: "detailsWithOption",
        },
      },
      {
        $lookup: {
          from: "features",
          localField: "features",
          foreignField: "_id",
          as: "features",
        },
      },
      {
        $addFields: {
          details: {
            $map: {
              input: "$details",
              as: "detailEntry",
              in: {
                detail: {
                  $arrayElemAt: [
                    "$detailsWithDetail",
                    {
                      $indexOfArray: [
                        "$detailsWithDetail._id",
                        "$$detailEntry.detail",
                      ],
                    },
                  ],
                },
                option: {
                  $arrayElemAt: [
                    "$detailsWithOption",
                    {
                      $indexOfArray: [
                        "$detailsWithOption._id",
                        "$$detailEntry.option",
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $match: {
          ...(detailsFilter.length > 0
            ? {
                details: {
                  $all: detailsFilter.map((filter) => ({
                    $elemMatch: {
                      "detail.name": filter.name,
                      "option.name": {
                        $in: filter.values,
                      },
                    },
                  })),
                },
              }
            : {}),
        },
      },
      {
        $project: {
          _id: 0,
          features: 1,
        },
      },
    ];

    const cars = await Car.aggregate(pipeline);

    const featuresWithCount = cars.reduce((acc, car) => {
      car.features.forEach((feature: any) => {
        const existingFeature = acc.find(
          (f: any) => String(f._id) === String(feature._id),
        );
        if (existingFeature) {
          existingFeature.count += 1;
        } else {
          acc.push({ ...feature, count: 1 });
        }
      });
      return acc;
    }, []);
    return NextResponse.json(
      featuresWithCount.sort((a: any, b: any) =>
        a.count === b.count ? a.name.localeCompare(b.name) : b.count - a.count,
      ),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching unique features with ordering:", error);
    return NextResponse.json(
      { message: "Failed to fetch unique features" },
      { status: 500 },
    );
  }
}
