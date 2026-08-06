import mongoose, { Types } from "mongoose";

const InventoryLocationSchema = new mongoose.Schema<InventoryLocationDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

export interface InventoryLocationDocument {
  _id: Types.ObjectId;
  name: string;
  description?: string;
}

const InventoryLocationModel =
  mongoose.models.InventoryLocation ||
  mongoose.model<InventoryLocationDocument>(
    "InventoryLocation",
    InventoryLocationSchema,
  );

export default InventoryLocationModel;
