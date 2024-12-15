import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, XCircle, ChevronDown, XIcon } from "lucide-react";

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
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  options: Option[];
  onValueChange: (value: string[]) => void;
  defaultValue?: string[];
  value?: string[];
  placeholder?: string;
  animation?: number;
  maxCount?: number;
  modalPopover?: boolean;
  asChild?: boolean;
  className?: string;
  maxSelectedValues?: number;
  allowDelete?: boolean;
  onOptionDelete?: (options: string) => void;
}

export const MultiSelectWithCustom = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
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

    const allOptions: Option[] = React.useMemo(() => [...options], [options]);

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
        if (prev.includes(optionValue)) {
          const newValues = prev.filter((value) => value !== optionValue);
          onValueChange(newValues);
          return newValues;
        } else if (prev.length < maxSelectedValues) {
          const newValues = [...prev, optionValue];
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
      if (selectedValues.length === allOptions.length) {
        setSelectedValues([]);
        onValueChange([]);
      } else {
        const allValues = allOptions
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
                    const option = allOptions.find((o) => o.value === value);
                    const IconComponent = option?.icon;
                    return (
                      <Badge
                        key={value}
                        className={cn(multiSelectVariants({ variant }))}
                        style={{ animationDuration: `${animation}s` }}
                      >
                        {IconComponent && (
                          <IconComponent className="mr-2 h-4 w-4" />
                        )}
                        {option?.label}
                        <XCircle
                          className="ml-2 h-4 w-4 cursor-pointer"
                          onClick={(event) => handleRemoveOption(event, value)}
                        />
                      </Badge>
                    );
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
                    className="mx-2 h-4 cursor-pointer"
                    onClick={handleClear}
                  />
                  <Separator
                    orientation="vertical"
                    className="flex h-full min-h-6"
                  />
                  <ChevronDown className="mx-2 h-4 cursor-pointer" />
                </div>
              </div>
            ) : (
              <div className="mx-auto flex w-full items-center justify-between">
                <span className="mx-3 text-sm">{placeholder}</span>
                <ChevronDown className="mx-2 h-4 cursor-pointer" />
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
                        selectedValues.length === allOptions.length
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    <span>(Select All)</span>
                  </CommandItem>
                )}
                {allOptions.map((option, index) => {
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
                        {option.icon && (
                          <option.icon className="mr-2 h-4 w-4" />
                        )}
                        <span>{option.label}</span>
                      </div>
                      {allowDelete && (
                        <XIcon
                          className="ml-2 h-4 w-4 cursor-pointer"
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

MultiSelectWithCustom.displayName = "MultiSelectWithCustom";
