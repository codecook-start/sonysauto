"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, GripVertical, Trash } from "lucide-react";
import { useAtom } from "jotai";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { imagesEditAtom } from "@/jotai/imagesAtom";
import { nanoid } from "nanoid";

type UploadedImage = {
  file?: File;
  path?: string;
  url?: string;
  _id: string;
  type?: "new" | "old";
};

const SortableThumbnail: React.FC<{
  image: UploadedImage;
  index: number;
  selectedIndex: number;
  handleRemoveImage: (index: number) => void;
  setSelectedIndex: (index: number) => void;
}> = ({ image, index, selectedIndex, handleRemoveImage, setSelectedIndex }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: image._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => setSelectedIndex(index)}
      className={`relative cursor-pointer rounded-md border-2 ${
        selectedIndex === index ? "border-blue-500" : "border-gray-300"
      }`}
    >
      {image.type === "old" ? (
        <img
          src={"/" + image.path}
          alt={image.path}
          className="h-20 w-full object-cover"
          loading="lazy"
          fetchPriority="low"
        />
      ) : (
        <img
          src={image.url}
          alt={image.file!.name}
          className="h-20 w-full object-cover"
          loading="lazy"
          fetchPriority="low"
        />
      )}
      <Button
        {...attributes}
        {...listeners}
        className="absolute aspect-square h-10 rounded-full border border-gray-100 bg-white p-1 shadow hover:bg-gray-100"
        style={{
          top: "-0.5rem",
          left: "-0.5rem",
        }}
      >
        <GripVertical size={16} color="black" />
      </Button>
      <Button
        className="absolute aspect-square h-10 rounded-full border border-white/30 bg-red-600 p-1 shadow"
        style={{
          top: "-0.5rem",
          right: "-0.5rem",
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleRemoveImage(index);
        }}
      >
        <Trash size={16} color="white" />
      </Button>
    </div>
  );
};

const ItemImages = () => {
  const [images, setImages] = useAtom(imagesEditAtom);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files
      .map((file) => {
        if (!file) return;
        return {
          file,
          url: URL.createObjectURL(file),
          _id: nanoid(),
          type: "new",
        };
      })
      .filter(Boolean) as UploadedImage[];
    if (!newImages.length) return;
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, imgIndex) => imgIndex !== index);
    setImages(updatedImages);
    if (index === selectedIndex && updatedImages.length > 0) {
      setSelectedIndex(0);
    } else if (updatedImages.length === 0) {
      setSelectedIndex(-1);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !active) {
      return;
    }

    if (active.id !== over.id) {
      setImages((prevImages) => {
        const oldIndex = prevImages.findIndex((img) => img._id === active.id);
        const newIndex = prevImages.findIndex((img) => img._id === over.id);
        return arrayMove(prevImages, oldIndex, newIndex);
      });
    }
  };

  const currImage =
    images[selectedIndex]?.type === "old"
      ? "/" + images[selectedIndex]?.path
      : images[selectedIndex]?.url;

  return (
    <div className="container-md my-8 space-y-8">
      <div className="form-group space-y-2">
        <Label>Images*</Label>
        <div className="flex items-start justify-between">
          <div className="w-1/2 flex-1">
            <Input
              ref={inputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="my-4 hidden border p-4"
            />
          </div>
          <div
            onClick={() => inputRef.current?.click()}
            className="carousel-main flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border hover:bg-neutral-100"
            title="Click to upload images"
          >
            {currImage ? (
              <img
                src={currImage}
                alt={`carousel-image-${selectedIndex}`}
                className="h-full w-full object-cover"
                loading="lazy"
                fetchPriority="low"
              />
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2">
                <Camera size={48} />
              </div>
            )}
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="form-group space-y-2">
          <Label>Image Thumbnails</Label>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((image) => image._id)}
              strategy={rectSortingStrategy}
            >
              <div className="carousel-thumbnails grid grid-cols-3 gap-4 rounded-md border p-4 md:grid-cols-4 lg:grid-cols-6">
                {images.map((image, index) => (
                  <SortableThumbnail
                    key={image._id}
                    image={image}
                    index={index}
                    selectedIndex={selectedIndex}
                    handleRemoveImage={handleRemoveImage}
                    setSelectedIndex={setSelectedIndex}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default ItemImages;
