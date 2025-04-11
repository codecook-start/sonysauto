import { useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import { useAtom } from "jotai";
import { carPaginationAtom, carsAtom } from "@/jotai/carsAtom";
import { CarResponse } from "@/types/edit-car";
import { usePathname, useRouter } from "next/navigation";
import { titleMap } from "@/data";
import { CarPagination } from "@/types/car";
import { delay } from "@/lib/utils";
import useCarOrdering from "./useCarOrdering";

export const useCars = () => {
  const [cars, setCars] = useAtom(carsAtom);
  const [pagination, setPagination] = useAtom(carPaginationAtom);
  const router = useRouter();
  const pathname = usePathname();
  const {
    patchOrdering: { mutate: patchOrdering, isLoading: isPatching },
  } = useCarOrdering();

  const fetchCars = async () => {
    let url = `/api/car?page=${pagination.page}&limit=${pagination.limit}`;
    
    if (pagination.details.length > 0) {
      const details = pagination.details
        .map((detail) => `${detail.name}:${detail.values.join(",")}`)
        .join(";");
      url += `&details=${details}`;
    }
    
    if (pagination.selectedFeatures && pagination.selectedFeatures.length > 0) {
      const selectedFeatures = pagination.selectedFeatures
        .map((feature) => feature.name)
        .join(",");
      url += `&features=${selectedFeatures}`;
    }
    
    if (pagination.sortBy) {
      url += `&sortBy=${pagination.sortBy.name}:${pagination.sortBy.order}`;
    }
    
    if (pagination.search) {
      url += `&search=${pagination.search}`;
    }
    
    if (pagination.minPrice) {
      url += `&minPrice=${pagination.minPrice}`;
    }
    
    if (pagination.maxPrice) {
      url += `&maxPrice=${pagination.maxPrice}`;
    }

    const { data } = await axios.get(url, {
      headers: {
        "Cache-Control": "no-cache",
        cache: "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return data;
  };

  const { isLoading, isError, refetch, ...rest } = useQuery<
    {
      data: CarResponse[];
      pagination: CarPagination & { currentPage: number };
    },
    AxiosError<{
      message: string;
    }>
  >(["cars", pathname], fetchCars, {
    refetchInterval: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    cacheTime: 0,
    staleTime: 0,
    onSuccess: async (response) => {
      // Always replace with fresh data for current page
      setCars(response.data);

      setPagination((prev) => ({
        ...prev,
        totalPages: response.pagination.totalPages,
        totalItems: response.pagination.totalItems,
        // page: response.pagination.currentPage,
        priceRange: response.pagination.priceRange,
      }));

      // Scroll to top on page change
      window.scrollTo(0, 0);
    },
    enabled:
      pathname.includes("/inventory") ||
      Object.keys(titleMap).includes(pathname),
  });

  const loadNext = async () => {
    if (pagination.page < pagination.totalPages) {
      setCars([]); // Clear current cars while loading
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
      await refetch();
      router.refresh();
    }
  };

  const loadPrev = async () => {
    if (pagination.page > 1) {
      setCars([]); // Clear current cars while loading
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
      await refetch();
      router.refresh();
    }
  };

  const setPage = async (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setCars([]); // Clear current cars while loading
    setPagination((prev) => ({ ...prev, page }));
    await refetch();
    router.refresh();
  };

  const saveOrder = () => {
    const ids = cars.map((field) => field._id);
    patchOrdering(ids);
  };

  return {
    cars,
    setCars,
    isLoading,
    isError,
    pagination,
    loadNext,
    loadPrev,
    setPage,
    refetch,
    setPagination,
    saveOrder: { mutate: saveOrder, isLoading: isPatching },
    ...rest,
  };
};