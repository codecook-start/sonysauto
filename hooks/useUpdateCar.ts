"use client";

import { useAtom, useAtomValue } from "jotai";
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
import useParagraph from "./useParagraph";

const updateCarData = async (carData: FormData) => {
  const response = await axios.put(`/api/car/${carData.get("id")}`, carData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

const useUpdateCar = () => {
  const [car, setCar] = useAtom(carAtom);
  const images = useAtomValue(imagesEditAtom);
  const carFormFields = useAtomValue(CarFormFieldsEditAtom);
  const features = useAtomValue(featuresEditAtom);
  const [sellerNotes, setSellerNotes] = useAtom(CarEditSellerNotesAtom);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const {
    addOption: { mutateAsync: addCarDetailOption },
  } = useOptions();
  const {
    updateParagraph: { mutateAsync: updateParagraph },
  } = useParagraph();

  const generateTitle = useCallback(() => {
    if (!carFormFields) return;

    const fieldValues = carFormFields.reduce<Record<string, string>>(
      (acc, field) => {
        acc[field.name.toLowerCase()] = field.selectedValues?.[0]?.name || "";
        return acc;
      },
      {},
    );

    const { year, make, model, fuel, seats } = fieldValues;

    const title = [
      year,
      make,
      model,
      fuel.toLowerCase() === "hybrid" ? "Hybrid" : "",
      seats && +seats > 5 ? `${seats} seats` : "",
    ]
      .filter(Boolean)
      .join(" ");

    setCar({ ...car, title });
  }, [car, carFormFields, setCar]);

  const handleUpdate = useCallback(async () => {
    if (!car?._id) return;

    if (!car.pages || !car.pages.length) {
      toast({
        title: "Error",
        description: "Please add at least one page",
        variant: "destructive",
      });
      return;
    }

    if (!car.title) {
      generateTitle();
    }

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
            showInListPage: field.showInListPage ?? false,
            showInDetailsPage: field.showInDetailsPage ?? false,
          };
        }
        return {
          detail: field._id,
          option: field.selectedValues?.[0]?._id ?? "",
          showInListPage: field.showInListPage ?? false,
          showInDetailsPage: field.showInDetailsPage ?? false,
        };
      }),
    );

    formData.append("details", JSON.stringify(detailOptions));

    const selectedFeatures = features
      .filter((feature) => feature.checked)
      .map((feature) => feature._id);
    formData.append("features", JSON.stringify(selectedFeatures));

    const sections = await Promise.all(
      sellerNotes
        .filter((note) => note.checked && note.texts?.length)
        .map(async (note) => ({
          note: note._id,
          texts: await Promise.all(
            (note.texts ?? [])
              .filter((t) => t.checked)
              .map(async (text) => {
                if (text.scope === "local" && !text.used) {
                  const newText = await updateParagraph({
                    _id: text._id,
                    title: text.title,
                    text: text.text,
                    scope: text.scope,
                    used: true,
                  });
                  return newText._id;
                }
                return text._id;
              }),
          ),
        })),
    );

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
    if (car.label) formData.append("label", car.label._id);

    console.log("FormData Prepared:", Object.fromEntries(formData.entries()));
    return updateCarData(formData);
  }, [
    car?._id,
    car?.pages,
    car?.title,
    car?.price,
    car?.extra,
    car?.videos,
    car?.label,
    images,
    carFormFields,
    features,
    sellerNotes,
    toast,
    generateTitle,
    addCarDetailOption,
    updateParagraph,
  ]);

  const mutation = useMutation(handleUpdate, {
    onSuccess: async (data) => {
      setSellerNotes([]);
      setCar(null);
      await queryClient.invalidateQueries("cars");
      await queryClient.invalidateQueries("car");
      await queryClient.invalidateQueries("get-features");
      await queryClient.invalidateQueries("get-details");
      await queryClient.invalidateQueries("get-sections");
      await queryClient.invalidateQueries("get-sections-edit");
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

  return {
    handleUpdate: mutation.mutate,
    isLoading: mutation.isLoading,
    generateTitle,
  };
};

export default useUpdateCar;
