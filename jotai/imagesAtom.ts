import { atom } from "jotai";

export const imagesAtom = atom<
  {
    file: File;
    url: string;
  }[]
>([]);

export const imagesEditAtom = atom<
  {
    file?: File;
    path?: string;
    url?: string;
    _id: string;
    type?: "new" | "old";
  }[]
>([]);

imagesAtom.debugLabel = "imagesAtom";
imagesEditAtom.debugLabel = "imagesEditAtom";
