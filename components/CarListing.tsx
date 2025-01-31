"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import InventoryCard from "@/components/InventoryCard";
import { useCars } from "@/hooks/useCars";
import CarPagination from "@/components/CarPagination";
import { delay, getPageTitle, throttle } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { carPaginationAtom } from "@/jotai/carsAtom";
import Loader from "@/components/Loader";
import MakeFilter from "@/components/CarListing/MakeFilter";
import TypeFilter from "@/components/CarListing/TypeFilter";
import InventoryFilter from "@/components/CarListing/InventoryFilter";
import ResultFilter from "@/components/CarListing/ResultFilter";
import ModelFilter from "@/components/CarListing/ModelFilter";
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
import AOS from "aos";
import "aos/dist/aos.css";

const CarListing = () => {
  const {
    cars,
    setCars,
    isLoading,
    isError,
    isRefetching,
    saveOrder: { mutate: saveOrder, isLoading: isPatching },
  } = useCars();
  const {
    isLoading: isFilterLoading,
    isRefetchingFeatures,
    isRefetchingMakes,
    isRefetchingModels,
    isRefetchingTypes,
    isRefetchingFilters,
  } = useFilter();
  const pagination = useAtomValue(carPaginationAtom);
  const { isAuthenticated } = useAuth();
  const [pageTitle, setPageTitle] = useState("");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const title = getPageTitle(window.location.pathname);
    setPageTitle(title);
  }, []);

  useEffect(() => {
    const handleScroll = throttle(async () => {
      if (
        isLoading ||
        isRefetching ||
        isFilterLoading ||
        isRefetchingFeatures ||
        isRefetchingMakes ||
        isRefetchingModels ||
        isRefetchingTypes ||
        isRefetchingFilters
      ) {
        return;
      }
      await delay(300);
      sessionStorage.setItem(
        "scrollPosition",
        JSON.stringify({
          ...JSON.parse(sessionStorage.getItem("scrollPosition") || "{}"),
          [window.location.pathname]: window.scrollY,
        }),
      );
    }, 300);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [
    isFilterLoading,
    isLoading,
    isRefetching,
    isRefetchingFeatures,
    isRefetchingFilters,
    isRefetchingMakes,
    isRefetchingModels,
    isRefetchingTypes,
  ]);

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

        const newCars = prevCars.filter(
          (car) => !selectedIds.includes(car._id),
        );

        const selectedCars = prevCars.filter((car) =>
          selectedIds.includes(car._id),
        );

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

  useEffect(() => {
    AOS.init({
      duration: 400, // Faster animation (400ms)
      delay: 0, // No global delay
      once: true, // Animate only once
      easing: "ease-out", // Smooth transition
      offset: 20, // Trigger animation earlier when just 20px in view
    });
  }, []);

  return (
    <div className="container-md-mx flex-1">
      <h2 className="mx-auto my-4 text-center text-2xl font-bold">
        {pageTitle}
      </h2>
      {cars && cars.length > 0 && (
        <>
          <div className="flex flex-col gap-3">
            <MakeFilter />
            <ModelFilter />
            <TypeFilter />
          </div>
          <InventoryFilter />
        </>
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
                    {cars.map((car, index) => (
                      <div
                        key={car._id}
                        data-aos="fade-up" // Use the fade-up animation
                        data-aos-delay={(index % 4) * 100} // Stagger animations with delay based on index
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
                        {selectedIds.map((id, index) => {
                          const car = cars.find((c) => c._id === id);
                          return car ? (
                            <div
                              key={id}
                              className="inventory-card relative w-48 opacity-80 shadow-lg"
                              data-aos="fade-up" // Use the fade-up animation
                              data-aos-delay={(index % 4) * 100} // Stagger animations with delay based on index
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
