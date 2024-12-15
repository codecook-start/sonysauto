import { Feature } from "@/types/car";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const featuresAtom = atomWithStorage<Feature[]>("features", []);

export const featuresEditAtom = atom<Feature[]>([]);

featuresEditAtom.debugLabel = "featuresEditAtom";
featuresAtom.debugLabel = "featuresAtom";
