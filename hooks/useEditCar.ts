import { useMutation, useQuery, useQueryClient } from "react-query";
import axios, { AxiosError } from "axios";
import { useAtom } from "jotai";
import { carAtom } from "@/jotai/carAtom";
import { CarResponse } from "@/types/edit-car";
import { useToast } from "@/hooks/use-toast";

export const useEditCar = (id: string) => {
  const [car, setCar] = useAtom(carAtom);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const fetchCar = async () => {
    const { data } = await axios.get<CarResponse>(`/api/car/${id}`, {
      headers: {
        "Cache-Control": "no-cache",
        cache: "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return data;
  };

  const deleteCar = async () => {
    await axios.delete(`/api/car/${id}`, {
      headers: {
        "Cache-Control": "no-cache",
        cache: "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  };

  const deleteCarMutation = useMutation(deleteCar, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("cars");
      setCar(null);
      toast({
        title: "Success",
        description: "Car deleted successfully!",
      });
    },
  });

  const { isLoading, isError, refetch } = useQuery<CarResponse, AxiosError>(
    ["car", id],
    fetchCar,
    {
      staleTime: 0,
      cacheTime: 0,
      refetchOnWindowFocus: false,
      refetchInterval: 5 * 60 * 1000,
      onSuccess: (response) => {
        setCar(response);
      },
    },
  );

  return {
    car,
    isLoading,
    isError,
    refetch,
    deleteCar: deleteCarMutation,
  };
};
