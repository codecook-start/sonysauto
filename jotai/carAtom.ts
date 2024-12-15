import { CarResponse } from "@/types/edit-car";
import { atom } from "jotai";

export const carAtom = atom<Partial<CarResponse> | null>(null);

carAtom.debugLabel = "carAtom";
