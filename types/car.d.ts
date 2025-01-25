export type Image =
  | {
      name: string;
      type: string;
      size: number;
      file: File;
    }
  | {
      filename: string;
      path: string;
    };

export type ItemDetailName =
  | "type"
  | "model"
  | "year"
  | "fuel"
  | "color"
  | "transmission"
  | "make"
  | "modelCode"
  | "stockId";

export type ItemInsightName =
  | "kilometers"
  | "miles"
  | "engineSize"
  | "drive"
  | "interior"
  | "doorsSeats";

export type ItemDetail<T> = {
  name: T;
  value: string;
};

export type ItemInsight = ItemDetail<ItemInsightName>;

export type Detail<T> = {
  _id?: string;
  name: string;
  values: T extends string ? string : T;
  icon?: File;
};

export type Car = {
  title?: string;
  features?: {
    id: string;
    name: string;
    icon?: File | string;
  }[];
  price?: string;
  videos?: string[];
  images?: Image[];
  sellerNotes?: SellerNote[];
  extra?: string;
  details: Detail<string[]>[];
  domain?: string[];
  pages?: string[];
  label?: CarLabel;
};

export type UploadedImage = {
  filename: string;
  path: string;
};

export type CarDataWithUploadedImages = Omit<Car, "images"> & {
  images: UploadedImage[];
};

export type CarPagination = {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  details: Detail<string[]>[];
  search?: string;
  sortBy?: { name: string; order: string };
  priceRange?: { min: number; max: number };
  minPrice?: number;
  maxPrice?: number;
  features?: {
    _id?: string;
    name: string;
    count: number;
  }[];
  selectedFeatures?: {
    _id?: string;
    name: string;
  }[];
};

export type FeatureResponse = {
  _id: string;
  name: string;
  icon: string | null;
  __v: number;
};

export type Text = {
  _id: string;
  noteId: string;
  title: string;
  text: string;
  scope: string;
  checked?: boolean;
};

export type Note = {
  _id: string;
  title: string;
};

export type SellerNote = {
  note: Note;
  texts: Text[];
  _id: string;
};

export type ImageResponse = {
  filename: string;
  path: string;
  _id: string;
};

export type Feature = {
  _id: string;
  name: string;
  icon: string | null;
  checked?: boolean;
};

export type ImageResponse = {
  filename: string;
  path: string;
  _id: string;
};

export type DetailResponse = {
  _id: string;
  name: string;
  values: string[];
  icon: string | null;
  __v: number;
};

export type Pagination = {
  currentPage: number;
  totalPages: number;
  limit: number;
  totalItems: number;
};

export type CarDetailOption = {
  _id: string;
  detailId: string;
  name: string;
  icon: string | null;
};

export type CarFormField = {
  _id: string;
  name: string;
  icon: string | null;
  value?: string;
  values: CarDetailOption[];
  selectedValues?: CarDetailOption[];
  showInListPage: boolean;
  showInDetailsPage: boolean;
};

export type DetailResponse = {
  _id: string;
  name: string;
  values: string[];
  icon: string | null;
  __v: number;
};

export type CarSellerText = {
  _id: string;
  checked?: boolean;
  title: string;
  text: string;
  scope?: string;
  used?: boolean;
};

export type CarSellerNoteFormField = {
  _id: string;
  title: string;
  checked?: boolean;
  texts?: CarSellerText[];
};

export type FilterValue = {
  _id?: string;
  name: string;
  icon: string | null;
  count: number;
};

export type Filter = {
  _id: string;
  name: string;
  icon: string | null;
  values: FilterValue[];
};

export type CarLabel = {
  _id: string;
  name: string;
  color: string | null;
  bgColor: string | null;
};
