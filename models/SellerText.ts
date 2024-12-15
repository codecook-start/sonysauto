import { Document, Model, Schema, model, models, Types } from "mongoose";

type SellerTextDocument = Document & {
  noteId: Types.ObjectId;
  title: string;
  text: string;
  scope: "global" | "local";
};

const SellerTextSchema = new Schema<SellerTextDocument>({
  noteId: { type: Schema.Types.ObjectId, ref: "SellerNote", required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  scope: {
    type: String,
    enum: ["global", "local"],
    default: "global",
  },
});

export const SellerNoteText: Model<SellerTextDocument> =
  models.SellerNoteText ||
  model<SellerTextDocument>("SellerNoteText", SellerTextSchema);
