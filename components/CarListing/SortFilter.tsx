"use client";

import SortSelect from "./SortSelect";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { X } from "lucide-react";

export const SortFilter = ({ onValueChange }: { onValueChange: (value: string) => void }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        onClick={() => setOpen(true)}
        title="Sort"
      >
        <Filter className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Sort Options
              <button onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <SortSelect onValueChange={onValueChange} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};