import { Schema, model, models, Document, Model } from "mongoose";

export type ILabel = Document & {
  name: string;
  color: string;
  bgColor: string;
};

const labelSchema = new Schema<ILabel>(
  {
    name: { type: String, required: true },
    color: { type: String, default: "#000000" },
    bgColor: { type: String, default: "#FFFFFF" },
  },
  { timestamps: true },
);

labelSchema.index({ name: 1 });

export const CarLabel: Model<ILabel> =
  models.CarLabel || model<ILabel>("CarLabel", labelSchema);
