/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model, models, Document, Model, Types } from "mongoose";

export type IOrdering = Document & {
  name: "CarDetail" | "Feature" | "SellerNote" | "Car";
  page: string;
  ids: Types.ObjectId[];
};

const OrderingSchema = new Schema<IOrdering>({
  name: {
    type: String,
    required: true,
    enum: ["CarDetail", "Feature", "SellerNote", "Car"],
  },
  page: {
    type: String,
  },
  ids: [
    {
      type: Schema.Types.ObjectId,
      refPath: "name",
    },
  ],
});

OrderingSchema.index({ name: 1, page: 1 });

export const Ordering: Model<IOrdering> =
  models.Ordering || model<IOrdering>("Ordering", OrderingSchema);
