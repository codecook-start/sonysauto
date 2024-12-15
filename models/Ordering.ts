/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model, models, Document, Model, Types } from "mongoose";

export interface IOrdering extends Document {
  name: "CarDetail" | "Feature" | "SellerNote";
  ids: Types.ObjectId[];
}

const OrderingSchema = new Schema<IOrdering>({
  name: {
    type: String,
    required: true,
    enum: ["CarDetail", "Feature", "SellerNote"],
  },
  ids: [
    {
      type: Schema.Types.ObjectId,
      refPath: "name",
    },
  ],
});

OrderingSchema.index({ name: 1 }, { unique: true });

export const Ordering: Model<IOrdering> =
  models.Ordering || model<IOrdering>("Ordering", OrderingSchema);
