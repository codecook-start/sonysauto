"use client";

import { Layers, X, Check } from "lucide-react";
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

export const TypeFilterIcon = () => {
  const [open, setOpen] = useState(false);
  const [pagination, setPagination] = useAtom(carPaginationAtom);
  const {
    types,
    refetch: refetchFilters,
    refetchFeatures,
    refetchMakes,
    refetchModels,
    isLoadingTypes,
    isRefetchingTypes,
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

  const isTypeSelected = (typeName: string) => {
    return !!pagination.details
      ?.find(detail => detail.name === "type")
      ?.values.includes(typeName);
  };

  const hasSelectedTypes = () => {
    const typeFilters = pagination.details.find(d => d.name === "type");
    return typeFilters && typeFilters.values.length > 0;
  };

  const handleTypeClick = async (typeName: string) => {
    const currentValues = 
      pagination.details.find(d => d.name === "type")?.values || [];
    const newValues = currentValues.includes(typeName)
      ? currentValues.filter(v => v !== typeName)
      : [...currentValues, typeName];

    await handleFilterChange("type", newValues);
    await Promise.all([
      refetchFilters(),
      refetchFeatures(),
      refetchMakes(),
      refetchModels(),
      refetch()
    ]);
  };

  return (
    <>
      <div className="relative group h-9">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-white hover:bg-gray-700/50 hover:text-white rounded-none absolute right-0"
          onClick={() => setOpen(true)}
          title="Body Type"
        >
          <Layers className="h-4 w-4" />
        </Button>

        <div className="absolute right-9 top-0 h-full overflow-hidden">
          <div className="h-full flex items-center bg-gray-700/50 px-3 whitespace-nowrap transform transition-all duration-300 ease-out translate-x-full group-hover:translate-x-0">
            <span className="text-sm font-bold text-white">Body Type</span>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] flex flex-col w-[90vw] max-w-[1200px] p-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <DialogHeader className="px-6 pt-6 pb-4">
              <DialogTitle className="flex items-center justify-between text-lg">
                Body Type
                <button 
                  onClick={() => setOpen(false)}
                  className="rounded-full p-1 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </DialogTitle>
            </DialogHeader>
            <div className="px-6 pb-4">
              {(isRefetchingTypes || isLoadingTypes) ? (
                <Loader className="h-40" />
              ) : (
                <div className="grid grid-cols-6 gap-4">
                  {types?.map((type) => (
                    <button
                      key={type.name}
                      onClick={() => handleTypeClick(type.name)}
                      className={`group relative flex flex-col items-center rounded-lg border-2 p-3 transition-all ${
                        isTypeSelected(type.name)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      {type.icon && (
                        <div className="mb-2 h-16 w-full">
                          <img
                            src={`/${type.icon}`}
                            alt={type.name}
                            className="h-full w-full object-contain object-center"
                          />
                        </div>
                      )}
                      <div className="flex w-full items-center justify-center gap-2">
                        {isTypeSelected(type.name) ? (
                          <Check className="h-4 w-4 text-blue-600" />
                        ) : (
                          <div className="h-4 w-4 rounded border border-gray-300" />
                        )}
                        <span className="text-sm font-medium">{type.name}</span>
                      </div>
                      <span className="mt-1 text-xs text-gray-500">
                        {type.count} available
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Continue button */}
          <div className={`sticky bottom-0 bg-background px-6 py-4 border-t transition-opacity ${
            hasSelectedTypes() ? 'opacity-100' : 'opacity-0 h-0 py-0 overflow-hidden'
          }`}>
            <div className="flex justify-end">
              <Button 
                onClick={() => setOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};