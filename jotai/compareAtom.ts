import { CarResponse } from "@/types/edit-car";
import { atomWithStorage } from "jotai/utils";

export const compareAtom = atomWithStorage<string[]>("compare", []);
export const compareCarsAtom = atomWithStorage<CarResponse[]>(
  "compare_cars",
  [],
);

compareAtom.debugLabel = "compareAtom";
compareCarsAtom.debugLabel = "compareCarsAtom";
