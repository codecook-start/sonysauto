"use client";

import { Factory, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useAtom } from "jotai";
import { carPaginationAtom } from "@/jotai/carsAtom";
import { useFilter } from "@/hooks/useFilter";
import { useCars } from "@/hooks/useCars";
import { delay } from "@/lib/utils";
import Loader from "@/components/Loader";
import Image from "next/image";

export const MakeFilterIcon = () => {
  const [open, setOpen] = useState(false);
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

  const handleFilterChange = async (name: string, values: string[]) => {
    setPagination(prev => {
      const updatedDetails = prev.details.map(detail =>
        detail.name === name ? { ...detail, values } : detail
      );

      if (!updatedDetails.some(detail => detail.name === name)) {
        updatedDetails.push({ name, values });
      }

      return { ...prev, details: updatedDetails };
    });
  };

  const toggleMakeFilter = async (make: string) => {
    const currentValues = 
      pagination.details.find(d => d.name === "make")?.values || [];
    const newValues = currentValues.includes(make)
      ? currentValues.filter(v => v !== make)
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
      refetch()
    ]);
  };

  const isMakeSelected = (makeName: string) => {
    return !!pagination.details
      ?.find(detail => detail.name === "make")
      ?.values.includes(makeName);
  };

  // Check if any make is selected
  const hasSelectedMakes = () => {
    const makeFilters = pagination.details.find(d => d.name === "make");
    return makeFilters && makeFilters.values.length > 0;
  };

  return (
    <>
      <div className="relative group h-9">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-white hover:bg-gray-700/50 hover:text-white rounded-none absolute right-0" // Force white on hover
          onClick={() => setOpen(true)}
          title="Make"
        >
          <Factory className="h-4 w-4" />
        </Button>
        {/* Sliding label with bold white text */}
        <div className="absolute right-9 top-0 h-full overflow-hidden">
          <div className="h-full flex items-center bg-gray-700/50 px-3 whitespace-nowrap transform transition-all duration-300 ease-out translate-x-full group-hover:translate-x-0">
            <span className="text-sm font-bold text-white">Make</span>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto w-[90vw] max-w-[1200px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-lg">
              Make
              <button 
                onClick={() => setOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {(isRefetchingMakes || isLoadingMakes) ? (
              <Loader style={{}} className="h-40" />
            ) : (
              <>
                <div className="grid grid-cols-6 gap-4">
                  {makes?.map((make) => (
                    <button
                      key={make.name}
                      onClick={() => toggleMakeFilter(make.name)}
                      className={`group relative flex flex-col items-center rounded-lg border-2 p-3 transition-all ${
                        isMakeSelected(make.name)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      {/* Make icon/image */}
                      {make.icon && (
                        <div className="mb-2 h-16 w-full relative">
                          <Image
                            src={`/${make.icon}`}
                            alt={make.name}
                            fill
                            className="object-contain object-center"
                          />
                        </div>
                      )}

                      {/* Checkmark and name inline */}
                      <div className="flex w-full items-center justify-center gap-2">
                        {isMakeSelected(make.name) ? (
                          <Check className="h-4 w-4 text-blue-600" />
                        ) : (
                          <div className="h-4 w-4 rounded border border-gray-300" />
                        )}
                        <span className="text-sm font-medium">{make.name}</span>
                      </div>

                      {/* Count */}
                      <span className="mt-1 text-xs text-gray-500">
                        {make.count} available
                      </span>
                    </button>
                  ))}
                </div>
                {/* Continue button that appears when at least one make is selected */}
                {hasSelectedMakes() && (
                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={() => setOpen(false)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Continue
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};