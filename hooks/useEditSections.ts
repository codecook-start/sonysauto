import { useAtom, useAtomValue } from "jotai";
import { useToast } from "@/hooks/use-toast";
import { CarEditSellerNotesAtom } from "@/jotai/dashboardAtom";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";
import { carAtom } from "@/jotai/carAtom";
import { SellerNote, Text } from "@/types/car";
import useOrdering from "@/hooks/useOrdering";
import { usePathname } from "next/navigation";

type SectionResponse = {
  _id: string;
  title: string;
  texts: Text[];
};

const useEditSections = () => {
  const { toast } = useToast();
  const {
    patchOrdering: { mutate: patchOrdering, isLoading: isPatching },
  } = useOrdering("SellerNote");
  const [sections, setSections] = useAtom(CarEditSellerNotesAtom);
  const car = useAtomValue(carAtom);
  const pathname = usePathname();

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
    const response = await axios.get("/api/sections", {
      headers: {
        "Cache-Control": "no-cache",
        cache: "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return response.data;
  };

  const getSectionsQuery = useQuery<
    SectionResponse[],
    AxiosError<{ message: string }>
  >(["get-sections-edit", pathname], getSections, {
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: false,
    refetchInterval: 30 * 60 * 1000,
    onSuccess: (data) => {
      setSections((prev) => {
        return data.map((section) => {
          const existingSection = car?.sellerNotes?.find(
            (cs) => cs.note?._id === section._id,
          ) as SellerNote;
          const prevSection = prev.find((ps) => ps._id === section._id);
          if (prevSection) {
            return {
              ...section,
              texts: section.texts.map((text) => {
                const prevText = prevSection.texts?.find(
                  (pt) => pt._id === text._id,
                ) as Text;
                return {
                  ...text,
                  checked: prevText ? prevText.checked : false,
                };
              }),
              checked: prevSection.checked,
            };
          } else if (existingSection) {
            const mergedTexts = [];
            for (const text of section.texts) {
              const existingText = existingSection.texts.find(
                (et) => et._id === text._id,
              ) as Text;
              mergedTexts.push({
                ...text,
                checked: existingText ? true : false,
              });
            }
            for (const existingText of existingSection.texts) {
              if (!section.texts.find((t) => t._id === existingText._id)) {
                mergedTexts.push({
                  ...existingText,
                  checked: true,
                });
              }
            }
            return {
              ...section,
              texts: mergedTexts,
              checked: true,
            };
          }
          return {
            ...section,
            checked: false,
          };
        });
      });
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
    SectionResponse,
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
    SectionResponse,
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

export default useEditSections;
