import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosInstance from "@/lib/axios";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const getStyles = async () => {
  const { data } = await axios.get("/api/uploads/user-styles.css");
  return data;
};

const saveStyles = async (styles: string) => {
  await axiosInstance.post("/styles", { styles });
};

export const useStyles = () => {
  const [userStyles, setUserStyles] = useState<string>("");
  return {
    userStyles,
    setUserStyles,
    ...useQuery<string, AxiosError>({
      queryKey: ["styles"],
      queryFn: getStyles,
      staleTime: 5 * 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchInterval: 5 * 10 * 60 * 1000,
      onSuccess: (data) => {
        setUserStyles(data);
      },
    }),
  };
};

export const useSaveStyles = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveStyles,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["styles"],
      });
      toast({ title: "Styles saved" });
    },
    onError: () => {
      toast({ title: "Save failed", variant: "destructive" });
    },
  });
};
