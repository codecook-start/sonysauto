/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectToDatabase } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import { titleMap } from "@/data";
import { Car } from "@/models/Car";
import { createCarPipelineRaw } from "@/pipeline/rawfilterCars";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const filterableDetails = [
  "condition",
  "year",
  "fuel",
  "seats",
  "tags",
  "color",
];

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
          .filter(({ values }) => values.length > 0)
      : [];

    const detailMap: Record<
      string,
      {
        _id: string;
        name: string;
        values: { name: string; icon?: string; count: number }[];
        icon?: string;
      }
    > = {};

    const selectedFeatures = searchParams.get("features");
    let featuresFilter: string[] = [];
    if (selectedFeatures) {
      featuresFilter = selectedFeatures.split(",");
    }

    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "Infinity");

    const pipeline = createCarPipelineRaw(
      pathname,
      detailsFilter,
      featuresFilter,
      minPrice,
      maxPrice,
    );

    const cars = await Car.aggregate(pipeline);

    const carsDetails = cars.map((car) => car.details);

    carsDetails.forEach((details: any) => {
      details.forEach((detailEntry: any) => {
        if (!detailEntry.detail) return;
        const { _id, name, icon } = detailEntry.detail;
        const optionName = detailEntry.option?.name || null;
        const optionIcon = detailEntry.option?.icon || null;

        if (!detailMap[name]) {
          detailMap[name] = { _id, name, values: [], icon: icon || null };
        }

        if (optionName) {
          const existingOption = detailMap[name].values.find(
            (opt) => opt.name === optionName,
          );

          if (existingOption) {
            existingOption.count += 1;
          } else {
            detailMap[name].values.push({
              name: optionName,
              icon: optionIcon || null,
              count: 1,
            });
          }
        }
      });
    });

    const formattedDetails = Object.values(detailMap).filter((detail) =>
      filterableDetails.some(
        (filterName) =>
          filterName.toLowerCase() === detail.name.toLowerCase() &&
          detail.values.length > 0,
      ),
    );

    const sortedDetails = filterableDetails
      .map((filterName) =>
        formattedDetails.find(
          (detail) => detail.name.toLowerCase() === filterName.toLowerCase(),
        ),
      )
      .filter((detail) => detail);

    return NextResponse.json(sortedDetails, { status: 200 });
  } catch (error) {
    console.error("Error fetching unique details:", error);
    return NextResponse.json(
      { message: "Failed to fetch unique details" },
      { status: 500 },
    );
  }
}
