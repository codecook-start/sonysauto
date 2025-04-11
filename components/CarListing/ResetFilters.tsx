"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useSetAtom } from "jotai";
import { carPaginationAtom } from "@/jotai/carsAtom";
import { useFilter } from "@/hooks/useFilter";
import { useCars } from "@/hooks/useCars";
import { delay } from "@/lib/utils";
import { useCallback, useState } from "react";

export const ResetFilters = ({ disabled }: { disabled?: boolean }) => {
  const setPagination = useSetAtom(carPaginationAtom);
  const { refetch: refetchFilter, refetchMakes, refetchModels, refetchTypes } = useFilter();
  const { refetch: refetchCars } = useCars();
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = useCallback(async () => {
    setIsResetting(true);
    try {
      // Reset to default state while maintaining valid structure
      setPagination(prev => ({
        ...prev,
        details: [{ name: "make", values: [] }], // Keeps filter structure intact
        selectedFeatures: [],
        sortBy: undefined,
        minPrice: undefined,
        maxPrice: undefined
      }));

      await delay(300); // Gives UI time to update
      
      await Promise.allSettled([
        refetchCars(),
        refetchFilter(),
        refetchMakes(),
        refetchModels(),
        refetchTypes()
      ]);

      console.log("All filters reset successfully");
    } catch (error) {
      console.error("Error during reset:", error);
    } finally {
      setIsResetting(false);
    }
  }, [setPagination, refetchCars, refetchFilter, refetchMakes, refetchModels, refetchTypes]);

  return (
    <Button
      variant="ghost"
    size="icon"
    className="h-9 w-9 text-white hover:bg-gray-700/50 hover:text-white rounded-none"
      onClick={handleReset}
      disabled={disabled || isResetting}
      title="Reset all filters"
    >
      {isResetting ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <RotateCcw className="h-4 w-4" />
      )}
    </Button>
  );
};