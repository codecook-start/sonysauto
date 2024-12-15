import { Filter, FilterValue } from "@/types/car";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// export const filtersAtom = atom<Filter[]>([]);
// export const makesAtom = atom<FilterValue[]>([]);
// export const typesAtom = atom<FilterValue[]>([]);
// export const modelsAtom = atom<FilterValue[]>([]);
export const lastFilterAtom = atom<Filter | null>(null);

export const filtersAtom = atomWithStorage<Filter[]>("filters", []);
export const makesAtom = atomWithStorage<FilterValue[]>("makes", []);
export const typesAtom = atomWithStorage<FilterValue[]>("types", []);
export const modelsAtom = atomWithStorage<FilterValue[]>("models", []);

filtersAtom.debugLabel = "filtersAtom";
makesAtom.debugLabel = "makesAtom";
typesAtom.debugLabel = "typesAtom";
