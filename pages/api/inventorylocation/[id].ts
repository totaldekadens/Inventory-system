import dbConnect from "@/lib/dbConnect";
import InventoryLocation, {
  InventoryLocationDocument,
} from "@/models/InventoryLocationModel";
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
        const inventoryLocation: InventoryLocationDocument | null =
          await InventoryLocation.findById(id);

        if (!inventoryLocation) {
          return res.status(403).send({
            success: false,
            data: "Inventory location not found",
          });
        }

        res.status(201).json({ success: true, data: inventoryLocation });
      } catch (error) {
        res.json({ success: false, data: error });
      }
      break;

    case "DELETE":
      try {
        const deletedLocation = await InventoryLocation.deleteOne({ _id: id });
        if (deletedLocation.deletedCount < 1) {
          return res
            .status(400)
            .json({ success: false, data: "Inventory location not deleted" });
        }
        res.status(200).json({
          success: true,
          data: "Inventory location is successfully deleted",
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
