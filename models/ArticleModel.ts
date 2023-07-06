import mongoose, { Types } from "mongoose";
const { Schema } = mongoose;

const ArticleSchema = new Schema<ArticleDocument>({
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
  issue?: [
    {
      sold: boolean;
      qty: number;
      unitPrice: number;
      comment?: string;
      date: Date;
    }
  ];
  createdDate: string;
  lastUpdated?: string;
}

export default module.exports =
  mongoose.models.Article || mongoose.model("Article", ArticleSchema);
