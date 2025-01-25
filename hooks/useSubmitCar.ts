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
  const [section, setSection] = useAtom(CarSellerNotesAtom);
  const setImages = useSetAtom(imagesAtom);
  const { toast } = useToast();
  const {
    addOption: { mutateAsync: addCarDetailOption },
  } = useOptions();
  const {
    createParagraph: { mutateAsync: createParagraph },
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
    setSection([]);
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
    if (car.label) {
      formData.append("label", car.label._id);
    }
    mutation.mutate(formData);
    await queryClient.invalidateQueries("get-sections");
    await queryClient.invalidateQueries("get-sections-edit");
  }, [
    car.pages,
    car.title,
    car.price,
    car.extra,
    car.images,
    car.videos,
    car.label,
    carFormFields,
    features,
    section,
    setSection,
    mutation,
    queryClient,
    toast,
    generateTitle,
    addCarDetailOption,
    createParagraph,
  ]);

  return {
    handleSubmit,
    isLoading: mutation.isLoading,
    generateTitle,
  };
};

export default useSubmitCarData;
