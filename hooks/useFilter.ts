import { useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import { useAtom, useAtomValue } from "jotai";
import { Filter, FilterValue } from "@/types/car";
import {
  filtersAtom,
  lastFilterAtom,
  makesAtom,
  modelsAtom,
  typesAtom,
} from "@/jotai/filtersAtom";
import { useToast } from "@/hooks/use-toast";
import {
  CAR_PAGINATION_INITIAL_STATE,
  carPaginationAtom,
} from "@/jotai/carsAtom";
import { usePathname, useRouter } from "next/navigation";
import { delay } from "@/lib/utils";
import { useCars } from "@/hooks/useCars";

export const useFilter = () => {
  const [filters, setFilters] = useAtom(filtersAtom);
  const [makes, setMakes] = useAtom(makesAtom);
  const [types, setTypes] = useAtom(typesAtom);
  const [models, setModels] = useAtom(modelsAtom);
  const lastFilter = useAtomValue(lastFilterAtom);
  const [pagination, setPagination] = useAtom(carPaginationAtom);
  const { refetch: refetchCars } = useCars();
  const pathname = usePathname();
  const { toast } = useToast();
  const router = useRouter();

  const fetchFilter = async () => {
    let url = "/api/filters?a=1";
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
    if (pagination.search) {
      url += `&search=${pagination.search}`;
    }
    if (pagination.minPrice) {
      url += `&minPrice=${pagination.minPrice}`;
    }
    if (pagination.maxPrice) {
      url += `&maxPrice=${pagination.maxPrice}`;
    }
    const { data } = await axios.get<Filter[]>(url, {
      headers: {
        "Cache-Control": "no-cache",
        cache: "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return data;
  };

  const fetchMakes = async () => {
    let url = "/api/makes?a=1";
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
    if (pagination.search) {
      url += `&search=${pagination.search}`;
    }
    if (pagination.minPrice) {
      url += `&minPrice=${pagination.minPrice}`;
    }
    if (pagination.maxPrice) {
      url += `&maxPrice=${pagination.maxPrice}`;
    }
    const { data } = await axios.get<FilterValue[]>(url, {
      headers: {
        "Cache-Control": "no-cache",
        cache: "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return data;
  };

  const fetchTypes = async () => {
    let url = "/api/types?a=1";
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
    if (pagination.search) {
      url += `&search=${pagination.search}`;
    }
    if (pagination.minPrice) {
      url += `&minPrice=${pagination.minPrice}`;
    }
    if (pagination.maxPrice) {
      url += `&maxPrice=${pagination.maxPrice}`;
    }
    const { data } = await axios.get<FilterValue[]>(url, {
      headers: {
        "Cache-Control": "no-cache",
        cache: "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return data;
  };

  const fetchModels = async () => {
    let url = "/api/models?a=1";
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
    if (pagination.search) {
      url += `&search=${pagination.search}`;
    }
    if (pagination.minPrice) {
      url += `&minPrice=${pagination.minPrice}`;
    }
    if (pagination.maxPrice) {
      url += `&maxPrice=${pagination.maxPrice}`;
    }
    const { data } = await axios.get<FilterValue[]>(url, {
      headers: {
        "Cache-Control": "no-cache",
        cache: "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return data;
  };

  const fetchFeatures = async () => {
    let url = "/api/filters/features?a=1";
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
    if (pagination.search) {
      url += `&search=${pagination.search}`;
    }
    if (pagination.minPrice) {
      url += `&minPrice=${pagination.minPrice}`;
    }
    if (pagination.maxPrice) {
      url += `&maxPrice=${pagination.maxPrice}`;
    }
    const { data } = await axios.get<FilterValue[]>(url, {
      headers: {
        "Cache-Control": "no-cache",
        cache: "no-cache",
      },
    });
    return data;
  };

  const {
    isLoading,
    isRefetching: isRefetchingFilters,
    isError,
    refetch,
  } = useQuery<Filter[], AxiosError<{ message: string }>>(
    ["filters", pathname],
    fetchFilter,
    {
      refetchInterval: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      cacheTime: 0,
      staleTime: 0,
      optimisticResults: true,
      onSuccess: (response) => {
        if (!response) return;
        setFilters(
          response.map((f) => (f._id === lastFilter?._id ? lastFilter : f)),
        );
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message,
          variant: "destructive",
        });
      },
    },
  );

  const {
    isLoading: isLoadingMakes,
    isRefetching: isRefetchingMakes,
    refetch: refetchMakes,
  } = useQuery<FilterValue[], AxiosError<{ message: string }>>(
    ["makes", pathname],
    fetchMakes,
    {
      refetchInterval: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      cacheTime: 0,
      staleTime: 0,
      optimisticResults: true,
      onSuccess: (response) => {
        if (!response) return;
        setMakes(response);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message,
          variant: "destructive",
        });
      },
    },
  );

  const {
    isLoading: isLoadingTypes,
    isRefetching: isRefetchingTypes,
    refetch: refetchTypes,
  } = useQuery<FilterValue[], AxiosError<{ message: string }>>(
    ["types", pathname],
    fetchTypes,
    {
      refetchInterval: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      cacheTime: 0,
      staleTime: 0,
      optimisticResults: true,
      onSuccess: (response) => {
        if (!response) return;
        setTypes(response);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message,
          variant: "destructive",
        });
      },
      // enabled: !!pagination?.details?.find((detail) => detail.name === "make")
      //   ?.values?.length,
    },
  );

  const {
    isLoading: isLoadingModels,
    isRefetching: isRefetchingModels,
    refetch: refetchModels,
  } = useQuery<FilterValue[], AxiosError<{ message: string }>>(
    ["models", pathname],
    fetchModels,
    {
      refetchInterval: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      cacheTime: 0,
      staleTime: 0,
      optimisticResults: true,
      onSuccess: (response) => {
        if (!response) return;
        setModels(response);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message,
          variant: "destructive",
        });
      },
    },
  );

  const {
    isLoading: isLoadingFeatures,
    isRefetching: isRefetchingFeatures,
    refetch: refetchFeatures,
  } = useQuery<FilterValue[], AxiosError<{ message: string }>>(
    ["features", pathname],
    fetchFeatures,
    {
      refetchInterval: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      cacheTime: 0,
      staleTime: 0,
      optimisticResults: true,
      onSuccess: (response) => {
        if (!response) return;
        setPagination((prev) => ({
          ...prev,
          features: response.map((feature) => ({
            ...feature,
            _id: feature._id || "",
            name: feature.name || "",
            count: feature.count || 0,
          })),
        }));
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message,
          variant: "destructive",
        });
      },
    },
  );

  const resetAll = async () => {
    setPagination(() => CAR_PAGINATION_INITIAL_STATE);
    await delay(500);
    await Promise.all([
      refetch(),
      refetchMakes(),
      refetchModels(),
      refetchTypes(),
      refetchFeatures(),
      refetchCars(),
    ]);
    router.refresh();
  };

  return {
    filters,
    makes,
    types,
    models,
    isLoading:
      isLoading ||
      isLoadingMakes ||
      isLoadingTypes ||
      isLoadingModels ||
      isLoadingFeatures,
    isLoadingMakes,
    isLoadingTypes,
    isLoadingModels,
    isLoadingFeatures,
    isRefetchingFilters,
    isRefetchingMakes,
    isRefetchingTypes,
    isRefetchingModels,
    isRefetchingFeatures,
    isError,
    refetch,
    refetchTypes,
    refetchMakes,
    refetchModels,
    refetchFeatures,
    resetAll,
  };
};
