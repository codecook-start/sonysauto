"use client";

import { Button } from "@/components/ui/button";
import { Gauge, ArrowUp, ArrowDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { X } from "lucide-react";

export const MileageSort = ({ onValueChange }: { onValueChange: (value: string) => void }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
    <div className="relative group h-9">
      <Button
	  variant="ghost"
		size="icon"
		className="h-9 w-9 text-white hover:bg-gray-700/50 hover:text-white rounded-none absolute right-0" // Force white on hover
		onClick={() => setOpen(true)}
	  title="Sort by Mileage"
	>
	  <Gauge className="h-4 w-4" />
	</Button>

  {/* Sliding label with bold white text */}
  <div className="absolute right-9 top-0 h-full overflow-hidden">
          <div className="h-full flex items-center bg-gray-700/50 px-3 whitespace-nowrap transform transition-all duration-300 ease-out translate-x-full group-hover:translate-x-0">
            <span className="text-sm font-bold text-white">Mileage</span>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[325px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Mileage
              <button onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              variant="outline"
              onClick={() => {
                onValueChange("mileage-asc");
                setOpen(false);
              }}
            >
              <ArrowUp className="mr-2 h-4 w-4" />
              Low Mileage
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onValueChange("mileage-desc");
                setOpen(false);
              }}
            >
              <ArrowDown className="mr-2 h-4 w-4" />
              High Mileage
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};