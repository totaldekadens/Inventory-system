import dbConnect from "@/lib/dbConnect";
import Article from "@/models/ArticleModel";
import InventoryLocation from "@/models/InventoryLocationModel";
import { Types } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

const VIRTUAL_LOCATION_ID = "64a95847dec1488ee60d10cd";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      data: "Ogiltigt lagerplats-id.",
    });
  }

  await dbConnect();

  switch (req.method) {
    case "GET": {
      try {
        const inventoryLocation = await InventoryLocation.findById(id);

        if (!inventoryLocation) {
          return res.status(404).json({
            success: false,
            data: "Lagerplatsen hittades inte.",
          });
        }

        return res.status(200).json({
          success: true,
          data: inventoryLocation,
        });
      } catch (error) {
        console.error("Get inventory location error:", error);

        return res.status(500).json({
          success: false,
          data: "Lagerplatsen kunde inte hämtas.",
        });
      }
    }

    case "DELETE": {
      try {
        if (id === VIRTUAL_LOCATION_ID) {
          return res.status(403).json({
            success: false,
            data: "Den virtuella lagerplatsen 00 kan inte raderas.",
          });
        }

        const inventoryLocation = await InventoryLocation.findById(id);

        if (!inventoryLocation) {
          return res.status(404).json({
            success: false,
            data: "Lagerplatsen hittades inte.",
          });
        }

        const locationIsUsed = await Article.exists({
          inventoryLocation: id,
        });

        if (locationIsUsed) {
          return res.status(409).json({
            success: false,
            data: "Lagerplatsen kan inte raderas eftersom det finns artiklar placerade på den.",
          });
        }

        const deleteResult = await InventoryLocation.deleteOne({
          _id: id,
        });

        if (deleteResult.deletedCount !== 1) {
          return res.status(500).json({
            success: false,
            data: "Lagerplatsen kunde inte raderas.",
          });
        }

        return res.status(200).json({
          success: true,
          data: "Lagerplatsen är raderad.",
        });
      } catch (error) {
        console.error("Delete inventory location error:", error);

        return res.status(500).json({
          success: false,
          data: "Lagerplatsen kunde inte raderas.",
        });
      }
    }

    default: {
      res.setHeader("Allow", ["GET", "DELETE"]);

      return res.status(405).json({
        success: false,
        data: "Method not allowed.",
      });
    }
  }
}
