/* eslint-disable @next/next/no-img-element */
import { useCars } from "@/hooks/useCars";
import { useFilter } from "@/hooks/useFilter";
import { carPaginationAtom } from "@/jotai/carsAtom";
import { useAtom } from "jotai";
import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { delay } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import Loader from "@/components/Loader";

const MakeFilter = () => {
  const [pagination, setPagination] = useAtom(carPaginationAtom);
  const {
    makes,
    refetchTypes,
    refetch: refetchFilters,
    refetchModels,
    refetchFeatures,
    isLoadingMakes,
    isRefetchingMakes,
  } = useFilter();
  const { refetch } = useCars();
  if (isRefetchingMakes || isLoadingMakes)
    return <Loader style={{}} className="h-40" />;

  if (!makes || !makes.length) return null;

  const handleFilterChange = async (name: string, values: string[]) => {
    setPagination((prev) => {
      const updatedDetails = prev.details.map((detail) =>
        detail.name === name ? { ...detail, values } : detail,
      );

      if (!updatedDetails.some((detail) => detail.name === name)) {
        updatedDetails.push({ name, values });
      }

      return { ...prev, details: updatedDetails };
    });
  };

  const toggleMakeFilter = async (make: string) => {
    const currentValues =
      pagination.details.find((detail) => detail.name === "make")?.values || [];
    const newValues = currentValues.includes(make)
      ? currentValues.filter((value) => value !== make)
      : [...currentValues, make];

    await handleFilterChange("make", newValues);
    await handleFilterChange("type", []);
    await handleFilterChange("model", []);
    await delay(10);
    await Promise.all([
      refetchModels(),
      refetchTypes(),
      refetchFilters(),
      refetchFeatures(),
      refetch(),
    ]);
  };

  const isMakeSelected = (makeName: string) => {
    return !!pagination.details
      ?.find((detail) => detail.name === "make")
      ?.values.includes(makeName);
  };

  return (
    <div className="relative mx-auto w-min max-w-full">
      <ScrollArea>
        <div className="flex h-full gap-4 px-4 py-2">
          {makes?.slice(0, 8).map((make) => (
            <button
              key={make.name}
              onClick={() => toggleMakeFilter(make.name)}
              className="group relative flex-shrink-0"
              aria-pressed={isMakeSelected(make.name)}
            >
              {isMakeSelected(make.name) && (
                <div
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#008559] via-[#0073e5] to-[#6842ff] opacity-75 blur-sm"
                  aria-hidden="true"
                />
              )}

              {/* Content container */}
              <div
                className={`relative flex h-full flex-col items-center justify-center gap-3 rounded-lg px-4 py-2 ${isMakeSelected(make.name) ? "bg-white/95" : "bg-white"} min-w-[120px] shadow-sm transition-colors duration-200 hover:bg-white/90 hover:shadow-md`}
              >
                {/* Icon container */}
                {make.icon && (
                  <div className="h-8 w-8 flex-shrink-0">
                    <img
                      src={`/${make.icon}`}
                      alt={`${make.name} logo`}
                      className="h-full w-full object-contain"
                      loading="lazy"
                      fetchPriority="low"
                    />
                  </div>
                )}

                {/* Text content */}
                <span className="flex items-center gap-2 whitespace-nowrap font-medium">
                  <Checkbox
                    key={`${make.name}-${Date.now()}`}
                    checked={isMakeSelected(make.name)}
                  />
                  <span>{make.name}</span>
                  <span className="ml-1 text-gray-500">
                    ({make.count || "0"})
                  </span>
                </span>
              </div>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default MakeFilter;
