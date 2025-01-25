/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { GripVertical, PencilIcon, Plus, Save, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { capitalize, cn } from "@/lib/utils";
import { Loader } from "react-feather";
import useFeatures from "@/hooks/useFeatures";
import { Feature } from "@/types/car";

type SortableItemProps = {
  feature: Feature;
};

const SortableItem: React.FC<SortableItemProps> = ({ feature }) => {
  const [editMode, setEditMode] = useState(false);
  const [featureName, setFeatureName] = useState(feature.name);
  const {
    setFeatures,
    deleteFeature: { mutate: deleteFeature, isLoading: isDeleting },
    updateFeature: { mutate: updateFeature, isLoading: isUpdating },
  } = useFeatures();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: feature._id });

  const toggleFeature = () => {
    setFeatures((prev) =>
      prev.map((f) =>
        f._id === feature._id ? { ...f, checked: !f.checked } : f,
      ),
    );
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("id", feature._id);
    formData.append("name", featureName);
    updateFeature(formData);
    setEditMode(false);
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("icon", file);
    formData.append("id", feature._id);
    updateFeature(formData);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded bg-white py-2"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-move py-1"
        title="Drag"
      >
        <GripVertical className="h-5 w-5 text-gray-500" />
      </div>

      <Checkbox
        id={feature._id}
        checked={feature.checked}
        onCheckedChange={toggleFeature}
      />
      <button
        title="Upload Icon"
        className={cn(
          "relative flex h-10 w-10 flex-shrink-0 cursor-pointer overflow-hidden rounded-full bg-neutral-300",
          {
            "animate-pulse": isUpdating,
            "rounded-none bg-transparent": feature.icon,
          },
        )}
      >
        {feature.icon && (
          <img
            src={"/" + feature.icon}
            alt="feature"
            loading="lazy"
            fetchPriority="low"
            className={cn(
              "h-10 w-10 cursor-pointer rounded-full object-contain object-center",
              {
                "animate-pulse": isUpdating,
                "rounded-none": !!feature.icon,
              },
            )}
          />
        )}
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 cursor-pointer opacity-0"
          onInput={(e) => {
            e.stopPropagation();
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              handleImageUpload(file);
            }
          }}
        />
      </button>
      {editMode ? (
        <Input
          value={featureName}
          onChange={(e) => setFeatureName(e.target.value)}
          type="text"
          className="flex-1 text-xs"
        />
      ) : (
        <Label className="capitalize" htmlFor={feature._id}>
          {capitalize(featureName)}
        </Label>
      )}

      {!editMode ? (
        <PencilIcon
          className="ml-auto cursor-pointer"
          size="1rem"
          onClick={() => setEditMode(true)}
        />
      ) : isUpdating ? (
        <Loader className="ml-auto animate-spin text-green-500" size="1rem" />
      ) : (
        <>
          <X
            size="1rem"
            className="ml-auto cursor-pointer"
            onClick={() => setEditMode(false)}
          />
          <Save
            size="1rem"
            className="cursor-pointer text-green-500"
            onClick={handleSave}
          />
        </>
      )}

      {isDeleting ? (
        <Loader className="animate-spin text-red-500" size="1rem" />
      ) : (
        <Trash2
          onClick={() => deleteFeature(feature._id)}
          size="1rem"
          className="cursor-pointer text-red-500"
        />
      )}
    </div>
  );
};

const ItemFeatures: React.FC = () => {
  const {
    features,
    setFeatures,
    createFeature: { mutate: createFeature, isLoading: isCreating },
    saveOrder: { mutate: saveOrder, isLoading: isPatching },
  } = useFeatures();

  const handleCreateFeature = () => {
    const formData = new FormData();
    formData.append("name", `new feature ${features.length + 1}`);
    createFeature(formData);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setFeatures((prev) => {
        const oldIndex = prev.findIndex((f) => f._id === active.id);
        const newIndex = prev.findIndex((f) => f._id === over?.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="container-md my-8 space-y-4">
      <header className="flex items-center justify-between bg-gray-100 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Label className="font-medium text-gray-700">
            Car Features ({features.length})
          </Label>
          <div className="h-6 w-px bg-gray-300"></div>
          {isPatching ? (
            <Loader className="animate-spin text-gray-500" size="1.25em" />
          ) : (
            <Button
              title="Save Order"
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
              onClick={saveOrder}
            >
              <Save size="1.25em" className="cursor-pointer" />
              <span className="text-sm font-medium">Save Order</span>
            </Button>
          )}
        </div>
      </header>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={features.map((feature) => feature._id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <SortableItem key={feature._id} feature={feature} />
            ))}
            <Button
              title="Add Car Feature"
              onClick={handleCreateFeature}
              className="flex items-center justify-center rounded-md border bg-neutral-100 py-3 text-black hover:text-white"
            >
              {isCreating ? (
                <Loader className="animate-spin" size="1.5em" />
              ) : (
                <Plus size="1.5em" />
              )}
            </Button>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ItemFeatures;
