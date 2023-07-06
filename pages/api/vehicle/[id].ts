import dbConnect from "@/lib/dbConnect";
import Vehicle, { VehicleDocument } from "@/models/VehicleModel";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const vehicle: VehicleDocument | null = await Vehicle.findById(id);

        if (!vehicle) {
          return res.status(403).send({
            success: false,
            data: "Vehicle not found",
          });
        }

        res.status(201).json({ success: true, data: vehicle });
      } catch (error) {
        res.json({ success: false, data: error });
      }
      break;

    case "DELETE":
      try {
        // Todo:  Check if an article is on the location, it shall not be able to delete before the article is moved to a new location.
        const deletedLocation = await Vehicle.deleteOne({ _id: id });
        if (deletedLocation.deletedCount < 1) {
          return res
            .status(400)
            .json({ success: false, data: "Vehicle not deleted" });
        }
        res.status(200).json({
          success: true,
          data: "Vehicle is successfully deleted",
        });
      } catch (error) {
        res.status(400).json({ success: false, data: error });
      }
      break;

    default:
      res.json({ success: false, data: "break error" });
      break;
  }
}
