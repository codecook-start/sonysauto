"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import InventoryCard from "@/components/InventoryCard";
import { useCars } from "@/hooks/useCars";
import CarPagination from "@/components/CarPagination";
import { getPageTitle } from "@/lib/utils";
import { useAtom } from "jotai";
import { carPaginationAtom } from "@/jotai/carsAtom";
import Loader from "@/components/Loader";
//import MakeFilter from "@/components/CarListing/MakeFilter";
import { MakeFilterIcon } from "@/components/CarListing/MakeFilterIcon";
//import TypeFilter from "@/components/CarListing/TypeFilter";
import { TypeFilterIcon } from "@/components/CarListing/TypeFilterIcon";
import ResultFilter from "@/components/CarListing/ResultFilter";
//import ModelFilter from "@/components/CarListing/ModelFilter";
import { ModelFilterIcon } from "@/components/CarListing/ModelFilterIcon";
import { PriceSort } from "@/components/CarListing/PriceSort";
import { YearSort } from "@/components/CarListing/YearSort";
import { MileageSort } from "@/components/CarListing/MileageSort";
import { SizeSort } from "@/components/CarListing/SizeSort";
import { WeightSort } from "@/components/CarListing/WeightSort";
import { FeaturesFilter } from "@/components/CarListing/FeaturesFilter";
import { PerPageFilter } from "@/components/CarListing/PerPageFilter";
import { ResetFilters } from "@/components/CarListing/ResetFilters";
import { useFilter } from "@/hooks/useFilter";
import {
  closestCenter,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import useAuth from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { Save } from "lucide-react";
//import AOS from "aos";
//import "aos/dist/aos.css";

const CarListing = () => {
  const {
    cars,
    setCars,
    isLoading,
    isError,
    isRefetching,
    saveOrder: { mutate: saveOrder, isLoading: isPatching },
    refetch: refetchCars, // Added refetch from useCars
  } = useCars();
  const {
    isLoading: isFilterLoading,
    isRefetchingFeatures,
    isRefetchingMakes,
    isRefetchingModels,
    isRefetchingTypes,
    isRefetchingFilters,
    refetch: refetchFilter, // Added refetch from useFilter
    refetchMakes,
    refetchTypes,
  } = useFilter();
  const [pagination, setPagination] = useAtom(carPaginationAtom); // Changed to useAtom
  const { isAuthenticated } = useAuth();
  const [pageTitle, setPageTitle] = useState("");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const title = getPageTitle(window.location.pathname);
    setPageTitle(title);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    return () => {
      if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);
  
  useEffect(() => {
  if (resetKey > 0) { // Only run after first reset
    refetchCars();
    refetchFilter();
  }
}, [resetKey, refetchCars, refetchFilter]);

  const isFilterActive = pagination.details.some(
    (detail) => detail.values.length > 0,
  );

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (!active) return;
    const id = String(active.id);
    setActiveId(id);
    if (!selectedIds.includes(id)) {
      setSelectedIds([id]);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCars((prevCars) => {
        const overIndex = prevCars.findIndex((car) => car._id === over.id);
        const newCars = prevCars.filter((car) => !selectedIds.includes(car._id));
        const selectedCars = prevCars.filter((car) => selectedIds.includes(car._id));
        newCars.splice(overIndex, 0, ...selectedCars);
        return newCars;
      });
    }
    setActiveId(null);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      return prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id];
    });
  };

  const handleSortChange = async (value: string) => {
    const [name, order] = value.split("-");
    setPagination((prev) => ({
      ...prev,
      sortBy: { name, order },
    }));
    await delay(500);
    await refetchCars();
  };

  const handleFilterFeatureChange = async (names: string[]) => {
    setPagination((prev) => ({
      ...prev,
      selectedFeatures: names.map((name) => ({ name })),
    }));
    await delay(500);
    await Promise.all([
      refetchCars(),
      refetchFilter(),
      refetchMakes(),
      refetchTypes(),
    ]);
  };

  const handlePerPageChange = async (value: string) => {
    setPagination((prev) => ({ ...prev, limit: +value }));
    await delay(10);
    await refetchCars();
  };

