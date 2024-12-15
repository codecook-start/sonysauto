import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUp, ArrowDown } from "lucide-react";

const sortOptions = [
  {
    label: "Price",
    options: [
      {
        value: "price-asc",
        display: "Price",
        icon: <ArrowDown className="h-4 w-4" />,
      },
      {
        value: "price-desc",
        display: "Price",
        icon: <ArrowUp className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "Year",
    options: [
      {
        value: "year-desc",
        display: "Year",
        icon: <ArrowDown className="h-4 w-4" />,
      },
      {
        value: "year-asc",
        display: "Year",
        icon: <ArrowUp className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "Mileage",
    options: [
      {
        value: "mileage-desc",
        display: "Mileage",
        icon: <ArrowDown className="h-4 w-4" />,
      },
      {
        value: "mileage-asc",
        display: "Mileage",
        icon: <ArrowUp className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "Size",
    options: [
      {
        value: "size-desc",
        display: "Size",
        icon: <ArrowDown className="h-4 w-4" />,
      },
      {
        value: "size-asc",
        display: "Size",
        icon: <ArrowUp className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "Weight",
    options: [
      {
        value: "weight-desc",
        display: "Weight",
        icon: <ArrowDown className="h-4 w-4" />,
      },
      {
        value: "weight-asc",
        display: "Weight",
        icon: <ArrowUp className="h-4 w-4" />,
      },
    ],
  },
];

const SortSelect = ({
  onValueChange,
}: {
  onValueChange: (value: string) => void;
}) => {
  const [selectedSort, setSelectedSort] = useState<string | null>(null);

  const handleValueChange = (value: string) => {
    setSelectedSort(value);
    onValueChange(value);
  };

  return (
    <Select onValueChange={handleValueChange}>
      <SelectTrigger className="text-xs focus:ring-0">
        <SelectValue placeholder="Sort by" className="flex items-center gap-2">
          {selectedSort && (
            <span className="flex flex-row gap-2">
              {
                sortOptions
                  .flatMap((group) => group.options)
                  .find((option) => option.value === selectedSort)?.display
              }{" "}
              {
                sortOptions
                  .flatMap((group) => group.options)
                  .find((option) => option.value === selectedSort)?.icon
              }
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((group) => (
          <SelectGroup key={group.label}>
            <div className="grid grid-cols-3">
              <SelectItem
                value={group.options[0].value}
                className="mx-auto w-min"
              >
                {group.options[0].icon}
              </SelectItem>
              <SelectLabel>{group.label}</SelectLabel>
              <SelectItem
                value={group.options[1].value}
                className="mx-auto w-min"
              >
                {group.options[1].icon}
              </SelectItem>
            </div>
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SortSelect;
