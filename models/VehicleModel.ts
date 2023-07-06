import mongoose, { Types } from "mongoose";
const { Schema } = mongoose;

const VehicleModelSchema = new Schema<VehicleDocument>({
  name: { type: String, required: true },
});

export interface VehicleDocument {
  _id?: Types.ObjectId;
  name: string;
}

export default module.exports =
  mongoose.models.VehicleModel ||
  mongoose.model("VehicleModel", VehicleModelSchema);
