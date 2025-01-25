"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import ItemFeatures from "./_components/ItemFeatures";
import ItemDetails from "./_components/ItemDetails";
import ItemImages from "./_components/ItemImages";
import ItemVideo from "./_components/ItemVideo";
import SellerNotes from "./_components/SellerNotes";
import { Button } from "@/components/ui/button";
import { MultiSelectWithCustom } from "@/components/ui/multi-select-with-custom";
import { useCar } from "@/hooks/useCar";
import Loader from "@/components/Loader";
import useUpdateCar from "@/hooks/useUpdateCar";
import CarLabel from "./_components/CarLabel";
import { SparklesIcon } from "lucide-react";

const Dashboard = ({ params: { id } }: { params: { id: string } }) => {
  const { car: carData, setCar, isLoading: isLoadingCar, isError } = useCar(id);
  const { handleUpdate, isLoading, generateTitle } = useUpdateCar();

  if (isLoadingCar || isError)
    return (
      <div
        className="flex h-96 items-center justify-center"
        style={{ minHeight: "calc(100vh - 4rem)" }}
      >
        {isLoadingCar ? <Loader /> : "Error fetching car data"}
      </div>
    );

  return (
    <div className="mb-8">
      {/* Header */}
      <div
        className="bg-cover px-8 py-16"
        style={{ backgroundImage: "url(/1.jpg)" }}
      >
        <h2 className="container-md text-4xl font-bold text-white">Edit Car</h2>
      </div>

      {/* Main Content */}
      <div className="mx-8">
        {/* Breadcrumb */}
        <Breadcrumb className="container-md">
          <BreadcrumbList className="border-b py-4 text-xs text-neutral-800">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Sony{"'"}s Auto</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/components">Edit Car</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Title & Price Inputs */}
        <div className="container-md mt-8 flex gap-4">
          <div className="flex-1 space-y-4">
            <Label>Listing Title</Label>
            <div className="flex rounded border">
              <input
                type="text"
                value={carData?.title}
                onChange={(e) => setCar({ ...carData, title: e.target.value })}
                placeholder="Title"
                className="mx-4 flex-1 text-sm outline-none"
              />
              <Button
                onClick={generateTitle}
                variant="ghost"
                className="rounded text-neutral-500"
              >
                <SparklesIcon size={"1.25em"} />
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <Label>Price</Label>
            <Input
              value={carData?.price}
              onChange={(e) => setCar({ ...carData, price: e.target.value })}
              type="text"
              placeholder="Price"
              className="my-4 w-full border p-4"
            />
          </div>
        </div>

        {/* Item Details */}
        <ItemDetails />
        <ItemFeatures />
        <ItemImages />
        <ItemVideo />
        <SellerNotes />

        {/* Domain Selector */}
        <div className="container-md mt-8 space-y-4">
          <Label>Select Domain</Label>
          <MultiSelectWithCustom
            options={[
              { label: "sonysauto.net", value: "sonysauto.net" },
              { label: "sonysauto.com", value: "sonysauto.com" },
            ]}
            value={carData?.domain || []}
            placeholder="Enter Domain"
            onValueChange={(values) => setCar({ ...carData, domain: values })}
            animation={0}
          />
        </div>

        {/* Pages Selector */}
        <div className="container-md mt-8 space-y-1.5">
          <Label>Select Pages</Label>
          <MultiSelectWithCustom
            options={[
              {
                label: "Inventory in Japan",
                value: "japan",
              },
              {
                label: "Inventory in Cayman",
                value: "cayman",
              },
              {
                label: "Sold",
                value: "sold",
              },
              {
                label: "Shipping Soon",
                value: "shipping",
              },
              {
                label: "Shipped",
                value: "shipped",
              },
            ]}
            value={carData?.pages || []}
            placeholder="Enter Pages"
            onValueChange={(values) => setCar({ ...carData, pages: values })}
            animation={0}
          />
        </div>

        <CarLabel id={id} />

        {/* Extra Fields */}
        <div className="container-md mt-8">
          <Label>Extra Fields</Label>
          <Input
            value={carData?.extra}
            onChange={(e) => setCar({ ...carData, extra: e.target.value })}
            type="text"
            placeholder="Field 1"
            className="my-4 w-full border p-4"
          />
        </div>

        {/* Submit Buttons */}
        <div className="container-md">
          <Button
            onClick={() => handleUpdate()}
            disabled={isLoading}
            className="mt-8 w-full"
          >
            {isLoading ? "Loading..." : "Edit Car"}
          </Button>
        </div>
        <Button
          onClick={() => handleUpdate()}
          disabled={isLoading}
          className="fixed bottom-8 right-8 z-50 rounded-full border bg-white text-black shadow-md hover:bg-gray-100"
        >
          {isLoading ? "Loading..." : "Edit Car"}
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
