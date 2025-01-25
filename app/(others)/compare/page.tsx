"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import { CarFront } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCompare } from "@/hooks/useCompare";
import Loader from "@/components/Loader";
import { CarResponse } from "@/types/edit-car";
import { capitalize } from "@/lib/utils";

const MAX_COMPARE_CARS = 4;

const getAllDetails = (cars: CarResponse[]) => {
  const allDetails = new Set<string>();
  cars.forEach((car) => {
    car.details
      .filter((detail) => !!detail.detail && !!detail.option)
      .forEach((detail) => {
        allDetails.add(detail.detail.name);
      });
  });
  return Array.from(allDetails);
};

const getAllFeatures = (cars: CarResponse[]) => {
  const allFeatures = new Set<string>();
  cars.forEach((car) => {
    car.features.forEach((feature) => {
      allFeatures.add(feature.name);
    });
  });
  return Array.from(allFeatures);
};

const CompareItem = () => {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg"
      onClick={() => router.push("/japan")}
    >
      <CardContent className="p-4">
        <div className="flex aspect-video items-center justify-center rounded-md bg-neutral-100 hover:bg-neutral-200">
          <CarFront className="text-neutral-400" size={48} />
        </div>
        <p className="mt-3 text-center text-sm text-neutral-600">
          Add Car to Compare
        </p>
      </CardContent>
    </Card>
  );
};

const CarCard = ({ car }: { car: CarResponse }) => (
  <Card className="h-full">
    <CardContent className="p-4">
      <div className="aspect-video overflow-hidden rounded-md">
        <img
          src={car.images[0].path}
          alt={car.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
          loading="lazy"
          fetchPriority="low"
        />
      </div>
      <h4 className="mt-3 text-lg font-semibold">{car.title}</h4>
    </CardContent>
  </Card>
);

const ComparisonRow = ({
  label,
  values,
  emptySlots,
}: {
  label: string;
  values: (string | React.ReactNode)[];
  emptySlots: number;
}) => (
  <div
    className="grid items-center gap-4"
    style={{
      gridTemplateColumns: `200px repeat(${values.length + emptySlots}, 1fr)`,
    }}
  >
    <div className="font-medium text-neutral-700">{label}</div>
    {values.map((value, index) => (
      <div key={index} className="text-sm">
        {value}
      </div>
    ))}
    {[...Array(emptySlots)].map((_, index) => (
      <div key={`empty-${index}`} className="text-neutral-400">
        -
      </div>
    ))}
  </div>
);

const Compare = () => {
  const { cars: allCars, isLoading } = useCompare();
  const cars = allCars.slice(-MAX_COMPARE_CARS);
  const allDetails = getAllDetails(cars);
  const allFeatures = getAllFeatures(cars);
  const emptySlots = Math.max(0, MAX_COMPARE_CARS - cars.length);

  if (isLoading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb>
        <BreadcrumbList className="border-b py-4 text-sm text-neutral-600">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Sony{"'"}s Auto</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/compare">Compare</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="my-8">
        <h1 className="text-3xl font-bold md:text-4xl">Compare Vehicles</h1>
        <p className="mt-2 text-neutral-600">
          Compare up to {MAX_COMPARE_CARS} vehicles side by side
        </p>
      </div>

      <ScrollArea className="w-full">
        <div className="min-w-[800px]">
          {/* Cars Grid */}
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `200px repeat(${MAX_COMPARE_CARS}, 1fr)`,
            }}
          >
            <div className="font-medium text-neutral-700">
              Selected Vehicles
            </div>
            {cars.map((car, index) => (
              <CarCard key={index} car={car} />
            ))}
            {[...Array(emptySlots)].map((_, index) => (
              <CompareItem key={`empty-${index}`} />
            ))}
          </div>

          <Separator className="my-8" />

          {/* Specifications */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Specifications</h2>
            <div className="space-y-4">
              {allDetails.map((detail) => (
                <ComparisonRow
                  key={detail}
                  label={capitalize(detail)}
                  values={cars.map((car) => {
                    const fieldDetail = car.details.find(
                      (d) => d.detail?.name === detail,
                    );
                    return fieldDetail?.option?.name || "❌";
                  })}
                  emptySlots={emptySlots}
                />
              ))}
            </div>
          </div>

          <Separator className="my-8" />

          {/* Features */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Features</h2>
            <div className="space-y-4">
              {allFeatures.map((feature) => {
                return (
                  <ComparisonRow
                    key={feature}
                    label={feature}
                    values={cars.map((car) => {
                      const featureDetail = car.features.find(
                        (f) => f.name === feature,
                      );
                      return featureDetail ? (
                        <span className="text-lg">✅</span>
                      ) : (
                        <span className="text-lg">❌</span>
                      );
                    })}
                    emptySlots={emptySlots}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Compare;
