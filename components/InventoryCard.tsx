/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";

import React, { useState } from "react";
import {
  Fuel,
  Gauge,
  Milestone,
  ShipWheel,
  Calendar,
  Factory,
  Cog,
  Compass,
  Paintbrush,
  Sofa,
  Barcode,
  DoorOpen,
  Tag,
  Trash2,
  Pencil,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { Label } from "@/components/ui/label";
import { useCarPages } from "@/hooks/useCarPages";
import { Checkbox } from "@/components/ui/checkbox";
import { useCompare } from "@/hooks/useCompare";
import { useCar } from "@/hooks/useCar";
import Link from "next/link";
import { CarResponse } from "@/types/edit-car";
import { MultiSelectWithCustom } from "@/components/ui/multi-select-with-custom";
import { capitalize, getBadge } from "@/lib/utils";
import Image from "next/image";

const Loader = ({ size = "1em" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="0" fill="currentColor">
      <animate
        id="svgSpinnersPulse30"
        fill="freeze"
        attributeName="r"
        begin="0;svgSpinnersPulse32.begin+0.4s"
        calcMode="spline"
        dur="1.2s"
        keySplines=".52,.6,.25,.99"
        values="0;11"
      ></animate>
      <animate
        fill="freeze"
        attributeName="opacity"
        begin="0;svgSpinnersPulse32.begin+0.4s"
        calcMode="spline"
        dur="1.2s"
        keySplines=".52,.6,.25,.99"
        values="1;0"
      ></animate>
    </circle>
    <circle cx="12" cy="12" r="0" fill="currentColor">
      <animate
        id="svgSpinnersPulse31"
        fill="freeze"
        attributeName="r"
        begin="svgSpinnersPulse30.begin+0.4s"
        calcMode="spline"
        dur="1.2s"
        keySplines=".52,.6,.25,.99"
        values="0;11"
      ></animate>
      <animate
        fill="freeze"
        attributeName="opacity"
        begin="svgSpinnersPulse30.begin+0.4s"
        calcMode="spline"
        dur="1.2s"
        keySplines=".52,.6,.25,.99"
        values="1;0"
      ></animate>
    </circle>
    <circle cx="12" cy="12" r="0" fill="currentColor">
      <animate
        id="svgSpinnersPulse32"
        fill="freeze"
        attributeName="r"
        begin="svgSpinnersPulse30.begin+0.8s"
        calcMode="spline"
        dur="1.2s"
        keySplines=".52,.6,.25,.99"
        values="0;11"
      ></animate>
      <animate
        fill="freeze"
        attributeName="opacity"
        begin="svgSpinnersPulse30.begin+0.8s"
        calcMode="spline"
        dur="1.2s"
        keySplines=".52,.6,.25,.99"
        values="1;0"
      ></animate>
    </circle>
  </svg>
);

const itemIcons = [
  Fuel,
  Gauge,
  Milestone,
  ShipWheel,
  Calendar,
  Factory,
  Cog,
  Compass,
  Paintbrush,
  Sofa,
  Barcode,
  DoorOpen,
  Tag,
];

const InventoryCard = ({ car }: { car: CarResponse }) => {
  const {
    deleteCar: { mutate: deleteCar, isLoading: isDeleting },
  } = useCar(car._id);
  const slides = car.images || [];
  const [currentImage, setCurrentImage] = useState(0);
  const { isAuthenticated, isLoginLoading } = useAuth();
  const { ids, setIds } = useCompare();
  const { mutate } = useCarPages(car._id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const index = Math.floor((mouseX / width) * Math.min(5, slides.length));
    setCurrentImage(index);
  };

  const handleMouseLeave = () => {
    setCurrentImage(0);
  };

  const remainingslides = slides.length > 5 ? slides.length - 5 : 0;

  if (isLoginLoading && !isAuthenticated)
    return (
      <div className="flex min-h-[10rem] flex-1 items-center justify-center">
        <Loader size="5em" />
      </div>
    );

  const status = getBadge(car.pages);

  return (
    <div className="group relative h-full">
      <div className="absolute -inset-0 rounded-xl bg-gradient-to-r from-[#008559] via-[#0073e5] to-[#6842ff] opacity-25 blur-sm transition-opacity duration-500 group-hover:opacity-90 group-hover:blur-md"></div>
      {/* edit and delete */}
      {isAuthenticated && (
        <div className="absolute left-2 top-2 z-10 flex gap-2">
          <Link
            shallow
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="rounded-full bg-white p-2 text-black hover:shadow-md"
            href={`/dashboard/${car._id}/`}
          >
            <Pencil size={"1em"} color="black" />
          </Link>
          <button
            disabled={isDeleting}
            onClick={(e) => {
              e.stopPropagation();
              deleteCar();
            }}
            className="rounded-full bg-white p-2 text-black hover:shadow-md disabled:animate-pulse disabled:cursor-not-allowed disabled:bg-white/75"
          >
            {!isDeleting ? <Trash2 size={"1em"} color="red" /> : <Loader />}
          </button>
        </div>
      )}
      {!isAuthenticated && (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          title="Add to compare"
          className="absolute left-2 top-2 z-10 flex items-center justify-center gap-2 rounded-full bg-white px-3 py-1 opacity-0 transition-opacity hover:shadow-md group-hover:opacity-100"
        >
          <span className="text-black">Compare</span>
          <Checkbox
            id={car._id}
            checked={ids.includes(car._id)}
            onCheckedChange={() => {
              setIds((prev) => {
                if (prev.includes(car._id)) {
                  return prev.filter((id) => id !== car._id);
                } else {
                  return prev.length >= 4
                    ? prev.slice(1).concat(car._id)
                    : [...prev, car._id];
                }
              });
            }}
          />
        </div>
      )}
      <div className="inventory-card group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl bg-white">
        <Link href={`/inventory/${car._id}`}>
          <div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            {/* Image Section */}
            <div className="image relative aspect-[4/3] w-full overflow-hidden">
              <Image
                className="h-full w-full object-cover"
                src={"/" + slides[currentImage]?.path}
                alt={`inventory-${currentImage}`}
                layout="fill"
                objectFit="cover"
              />

              {/* Display overlay for 'n more photos' */}
              {currentImage === 4 && remainingslides > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-sm font-semibold text-white">
                  +{remainingslides} more photos
                </div>
              )}

              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 transform space-x-1">
                {slides.slice(0, Math.min(5, slides.length)).map((_, index) => (
                  <span
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentImage
                        ? "bg-white"
                        : "bg-transparent backdrop-blur backdrop-brightness-75"
                    }`}
                  ></span>
                ))}
              </div>

              {/* status badge */}
              {status && (
                <span
                  className="absolute -right-16 top-6 rotate-45 transform px-20 py-2 text-xs font-semibold capitalize text-white"
                  style={{ backgroundColor: status.color }}
                >
                  {status.text}
                </span>
              )}
            </div>

            <div className="header relative w-full space-x-2 border-b px-2 py-4">
              <h3 className="text-pretty pb-4 text-sm font-bold">
                {car.title || "Car Title"}
              </h3>
              <p className="skew-left absolute bottom-0 right-0 transform bg-blue-500 px-3 py-2 text-xs font-semibold text-white">
                {car.price || "N/A"}
              </p>
            </div>

            <div className="content flex flex-1 flex-col justify-between p-2">
              <ul className="grid grid-cols-3 gap-2 text-xs text-neutral-500">
                {(car.details || [])
                  .filter((item) => !!item.option)
                  .slice(0, 6)
                  ?.map((item: any, index: number) => (
                    <li
                      key={index}
                      className="flex flex-col items-center gap-1 rounded border px-2 py-1"
                    >
                      {item.option?.icon ? (
                        <Image
                          src={"/" + item.option.icon}
                          alt={item.option?.name || "N/A"}
                          className="h-6 w-6 object-contain grayscale"
                          width={24}
                          height={24}
                        />
                      ) : (
                        React.createElement(itemIcons[index], { size: "1.5em" })
                      )}
                      <span className="line-clamp-1 text-center">
                        {capitalize(item.option?.name) || "N/A"}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </Link>
        {isAuthenticated && (
          <div
            className="mt-auto space-y-1.5 p-2 pt-0"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
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
                  label: "Reserved",
                  value: "reserved",
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
              maxCount={1}
              onValueChange={(values) =>
                mutate({
                  pages: values,
                })
              }
              className="text-black"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryCard;
