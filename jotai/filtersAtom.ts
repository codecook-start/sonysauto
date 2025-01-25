import { Filter, FilterValue } from "@/types/car";
import { atom } from "jotai";

export const filtersAtom = atom<Filter[]>([]);
export const makesAtom = atom<FilterValue[]>([]);
export const typesAtom = atom<FilterValue[]>([]);
export const modelsAtom = atom<FilterValue[]>([]);
export const lastFilterAtom = atom<Filter | null>(null);

filtersAtom.debugLabel = "filtersAtom";
makesAtom.debugLabel = "makesAtom";
typesAtom.debugLabel = "typesAtom";
