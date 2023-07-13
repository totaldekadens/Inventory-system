import mongoose, { Types } from "mongoose";
import { ArticleDocument, ArticleSchema } from "./ArticleModel";
const { Schema } = mongoose;

const TransactionHistorySchema = new Schema<TransactionHistoryDocument>({
  direction: { type: String, required: true },
  cause: { type: String },
  article: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    artno: { type: Number, required: true },
    supplierArtno: { type: String },
    vehicleModels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
      },
    ],
    title: { type: String, required: true },
    description: { type: String },
    qty: { type: Number, required: true },
    condition: { type: String, required: true },
    forSale: { type: Boolean, required: true },
    price: { type: Number },
    inventoryLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InventoryLocation",
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    purchaseValue: { type: Number },
    comment: String,
    issue: [
      {
        sold: Boolean,
        qty: Number,
        unitPrice: Number,
        comment: String,
        date: Date,
      },
    ],
    createdDate: { type: String, required: true },
    lastUpdated: String,
  },
  qty: { type: Number, required: true },
  pricePerUnit: { type: Number },
  comment: { type: String },
  createdDate: { type: String, required: true },
});

export interface TransactionHistoryDocument {
  _id?: Types.ObjectId;
  direction: "-" | "+";
  cause?:
    | "Såld"
    | "Kastad (överflödig)"
    | "Kastad (trasig)"
    | "Använd vid reparation"
    | "Diff"
    | "Artikel permanent borttagen";
  article: ArticleDocument;
  qty: number;
  pricePerUnit?: number;
  comment?: string;
  createdDate: string;
}

export default module.exports =
  mongoose.models.TransactionHistory ||
  mongoose.model("TransactionHistory", TransactionHistorySchema);
