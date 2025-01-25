/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAtom, useAtomValue } from "jotai";
import { CarFormFieldsEditAtom } from "@/jotai/dashboardAtom";
import { useMutation, useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import { useToast } from "./use-toast";
import { CarFormField } from "@/types/car";
import { carAtom } from "@/jotai/carAtom";
import useOrdering from "@/hooks/useOrdering";
import { usePathname } from "next/navigation";

export const useEditDetails = () => {
  const { toast } = useToast();
  const {
    patchOrdering: { mutate: patchOrdering, isLoading: isPatching },
  } = useOrdering("CarDetail");
  const [carFormFields, setCarFormFields] = useAtom(CarFormFieldsEditAtom);
  const car = useAtomValue(carAtom);
  const pathname = usePathname();

  const getDetails = async (): Promise<CarFormField[]> => {
    const response = await axios.get("/api/details", {
      headers: {
        "Cache-Control": "no-cache",
        cache: "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return response.data;
  };

  const addDetail = async (detail: Partial<CarFormField>) => {
    const formData = new FormData();
    formData.append("name", detail.name || "");

    const response = await axios.post("/api/details", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.detail;
  };

  const updateDetail = async ({
    id,
    formData,
  }: {
    id: CarFormField["_id"];
    formData: FormData;
  }) => {
    const response = await axios.put(`/api/details`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      params: { id },
    });

    return response.data.detail;
  };

  const deleteDetail = async (id: CarFormField["_id"]) => {
    const response = await axios.delete("/api/details", { params: { id } });
    return response.data.detail;
  };

  const detailsQuery = useQuery<
    CarFormField[],
    AxiosError<{ message: string }>
  >({
    queryKey: ["get-details", car?._id, pathname],
    queryFn: getDetails,
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: false,
    refetchInterval: 5 * 10 * 60 * 1000,
    onSuccess(data) {
      setCarFormFields((prev) =>
        data.map((detail) => {
          const existingDetail = car?.details?.find(
            (d) => d.detail?._id === detail._id,
          );
          const prevDetail = prev.find((field) => field._id === detail._id);
          return {
            ...detail,
            value: prevDetail?.value || existingDetail?.option?.name || "",
            selectedValues: prevDetail?.selectedValues?.length
              ? prevDetail.selectedValues
              : existingDetail?.option
                ? [existingDetail.option]
                : [],
          };
        }),
      );
    },
    onError(err) {
      console.error("Error fetching details:", err);
      toast({
        title: "Failed to load car details.",
        description: err.response?.data.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });

  const addDetailMutation = useMutation<
    CarFormField,
    AxiosError<{ message: string }>,
    any
  >(addDetail, {
    onSuccess(data) {
      console.log("Added Detail:", data);
      setCarFormFields((prev) => [...prev, data]);
      toast({
        title: "Car detail added!",
        description: `Successfully added ${data.name}.`,
      });
    },
    onError(err) {
      console.error("Error adding detail:", err);
      toast({
        title: "Error adding car detail.",
        description: err.response?.data.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });

  const updateDetailMutation = useMutation<
    CarFormField,
    AxiosError<{ message: string }>,
    { id: CarFormField["_id"]; formData: FormData }
  >(updateDetail, {
    onSuccess(data, variables) {
      console.log("Updated Detail:", data);
      setCarFormFields((prev) => {
        return prev.map((field) =>
          field._id === variables.id
            ? {
                ...data,
                values: field.values,
              }
            : field,
        );
      });
      toast({
        title: "Car detail updated!",
        description: `Successfully updated ${data.name}.`,
      });
    },
    onError(err) {
      console.error("Error updating detail:", err);
      toast({
        title: "Error updating car detail.",
        description: err.response?.data.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });

  const deleteDetailMutation = useMutation<
    CarFormField,
    AxiosError<{ message: string }>,
    string
  >(deleteDetail, {
    async onSuccess(data) {
      console.log("Deleted Detail:", data);
      await detailsQuery.refetch();
      toast({
        title: "Car detail deleted!",
        description: `Successfully deleted.`,
      });
    },
    onError(err) {
      console.error("Error deleting detail:", err);
      toast({
        title: "Error deleting car detail.",
        description: err.response?.data.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });

  const saveOrder = () => {
    const ids = carFormFields.map((field) => field._id);
    patchOrdering(ids);
  };

  return {
    carFormFields,
    setCarFormFields,
    detailsQuery,
    addDetail: addDetailMutation,
    updateDetail: updateDetailMutation,
    deleteDetail: deleteDetailMutation,
    saveOrder: { mutate: saveOrder, isLoading: isPatching },
  };
};
