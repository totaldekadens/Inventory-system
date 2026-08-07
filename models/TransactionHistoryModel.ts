import mongoose, { Types } from "mongoose";
import { ArticleDocument } from "./ArticleModel";

export type TransactionDirection = "-" | "+" | "";

export type TransactionCause =
  | "Såld"
  | "Kastad (överflödig)"
  | "Kastad (trasig)"
  | "Använd vid reparation"
  | "Diff"
  | "Artikel permanent borttagen"
  | "Artikel skapad"
  | "Flytt till ny lagerplats";

interface LocationSnapshot {
  _id: Types.ObjectId;
  name: string;
}

export interface TransactionHistoryDocument {
  _id?: Types.ObjectId;
  direction: TransactionDirection;
  cause?: TransactionCause;
  article: ArticleDocument;
  qty: number;
  fromLocation?: LocationSnapshot;
  toLocation?: LocationSnapshot;
  pricePerUnit?: number;
  comment?: string;
  createdDate: Date;
}

const LocationSnapshotSchema = new mongoose.Schema<LocationSnapshot>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const TransactionHistorySchema =
  new mongoose.Schema<TransactionHistoryDocument>({
    direction: {
      type: String,
      enum: ["-", "+", ""],
    },

    cause: {
      type: String,
    },

    article: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      artno: {
        type: Number,
        required: true,
      },
      supplierArtno: String,

      vehicleModels: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Vehicle",
        },
      ],

      title: {
        type: String,
        required: true,
      },
      description: String,

      qty: {
        type: Number,
        required: true,
      },

      condition: {
        type: String,
        required: true,
      },

      forSale: {
        type: Boolean,
        required: true,
      },

      price: Number,

      inventoryLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InventoryLocation",
        required: true,
      },

      images: [String],
      purchaseValue: Number,
      comment: String,

      createdDate: {
        type: Date,
        required: true,
      },

      lastUpdated: String,
    },

    fromLocation: {
      type: LocationSnapshotSchema,
      required: false,
    },

    toLocation: {
      type: LocationSnapshotSchema,
      required: false,
    },

    qty: {
      type: Number,
      required: true,
    },

    pricePerUnit: Number,
    comment: String,

    createdDate: {
      type: Date,
      required: true,
    },
  });

const TransactionHistoryModel =
  mongoose.models.TransactionHistory ||
  mongoose.model<TransactionHistoryDocument>(
    "TransactionHistory",
    TransactionHistorySchema,
  );

export default TransactionHistoryModel;
