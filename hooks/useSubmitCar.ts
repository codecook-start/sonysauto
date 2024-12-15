"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  CarFormFieldsAtom,
  CarLocalAtom,
  CarSellerNotesAtom,
} from "@/jotai/dashboardAtom";
import { useMutation, useQueryClient } from "react-query";
import { useCallback } from "react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { imagesAtom } from "@/jotai/imagesAtom";
import { featuresAtom } from "@/jotai/featuresAtom";
import { isDropdown } from "@/lib/utils";
import useOptions from "@/hooks/useOptions";
import useParagraph from "@/hooks/useParagraph";

const addCarData = async (car: FormData) => {
  const response = await axios.post("/api/car", car, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const useSubmitCarData = () => {
  const queryClient = useQueryClient();
  const [car, setCar] = useAtom(CarLocalAtom);
  const [carFormFields, setCarFormFields] = useAtom(CarFormFieldsAtom);
  const features = useAtomValue(featuresAtom);
  const section = useAtomValue(CarSellerNotesAtom);
  const setImages = useSetAtom(imagesAtom);
  const { toast } = useToast();
  const {
    addOption: { mutateAsync: addCarDetailOption },
  } = useOptions();
  const {
    createParagraph: { mutateAsync: createParagraph },
  } = useParagraph();

  const reset = useCallback(() => {
    setCar((prevCar) => ({
      ...prevCar,
      title: "",
      features: [],
      price: "",
      videos: [],
      images: [],
      extra: "",
      details: [],
    }));
    setCarFormFields((prevFields) =>
      prevFields.map((field) => ({
        ...field,
        selectedValues: [],
        icon: typeof field.icon === "string" ? field.icon : "",
      })),
    );
    setImages([]);
  }, [setCar, setCarFormFields, setImages]);

  const mutation = useMutation<
    {
      message: string;
    },
    AxiosError<{ message: string }>,
    FormData
  >(addCarData, {
    onSuccess: async (data) => {
      console.log("Success:", data);
      await queryClient.invalidateQueries("cars");
      await queryClient.invalidateQueries("get-features");
      await queryClient.invalidateQueries("get-details");
      await queryClient.invalidateQueries("get-sections");
      toast({
        title: "Car data submitted successfully!",
      });
      reset();
    },
    onError: (error) => {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = useCallback(async () => {
    const formData = new FormData();

    formData.append("title", car.title || "");
    formData.append("price", car.price || "");
    formData.append("extra", car.extra || "");

    if (car.images) {
      car.images.forEach((image) => {
        if ("file" in image) {
          formData.append("images", image.file, image.name);
        } else {
          formData.append("images", image.path);
        }
      });
    }

    if (carFormFields) {
      const detailOptions = await Promise.all(
        carFormFields.map(async (field) => {
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
    }

    const selectedFeatures = features
      .filter((feature) => feature.checked)
      .map((feature) => feature._id);
    formData.append("features", JSON.stringify(selectedFeatures));

    const sellerNotes = await Promise.all(
      section
        .filter((note) => note.checked && note.texts?.length)
        .map(async (note) => ({
          note: note._id,
          texts: await Promise.all(
            (note.texts ?? [])
              .filter((t) => t.checked)
              .map(async (text) => {
                if (text.scope === "local") {
                  const newText = await createParagraph({
                    id: note._id,
                    title: text.title,
                    text: text.text,
                    scope: text.scope,
                  });
                  return newText._id;
                }
                return text._id;
              }),
          ),
        })),
    );
    formData.append("sellerNotes", JSON.stringify(sellerNotes));

    if (car.videos) {
      formData.append("videos", JSON.stringify(car.videos));
    }
    if (!car.pages || !car.pages.length) {
      toast({
        title: "Error",
        description: "Please add at least one page",
        variant: "destructive",
      });
      return;
    }
    if (car.pages) {
      formData.append("pages", JSON.stringify(car.pages));
    }
    console.log({
      formData: Object.fromEntries(formData.entries()),
    });
    mutation.mutate(formData);
  }, [
    addCarDetailOption,
    car.extra,
    car.images,
    car.pages,
    car.price,
    car.title,
    car.videos,
    carFormFields,
    createParagraph,
    features,
    mutation,
    section,
    toast,
  ]);

  return { handleSubmit, isLoading: mutation.isLoading };
};

export default useSubmitCarData;
