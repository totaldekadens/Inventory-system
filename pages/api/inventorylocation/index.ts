import caseInsensitive from "@/lib/caseCheck";
import dbConnect from "@/lib/dbConnect";
import InventoryLocation from "@/models/InventoryLocationModel";
import { Types } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

interface CreateInventoryLocationBody {
  name: string;
  description?: string;
}

interface UpdateInventoryLocationBody {
  _id: string;
  name: string;
  description?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      try {
        const inventoryLocations = await InventoryLocation.find({}).sort({
          name: 1,
        });

        return res.status(200).json({
          success: true,
          data: inventoryLocations,
        });
      } catch (error) {
        console.error("Get inventory locations error:", error);

        return res.status(500).json({
          success: false,
          data: "Lagerplatserna kunde inte hämtas.",
        });
      }
    }

    case "POST": {
      try {
        const { name, description } = req.body as CreateInventoryLocationBody;

        if (!name?.trim()) {
          return res.status(400).json({
            success: false,
            data: "Lagerplatsens namn måste anges.",
          });
        }

        const existingLocation = await InventoryLocation.findOne({
          name: caseInsensitive(name.trim()),
        });

        if (existingLocation) {
          return res.status(409).json({
            success: false,
            data: "Det finns redan en lagerplats med det namnet.",
          });
        }

        const inventoryLocation = await InventoryLocation.create({
          name: name.trim(),
          description: description?.trim() || undefined,
        });

        return res.status(201).json({
          success: true,
          data: inventoryLocation._id,
        });
      } catch (error) {
        console.error("Create inventory location error:", error);

        return res.status(500).json({
          success: false,
          data: "Lagerplatsen kunde inte skapas.",
        });
      }
    }

    case "PUT": {
      try {
        const { _id, name, description } =
          req.body as UpdateInventoryLocationBody;

        if (!_id || !Types.ObjectId.isValid(_id)) {
          return res.status(400).json({
            success: false,
            data: "Ogiltigt lagerplats-id.",
          });
        }

        if (!name?.trim()) {
          return res.status(400).json({
            success: false,
            data: "Lagerplatsens namn måste anges.",
          });
        }

        const existingLocation = await InventoryLocation.findOne({
          name: caseInsensitive(name.trim()),
          _id: { $ne: _id },
        });

        if (existingLocation) {
          return res.status(409).json({
            success: false,
            data: "Det finns redan en lagerplats med det namnet.",
          });
        }

        const inventoryLocation = await InventoryLocation.findByIdAndUpdate(
          _id,
          {
            $set: {
              name: name.trim(),
              description: description?.trim() || undefined,
            },
          },
          {
            new: true,
            runValidators: true,
          },
        );

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
        console.error("Update inventory location error:", error);

        return res.status(500).json({
          success: false,
          data: "Lagerplatsen kunde inte uppdateras.",
        });
      }
    }

    default: {
      res.setHeader("Allow", ["GET", "POST", "PUT"]);

      return res.status(405).json({
        success: false,
        data: "Method not allowed.",
      });
    }
  }
}
