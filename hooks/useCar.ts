import { useMutation, useQuery, useQueryClient } from "react-query";
import axios, { AxiosError } from "axios";
import { useAtom, useSetAtom } from "jotai";
import { carAtom } from "@/jotai/carAtom";
import { useToast } from "@/hooks/use-toast";
import { CarResponse } from "@/types/edit-car";
import { imagesEditAtom } from "@/jotai/imagesAtom";
import { usePathname } from "next/navigation";
import { titleMap } from "@/data";
import { useEditDetails } from "@/hooks/useEditDetails";
import useEditFeatures from "@/hooks/useEditFeatures";

export const useCar = (id: string) => {
  const [car, setCar] = useAtom(carAtom);
  const setImages = useSetAtom(imagesEditAtom);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const pathname = usePathname();

  const { setCarFormFields } = useEditDetails();
  const { setFeatures } = useEditFeatures();

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
      staleTime: 5 * 60 * 1000,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchInterval: 5 * 60 * 1000,
      onSuccess: async (response) => {
        setCar(response);
        setFeatures([]);
        await queryClient.invalidateQueries("get-features");
        setCarFormFields([]);
        await queryClient.invalidateQueries("get-details");
        setImages(
          response.images.map((image) => ({
            _id: image._id,
            path: image.path,
            type: "old",
          })),
        );
      },
      enabled: !!id && !Object.keys(titleMap).includes(pathname),
    },
  );

  return {
    car,
    setCar,
    isLoading,
    isError,
    refetch,
    deleteCar: deleteCarMutation,
  };
};
