import {
  Schema,
  model,
  models,
  Document,
  CallbackError,
  Model,
} from "mongoose";
import path from "path";
import fs from "fs";
import { CarDetailOption } from "./Option";
import { removeApi } from "@/lib/utils";

export type CarDetailDocument = Document & {
  name: string;
  icon?: string | null;
};

const carDetailSchema = new Schema<CarDetailDocument>({
  name: { type: String, required: true },
  icon: { type: String, nullable: true },
});

carDetailSchema.index({ name: 1 }, { unique: true });

carDetailSchema.pre("findOneAndDelete", async function (next) {
  try {
    const carDetail = await this.model.findOne(this.getFilter());

    if (!carDetail) return next();

    if (carDetail.icon) {
      const filePath = path.join(
        process.cwd(),
        "public",
        removeApi(carDetail.icon),
      );
      try {
        await fs.promises.unlink(filePath);
        console.log(`Deleted file: ${filePath}`);
      } catch (error) {
        console.error(`Error deleting file ${filePath}:`, error);
      }
    }

    await CarDetailOption.deleteMany({ detailId: carDetail._id });
    console.log(`Deleted options for CarDetail: ${carDetail._id}`);

    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

export const CarDetail: Model<CarDetailDocument> =
  models.CarDetail || model<CarDetailDocument>("CarDetail", carDetailSchema);
