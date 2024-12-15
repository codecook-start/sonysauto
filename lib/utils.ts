import { titleMap } from "@/data";
import { CarFormField } from "@/types/car";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export const getBadge = (status: string[]) => {
  if (!status) return null;
  if (status.includes("sold"))
    return {
      text: "Sold",
      color: "#C0392B",
    };
  if (status.includes("reserved"))
    return {
      text: "Reserved",
      color: "#F39C12",
    };
  if (status.includes("shipped"))
    return {
      text: "Shipped",
      color: "#1ABC9C",
    };
  return null;
};
