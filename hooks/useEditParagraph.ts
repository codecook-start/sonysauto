import { CarEditSellerNotesAtom } from "@/jotai/dashboardAtom";
import axios, { AxiosError } from "axios";
import { useAtom } from "jotai";
import { useMutation, useQueryClient } from "react-query";
import { useToast } from "@/hooks/use-toast";

const useEditParagraph = (noteId: string) => {
  const [sections, setSections] = useAtom(CarEditSellerNotesAtom);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createParagraph = async ({
    text,
    title,
    scope,
  }: {
    title: string;
    text: string;
    scope: string;
  }) => {
    const response = await axios.post("/api/sections/texts", {
      noteId,
      title,
      text,
      scope,
    });
    return response.data;
  };

  const updateParagraph = async ({
    _id,
    title,
    text,
    scope,
  }: {
    _id: string;
    title: string;
    text: string;
    scope: string;
  }) => {
    const response = await axios.put("/api/sections/texts", {
      _id,
      title,
      text,
      scope,
    });
    return response.data;
  };

  const deleteParagraph = async (id: string) => {
    const response = await axios.delete("/api/sections/texts", {
      params: { id },
    });
    return response.data;
  };

  const createParagraphMutation = useMutation<
    { _id: string; title: string; text: string; scope: string },
    AxiosError<{ message: string }>,
    { title: string; text: string; scope: string }
  >(createParagraph, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("get-sections");
      await queryClient.invalidateQueries("get-sections-edit");
      // setSections((prev) =>
      //   prev.map((s) =>
      //     s._id === noteId
      //       ? {
      //           ...s,
      //           texts: s.texts?.map((p) =>
      //             p._id === data._id ? { ...p, scope: "local" } : p,
      //           ),
      //         }
      //       : s,
      //   ),
      // );
    },
    onError: (error) => {
      console.error("Error creating paragraph:", error);
      toast({
        title: "Error creating paragraph",
        description: error.response?.data.message || error.message,
      });
    },
  });

  const updateParagraphMutation = useMutation<
    { _id: string; title: string; text: string; scope: string },
    AxiosError<{ message: string }>,
    { _id: string; title: string; text: string; scope: string }
  >(updateParagraph, {
    async onSuccess() {
      await queryClient.invalidateQueries("get-sections");
      await queryClient.invalidateQueries("get-sections-edit");
    },
    onError: (error) => {
      console.error("Error updating paragraph:", error);
      toast({
        title: "Error updating paragraph",
        description: error.response?.data.message || error.message,
      });
    },
  });

  const deleteParagraphMutation = useMutation<
    { _id: string },
    AxiosError<{ message: string }>,
    string
  >(deleteParagraph, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("get-sections-edit");
    },
    onError: (error) => {
      console.error("Error deleting paragraph:", error);
      toast({
        title: "Error deleting paragraph",
        description: error.response?.data.message || error.message,
      });
    },
  });

  return {
    sections,
    setSections,
    createParagraph: createParagraphMutation,
    updateParagraph: updateParagraphMutation,
    deleteParagraph: deleteParagraphMutation,
  };
};

export default useEditParagraph;
