"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { X } from "lucide-react";
import { List } from "lucide-react";

export const PerPageFilter = ({
  limit,
  onValueChange,
}: {
  limit: number;
  onValueChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
    <div className="relative group h-9">
      <Button
	  variant="ghost"
		size="icon"
		className="h-9 w-9 text-white hover:bg-gray-700/50 hover:text-white rounded-none absolute right-0" // Force white on hover
		onClick={() => setOpen(true)}
	  title="Items per page"
	>
	  <List className="h-4 w-4" />
	</Button>

   {/* Sliding label with bold white text */}
   <div className="absolute right-9 top-0 h-full overflow-hidden">
          <div className="h-full flex items-center bg-gray-700/50 px-3 whitespace-nowrap transform transition-all duration-300 ease-out translate-x-full group-hover:translate-x-0">
            <span className="text-sm font-bold text-white">Items Per Page</span>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Items Per Page
              <button onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select value={limit.toString()} onValueChange={onValueChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="32">32</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};