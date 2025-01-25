/* eslint-disable @next/next/no-img-element */
import { useCars } from "@/hooks/useCars";
import { useFilter } from "@/hooks/useFilter";
import { carPaginationAtom } from "@/jotai/carsAtom";
import { Checkbox } from "@/components/ui/checkbox";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import Loader from "@/components/Loader";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles

const TypeFilter = () => {
  const [pagination, setPagination] = useAtom(carPaginationAtom);
  const { refetch } = useCars();

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000, // Animation duration
      easing: "ease-in-out", // Easing for the animations
      once: true, // Run animation only once
    });
  }, []);
  const {
    types,
    refetch: refetchFilters,
    refetchFeatures,
    refetchMakes,
    refetchModels,
    isLoadingTypes,
    isRefetchingTypes,
  } = useFilter();

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

  const isTypeSelected = (typeName: string) => {
    return !!pagination.details
      ?.find((detail) => detail.name === "type")
      ?.values.includes(typeName);
  };

  const handleTypeClick = async (typeName: string) => {
    const currentValues =
      pagination.details.find((detail) => detail.name === "type")?.values || [];
    const newValues = currentValues.includes(typeName)
      ? currentValues.filter((value) => value !== typeName)
      : [...currentValues, typeName];

    await handleFilterChange("type", newValues);
    await Promise.all([
      refetchFilters(),
      refetchFeatures(),
      refetchMakes(),
      refetchModels(),
      refetch(),
    ]);
  };

  if (isRefetchingTypes || isLoadingTypes)
    return <Loader style={{}} className="h-40" />;

  if (!types || !types.length) return null;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-center text-lg font-semibold">Body Type</h3>
      <div className="flex h-full flex-wrap gap-4 rounded bg-orange-400/50 p-4">
        {types.map((type) => (
          <button
            key={type.name}
            onClick={() => handleTypeClick(type.name)}
            className="group relative flex-1 flex-shrink-0"
            data-aos="fade-up" // Add AOS animation
          >
            {isTypeSelected(type.name) && (
              <div className="absolute inset-0 h-full rounded-lg bg-gradient-to-r from-[#008559] via-[#0073e5] to-[#6842ff] opacity-75 blur-sm" />
            )}

            <div
              className={`relative flex h-full flex-col items-center justify-center gap-3 rounded-lg p-2 ${
                isTypeSelected(type.name) ? "bg-white/95" : "bg-white"
              } shadow-sm transition-colors duration-200 hover:bg-white/90 hover:shadow-md`}
            >
              {/* Icon container */}
              {type.icon && (
                <div className="h-[4.5rem] w-36 flex-shrink-0">
                  <img
                    src={`/${type.icon}`}
                    alt={`${type.name} icon`}
                    className="h-full w-full object-contain"
                    loading="lazy"
                    fetchPriority="low"
                  />
                </div>
              )}

              {/* Text content */}
              <span className="flex items-center gap-2 whitespace-nowrap font-medium">
                <Checkbox
                  key={`${type.name}-${Date.now()}`}
                  checked={isTypeSelected(type.name)}
                />
                <span>{type.name}</span>
                <span className="-ml-1 text-gray-500">
                  ({type.count || "0"})
                </span>
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TypeFilter;
