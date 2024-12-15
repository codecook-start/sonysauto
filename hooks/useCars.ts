import { useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import { useAtom } from "jotai";
import { carPaginationAtom, carsAtom } from "@/jotai/carsAtom";
import { CarResponse } from "@/types/edit-car";
import { usePathname, useRouter } from "next/navigation";
import { titleMap } from "@/data";
import { CarPagination } from "@/types/car";
import { delay } from "@/lib/utils";

export const useCars = () => {
  const [cars, setCars] = useAtom(carsAtom);
  const [pagination, setPagination] = useAtom(carPaginationAtom);
  const router = useRouter();
  const pathname = usePathname();

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
    // if (pagination.sortBy && pagination.sortBy.length > 0) {
    //   const sortBy = pagination.sortBy
    //     .map((sort) => `${sort.name}:${sort.order}`)
    //     .join(",");
    //   url += `&sortBy=${sortBy}`;
    // }
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
    const { data } = await axios.get(url);
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
    onSuccess: async (response) => {
      setCars(response.data);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.pagination.totalPages,
        totalItems: response.pagination.totalItems,
        page: response.pagination.currentPage,
        priceRange: response.pagination.priceRange,
      }));
      await delay(100);
      const scrollPosition = sessionStorage.getItem("scrollPosition");
      console.log({ scrollPosition });
      if (scrollPosition) {
        window.scrollTo({
          top: parseInt(scrollPosition) || 0,
          behavior: "smooth",
        });
      }
    },
    enabled:
      pathname.includes("/inventory") ||
      Object.keys(titleMap).includes(pathname),
  });

  const loadNext = async () => {
    if (pagination.page < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
      await delay(500);
      await refetch();
      router.refresh();
    }
  };

  const loadPrev = async () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
      await delay(500);
      await refetch();
      router.refresh();
    }
  };

  const setPage = async (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, page }));
    await delay(500);
    await refetch();
    router.refresh();
  };

  return {
    cars,
    isLoading,
    isError,
    pagination,
    loadNext,
    loadPrev,
    setPage,
    refetch,
    ...rest,
  };
};
