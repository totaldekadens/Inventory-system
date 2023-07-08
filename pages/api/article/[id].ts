import dbConnect from "@/lib/dbConnect";
import Article from "@/models/ArticleModel";
import { NextApiRequest, NextApiResponse } from "next";
import InventoryLocation from "@/models/InventoryLocationModel";
import Vehicle from "@/models/VehicleModel";
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
        const article = await Article.findById(id)
          .populate({
            path: "inventoryLocation",
            model: InventoryLocation,
          })
          .populate({
            path: "vehicleModels",
            model: Vehicle,
          });

        if (!article) {
          return res.status(403).send({
            success: false,
            data: "Article not found",
          });
        }

        res.status(201).json({ success: true, data: article });
      } catch (error) {
        res.json({ success: false, data: error });
      }
      break;

    case "DELETE":
      try {
        const deletedLocation = await Article.deleteOne({ _id: id });
        if (deletedLocation.deletedCount < 1) {
          return res
            .status(400)
            .json({ success: false, data: "Article not deleted" });
        }
        res.status(200).json({
          success: true,
          data: "Article is successfully deleted",
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
