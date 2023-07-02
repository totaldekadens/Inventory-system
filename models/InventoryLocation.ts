import mongoose from "mongoose";
const { Schema } = mongoose;

const InventoryLocationSchema = new Schema<InventoryLocationDocument>({
  name: { type: String, required: true },
});

export interface InventoryLocationDocument {
  name: string;
}

export default module.exports =
  mongoose.models.InventoryLocation ||
  mongoose.model("InventoryLocation", InventoryLocationSchema);
