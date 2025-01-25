/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { useSetAtom } from "jotai";
import { CarFormFieldsEditAtom } from "@/jotai/dashboardAtom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, PencilIcon, Plus, Save, Trash2 } from "lucide-react";
import { CarFormField } from "@/types/car";
import { capitalize, cn, isDropdown, isImageDropdown } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader } from "react-feather";
import { MultiSelectWithCustomImageOptionControl } from "@/components/ui/multi-select-with-custom-image-option-control";
import useOptions from "@/hooks/useOptions";
import { MultiSelectWithCustomOptionControl } from "@/components/ui/multi-select-with-custom-option-control";
import { useEditDetails } from "@/hooks/useEditDetails";

const SortableItem: React.FC<{ field: CarFormField }> = ({ field }) => {
  const [editMode, setEditMode] = useState(false);
  const setCarFormFields = useSetAtom(CarFormFieldsEditAtom);
  const {
    updateDetail: { mutate: updateField, isLoading: isUpdatingField },
    deleteDetail: { mutate: deleteField, isLoading: isDeletingField },
  } = useEditDetails();
  const {
    addOption: { mutate: addOption, isLoading: isAddingOption },
    updateOption: { mutate: updateOption, isLoading: isUpdatingOption },
    deleteOption: { mutate: deleteOption, isLoading: isDeletingOption },
  } = useOptions();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    boxShadow: isDragging
      ? "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
      : "",
  };

  const handleEdit = () => setEditMode((prev) => !prev);

  const handleDelete = () => {
    deleteField(field._id);
  };

  const handleChangeName = (name: string) => {
    setCarFormFields((prevFields) =>
      prevFields.map((f) => (f._id === field._id ? { ...f, name } : f)),
    );
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("name", field.name);
    updateField({ id: field._id, formData });
    setEditMode(false);
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    updateField({ id: field._id, formData });
  };

  const handleIconChange = (_id: string, icon: File) => {
    const formData = new FormData();
    formData.append("icon", icon);
    updateOption({
      id: _id,
      formData,
    });
  };

  const options = (field.values || []).map((v) => ({
    _id: v._id,
    label: v.name,
    value: v.name,
    icon: v.icon,
  }));

  const selectedOptions = (field.selectedValues || []).map((option) => ({
    _id: option._id,
    label: option.name,
    value: option.name,
    icon: option.icon,
  }));

  const handleValueChange = (ops: typeof options) => {
    setCarFormFields((prevFields) =>
      prevFields.map((f) =>
        f._id === field._id
          ? {
              ...f,
              selectedValues: ops.map((op) => ({
                ...op,
                detailId: f._id,
                name: op.value,
              })),
            }
          : f,
      ),
    );
  };

  const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCarFormFields((prevFields) => {
      if (field.name.toLowerCase() === "kilometers") {
        return prevFields.map((f) => {
          if (f.name.toLowerCase() === "miles") {
            return {
              ...f,
              value: e.target.value
                ? (parseFloat(e.target.value) * 0.621371).toFixed(2).toString()
                : "",
            };
          }
          return f._id === field._id
            ? {
                ...f,
                value: e.target.value,
              }
            : f;
        });
      } else if (field.name.toLowerCase() === "miles") {
        return prevFields.map((f) => {
          if (f.name.toLowerCase() === "kilometers") {
            return {
              ...f,
              value: e.target.value
                ? (parseFloat(e.target.value) / 0.621371).toFixed(2).toString()
                : "",
            };
          }
          return f._id === field._id
            ? {
                ...f,
                value: e.target.value,
              }
            : f;
        });
      }
      return prevFields.map((f) => {
        return f._id === field._id
          ? {
              ...f,
              value: e.target.value,
            }
          : f;
      });
    });
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
        className="mb-1.5 mt-auto cursor-move py-1"
        title="Drag"
      >
        <GripVertical className="h-5 w-5 text-gray-500" />
      </div>
      <div className="form-group w-full space-y-2">
        <div className="flex items-center gap-2">
          {(isAddingOption || isDeletingOption || isUpdatingOption) && (
            <Loader className="animate-spin text-xs text-gray-500" />
          )}
          <button
            title="Upload Icon"
            className={cn(
              "relative flex h-10 w-10 flex-shrink-0 cursor-pointer overflow-hidden rounded-full bg-neutral-300",
              {
                "animate-pulse": isUpdatingField,
                "rounded-none bg-transparent": field.icon,
              },
            )}
          >
            {field.icon && (
              <img
                src={"/" + field.icon}
                alt="field"
                loading="lazy"
                fetchPriority="low"
                className={cn(
                  "h-10 w-10 cursor-pointer rounded-full object-contain object-center",
                  {
                    "animate-pulse": isUpdatingField,
                    "rounded-none": !!field.icon,
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
              id={field._id}
              value={field.name}
              onChange={(e) => handleChangeName(e.target.value)}
              type="text"
              placeholder={field.name}
              className="text-xs"
            />
          ) : (
            <Label className="capitalize" htmlFor={field._id}>
              {capitalize(field.name)}
            </Label>
          )}
          <div className="right ml-auto flex gap-4">
            {!editMode ? (
              <PencilIcon
                className="cursor-pointer"
                size="1em"
                onClick={handleEdit}
              />
            ) : (
              <>
                <Save
                  size="1em"
                  className="cursor-pointer text-green-500"
                  onClick={handleSave}
                />
                {isUpdatingField && <Loader className="animate-spin" />}
              </>
            )}
            <Trash2
              size="1em"
              className={cn("cursor-pointer text-red-500", {
                "animate-spin": isDeletingField,
                "cursor-not-allowed": isDeletingField,
              })}
              onClick={handleDelete}
            />
          </div>
        </div>
        {isDropdown(field) ? (
          isImageDropdown(field) ? (
            <MultiSelectWithCustomImageOptionControl
              options={options}
              selectedOptions={selectedOptions}
              placeholder={`Enter ${capitalize(field.name)}`}
              onValueChange={handleValueChange}
              maxSelectedValues={1}
              animation={0}
              allowDelete
              onOptionDelete={(option) => {
                deleteOption(option);
              }}
              onIconChange={handleIconChange}
              onOptionAdd={(option) => {
                const formData = new FormData();
                formData.append("detailId", field._id);
                formData.append("name", option.value);
                addOption(formData);
              }}
            />
          ) : (
            <MultiSelectWithCustomOptionControl
              options={options}
              selectedOptions={selectedOptions}
              placeholder={`Enter ${capitalize(field.name)}`}
              onValueChange={handleValueChange}
              maxSelectedValues={1}
              animation={0}
              allowDelete
              onOptionDelete={(option) => {
                deleteOption(option);
              }}
              onOptionAdd={(option) => {
                const formData = new FormData();
                formData.append("detailId", field._id);
                formData.append("name", option.value);
                addOption(formData);
              }}
            />
          )
        ) : (
          <Input
            type="text"
            placeholder={`Enter ${capitalize(field.name)}`}
            className="text-xs"
            value={field.value}
            onChange={handleInputValueChange}
          />
        )}
      </div>
    </div>
  );
};

const ItemDetails: React.FC = () => {
  const {
    carFormFields,
    setCarFormFields,
    addDetail: { mutate: addField, isLoading: isAddingField },
    saveOrder: { mutate: saveOrder, isLoading: isPatching },
  } = useEditDetails();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setCarFormFields((prevFields) => {
        const oldIndex = prevFields.findIndex((f) => f._id === active.id);
        const newIndex = prevFields.findIndex((f) => f._id === over?.id);
        return arrayMove(prevFields, oldIndex, newIndex);
      });
    }
  };

  const handleAddField = () => {
    addField({
      name: `new field ${carFormFields.length + 1}`,
      icon: "",
    });
  };

  return (
    <div className="container-md my-8 space-y-4">
      <header className="flex items-center justify-between bg-gray-100 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Label className="font-medium text-gray-700">
            Car Details ({carFormFields.length})
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
          items={carFormFields.map((field) => field._id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {carFormFields.map((field) => (
              <SortableItem key={field._id} field={field} />
            ))}
            <Button
              title="Add Item Detail"
              onClick={handleAddField}
              disabled={isAddingField}
              className={`mt-5 flex flex-1 items-center justify-center rounded-md border bg-neutral-100 py-3 text-black transition-colors duration-150 hover:bg-neutral-200 ${
                isAddingField ? "animate-pulse cursor-not-allowed" : ""
              }`}
              style={{
                height: "5.15em",
              }}
            >
              {isAddingField ? (
                <Loader className="animate-spin" size={"1.5em"} />
              ) : (
                <Plus size={"1.5em"} />
              )}
            </Button>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ItemDetails;
