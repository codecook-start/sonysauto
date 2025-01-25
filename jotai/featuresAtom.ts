import { Feature } from "@/types/car";
import { atom } from "jotai";

export const featuresAtom = atom<Feature[]>([]);

export const featuresEditAtom = atom<Feature[]>([]);

featuresEditAtom.debugLabel = "featuresEditAtom";
featuresAtom.debugLabel = "featuresAtom";
