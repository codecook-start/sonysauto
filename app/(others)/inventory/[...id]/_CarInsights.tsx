/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { carDetailMap } from "@/data";
import { carAtom } from "@/jotai/carAtom";
import { useAtomValue } from "jotai";
import { Zap } from "lucide-react";
import React from "react";

const CarInsights = () => {
  const car = useAtomValue(carAtom);
  const insights = ((car?.details || []) as any[])
    .filter(({ detail }) => !!detail)
    .slice(0, 6)
    .map((detail: any) => ({
      name: detail.detail.name,
      values: [detail.option?.name],
      icon:
        (detail.detail as any).icon ||
        carDetailMap[detail.detail.name as keyof typeof carDetailMap],
    }));
  return (
    <div className="bg-black">
      <ul className="container-md-mx grid grid-cols-3 gap-4 py-8 md:grid-cols-6">
        {insights.map(({ name, values, icon }, index) => {
          let Icon = icon;
          if (!Icon) Icon = Zap;
          const isIcon = typeof Icon === "object";
          return (
            <li
              key={index}
              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl bg-blue-600 p-4 text-white"
            >
              {isIcon ? (
                <Icon size={"2em"} />
              ) : (
                <img
                  className="h-8 w-8 rounded-full object-cover object-center"
                  src={`${window.location.origin}/${icon}`}
                  alt={name}
                  loading="lazy"
                  fetchPriority="low"
                />
              )}
              <div className="flex flex-col text-center">
                <span className="text-xs capitalize">{name}:</span>
                <span className="font-bold">{values[0] || "N/A"}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CarInsights;
