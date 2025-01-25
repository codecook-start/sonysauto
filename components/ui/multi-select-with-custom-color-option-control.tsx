/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CheckIcon,
  XCircle,
  ChevronDown,
  XIcon,
  PencilIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { v4 as uuidv4 } from "uuid";
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
import { CarLabel } from "@/types/car";

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

type Option = CarLabel;

type MultiSelectProps = {
  options: Option[];
  onValueChange: (value: Option[]) => void;
  onEdit?: (option: Option) => void;
  defaultValue?: Option[];
  selectedOptions?: Option[];
  placeholder?: string;
  animation?: number;
  maxCount?: number;
  modalPopover?: boolean;
  className?: string;
  maxSelectedValues?: number;
  allowDelete?: boolean;
  onOptionDelete?: (_id: string) => void;
  onOptionAdd?: (option: Option) => void;
} & VariantProps<typeof multiSelectVariants>;

export const MultiSelectWithCustomColorOptionControl = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      onEdit,
      variant,
      defaultValue = [],
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
      selectedOptions || defaultValue,
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
          !selectedValues.some((val) => val.name === inputValue) &&
          selectedValues.length < maxSelectedValues
        ) {
          if (!inputValue) return;
          const newOption: Option = {
            _id: uuidv4(),
            name: inputValue,
            color: null,
            bgColor: null,
          };
          onOptionAdd?.(newOption);
          setInputValue("");
        }
        setInputValue("");
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
                      style={{
                        animationDuration: `${animation}s`,
                        color: option.color || "#ffffff",
                        backgroundColor: option.bgColor || "#000000",
                      }}
                    >
                      <span className="flex-1 content-center rounded-full px-4 py-2 text-center">
                        {option.name}
                      </span>
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
        <PopoverContent className="p-0" align="start">
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
                        name: inputValue,
                        color: null,
                        bgColor: null,
                      };
                      onOptionAdd?.(newOption);
                      setInputValue("");
                    }}
                    className="line-clamp-1 cursor-pointer"
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
                        <span
                          className="line-clamp-1 max-w-[12rem] flex-1 content-center rounded-full px-4 py-2 text-center"
                          style={{
                            color: option.color || "#ffffff",
                            backgroundColor: option.bgColor || "#000000",
                          }}
                        >
                          {option.name}
                        </span>
                      </div>
                      <PencilIcon
                        onClick={() => onEdit?.(option)}
                        className="ml-2 h-4 w-4 cursor-pointer text-muted-foreground"
                      />
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

MultiSelectWithCustomColorOptionControl.displayName =
  "MultiSelectWithCustomColorOptionControl";
