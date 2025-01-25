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
import { useAtom } from "jotai";
import { CarLocalAtom } from "@/jotai/dashboardAtom";
import useSubmitCar from "@/hooks/useSubmitCar";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelectWithCustom } from "@/components/ui/multi-select-with-custom";
import CarLabel from "./_components/CarLabel";
import { SparklesIcon } from "lucide-react";

const Dashboard = () => {
  const [car, setCar] = useAtom(CarLocalAtom);
  const { handleSubmit, isLoading, generateTitle } = useSubmitCar();

  return (
    <div className="mb-8">
      {/* Add Car banner */}
      <div
        className="px-8 py-16"
        style={{
          backgroundImage: "url(/1.jpg)",
          backgroundSize: "cover",
        }}
      >
        <h2 className="container-md text-4xl font-bold text-white">Add Car</h2>
      </div>
      {/* main content */}
      <div className="mx-8">
        {/* breadcrumb */}
        <Breadcrumb className="container-md">
          <BreadcrumbList className="border-b py-4 text-xs text-neutral-800">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Sony{"'"}s Auto</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/components">Add Car</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* merge title and price */}
        <div className="container-md mt-8 flex gap-4">
          {/* title */}
          <div className="flex-1 space-y-4">
            <Label>Listing Title</Label>
            <div className="flex rounded border">
              <input
                type="text"
                value={car?.title}
                onChange={(e) => setCar({ ...car, title: e.target.value })}
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
          {/* price */}
          <div className="flex-1">
            <Label>Price</Label>
            <Input
              value={car?.price}
              onChange={(e) => setCar({ ...car, price: e.target.value })}
              type="text"
              placeholder="Price"
              className="my-4 w-full border p-4"
            />
          </div>
        </div>
        <div className="container-md flex-1">
          <Label>Link</Label>
          <Input
            value={car?.link}
            onChange={(e) => setCar({ ...car, link: e.target.value })}
            type="text"
            placeholder="Link"
            className="my-4 w-full border p-4"
          />
        </div>
        {/* listing Item Details */}
        <ItemDetails />
        {/* listing item features */}
        <ItemFeatures />
        {/* listing item images */}
        <ItemImages />
        {/* add video */}
        <ItemVideo />
        {/* description section */}
        <SellerNotes />
        {/* select domain */}
        <div className="container-md mt-8 space-y-4">
          <Label className="">Select Domain</Label>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="sonysauto.net"
                checked={car?.domain?.includes("sonysauto.net")}
                onCheckedChange={() =>
                  setCar({
                    ...car,
                    domain: car?.domain?.includes("sonysauto.net")
                      ? car.domain.filter((d) => d !== "sonysauto.net")
                      : [...(car?.domain || []), "sonysauto.net"],
                  })
                }
              />
              <Label htmlFor="sonysauto.net">sonysauto.net</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="sonysauto.com"
                checked={car?.domain?.includes("sonysauto.com")}
                onCheckedChange={() =>
                  setCar({
                    ...car,
                    domain: car?.domain?.includes("sonysauto.com")
                      ? car.domain.filter((d) => d !== "sonysauto.com")
                      : [...(car?.domain || []), "sonysauto.com"],
                  })
                }
              />
              <Label htmlFor="sonysauto.com">sonysauto.com</Label>
            </div>
          </div>
        </div>
        {/* select pages */}
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
            value={car?.pages || []}
            placeholder="Enter Pages"
            onValueChange={(values) => setCar({ ...car, pages: values })}
            animation={0}
          />
        </div>
        {/* label */}
        <CarLabel />
        {/* extra field */}
        <div className="container-md mt-8">
          <Label>Extra Fields</Label>
          <Input
            value={car?.extra}
            onChange={(e) => setCar({ ...car, extra: e.target.value })}
            type="text"
            placeholder="Field 1"
            className="my-4 w-full border p-4"
          />
        </div>
        <div className="container-md">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="mt-8 w-full"
          >
            {isLoading ? "Loading..." : "Add Car"}
          </Button>
        </div>
        {/* Floating Add Car Button */}
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="fixed bottom-8 right-8 z-50 rounded-full border bg-white text-black shadow-md hover:bg-gray-100"
        >
          {isLoading ? "Loading..." : "Add Car"}
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
