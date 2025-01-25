import { useMutation, useQueryClient } from "react-query";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";

export const useCarPages = (id: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const updateCarPages = async ({
    id,
    pages,
  }: {
    id: string;
    pages: string[];
  }) => {
    const { data } = await axios.put(
      `/api/car/pages/${id}`,
      { pages },
      {
        headers: {
          "Cache-Control": "no-cache",
          cache: "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
    return data;
  };

  const { mutate, isLoading, isError, ...rest } = useMutation<
    {},
    AxiosError<{ message: string }>,
    { pages: string[] }
  >(({ pages }) => updateCarPages({ id, pages }), {
    onSuccess: async (response) => {
      console.log("Success:", response);
      await queryClient.invalidateQueries("cars");
      toast({
        title: "Success",
        description: "Car pages updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    },
  });

  return {
    mutate,
    isLoading,
    isError,
    ...rest,
  };
};
