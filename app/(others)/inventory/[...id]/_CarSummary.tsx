/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { carDetailMap } from "@/data";
import { carAtom } from "@/jotai/carAtom";
import { capitalize } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { Zap } from "lucide-react";
import React from "react";

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
          let Icon = icon;
          if (!Icon) Icon = Zap;
          const isIcon = typeof Icon === "object";
          return (
            <li key={index} className="flex items-center gap-2 border-b py-4">
              {isIcon ? (
                <Icon size={"1em"} color="green" />
              ) : (
                <img
                  className="h-8 w-8 rounded-md object-contain object-center"
                  src={`${window.location.origin}/${icon}`}
                  alt={name}
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
