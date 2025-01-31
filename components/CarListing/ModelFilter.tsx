/* eslint-disable @next/next/no-img-element */
import { useCars } from "@/hooks/useCars";
import { useFilter } from "@/hooks/useFilter";
import { carPaginationAtom } from "@/jotai/carsAtom";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Loader from "@/components/Loader";
import AOS from "aos";
import "aos/dist/aos.css"; //

const ModelFilter = () => {
  const [pagination, setPagination] = useAtom(carPaginationAtom);
  useEffect(() => {
    AOS.init({
      duration: 400, // Faster animation (400ms)
      delay: 0, // No global delay
      once: true, // Animate only once
      easing: "ease-out", // Smooth transition
      offset: 20, // Trigger animation earlier when just 20px in view
    });
  }, []);
  const { refetch } = useCars();
  const {
    models,
    refetch: refetchFilters,
    refetchMakes,
    refetchTypes,
    refetchFeatures,
    isLoadingModels,
    isRefetchingModels,
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

  const isModelSelected = (modelName: string) => {
    return !!pagination.details
      ?.find((detail) => detail.name === "model")
      ?.values.includes(modelName);
  };

  const handleModelClick = async (modelName: string) => {
    const currentValues =
      pagination.details.find((detail) => detail.name === "model")?.values ||
      [];
    const newValues = currentValues.includes(modelName)
      ? currentValues.filter((value) => value !== modelName)
      : [...currentValues, modelName];
    await handleFilterChange("model", newValues);
    await Promise.all([
      refetchTypes(),
      refetchFilters(),
      refetchFeatures(),
      refetchMakes(),
      refetch(),
    ]);
  };

  if (isRefetchingModels || isLoadingModels)
    return <Loader style={{}} className="h-40" />;

  if (!models || !models.length) return null;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-center text-lg font-semibold">Models</h3>
      <div className="flex h-full flex-wrap gap-4 rounded bg-lime-400/50 p-4">
        {models.map((model, index) => (
          <button
            key={model.name}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleModelClick(model.name);
            }}
            className="group relative flex-1 flex-shrink-0"
            data-aos="fade-up" // Add animation to each model button
            data-aos-delay={(index % 6) * 100}
          >
            {isModelSelected(model.name) && (
              <div className="absolute inset-0 h-full rounded-lg bg-gradient-to-r from-[#008559] via-[#0073e5] to-[#6842ff] opacity-75 blur-sm" />
            )}

            <div
              className={`relative flex h-full flex-col items-center gap-3 rounded-lg p-2 ${
                isModelSelected(model.name) ? "bg-white/95" : "bg-white"
              } justify-center shadow-sm transition-colors duration-200 hover:bg-white/90 hover:shadow-md`}
            >
              {/* Icon container */}
              {model.icon && (
                <div className="h-[4.5rem] w-36 flex-shrink-0">
                  <img
                    src={`/${model.icon}`}
                    alt={`${model.name} icon`}
                    className="h-full w-full object-contain"
                    loading="lazy"
                    fetchPriority="low"
                  />
                </div>
              )}

              {/* Text content */}
              <span className="flex items-center gap-2 whitespace-nowrap font-medium">
                <Checkbox
                  key={`${model.name}-${Date.now()}`}
                  checked={isModelSelected(model.name)}
                />
                <span>{model.name}</span>
                <span className="-ml-1 text-gray-500">
                  ({model.count || "0"})
                </span>
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModelFilter;
