/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectToDatabase } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import { titleMap } from "@/data";
import { Car } from "@/models/Car";
// import fs from "fs";
// import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
          .filter(({ name, values }) => {
            if (name.toLowerCase() === "model") return false;
            // if (name.toLowerCase() === "type") return false;
            return values.length > 0;
          })
      : [];

    const selectedFeatures = searchParams.get("features");
    let featuresFilter: string[] = [];
    if (selectedFeatures) {
      featuresFilter = selectedFeatures.split(",");
    }

    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "Infinity");

    const pipeline = [
      {
        $match: {
          ...(() => {
            switch (pathname) {
              case "inventory":
                return {};
              case "reserved":
                return {
                  pages: { $in: ["reserved", "sold"] },
                };
              default:
                return { $or: [{ pages: pathname }, { pages: { $size: 0 } }] };
            }
          })(),
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
        $match: {
          ...(featuresFilter.length > 0
            ? {
                features: {
                  $elemMatch: {
                    name: {
                      $in: featuresFilter,
                    },
                  },
                },
              }
            : {}),
        },
      },
      {
        $addFields: {
          numericPrice: {
            $toDouble: {
              $getField: {
                field: "match",
                input: {
                  $regexFind: {
                    input: "$price",
                    regex: /\d+(\.\d+)?/,
                  },
                },
              },
            },
          },
        },
      },
      {
        $match: {
          numericPrice: {
            $gte: minPrice || 0,
            $lte: maxPrice || Infinity,
          },
        },
      },
      {
        $project: {
          _id: 0,
          details: 1,
        },
      },
    ];

    const cars = await Car.aggregate(pipeline);
    const modelsWithCount = cars.reduce((acc, car) => {
      const modelDetail = car.details.find(
        ({ detail }: any) => detail.name.toLowerCase() === "model",
      );
      if (
        String(modelDetail.detail._id) !== String(modelDetail.option.detailId)
      )
        return acc;
      if (modelDetail && modelDetail.option) {
        const { option } = modelDetail;
        const model = option.name;
        acc[model] = acc[model] || {
          _id: option._id,
          name: option.name,
          icon: option.icon,
          count: 0,
        };
        acc[model].count += 1;
      }
      return acc;
    }, {});

    return NextResponse.json(
      Object.values(modelsWithCount).sort((a: any, b: any) => {
        if (b.count === a.count) {
          return a.name.localeCompare(b.name);
        }
        return b.count - a.count;
      }),
    );
  } catch (error) {
    console.error("Error fetching unique details:", error);
    return NextResponse.json(
      { message: "Failed to fetch unique details" },
      { status: 500 },
    );
  }
}
