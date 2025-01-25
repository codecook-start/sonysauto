/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { carDetailMap } from "@/data";
import { carAtom } from "@/jotai/carAtom";
import { capitalize } from "@/lib/utils";
import { useAtomValue } from "jotai";
import React from "react";
import {
  CalendarDays,
  Car,
  CarFront,
  Circle,
  Fan,
  File,
  Home,
  Layers,
  Lock,
  MoreVertical,
  Sliders,
  Sun,
  Tag,
  ToggleLeft,
  Truck,
  Zap,
  FileScan,
} from "lucide-react";

const fieldIcons: Record<string, React.ComponentType<any>> = {
  year: CalendarDays,
  make: Fan,
  model: Car,
  "Sub-Model": CarFront,
  condition: Layers,
  type: ToggleLeft,
  "Engine Size": Truck,
  tranny: Car,
  kilometers: Truck,
  miles: Truck,
  color: Circle,
  interior: Home,
  doors: Lock,
  seats: Car,
  "l x w x h": Sliders,
  weight: Zap,
  tags: Tag,
  "other tags": MoreVertical,
  "model code": FileScan,
  "stock id": File,
  "fuel type": Sun,
};

const CarSummary = () => {
  const car = useAtomValue(carAtom);
  const carDetails = ((car?.details || []) as any[])
    .filter((detail) => !!detail.detail)
    .map((detail) => ({
      name: detail.detail?.name,
      values: [detail.option?.name],
      icon:
        (detail.detail as any)?.icon ||
        carDetailMap[detail.detail?.name as keyof typeof carDetailMap],
    }))
    .filter((detail) => !!detail.values && detail.values.length > 0);
  return (
    <div className="container-md-mx grid md:grid-cols-4">
      <h3 className="font-[family-name:var(--font-harkshock)] text-4xl font-bold">
        Summary
      </h3>
      <ul className="col-span-3 grid grid-rows-5 gap-x-8 md:grid-cols-3">
        {carDetails.map(({ name, values, icon }, index) => {
          const normalizedName = name.toLowerCase();
          const Icon = icon || fieldIcons[normalizedName] || Zap;
          const isIcon = typeof Icon === "object";
          return (
            <li key={index} className="flex items-center gap-2 border-b py-2">
              {isIcon ? (
                <Icon size={25} color="#00C72E" />
              ) : (
                <img
                  className="size-4 rounded-md object-contain object-center"
                  src={`${window.location.origin}/${icon}`}
                  alt={name}
                  loading="lazy"
                  fetchPriority="low"
                />
              )}
              <span className="text-xs text-neutral-600">
                {capitalize(name)}
              </span>
              <span className="ml-auto text-sm font-bold">
                {values[0] || "N/A"}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CarSummary;
