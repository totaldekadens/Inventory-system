import mongoose, { Types } from "mongoose";
const { Schema } = mongoose;

const InventoryLocationSchema = new Schema<InventoryLocationDocument>({
  name: { type: String, required: true },
  description: { type: String },
});

export interface InventoryLocationDocument {
  _id: Types.ObjectId;
  name: string;
  description?: string;
}

export default module.exports =
  mongoose.models.InventoryLocation ||
  mongoose.model("InventoryLocation", InventoryLocationSchema);
