import { CarPagination } from "@/types/car";
import { CarResponse } from "@/types/edit-car";
import { atom } from "jotai";

export const carsAtom = atom<CarResponse[]>([]);

export const CAR_PAGINATION_INITIAL_STATE: CarPagination = {
  page: 1,
  limit: 32,
  totalPages: 1,
  totalItems: 0,
  details: [],
  search: "",
  minPrice: undefined,
  maxPrice: undefined,
};

export const carPaginationAtom = atom<CarPagination>({
  page: 1,
  limit: 32,
  totalPages: 1,
  totalItems: 0,
  details: [],
});

carsAtom.debugLabel = "carsAtom";
carPaginationAtom.debugLabel = "carPaginationAtom";
