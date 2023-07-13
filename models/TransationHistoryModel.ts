import mongoose, { Types } from "mongoose";
import { ArticleDocument } from "./ArticleModel";
const { Schema } = mongoose;

const TransactionHistoryModelSchema = new Schema<TransactionHistoryDocument>({
  direction: { type: String, required: true },
  cause: { type: String, required: true },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
    required: true,
  },
  pricePerUnit: { type: Number },
  comment: { type: String },
  createdDate: { type: String, required: true },
});

export interface TransactionHistoryDocument {
  _id?: Types.ObjectId;
  direction: "-" | "+";
  cause:
    | "Såld"
    | "Kastad (överflödig)"
    | "Kastad (trasig)"
    | "Använd vid reparation"
    | "Diff";
  article: ArticleDocument;
  pricePerUnit?: number;
  comment?: string;
  createdDate: string;
}

export default module.exports =
  mongoose.models.TransactionHistoryModel ||
  mongoose.model("TransactionHistoryModel", TransactionHistoryModelSchema);
