import { CarPagination } from "@/types/car";
import { CarResponse } from "@/types/edit-car";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const carsAtom = atomWithStorage<CarResponse[]>("cars", []);

export const CAR_PAGINATION_INITIAL_STATE: CarPagination = {
  page: 1,
  limit: 24,
  totalPages: 1,
  totalItems: 0,
  details: [],
  search: "",
  minPrice: undefined,
  maxPrice: undefined,
};

export const carPaginationAtom = atom<CarPagination>({
  page: 1,
  limit: 24,
  totalPages: 1,
  totalItems: 0,
  details: [],
});

carsAtom.debugLabel = "carsAtom";
carPaginationAtom.debugLabel = "carPaginationAtom";
