import { titleMap } from "@/data";
import { CarFormField } from "@/types/car";
import { Details } from "@/types/edit-car";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const capitalize = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getPageTitle = (pathname: string): string => {
  if (!pathname) return "";
  return titleMap[pathname as keyof typeof titleMap] || "";
};

export const unique = <T>(arr: T[]) => {
  if (!arr) return [];
  return Array.from(new Set(arr));
};

export const removeQuotes = (str: string) => {
  if (!str || typeof str !== "string") return "";
  return str.replace(/^"|"$/g, "");
};

export const isDropdown = (field: CarFormField) => {
  const inputFields = ["stockId", "stock id", "miles", "kilometers"];
  return !inputFields.some((inputField) =>
    field.name.toLowerCase().includes(inputField.toLowerCase()),
  );
};

export const isImageDropdown = (field: CarFormField) => {
  const imageDropdownFields = ["make", "type", "model"];
  return imageDropdownFields.some(
    (imageDropdownField) => field.name.toLowerCase() === imageDropdownField,
  );
};

export const removeApi = (str: string) => {
  return str.replace(/^api\//, "");
};

export const inventoryCardDetailsOrder = (details: Details[]) => {
  const detailsOrder = [
    // transmission
    "672d5665d23e5a0cfb0e196b",
    // engine size
    "672d5674d23e5a0cfb0e196f",
    // mileage
    "672bfd5fd867275157469a47",
    // model code
    "672d54bbd23e5a0cfb0e183e",
    // seats
    "672cbb4ca2af0af92457c8f1",
    // stock id
    "676d7701d532adf9188111f7",
  ];

  const detailsOrderFiltered = detailsOrder.map((id) => {
    const detail = details
      .filter((item) => Boolean(item.detail))
      .find((item) => item.detail._id === id);
    return (
      detail || {
        _id: id,
        option: {
          _id: uuidv4(),
          detailId: id,
          name: "N/A",
          icon: null,
        },
        detail: {
          _id: id,
          name: "N/A",
          icon: null,
        },
      }
    );
  });
  return detailsOrderFiltered;
};

export const throttle = <T extends (...args: unknown[]) => void>(
  func: T,
  limit: number,
) => {
  let inThrottle: boolean;
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
