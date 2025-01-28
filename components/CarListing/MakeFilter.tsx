/* eslint-disable @next/next/no-img-element */
import { useCars } from "@/hooks/useCars";
import { useFilter } from "@/hooks/useFilter";
import { carPaginationAtom } from "@/jotai/carsAtom";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { delay } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import Loader from "@/components/Loader";
import AOS from "aos";
import "aos/dist/aos.css";

const MakeFilter = () => {
  useEffect(() => {
    AOS.init({
      duration: 600, // Animation duration (0.6 seconds)
      delay: 100, // Initial delay for the first item
      once: true, // Trigger animation only once
      easing: "ease-out", // Easing function
      offset: 200, // Trigger when the element is 200px away from the viewport
    });
  }, []);
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
    <div className="relative mx-auto w-full">
      <div className="grid grid-cols-1 gap-4 overflow-x-auto px-4 py-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {makes?.slice(0, 8).map((make, index) => (
          <button
            key={make.name}
            onClick={() => toggleMakeFilter(make.name)}
            className="group relative flex-shrink-0"
            aria-pressed={isMakeSelected(make.name)}
            data-aos="fade-up" // Apply AOS fade-up animation
            data-aos-delay={index * 150} // Staggered delay based on index
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
    </div>
  );
};

export default MakeFilter;
