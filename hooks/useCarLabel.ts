import axios from "axios";
import { useToast } from "./use-toast";
import { useMutation, useQuery } from "react-query";
import { useAtom } from "jotai";
import { CarLabelAtom } from "@/jotai/dashboardAtom";

export const useCarLabel = () => {
  const { toast } = useToast();
  const [carLabels, setCarLabels] = useAtom(CarLabelAtom);
  const getCarLabels = async () => {
    const {
      data: { data },
    } = await axios.get("/api/labels");
    return data;
  };
  const addCarLabel = async (label: {
    name: string;
    color: string | null;
    bgColor: string | null;
  }) => {
    const response = await axios.post("/api/labels", label);
    return response.data;
  };
  const updateCarLabel = async (label: {
    id: string;
    name: string;
    color: string | null;
    bgColor: string | null;
  }) => {
    const response = await axios.put("/api/labels", label);
    return response.data;
  };
  const deleteCarLabel = async (id: string) => {
    const response = await axios.delete("/api/labels", { params: { id } });
    return response.data;
  };

  const carLabelQuery = useQuery({
    queryKey: ["get-car-labels"],
    queryFn: getCarLabels,
    staleTime: 5 * 10 * 60 * 1000,
    cacheTime: 5 * 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    onSuccess(data) {
      console.log("Car Labels", data);
      setCarLabels(data);
    },
    onError(error) {
      console.error("Error fetching car labels", error);
      toast({
        title: "Error",
        description: "Failed to load car labels",
        variant: "destructive",
      });
    },
  });

  const addCarLabelMutation = useMutation(addCarLabel, {
    async onSuccess(data) {
      await carLabelQuery.refetch();
      console.log("Added Car Label", data);
      toast({
        title: "Car Label added",
        description: `Successfully added ${data.name}`,
      });
    },
    onError(error) {
      console.error("Error adding car label", error);
      toast({
        title: "Error",
        description: "Failed to add car label",
        variant: "destructive",
      });
    },
  });

  const updateCarLabelMutation = useMutation(updateCarLabel, {
    async onSuccess(data) {
      await carLabelQuery.refetch();
      console.log("Updated Car Label", data);
      toast({
        title: "Car Label updated",
        description: `Successfully updated ${data.name}`,
      });
    },
    onError(error) {
      console.error("Error updating car label", error);
      toast({
        title: "Error",
        description: "Failed to update car label",
        variant: "destructive",
      });
    },
  });

  const deleteCarLabelMutation = useMutation(deleteCarLabel, {
    async onSuccess(data) {
      await carLabelQuery.refetch();
      console.log("Deleted Car Label", data);
      toast({
        title: "Car Label deleted",
        description: "Successfully deleted car label",
      });
    },
    onError(error) {
      console.error("Error deleting car label", error);
      toast({
        title: "Error",
        description: "Failed to delete car label",
        variant: "destructive",
      });
    },
  });

  return {
    carLabels,
    carLabelQuery,
    addCarLabel: addCarLabelMutation,
    updateCarLabel: updateCarLabelMutation,
    deleteCarLabel: deleteCarLabelMutation,
  };
};
