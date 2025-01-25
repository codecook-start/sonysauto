import { IOrdering } from "@/models/Ordering";
import axios, { AxiosError } from "axios";
import { useMutation, UseMutationResult } from "react-query";
import { useToast } from "@/hooks/use-toast";
import { usePathname } from "next/navigation";
import { useAtomValue } from "jotai";
import { carPaginationAtom } from "@/jotai/carsAtom";

type PatchOrderingPayload = {
  name: string;
  page: string;
  pageNumber: number;
  limit: number;
  ids: string[];
};

const useCarOrdering = (): {
  patchOrdering: UseMutationResult<
    IOrdering,
    AxiosError<{ message: string }>,
    string[]
  >;
} => {
  const { toast } = useToast();

  const pagination = useAtomValue(carPaginationAtom);

  const { page: pageNumber, limit } = pagination;

  const pathname = usePathname();

  const patchOrdering = async (ids: string[]): Promise<IOrdering> => {
    const payload: PatchOrderingPayload = {
      name: "Car",
      page: pathname,
      pageNumber,
      limit,
      ids,
    };
    const { data } = await axios.patch<IOrdering>(
      "/api/ordering/car",
      payload,
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

  return {
    patchOrdering: useMutation<
      IOrdering,
      AxiosError<{ message: string }>,
      string[]
    >(patchOrdering, {
      onError: (error) => {
        console.error(error);
        toast({
          title: "An error occurred.",
          description: error.response?.data.message || error.message,
        });
      },
    }),
  };
};

export default useCarOrdering;
