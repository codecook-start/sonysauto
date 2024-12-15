/* eslint-disable @next/next/no-img-element */
import { carAtom } from "@/jotai/carAtom";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { Check } from "lucide-react";
import React from "react";

const CarFeatures = () => {
  const car = useAtomValue(carAtom);
  const carFeatures = car?.features || [];
  return (
    <div className="container-md-mx grid gap-4 md:grid-cols-4">
      <h3 className="font-[family-name:var(--font-harkshock)] text-4xl font-bold">
        Features
      </h3>
      <ul className="col-span-3 grid grid-cols-2 gap-4 md:grid-cols-4">
        {carFeatures.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <span
              className={cn(
                !feature.icon && "aspect-square rounded-full bg-green-500 p-1",
              )}
            >
              {!feature.icon ? (
                <Check size={"0.75em"} color="white" />
              ) : (
                <img
                  src={"/" + feature.icon}
                  className="size-5 object-cover"
                  alt={feature.name}
                />
              )}
            </span>
            <span className="text-xs font-semibold">{feature.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CarFeatures;
