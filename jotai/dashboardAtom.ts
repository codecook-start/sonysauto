import {
  Car,
  CarFormField,
  CarLabel,
  CarSellerNoteFormField,
} from "@/types/car";
import { atom } from "jotai";

const initialCar: Car = {
  title: "",
  link: "",
  features: [],
  price: "",
  videos: [],
  images: [],
  sellerNotes: [],
  extra: "",
  details: [],
};

export const CarLocalAtom = atom<Car>(initialCar);

export const CarFormFieldsAtom = atom<CarFormField[]>([]);

export const CarFormFieldsEditAtom = atom<CarFormField[]>([]);

export const CarSellerNotesAtom = atom<CarSellerNoteFormField[]>([]);
export const CarEditSellerNotesAtom = atom<CarSellerNoteFormField[]>([]);

export const CarLabelAtom = atom<CarLabel[]>([]);

CarLocalAtom.debugLabel = "CarLocalAtom";
CarFormFieldsAtom.debugLabel = "CarFormFieldsAtom";
CarFormFieldsEditAtom.debugLabel = "CarFormFieldsEditAtom";
CarSellerNotesAtom.debugLabel = "CarSellerNotesAtom";
CarEditSellerNotesAtom.debugLabel = "CarEditSellerNotesAtom";
CarLabelAtom.debugLabel = "CarLabelAtom";
