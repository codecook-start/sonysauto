"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "react-feather";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCarouselData } from "@/hooks/useCarouselData";
import { Skeleton } from "@/components/ui/skeleton";

const CarouselSkeleton = () => (
  <div className="flex flex-col items-center justify-center p-4">
    <div
      className="mx-auto mb-6 flex flex-col items-center justify-between gap-4 rounded-md border p-8"
      style={{
        width: "min(calc(100% - 2rem), 40rem)",
      }}
    >
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-48 w-full" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  </div>
);

const Carousel = ({ title }: { title: string }) => {
  const { carouselData, isLoading, isError, error, saveData, isSaving } =
    useCarouselData(title);
  const [localData, setLocalData] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (carouselData) {
      setLocalData(JSON.stringify(carouselData));
    }
  }, [carouselData]);

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: `Failed to load carousel data: ${error?.message}`,
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (content) {
          try {
            const parsedData = JSON.parse(content as string);
            setLocalData(JSON.stringify(parsedData));
          } catch (error) {
            console.error("Invalid JSON file", error);
            toast({
              title: "Error",
              description: "Invalid JSON file",
              variant: "destructive",
            });
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExportJson = (fileName: string) => {
    if (localData.length === 0) {
      toast({
        title: "Error",
        description: "No data to export.",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([localData], { type: "application/json" });
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export JSON", error);
    }
  };

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setLocalData(event.target.value);
  };

  const handleSaveToServer = () => {
    try {
      const parsedData = JSON.parse(localData);
      saveData(parsedData);
    } catch (error) {
      console.error("Invalid JSON structure in textarea.", error);
      toast({
        title: "Error",
        description: "Invalid JSON structure. Please check your input.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <CarouselSkeleton />;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className="mx-auto mb-6 flex flex-col items-center justify-between gap-4 rounded-md border p-8"
        style={{
          width: "min(calc(100% - 2rem), 40rem)",
        }}
      >
        <h2 className="text-center text-2xl font-semibold">{title}</h2>
        <Textarea
          value={localData}
          onChange={handleTextareaChange}
          className="h-48 w-full"
        />
        <div className="flex items-center gap-4">
          <label className="cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant={"ghost"}
              className="flex items-center gap-2"
            >
              <Upload />
              Upload JSON
            </Button>
          </label>

          <Button
            onClick={() =>
              handleExportJson(`${title.toLowerCase()}-carousel.json`)
            }
            variant={"ghost"}
            className="flex items-center gap-2"
          >
            <Download />
            Export JSON
          </Button>

          <Button
            onClick={handleSaveToServer}
            variant="default"
            className="flex items-center gap-2"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save to Server"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const CarouselsContainer = () => {
  return (
    <div className="my-8">
      <Carousel title="Landing Page Carousel" />
      <Carousel title="Japan Carousel" />
      <Carousel title="Cayman Carousel" />
      <Carousel title="Shipping Carousel" />
      <Carousel title="Reserved Carousel" />
    </div>
  );
};

export default CarouselsContainer;
