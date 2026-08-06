import dbConnect from "@/lib/dbConnect";
import Article from "@/models/ArticleModel";
import Vehicle from "@/models/VehicleModel";
import { Types } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      data: "Ogiltigt fordonsmodell-id.",
    });
  }

  await dbConnect();

  switch (req.method) {
    case "GET": {
      try {
        const vehicle = await Vehicle.findById(id);

        if (!vehicle) {
          return res.status(404).json({
            success: false,
            data: "Fordonsmodellen hittades inte.",
          });
        }

        return res.status(200).json({
          success: true,
          data: vehicle,
        });
      } catch (error) {
        console.error("Get vehicle error:", error);

        return res.status(500).json({
          success: false,
          data: "Fordonsmodellen kunde inte hämtas.",
        });
      }
    }

    case "DELETE": {
      try {
        const vehicle = await Vehicle.findById(id);

        if (!vehicle) {
          return res.status(404).json({
            success: false,
            data: "Fordonsmodellen hittades inte.",
          });
        }

        const vehicleIsUsed = await Article.exists({
          vehicleModels: id,
        });

        if (vehicleIsUsed) {
          return res.status(409).json({
            success: false,
            data: "Fordonsmodellen kan inte raderas eftersom den används av en eller flera artiklar.",
          });
        }

        const deleteResult = await Vehicle.deleteOne({
          _id: id,
        });

        if (deleteResult.deletedCount !== 1) {
          return res.status(500).json({
            success: false,
            data: "Fordonsmodellen kunde inte raderas.",
          });
        }

        return res.status(200).json({
          success: true,
          data: "Fordonsmodellen är raderad.",
        });
      } catch (error) {
        console.error("Delete vehicle error:", error);

        return res.status(500).json({
          success: false,
          data: "Fordonsmodellen kunde inte raderas.",
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
