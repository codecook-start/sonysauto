import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useToast } from "./use-toast";
import { CarDetailOption } from "@/types/car";

const useOptions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const addOption = async (formData: FormData) => {
    const response = await axios.post("/api/options", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.option;
  };
  const updateOption = async ({
    id,
    formData,
  }: {
    id: string;
    formData: FormData;
  }) => {
    const response = await axios.put("/api/options", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      params: { id },
    });
    return response.data.option;
  };
  const deleteOption = async (id: string) => {
    const response = await axios.delete("/api/options", {
      params: { id },
    });
    return response.data.option;
  };
  const addOptionMutation = useMutation<
    CarDetailOption,
    AxiosError<{ message: string }>,
    FormData
  >(addOption, {
    onSuccess: async (data) => {
      console.log("Option added:", data);
      await queryClient.invalidateQueries("get-details");
    },
    onError: (error) => {
      console.error("Error adding option:", error);
      toast({
        title: "Failed to add option.",
        description: error.response?.data.message || "",
        variant: "destructive",
      });
    },
  });

  const updateOptionMutation = useMutation<
    CarDetailOption,
    AxiosError<{ message: string }>,
    {
      id: string;
      formData: FormData;
    }
  >(updateOption, {
    onSuccess: async (data) => {
      console.log("Option updated:", data);
      await queryClient.invalidateQueries("get-details");
    },
    onError: (error) => {
      console.error("Error updating option:", error);
      toast({
        title: "Failed to update option.",
        description: error.response?.data.message || "",
        variant: "destructive",
      });
    },
  });

  const deleteOptionMutation = useMutation<
    void,
    AxiosError<{ message: string }>,
    string
  >(deleteOption, {
    onSuccess: async (data) => {
      console.log("Option deleted:", data);
      await queryClient.invalidateQueries("get-details");
      toast({
        title: "Option deleted successfully.",
      });
    },
    onError: (error) => {
      console.error("Error deleting option:", error);
      toast({
        title: "Failed to delete option.",
        description: error.response?.data.message || "",
        variant: "destructive",
      });
    },
  });

  return {
    addOption: addOptionMutation,
    updateOption: updateOptionMutation,
    deleteOption: deleteOptionMutation,
  };
};

export default useOptions;
