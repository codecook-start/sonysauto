import { Car, CarFormField, CarSellerNoteFormField } from "@/types/car";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const initialCar: Car = {
  title: "",
  features: [],
  price: "",
  videos: [],
  images: [],
  sellerNotes: [],
  extra: "",
  details: [],
};

export const CarLocalAtom = atomWithStorage<Car>("carLocal", initialCar);

export const CarFormFieldsAtom = atomWithStorage<CarFormField[]>(
  "car_form_fields",
  [],
);

export const CarFormFieldsEditAtom = atom<CarFormField[]>([]);

export const CarSellerNotesAtom = atom<CarSellerNoteFormField[]>([]);
export const CarEditSellerNotesAtom = atom<CarSellerNoteFormField[]>([]);

CarLocalAtom.debugLabel = "CarLocalAtom";
CarFormFieldsAtom.debugLabel = "CarFormFieldsAtom";
CarFormFieldsEditAtom.debugLabel = "CarFormFieldsEditAtom";
CarSellerNotesAtom.debugLabel = "CarSellerNotesAtom";
CarEditSellerNotesAtom.debugLabel = "CarEditSellerNotesAtom";
