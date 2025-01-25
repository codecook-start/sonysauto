import {
  Schema,
  model,
  models,
  Document,
  Model,
  CallbackError,
} from "mongoose";
import { Ordering } from "@/models/Ordering";

export type IFeature = Document & {
  name: string;
  icon: string | null;
};

const featureSchema = new Schema<IFeature>({
  name: { type: String, required: true },
  icon: { type: String, default: null },
});

featureSchema.index({ name: 1 });

featureSchema.pre("findOneAndDelete", async function (next) {
  try {
    const feature = await this.model.findOne(this.getFilter());

    if (!feature) return next();

    await Ordering.updateMany(
      { name: "Feature" },
      { $pull: { ids: feature._id } },
    );

    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

export const Feature: Model<IFeature> =
  models.Feature || model<IFeature>("Feature", featureSchema);
