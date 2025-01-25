/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, XCircle, ChevronDown, XIcon } from "lucide-react";

import { cn, removeQuotes } from "@/lib/utils";
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
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  filterIcon?: string | File;
}

interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  options: Option[];
  onValueChange: (value: string[]) => void;
  onFilterIconChange?: (value: string, newIcon: File) => void;
  defaultValue?: string[];
  value?: string[];
  placeholder?: string;
  animation?: number;
  maxCount?: number;
  modalPopover?: boolean;
  className?: string;
  maxSelectedValues?: number;
  allowDelete?: boolean;
  onOptionDelete?: (option: string) => void;
}

export const MultiSelectWithCustomImage = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      onFilterIconChange,
      variant,
      defaultValue = [],
      value = [],
      placeholder = "Select options",
      animation = 0,
      maxCount = 3,
      modalPopover = false,
      className,
      maxSelectedValues = Infinity,
      allowDelete = false,
      onOptionDelete,
      ...props
    },
    ref,
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(
      value || defaultValue,
    );
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    React.useEffect(() => {
      if (value !== undefined && !arraysEqual(value, selectedValues)) {
        setSelectedValues(value);
      }
    }, [selectedValues, value]);

    const arraysEqual = (a: string[], b: string[]) => {
      if (a.length !== b.length) return false;
      return a.every((val, index) => val === b[index]);
    };

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (event.key === "Enter" && inputValue) {
        if (
          !selectedValues.includes(inputValue) &&
          selectedValues.length < maxSelectedValues
        ) {
          toggleOption(inputValue);
        }
        setInputValue("");
      } else if (event.key === "Backspace" && !inputValue) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    const toggleOption = (optionValue: string) => {
      setSelectedValues((prev) => {
        const newValues = prev.includes(optionValue)
          ? prev.filter((value) => value !== optionValue)
          : [...prev, optionValue];

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
        const allValues = options
          .map((option) => option.value)
          .slice(0, maxSelectedValues);
        setSelectedValues(allValues);
        onValueChange(allValues);
      }
    };

    const handleRemoveOption = (event: React.MouseEvent, value: string) => {
      event.stopPropagation();
      toggleOption(value);
    };

    const handleDeleteOption = (
      optionValue: string,
      event: React.MouseEvent,
    ) => {
      event.stopPropagation();
      onOptionDelete?.(optionValue);
      const newSelectedValues = selectedValues.filter(
        (value) => value !== optionValue,
      );

      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const handleImageChange = (
      optionValue: string,
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      event.stopPropagation();
      const file = event.target.files?.[0];
      if (file && onFilterIconChange) {
        onFilterIconChange(optionValue, file);
      }
    };

    const renderFilterIcon = (option: Option) => {
      const iconSrc =
        option.filterIcon instanceof File
          ? URL.createObjectURL(option.filterIcon)
          : `${window.location.origin}/${removeQuotes(option.filterIcon || "")}`;
      return (
        <div className="relative mr-2 flex h-4 w-4 cursor-pointer overflow-hidden rounded-full bg-neutral-300">
          <img
            src={iconSrc}
            alt="option"
            className="h-full w-full cursor-pointer rounded-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "";
            }}
            loading="lazy"
            fetchPriority="low"
          />
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={(e) => handleImageChange(option.value, e)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      );
    };

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
                  {selectedValues.slice(0, maxCount).map((value) => {
                    const option = options.find((o) => o.value === value);
                    return option ? (
                      <Badge
                        key={value}
                        className={cn(multiSelectVariants({ variant }))}
                        style={{ animationDuration: `${animation}s` }}
                      >
                        {renderFilterIcon(option)}
                        {option.label}
                        <XCircle
                          className="ml-2 h-4 w-4 cursor-pointer"
                          onClick={(event) => handleRemoveOption(event, value)}
                        />
                      </Badge>
                    ) : null;
                  })}
                  {selectedValues.length > maxCount && (
                    <Badge
                      className={cn(
                        "border-foreground/1 bg-transparent text-foreground hover:bg-transparent",
                        multiSelectVariants({ variant }),
                      )}
                      style={{ animationDuration: `${animation}s` }}
                    >
                      {`+ ${selectedValues.length - maxCount} more`}
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
                      toggleOption(inputValue);
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
                {options.map((option, index) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <CommandItem
                      key={index}
                      onSelect={() => toggleOption(option.value)}
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
                        {renderFilterIcon(option)}
                        <span>{option.label}</span>
                      </div>
                      {allowDelete && (
                        <XIcon
                          className="ml-2 h-4 w-4 cursor-pointer text-muted-foreground"
                          onClick={(event) =>
                            handleDeleteOption(option.value, event)
                          }
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

MultiSelectWithCustomImage.displayName = "MultiSelectWithCustomImage";
