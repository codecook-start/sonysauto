import {
  CallbackError,
  Document,
  Model,
  Schema,
  model,
  models,
} from "mongoose";
import { SellerNoteText } from "./SellerText";

type SellerNoteDocument = Document & {
  title: string;
};

const SellerNoteSchema = new Schema<SellerNoteDocument>({
  title: { type: String, required: true },
});

SellerNoteSchema.index({ title: 1 }, { unique: true });

SellerNoteSchema.pre("findOneAndDelete", async function (next) {
  try {
    const noteId = this.getQuery()["_id"];
    await SellerNoteText.deleteMany({ noteId });
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

export const SellerNote: Model<SellerNoteDocument> =
  models.SellerNote ||
  model<SellerNoteDocument>("SellerNote", SellerNoteSchema);
