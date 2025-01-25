import { Feature } from "@/types/car";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";
import { useToast } from "@/hooks/use-toast";
import { useAtom } from "jotai";
import { featuresAtom } from "@/jotai/featuresAtom";
import useOrdering from "@/hooks/useOrdering";

const useFeatures = () => {
  const { toast } = useToast();
  const {
    patchOrdering: { mutate: patchOrdering, isLoading: isPatching },
  } = useOrdering("Feature");
  const [features, setFeatures] = useAtom(featuresAtom);

  const createFeature = async (formData: FormData) => {
    const response = await axios.post("/api/features", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  };

  const getFeatures = async () => {
    const response = await axios.get("/api/features", {
      headers: {
        "Cache-Control": "no-cache",
        cache: "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return response.data;
  };

  const updateFeature = async (formData: FormData) => {
    const response = await axios.put("/api/features", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  };

  const deleteFeature = async (id: Feature["_id"]) => {
    const response = await axios.delete("/api/features", {
      params: { id },
    });
    return response.data;
  };

  const getFeaturesQuery = useQuery<Feature[], AxiosError<{ message: string }>>(
    ["get-features"],
    getFeatures,
    {
      staleTime: 0,
      cacheTime: 0,
      refetchOnWindowFocus: false,
      refetchInterval: 30 * 60 * 1000,
      onSuccess: (data) => {
        setFeatures((prev) =>
          data.map((f) => ({
            ...f,
            checked: prev.some((pf) => pf._id === f._id && pf.checked),
          })),
        );
      },
      onError: (error) => {
        console.error("Error fetching features:", error);
        toast({
          title: "Error fetching features",
          description: error.response?.data.message || error.message,
        });
      },
    },
  );

  const updateFeatureMutation = useMutation<
    Feature,
    AxiosError<{ message: string }>,
    FormData
  >(updateFeature, {
    onSuccess: async (data) => {
      console.log("Data:", data);
      await getFeaturesQuery.refetch();
      toast({
        title: "Feature updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating feature:", error);
      toast({
        title: "Error updating feature",
        description: error.response?.data.message || error.message,
      });
    },
  });

  const createFeatureMutation = useMutation<
    Feature,
    AxiosError<{
      message: string;
    }>,
    FormData
  >(createFeature, {
    onSuccess: async (data) => {
      console.log("Data:", data);
      await getFeaturesQuery.refetch();
      toast({
        title: "Feature created successfully",
      });
    },
    onError: (error) => {
      console.error("Error creating feature:", error);
      toast({
        title: "Error creating feature",
        description: error.response?.data.message || error.message,
      });
    },
  });

  const deleteFeatureMutation = useMutation<
    Feature,
    AxiosError<{ message: string }>,
    string
  >(deleteFeature, {
    async onSuccess(data) {
      console.log("Deleted Feature:", data);
      await getFeaturesQuery.refetch();
      toast({
        title: "Feature deleted!",
        description: `Successfully deleted ${data.name}.`,
      });
    },
    onError(err) {
      console.error("Error deleting feature:", err);
      toast({
        title: "Error deleting feature.",
        description: err.response?.data.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });

  const saveOrder = () => {
    const ids = features.map((feature) => feature._id);
    patchOrdering(ids);
  };

  return {
    features,
    setFeatures,
    getFeatures: getFeaturesQuery,
    updateFeature: updateFeatureMutation,
    createFeature: createFeatureMutation,
    deleteFeature: deleteFeatureMutation,
    saveOrder: { mutate: saveOrder, isLoading: isPatching },
  };
};

export default useFeatures;
