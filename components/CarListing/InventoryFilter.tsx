import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCars } from "@/hooks/useCars";
import { useFilter } from "@/hooks/useFilter";
import { carPaginationAtom } from "@/jotai/carsAtom";
import { lastFilterAtom } from "@/jotai/filtersAtom";
import { capitalize, delay } from "@/lib/utils";
import { useAtom, useSetAtom } from "jotai";
// import { Slider } from "@/components/ui/slider";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import SortSelect from "./SortSelect";
import AOS from "aos";
import "aos/dist/aos.css";

const InventoryFilter = () => {
  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out" });
  }, []);
  const { cars, refetch, isLoading } = useCars();
  const {
    filters,
    refetch: refetchFilters,
    refetchMakes,
    refetchTypes,
    resetAll,
  } = useFilter();
  const [pagination, setPagination] = useAtom(carPaginationAtom);
  const setLastFilter = useSetAtom(lastFilterAtom);

  if (!cars || cars.length === 0 || !filters || !filters.length) return null;

  // const formatPrice = (price: number) => {
  //   if (!Number.isFinite(price)) return "∞";
  //   return new Intl.NumberFormat("en-US", {
  //     maximumFractionDigits: 0,
  //   }).format(price);
  // };

  const handleFilterChange = async (name: string, values: string[]) => {
    setPagination((prev) => {
      const details = prev.details;
      const index = details.findIndex((detail) => detail.name === name);
      if (index === -1) {
        details.push({ name, values });
      } else {
        details[index].values = values;
      }
      return { ...prev, details };
    });
    await delay(500);
    await Promise.all([refetch(), refetchFilters(), refetchMakes()]);
  };

  const handleFilterFeatureChange = async (names: string[]) => {
    setPagination((prev) => ({
      ...prev,
      selectedFeatures: names.map((name) => ({ name })),
    }));
    await delay(500);
    await Promise.all([
      refetch(),
      refetchFilters(),
      refetchMakes(),
      refetchTypes(),
    ]);
  };

  // const handleSortChange = async (name: string, order: string) => {
  //   setPagination((prev) => ({ ...prev, sortBy: { name, order } }));
  //   await delay(500);
  //   await refetch();
  // };

  const handleSortChange = async (value: string) => {
    const [name, order] = value.split("-");
    setPagination((prev) => ({
      ...prev,
      sortBy: { name, order },
    }));
    await delay(500);
    await refetch();
  };

  // const handlePriceRangeChange = (values: [number, number]) => {
  //   setPagination((prev) => ({
  //     ...prev,
  //     minPrice: values[0],
  //     maxPrice: values[1],
  //   }));
  // };

  // const handlePriceRangeApply = async () => {
  //   await refetch();
  //   await refetchFilters();
  //   await refetchMakes();
  // };

  const handlePerPageChange = async (value: string) => {
    setPagination((prev) => ({ ...prev, limit: +value }));
    await delay(10);
    await refetch();
  };

  // const currentMinPrice =
  //   pagination.minPrice || pagination.priceRange?.min || 0;
  // const currentMaxPrice =
  //   pagination.maxPrice || pagination.priceRange?.max || Infinity;

  return (
    <div className="my-3 flex flex-col gap-4" data-aos="fade-up">
      <h3 className="text-center text-lg font-semibold" data-aos="fade-down">
        Refine Search Results
      </h3>
      <div
        className="my-8 mt-0 grid grid-cols-2 items-center gap-4 rounded bg-sky-400/50 p-4 lg:grid-cols-5"
        data-aos="zoom-in"
      >
        {filters
          ?.filter((filter) => filter.name.toLowerCase() !== "model")
          .map((filter) => (
            <div key={filter.name} className="filter" data-aos="fade-right">
              <MultiSelect
                options={filter.values.map(({ name, count }) => ({
                  label: name,
                  value: name,
                  count,
                }))}
                onValueChange={(value) => {
                  setLastFilter(filter);
                  handleFilterChange(filter.name, value);
                }}
                value={
                  pagination.details.find(
                    (detail) => detail.name === filter.name,
                  )?.values || []
                }
                placeholder={capitalize(filter?.name || "")}
                maxCount={1}
                className="hover:bg-white"
              />
            </div>
          ))}
        <div className="features" data-aos="fade-left">
          <MultiSelect
            options={(pagination.features || []).map(({ name, count }) => ({
              label: name,
              value: name,
              count,
            }))}
            onValueChange={handleFilterFeatureChange}
            value={pagination.selectedFeatures?.map((feature) => feature.name)}
            placeholder="Features"
            maxCount={1}
            className="hover:bg-white"
          />
        </div>
        {/* Sorting */}
        <div className="sorting" data-aos="fade-right">
          <SortSelect onValueChange={handleSortChange} />
        </div>
        {/* Per Page */}
        <div className="items-per-page" data-aos="fade-left">
          <Select
            value={pagination.limit.toString()}
            onValueChange={handlePerPageChange}
          >
            <SelectTrigger className="text-xs focus:ring-0">
              <SelectValue>Per page</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="32">32</SelectItem>
              <SelectItem value="40">40</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {!isLoading && (
          <div className="reset" data-aos="flip-up">
            <Button
              onClick={resetAll}
              className="w-full rounded bg-blue-600 text-xs"
            >
              Reset
            </Button>
          </div>
        )}
        {/* Price Range Slider */}
        {/* <div className="col-span-2 space-y-2">
          <div className="flex justify-between text-sm">
            <div className="font-medium">Price Range:</div>
            <div className="text-blue-600">
              {formatPrice(currentMinPrice)} - {formatPrice(currentMaxPrice)}
            </div>
          </div>
          <Slider
            min={pagination.priceRange?.min || 0}
            max={pagination.priceRange?.max || Infinity}
            value={[currentMinPrice, currentMaxPrice] as [number, number]}
            onValueChange={handlePriceRangeChange}
            onValueCommit={handlePriceRangeApply}
            className="w-full"
            rangeColor="bg-gray-800"
            step={1000}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatPrice(pagination.priceRange?.min || 0)}</span>
            <span>{formatPrice(pagination.priceRange?.max || Infinity)}</span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default InventoryFilter;
