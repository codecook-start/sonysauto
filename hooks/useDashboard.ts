/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useToast } from "@/hooks/use-toast";

const useDashboard = (title: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const saveJSON = async (data: any[]): Promise<void> => {
    await axios.post("/api/save-json", { title, data });
  };
  const fetchJSON = async (): Promise<any> => {
    const response = await axios.get(
      `/api/save-json?title=${encodeURIComponent(title)}`,
    );
    return response.data;
  };

  const query = useQuery<any, AxiosError<{ message: string }>, any>({
    queryKey: ["save-json", title],
    queryFn: fetchJSON,
    staleTime: 5 * 10 * 60 * 1000,
    cacheTime: 5 * 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchInterval: 5 * 10 * 60 * 1000,
    onSuccess(data) {
      console.log("Data:", data);
    },
    onError(err) {
      console.log("Error:", err);
      toast({
        title: "An error occurred.",
        description: err.message,
        variant: "destructive",
      });
    },
  });
  const mutation = useMutation<void, AxiosError<{ message: string }>, any>({
    mutationFn: saveJSON,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["save-json", title] });
      toast({
        title: "Data saved successfully",
      });
    },
    onError: (error) => {
      console.log("Error:", error);
      toast({
        title: "An error occurred.",
        description: error.message,
      });
    },
  });
  return {
    data: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    saveData: mutation.mutate,
    isSaving: mutation.isLoading,
    refetch: query.refetch,
  };
};

export default useDashboard;
