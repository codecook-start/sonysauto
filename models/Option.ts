import {
  Schema,
  model,
  models,
  Document,
  Model,
  CallbackError,
} from "mongoose";
import fs from "fs";
import path from "path";
import { removeApi } from "@/lib/utils";

export type CarDetailOptionDocument = Document & {
  detailId: Schema.Types.ObjectId;
  name: string;
  icon?: string | null;
};

const CarDetailOptionSchema = new Schema<CarDetailOptionDocument>({
  detailId: { type: Schema.Types.ObjectId, ref: "CarDetail", required: true },
  name: { type: String, required: true },
  icon: { type: String, nullable: true },
});

CarDetailOptionSchema.index({ name: 1, detailId: 1 });

CarDetailOptionSchema.pre("findOneAndDelete", async function (next) {
  try {
    const carDetailOption = await this.model.findOne(this.getFilter());

    if (!carDetailOption) return next();

    if (carDetailOption.icon) {
      const filePath = path.join(
        process.cwd(),
        "public",
        removeApi(carDetailOption.icon),
      );
      try {
        await fs.promises.unlink(filePath);
        console.log(`Deleted file: ${filePath}`);
      } catch (error) {
        console.error(`Error deleting file ${filePath}:`, error);
      }
    }

    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

export const CarDetailOption: Model<CarDetailOptionDocument> =
  models.CarDetailOption ||
  model<CarDetailOptionDocument>("CarDetailOption", CarDetailOptionSchema);
