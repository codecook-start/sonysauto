import { IOrdering } from "@/models/Ordering";
import axios, { AxiosError } from "axios";
import { useMutation } from "react-query";
import { useToast } from "@/hooks/use-toast";

const useOrdering = (name: IOrdering["name"]) => {
  const { toast } = useToast();
  const patchOrdering = async (ids: string[]) => {
    const { data } = await axios.patch<IOrdering>(`/api/ordering`, {
      name,
      ids,
    });
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

export default useOrdering;
