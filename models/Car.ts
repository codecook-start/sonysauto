import {
  CallbackError,
  Document,
  model,
  Model,
  models,
  Schema,
  Types,
} from "mongoose";
import path from "path";
import fs from "fs";
import { removeApi } from "@/lib/utils";

type Image = {
  filename: string;
  path: string;
};

type SellerNote = {
  note: Types.ObjectId;
  text: Types.ObjectId[];
};

type Detail = {
  detail: Types.ObjectId;
  option: Types.ObjectId | null;
  showInDetailsPage: boolean;
  showInListPage: boolean;
};

type ICar = Document & {
  title: string;
  price?: string;
  features: Types.ObjectId[];
  details: Detail[];
  videos: string[];
  sellerNotes: SellerNote[];
  extra?: string;
  images: Image[];
  label: Types.ObjectId | null;
  domain: string[];
  pages: string[];
  createdAt: Date;
  updatedAt: Date;
  counter: number;
  link: string;
  isCarousel: boolean;
};

const CarSchema = new Schema<ICar>(
  {
    title: { type: String, required: true },
    price: { type: String, default: null },
    counter: { type: Number, default: 0 },
    link: { type: String, default: null, required: false },
    isCarousel: { type: Boolean, default: true, required: false },
    features: [
      {
        type: Schema.Types.ObjectId,
        ref: "Feature",
      },
    ],
    details: [
      {
        detail: {
          type: Schema.Types.ObjectId,
          ref: "CarDetail",
        },
        option: {
          type: Schema.Types.ObjectId,
          ref: "CarDetailOption",
          default: null,
        },
        showInDetailsPage: { type: Boolean, default: false },
        showInListPage: { type: Boolean, default: false },
      },
    ],
    videos: { type: [String], default: [] },
    sellerNotes: [
      {
        note: {
          type: Schema.Types.ObjectId,
          ref: "SellerNote",
        },
        texts: [
          {
            type: Schema.Types.ObjectId,
            ref: "SellerNoteText",
          },
        ],
      },
    ],
    extra: { type: String, default: null },
    images: [
      {
        filename: { type: String, required: true },
        path: { type: String, required: true },
      },
    ],
    label: {
      type: Schema.Types.ObjectId,
      ref: "CarLabel",
      default: null,
    },
    domain: {
      type: [String],
      default: ["sonysauto.net", "sonysauto.com"],
    },
    pages: {
      type: [String],
      default: ["japan"],
    },
  },
  { timestamps: true },
);

CarSchema.pre("findOneAndDelete", async function (next) {
  try {
    const car = (await this.model.findOne(this.getFilter())) as ICar;
    if (car && car.images) {
      await Promise.all(
        car.images.map(async (image) => {
          const filePath = path.join(
            process.cwd(),
            "public",
            removeApi(image.path),
          );
          try {
            await fs.promises.unlink(filePath);
            console.log(`Deleted file: ${filePath}`);
          } catch (error) {
            console.error(`Error deleting file ${filePath}:`, error);
          }
        }),
      );
    }
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

export const Car: Model<ICar> = models.Car || model<ICar>("Car", CarSchema);
