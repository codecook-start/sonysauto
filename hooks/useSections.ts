import { useAtom } from "jotai";
import { useToast } from "@/hooks/use-toast";
import { CarSellerNotesAtom } from "@/jotai/dashboardAtom";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";
import useOrdering from "@/hooks/useOrdering";
import { CarSellerNoteFormField } from "@/types/car";

export const useSections = () => {
  const { toast } = useToast();
  const {
    patchOrdering: { mutate: patchOrdering, isLoading: isPatching },
  } = useOrdering("SellerNote");
  const [sections, setSections] = useAtom(CarSellerNotesAtom);

  const createSection = async (title: string) => {
    const response = await axios.post("/api/sections", { title });
    return response.data;
  };

  const updateSection = async ({
    id,
    title,
  }: {
    id: string;
    title: string;
  }) => {
    const response = await axios.put("/api/sections", { id, title });
    return response.data;
  };

  const deleteSection = async (id: string) => {
    const response = await axios.delete("/api/sections", { params: { id } });
    return response.data;
  };

  const getSections = async () => {
    const response = await axios.get("/api/sections");
    return response.data;
  };

  const getSectionsQuery = useQuery<
    CarSellerNoteFormField[],
    AxiosError<{ message: string }>
  >(["get-sections"], getSections, {
    staleTime: 30 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchInterval: 30 * 60 * 1000,
    onSuccess: (data) => {
      setSections((prev) =>
        data.map((section) => {
          const existingSection = prev.find((s) => s._id === section._id);
          return {
            ...section,
            checked: existingSection?.checked || false,
            texts: section.texts?.map((t) => {
              const existingText = existingSection?.texts?.find(
                (et) => et._id === t._id,
              );
              return {
                ...t,
                checked: existingText?.checked || false,
              };
            }),
          };
        }),
      );
    },
    onError: (error) => {
      console.error("Error fetching sections:", error);
      toast({
        title: "Error fetching sections",
        description: error.response?.data.message || error.message,
      });
    },
  });

  const createSectionMutation = useMutation<
    CarSellerNoteFormField,
    AxiosError<{ message: string }>,
    string
  >(createSection, {
    onSuccess: async () => {
      await getSectionsQuery.refetch();
      toast({
        title: "Section created",
        description: "Section has been created successfully",
      });
    },
    onError: (error) => {
      console.error("Error creating section:", error);
      toast({
        title: "Error creating section",
        description: error.response?.data.message || error.message,
      });
    },
  });

  const updateSectionMutation = useMutation<
    CarSellerNoteFormField,
    AxiosError<{ message: string }>,
    { id: string; title: string }
  >(updateSection, {
    onSuccess: async () => {
      await getSectionsQuery.refetch();
      toast({
        title: "Section updated",
        description: "Section has been updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating section:", error);
      toast({
        title: "Error updating section",
        description: error.response?.data.message || error.message,
      });
    },
  });

  const deleteSectionMutation = useMutation<
    { success: boolean },
    AxiosError<{ message: string }>,
    string
  >(deleteSection, {
    onSuccess: async () => {
      await getSectionsQuery.refetch();
      toast({
        title: "Section deleted",
        description: "Section has been deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting section:", error);
      toast({
        title: "Error deleting section",
        description: error.response?.data.message || error.message,
      });
    },
  });

  const saveOrder = () => {
    const ids = sections.map((section) => section._id);
    patchOrdering(ids);
  };

  return {
    sections,
    setSections,
    createSection: createSectionMutation,
    updateSection: updateSectionMutation,
    deleteSection: deleteSectionMutation,
    getSections: getSectionsQuery,
    saveOrder: {
      mutate: saveOrder,
      isLoading: isPatching,
    },
  };
};
