import mongoose, { Types } from "mongoose";
const { Schema } = mongoose;

export const ArticleSchema = new Schema<ArticleDocument>({
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
  createdDate: {
    type: Date,
    required: true,
  },

  lastUpdated: {
    type: Date,
    required: true,
  },
});

export interface ArticleDocument {
  _id?: Types.ObjectId;
  artno: number;
  supplierArtno?: string;
  vehicleModels?: Types.ObjectId[];
  title: string;
  description?: string;
  qty: number;
  condition: string;
  forSale: boolean;
  price?: number;
  inventoryLocation: Types.ObjectId;
  images: string[];
  purchaseValue?: number;
  comment?: string;
  createdDate: Date;
  lastUpdated: Date;
}

const ArticleModel =
  mongoose.models.Article ||
  mongoose.model<ArticleDocument>("Article", ArticleSchema);

export default ArticleModel;