/*
  const resetAll = async () => {
    setPagination((prev) => ({
      ...prev,
      details: [],
      selectedFeatures: [],
      sortBy: undefined,
    }));
    await Promise.all([refetchCars(), refetchFilter()]);
  };
*/
/*
  useEffect(() => {
    AOS.init({
      duration: 400,
      delay: 0,
      once: true,
      easing: "ease-out",
      offset: 0,
      debounceDelay: 50,
      throttleDelay: 99,
      disable: typeof window !== 'undefined' && window.innerWidth < 768
    });
    const timer = setTimeout(() => AOS.refresh(), 1000);
    return () => clearTimeout(timer);
  }, []);
*/
  return (
    <div className="container-md-mx flex-1">
      <h2 className="mx-auto my-4 text-center text-2xl font-bold">
        {pageTitle}
      </h2>
      {cars && cars.length > 0 && (
		  <div className="flex flex-col gap-3">
			
		  </div>
		)}

      {/* New filter sidebar */}
{cars && cars.length > 0 && (
  <div className="fixed right-0 top-1/2 z-20 flex -translate-y-1/2 transform flex-col max-md:bottom-0 max-md:left-0 max-md:top-auto max-md:right-auto max-md:translate-y-0 max-md:flex-row">
    <div className="flex flex-col divide-y divide-white/20 rounded-l-lg bg-gray-800/80 shadow-lg backdrop-blur-sm max-md:flex-row max-md:divide-x max-md:divide-y-0 max-md:rounded-t-lg max-md:rounded-l-none">
      <MakeFilterIcon key={`make-${resetKey}`} />
      <ModelFilterIcon key={`model-${resetKey}`} />
      <TypeFilterIcon key={`type-${resetKey}`} />
      <PriceSort key={`price-${resetKey}`} onValueChange={handleSortChange} />
      <YearSort key={`year-${resetKey}`} onValueChange={handleSortChange} />
      <MileageSort key={`mileage-${resetKey}`} onValueChange={handleSortChange} />
      <SizeSort key={`size-${resetKey}`} onValueChange={handleSortChange} />
      <WeightSort key={`weight-${resetKey}`} onValueChange={handleSortChange} />
      <FeaturesFilter
        key={`features-${resetKey}`}
        features={pagination.features || []}
        selectedFeatures={pagination.selectedFeatures?.map(f => f.name) || []}
        onValueChange={handleFilterFeatureChange}
      />
      <PerPageFilter
        key={`perpage-${resetKey}`}
        limit={pagination.limit}
        onValueChange={handlePerPageChange}
      />
      <ResetFilters 
        key={`reset-${resetKey}`}
        disabled={isLoading}
        onBeforeReset={() => {
          setResetKey(prev => prev + 1);
          setPagination(prev => ({
            ...prev,
            details: [],
            selectedFeatures: [],
            sortBy: undefined,
            minPrice: undefined,
            maxPrice: undefined
          }));
        }}
      />
    </div>
  </div>
)}

      {/* inventory */}
      <div className="mb-8 space-y-8">
        {/* header */}
        <div className="flex flex-col">
          <div className="relative flex flex-1 flex-col items-center justify-center gap-4 md:flex-row md:items-center">
            {!isLoading && !isRefetching && (
              <>
                <h3 className="text-lg font-semibold">
                  {pagination.totalItems || cars.length || 0}
                  {isFilterActive && " Matching"} Cars Found
                </h3>
                {isAuthenticated && cars && cars.length > 0 && (
                  <Button
                    title="Save Order"
                    variant="ghost"
                    disabled={isPatching}
                    className="fixed inset-4 left-auto top-auto z-10 flex transform items-center gap-2 bg-gray-50 text-gray-600 shadow hover:bg-gray-200 hover:text-gray-800"
                    onClick={saveOrder}
                  >
                    {isPatching ? (
                      <Loader
                        className="h-auto animate-spin text-gray-500"
                        size="1.25em"
                        style={{}}
                      />
                    ) : (
                      <Save size="1.25em" className="cursor-pointer" />
                    )}
                    <span className="text-sm font-medium">Save Order</span>
                  </Button>
                )}
              </>
            )}
          </div>
          {/* results */}
          <ResultFilter />
        </div>

        {/* content */}
        {(!cars.length && isLoading) ||
        isRefetching ||
        isFilterLoading ||
        isRefetchingFeatures ||
        isRefetchingMakes ||
        isRefetchingModels ||
        isRefetchingTypes ||
        isRefetchingFilters ? (
          <div
            className="flex h-96 items-center justify-center"
            style={{ minHeight: "calc(40vh)" }}
          >
            <Loader />
          </div>
        ) : (
          isError && (
            <div
              className="flex h-96 items-center justify-center"
              style={{ minHeight: "calc(100vh - 4rem)" }}
            >
              Error fetching car data
            </div>
          )
        )}
        {cars && cars.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {/* inventory card */}
            {!!cars?.length ? (
              <>
                <DndContext
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={cars.map((field) => field._id)}
                    strategy={rectSortingStrategy}
                  >
                    {cars.map((car) => (
                      <div
                        key={car._id}
                        className="inventory-card"
                      >
                        <InventoryCard
                          key={car._id}
                          car={car}
                          onSelect={toggleSelection}
                          isDragging={activeId === car._id}
                          isSelected={selectedIds.includes(car._id)}
                        />
                      </div>
                    ))}
                  </SortableContext>
                  <DragOverlay dropAnimation={dropAnimation}>
                    {activeId ? (
                      <div className="flex gap-2">
                        {selectedIds.map((id) => {
                          const car = cars.find((c) => c._id === id);
                          return car ? (
                            <div
                              key={id}
                              className="inventory-card relative w-48 opacity-80 shadow-lg"
                            >
                              <InventoryCard
                                car={car}
                                onSelect={() => {}}
                                isDragging={true}
                                isSelected={true}
                              />
                            </div>
                          ) : null;
                        })}
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </>
            ) : (
              <div className="col-span-1 flex h-96 items-center justify-center sm:col-span-2 lg:col-span-4">
                No cars found
              </div>
            )}
          </div>
        )}

        <CarPagination />
      </div>
    </div>
  );
};

export default CarListing;