/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, XCircle, ChevronDown, XIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const multiSelectVariants = cva(
  "m-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 text-foreground bg-card hover:bg-card/80",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface Option {
  _id: string;
  label: string;
  value: string;
  icon: string | null;
}

interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  options: Option[];
  onValueChange: (value: Option[]) => void;
  // onIconChange?: (_id: string, newIcon: File) => void;
  defaultOptions?: Option[];
  selectedOptions?: Option[];
  placeholder?: string;
  animation?: number;
  maxCount?: number;
  modalPopover?: boolean;
  asChild?: boolean;
  className?: string;
  maxSelectedValues?: number;
  allowDelete?: boolean;
  onOptionDelete?: (_id: string) => void;
  onOptionAdd?: (option: Option) => void;
}

export const MultiSelectWithCustomOptionControl = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      // onIconChange,
      variant,
      defaultOptions = [],
      selectedOptions = [],
      placeholder = "Select options",
      animation = 0,
      maxCount = 3,
      modalPopover = false,
      className,
      maxSelectedValues = Infinity,
      allowDelete = false,
      onOptionDelete,
      onOptionAdd,
      ...props
    },
    ref,
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<Option[]>(
      selectedOptions || defaultOptions,
    );
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    React.useEffect(() => {
      if (
        selectedOptions !== undefined &&
        !arraysEqual(selectedOptions, selectedValues)
      ) {
        setSelectedValues(selectedOptions);
      }
    }, [selectedValues, selectedOptions]);

    const arraysEqual = (a: Option[], b: Option[]) => {
      if (a.length !== b.length) return false;
      return a.every((val, index) => val._id === b[index]._id);
    };

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (event.key === "Enter" && inputValue) {
        if (
          !selectedValues.some((val) => val.value === inputValue) &&
          selectedValues.length < maxSelectedValues
        ) {
          if (!inputValue) return;
          const newOption: Option = {
            _id: uuidv4(),
            label: inputValue,
            value: inputValue,
            icon: null,
          };
          onOptionAdd?.(newOption);
          // toggleOption(newOption);
          setInputValue("");
        }
      } else if (event.key === "Backspace" && !inputValue) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    const toggleOption = (option: Option) => {
      setSelectedValues((prev) => {
        const isSelected = prev.some((val) => val._id === option._id);
        const newValues = isSelected
          ? prev.filter((val) => val._id !== option._id)
          : [...prev, option];

        if (newValues.length <= maxSelectedValues) {
          onValueChange(newValues);
          return newValues;
        }
        return prev;
      });
    };

    const handleClear = (event: React.MouseEvent) => {
      event.stopPropagation();
      setSelectedValues([]);
      onValueChange([]);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = (event: React.MouseEvent) => {
      event.stopPropagation();
      const newSelectedValues = selectedValues.slice(0, maxCount);
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const toggleAll = () => {
      if (selectedValues.length === options.length) {
        setSelectedValues([]);
        onValueChange([]);
      } else {
        const allValues = options.slice(0, maxSelectedValues);
        setSelectedValues(allValues);
        onValueChange(allValues);
      }
    };

    const handleRemoveOption = (event: React.MouseEvent, option: Option) => {
      event.stopPropagation();
      toggleOption(option);
    };

    const handleDeleteOption = (option: Option, event: React.MouseEvent) => {
      event.stopPropagation();
      onOptionDelete?.(option._id);
      const newSelectedValues = selectedValues.filter(
        (val) => val._id !== option._id,
      );
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    // const handleImageChange = (
    //   _id: string,
    //   event: React.ChangeEvent<HTMLInputElement>,
    // ) => {
    //   event.stopPropagation();
    //   const file = event.target.files?.[0];
    //   if (file && onIconChange) {
    //     onIconChange(_id, file);
    //   }
    // };

    // const renderIcon = (option: Option) => {
    //   return (
    //     <div className="relative mr-2 flex h-4 w-4 cursor-pointer overflow-hidden rounded-full bg-neutral-300">
    //       <img
    //         src={option.icon || ""}
    //         alt={option.label}
    //         className="h-full w-full cursor-pointer rounded-full object-cover object-center"
    //         onError={(e) => {
    //           (e.target as HTMLImageElement).src = "";
    //         }}
    //       />
    //       {onIconChange && (
    //         <input
    //           type="file"
    //           accept="image/*"
    //           className="absolute inset-0 cursor-pointer opacity-0"
    //           onChange={(e) => handleImageChange(option._id, e)}
    //           onClick={(e) => e.stopPropagation()}
    //         />
    //       )}
    //     </div>
    //   );
    // };

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        modal={modalPopover}
      >
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            className={cn(
              "flex h-auto min-h-10 w-full items-center justify-between rounded-md border bg-inherit p-1 hover:bg-inherit",
              className,
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-wrap items-center">
                  {selectedValues.slice(0, maxCount).map((option) => (
                    <Badge
                      key={option._id}
                      className={cn(multiSelectVariants({ variant }))}
                      style={{ animationDuration: `${animation}s` }}
                    >
                      {/* {renderIcon(option)} */}
                      {option.label}
                      <XCircle
                        className="ml-2 h-4 w-4 cursor-pointer"
                        onClick={(event) => handleRemoveOption(event, option)}
                      />
                    </Badge>
                  ))}
                  {selectedValues.length > maxCount && (
                    <Badge
                      className={cn(
                        "border-foreground/1 bg-transparent text-foreground hover:bg-transparent",
                        multiSelectVariants({ variant }),
                      )}
                      style={{ animationDuration: `${animation}s` }}
                    >
                      +{selectedValues.length - maxCount} more
                      <XCircle
                        className="ml-2 h-4 w-4 cursor-pointer"
                        onClick={clearExtraOptions}
                      />
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <XIcon
                    className="mx-2 h-4 cursor-pointer text-muted-foreground"
                    onClick={handleClear}
                  />
                  <Separator
                    orientation="vertical"
                    className="flex h-full min-h-6"
                  />
                  <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="mx-auto flex w-full items-center justify-between">
                <span className="mx-3 text-sm text-muted-foreground">
                  {placeholder}
                </span>
                <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Type to search or add..."
              onKeyDown={handleInputKeyDown}
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>
                {selectedValues.length < maxSelectedValues ? (
                  <div
                    onClick={() => {
                      if (!inputValue) return;
                      const newOption: Option = {
                        _id: uuidv4(),
                        label: inputValue,
                        value: inputValue,
                        icon: null,
                      };
                      onOptionAdd?.(newOption);
                      // toggleOption(newOption);
                      setInputValue("");
                    }}
                    className="cursor-pointer"
                  >
                    Add {inputValue && `"${inputValue}"`}
                  </div>
                ) : (
                  "Max selections reached."
                )}
              </CommandEmpty>
              <CommandGroup>
                {maxSelectedValues !== 1 && (
                  <CommandItem
                    key="all"
                    onSelect={toggleAll}
                    className="cursor-pointer"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selectedValues.length === options.length
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    <span>(Select All)</span>
                  </CommandItem>
                )}
                {options.map((option) => {
                  const isSelected = selectedValues.some(
                    (val) => val._id === option._id,
                  );
                  return (
                    <CommandItem
                      key={option._id}
                      onSelect={() => toggleOption(option)}
                      className={cn(
                        "cursor-pointer",
                        !isSelected &&
                          selectedValues.length >= maxSelectedValues &&
                          "opacity-50",
                      )}
                    >
                      <div className="flex flex-1 items-center">
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible",
                          )}
                        >
                          <CheckIcon className="h-4 w-4" />
                        </div>
                        {/* {renderIcon(option)} */}
                        <span>{option.label}</span>
                      </div>
                      {allowDelete && (
                        <XIcon
                          className="ml-2 h-4 w-4 cursor-pointer text-muted-foreground"
                          onClick={(event) => handleDeleteOption(option, event)}
                        />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

MultiSelectWithCustomOptionControl.displayName =
  "MultiSelectWithCustomOptionControl";
