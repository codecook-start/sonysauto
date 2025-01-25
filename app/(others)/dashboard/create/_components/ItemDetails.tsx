/* eslint-disable @next/next/no-img-element */
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CarFormFieldsAtom } from "@/jotai/dashboardAtom";
import { useSetAtom } from "jotai";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { MultiSelectWithCustomImageOptionControl } from "@/components/ui/multi-select-with-custom-image-option-control";
import { MultiSelectWithCustomOptionControl } from "@/components/ui/multi-select-with-custom-option-control";
import { useDetails } from "@/hooks/useDetails";
import useOptions from "@/hooks/useOptions";
import { capitalize, cn } from "@/lib/utils";
import { CarFormField } from "@/types/car";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, PencilIcon, Plus, Save, Trash2 } from "lucide-react";
import { Loader } from "react-feather";

const SortableItem: React.FC<{ field: CarFormField }> = ({ field }) => {
  const [editMode, setEditMode] = useState(false);
  const [listChecked, setListChecked] = useState(false);
  const [detailsChecked, setDetailsChecked] = useState(false);
  const setCarFormFields = useSetAtom(CarFormFieldsAtom);
  const {
    updateDetail: { mutate: updateField, isLoading: isUpdatingField },
    deleteDetail: { mutate: deleteField, isLoading: isDeletingField },
  } = useDetails();
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

  const options = (field.values || [])
    .map((v) => ({
      _id: v._id,
      label: v.name,
      value: v.name,
      icon: v.icon,
    }))
    .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));

  const selectedOptions = (field.selectedValues || [])
    .map((option) => ({
      _id: option._id,
      label: option.name,
      value: option.name,
      icon: option.icon,
    }))
    .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));

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
                ? Math.round(parseFloat(e.target.value) * 0.621371).toString() // No decimal places
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
                ? Math.round(parseFloat(e.target.value) / 0.621371).toString() // No decimal places
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

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    checkboxType: "list" | "detail",
  ) => {
    const isChecked = e.target.checked;
    console.log({ isChecked, id: field._id });
    setCarFormFields((prevFields) =>
      prevFields.map((f) =>
        f._id === field._id
          ? {
              ...f,
              [checkboxType === "list"
                ? "showInListPage"
                : "showInDetailsPage"]: isChecked,
            }
          : f,
      ),
    );
    if (checkboxType === "list") {
      setListChecked(isChecked);
    } else {
      setDetailsChecked(isChecked);
    }
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={listChecked}
              onChange={(e) => handleCheckboxChange(e, "list")}
            />
            <Label className="text-xs">List</Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={detailsChecked}
              onChange={(e) => handleCheckboxChange(e, "detail")}
            />
            <Label className="text-xs">Details</Label>
          </div>
        </div>
        {!field.type ||
        field.type === "dropdown" ||
        field.type === "image-dropdown" ? (
          field.type === "image-dropdown" ? (
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
  } = useDetails();

  const [isModalOpen, setModalOpen] = useState(false);
  const [fieldType, setFieldType] = useState<
    "text" | "dropdown" | "image-dropdown"
  >("dropdown");

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

  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleConfirmAddField = () => {
    addField({
      name: `new field ${carFormFields.length + 1}`,
      icon: "",
      type: fieldType,
    });
    setModalOpen(false);
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
              onClick={handleOpenModal}
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
      {/* Modal for Selecting Field Type */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-100 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold">Choose Field Type</h2>
            <div className="mb-4 flex gap-4">
              <Button
                onClick={() => setFieldType("text")}
                className={`rounded-md px-4 py-2 ${
                  fieldType === "text"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Text Input
              </Button>
              <Button
                onClick={() => setFieldType("image-dropdown")}
                className={`rounded-md px-4 py-2 ${
                  fieldType === "image-dropdown"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Image Dropdown
              </Button>
              <Button
                onClick={() => setFieldType("dropdown")}
                className={`rounded-md px-4 py-2 ${
                  fieldType === "dropdown"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Dropdown
              </Button>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                onClick={handleConfirmAddField}
                className="rounded-md bg-blue-500 px-4 py-2 text-white"
              >
                Add Field
              </Button>
              <Button
                onClick={() => setModalOpen(false)}
                className="rounded-md bg-gray-400 px-4 py-2 text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;
