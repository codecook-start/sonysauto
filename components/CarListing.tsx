"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import InventoryCard from "@/components/InventoryCard";
import { useCars } from "@/hooks/useCars";
import CarPagination from "@/components/CarPagination";
import { delay, getPageTitle } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { carPaginationAtom } from "@/jotai/carsAtom";
import Loader from "@/components/Loader";
import MakeFilter from "@/components/CarListing/MakeFilter";
import TypeFilter from "@/components/CarListing/TypeFilter";
import InventoryFilter from "@/components/CarListing/InventoryFilter";
import ResultFilter from "@/components/CarListing/ResultFilter";
import ModelFilter from "@/components/CarListing/ModelFilter";
import { useFilter } from "@/hooks/useFilter";

const CarListing = () => {
  const { cars, isLoading, isError, isRefetching } = useCars();
  const {
    isLoading: isFilterLoading,
    isRefetchingFeatures,
    isRefetchingMakes,
    isRefetchingModels,
    isRefetchingTypes,
    isRefetchingFilters,
  } = useFilter();
  const pagination = useAtomValue(carPaginationAtom);
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    const title = getPageTitle(window.location.pathname);
    setPageTitle(title);
  }, []);

  useEffect(() => {
    const handleScroll = async () => {
      await delay(300);
      sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isFilterActive = pagination.details.some(
    (detail) => detail.values.length > 0,
  );
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
          <div className="flex flex-1 flex-col items-center justify-center gap-4 md:flex-row md:items-center">
            {!isLoading && !isRefetching && (
              <h3 className="text-lg font-semibold">
                {pagination.totalItems || cars.length || 0}
                {isFilterActive && " Matching"} Cars Found
              </h3>
            )}
            {/* {!isLoading && (
              <div className="reset">
                <Button
                  onClick={handleReset}
                  className="rounded bg-blue-600 px-16 text-xs"
                >
                  Reset
                </Button>
              </div>
            )} */}
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
              cars.map((car) => <InventoryCard key={car._id} car={car} />)
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
