import React, { useState } from "react";
import { useAtom } from "jotai";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelectWithCustomColorOptionControl } from "@/components/ui/multi-select-with-custom-color-option-control";
import { Save, X } from "lucide-react";
import { useCarLabel } from "@/hooks/useCarLabel";
import { CarLocalAtom } from "@/jotai/dashboardAtom";
import type { CarLabel as CarLabelType } from "@/types/car";

const CarLabel = () => {
  const [car, setCar] = useAtom(CarLocalAtom);
  const [editLabel, setEditLabel] = useState<CarLabelType | null>(null);
  const [editForm, setEditForm] = useState<CarLabelType>({
    _id: "",
    name: "",
    color: null,
    bgColor: null,
  });

  const {
    carLabels,
    carLabelQuery: { isLoading },
    deleteCarLabel: { mutate: deleteCarLabel, isLoading: isDeleting },
    addCarLabel: { mutate: addCarLabel, isLoading: isAdding },
    updateCarLabel: { mutate: editCarLabel, isLoading: isEditing },
  } = useCarLabel();
  const handleCarLabelChange = (selectedOptions: CarLabelType[]) => {
    setCar((prev) => ({
      ...prev,
      label: selectedOptions[0],
    }));
  };

  const openEditModal = (label: CarLabelType) => {
    setEditLabel(label);
    setEditForm(label);
  };

  const handleEditSave = () => {
    if (editLabel) {
      editCarLabel({
        id: editLabel._id,
        ...editForm,
      });
      setEditLabel(null);
    }
  };

  return (
    <div className="container-md mt-8 space-y-2">
      <Label>Label</Label>
      {isLoading ? (
        <Skeleton className="h-10 w-full rounded-md" />
      ) : (
        <MultiSelectWithCustomColorOptionControl
          options={carLabels}
          selectedOptions={car?.label ? [car?.label] : []}
          onValueChange={handleCarLabelChange}
          maxSelectedValues={1}
          animation={0}
          allowDelete
          onEdit={openEditModal}
          onOptionDelete={(id) => {
            deleteCarLabel(id);
            if (car.label?._id === id) {
              setCar((prev) => ({ ...prev, label: undefined }));
            }
          }}
          onOptionAdd={(label) => {
            addCarLabel(label);
          }}
        />
      )}

      {/* Edit Modal */}
      <Dialog
        open={!!editLabel}
        onOpenChange={(open) => !open && setEditLabel(null)}
      >
        <DialogContent className="p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">
              Edit Label
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="mb-1 block text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="color" className="mb-1 block text-sm font-medium">
                Color
              </Label>
              <Input
                id="color"
                type="color"
                value={editForm.color || "#FFFFFF"}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, color: e.target.value }))
                }
              />
            </div>
            <div>
              <Label
                htmlFor="bgColor"
                className="mb-1 block text-sm font-medium"
              >
                Background Color
              </Label>
              <Input
                id="bgColor"
                type="color"
                value={editForm.bgColor || "#000000"}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, bgColor: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter className="mt-6 flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => setEditLabel(null)}
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </Button>
            <Button
              onClick={handleEditSave}
              disabled={isEditing}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isEditing ? "Saving..." : "Save"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loading Indicator for Add/Delete */}
      {(isAdding || isDeleting) && (
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Skeleton className="h-4 w-4 rounded-full" />
          <span>Processing changes...</span>
        </div>
      )}
    </div>
  );
};

export default CarLabel;
