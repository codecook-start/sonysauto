/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";

type CarouselData = {
  title: string;
  data: any[];
};

export const useCarouselData = (title: string) => {
  const queryClient = useQueryClient();

  const fetchCarouselData = async (): Promise<CarouselData> => {
    const response = await axios.get(
      `/api/carousel?title=${encodeURIComponent(title)}`,
    );
    return response.data;
  };

  const saveCarouselData = async (data: any[]): Promise<void> => {
    await axios.post("/api/carousel", { title, data });
  };

  const query = useQuery<CarouselData, Error>({
    queryKey: ["carousel", title],
    queryFn: fetchCarouselData,
    staleTime: 5 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchInterval: 5 * 60 * 1000,
    retry: false,
    onError: (error) => {
      console.error(error);
    },
  });

  const mutation = useMutation({
    mutationFn: saveCarouselData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousel", title] });
    },
  });

  return {
    carouselData: query.data?.data || [
      "/1.jpg",
      "/2.jpg",
      "/3.jpg",
      "/4.jpg",
      "/1.jpg",
      "/2.jpg",
      "/3.jpg",
      "/4.jpg",
      "/1.jpg",
      "/2.jpg",
      "/3.jpg",
      "/4.jpg",
    ],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    saveData: mutation.mutate,
    isSaving: mutation.isLoading,
  };
};
