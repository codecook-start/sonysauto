"use client";

import { useAtomValue } from "jotai";
import {
  CarEditSellerNotesAtom,
  CarFormFieldsEditAtom,
} from "@/jotai/dashboardAtom";
import { useMutation, useQueryClient } from "react-query";
import { useCallback } from "react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { featuresEditAtom } from "@/jotai/featuresAtom";
import { isDropdown } from "@/lib/utils";
import useOptions from "@/hooks/useOptions";
import { carAtom } from "@/jotai/carAtom";
import { imagesEditAtom } from "@/jotai/imagesAtom";

const updateCarData = async (carData: FormData) => {
  const response = await axios.put(`/api/car/${carData.get("id")}`, carData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

const useUpdateCar = () => {
  const car = useAtomValue(carAtom);
  const images = useAtomValue(imagesEditAtom);
  const carFormFields = useAtomValue(CarFormFieldsEditAtom);
  const features = useAtomValue(featuresEditAtom);
  const sellerNotes = useAtomValue(CarEditSellerNotesAtom);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const {
    addOption: { mutateAsync: addCarDetailOption },
  } = useOptions();

  const handleUpdate = useCallback(async () => {
    if (!car?._id) return;

    const formData = new FormData();
    formData.append("id", car._id);
    formData.append("title", car.title || "");
    formData.append("price", car.price || "");
    formData.append("extra", car.extra || "");

    images.forEach((image) => {
      if (image.type === "old") {
        formData.append("images", image.path!);
      } else {
        formData.append("images", image.file!, image.file!.name);
      }
    });

    const detailOptions = await Promise.all(
      carFormFields?.map(async (field) => {
        if (!isDropdown(field) && field.value) {
          const optionFormData = new FormData();
          optionFormData.append("detailId", field._id);
          optionFormData.append("name", field.value);

          const optionResult = await addCarDetailOption(optionFormData);
          return {
            detail: field._id,
            option: optionResult?._id ?? "",
          };
        }
        return {
          detail: field._id,
          option: field.selectedValues?.[0]?._id ?? "",
        };
      }),
    );

    formData.append("details", JSON.stringify(detailOptions));

    const selectedFeatures = features
      .filter((feature) => feature.checked)
      .map((feature) => feature._id);
    formData.append("features", JSON.stringify(selectedFeatures));

    const sections = sellerNotes
      .filter((note) => note.checked && note.texts?.length)
      .map((note) => ({
        note: note._id,
        texts: (note.texts ?? [])
          .filter((t) => t.checked)
          .map((text) => text._id),
      }));
    formData.append("sellerNotes", JSON.stringify(sections));

    if (car.videos) formData.append("videos", JSON.stringify(car.videos));
    if (!car.pages || !car.pages.length) {
      toast({
        title: "Error",
        description: "Please add at least one page",
        variant: "destructive",
      });
      return;
    }
    if (car.pages) formData.append("pages", JSON.stringify(car.pages));

    console.log("FormData Prepared:", Object.fromEntries(formData.entries()));
    return updateCarData(formData);
  }, [
    addCarDetailOption,
    car,
    carFormFields,
    features,
    sellerNotes,
    images,
    toast,
  ]);

  const mutation = useMutation(handleUpdate, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries("cars");
      await queryClient.invalidateQueries("car");
      await queryClient.invalidateQueries("get-features");
      await queryClient.invalidateQueries("get-details");
      await queryClient.invalidateQueries("get-sections");
      console.log("Car updated successfully:", data);
      toast({ title: "Car updated successfully" });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Error updating car:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    },
  });

  return { handleUpdate: mutation.mutate, isLoading: mutation.isLoading };
};

export default useUpdateCar;
