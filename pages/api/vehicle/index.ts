import caseInsensitive from "@/lib/caseCheck";
import dbConnect from "@/lib/dbConnect";
import Vehicle from "@/models/VehicleModel";
import { Types } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

interface CreateVehicleBody {
  name: string;
}

interface UpdateVehicleBody {
  _id: string;
  name: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      try {
        const vehicles = await Vehicle.find({}).sort({
          name: 1,
        });

        return res.status(200).json({
          success: true,
          data: vehicles,
        });
      } catch (error) {
        console.error("Get vehicles error:", error);

        return res.status(500).json({
          success: false,
          data: "Fordonsmodellerna kunde inte hämtas.",
        });
      }
    }

    case "POST": {
      try {
        const { name } = req.body as CreateVehicleBody;

        if (!name?.trim()) {
          return res.status(400).json({
            success: false,
            data: "Fordonsmodellens namn måste anges.",
          });
        }

        const existingVehicle = await Vehicle.findOne({
          name: caseInsensitive(name.trim()),
        });

        if (existingVehicle) {
          return res.status(409).json({
            success: false,
            data: "Det finns redan en fordonsmodell med det namnet.",
          });
        }

        const vehicle = await Vehicle.create({
          name: name.trim(),
        });

        return res.status(201).json({
          success: true,
          data: vehicle._id,
        });
      } catch (error) {
        console.error("Create vehicle error:", error);

        return res.status(500).json({
          success: false,
          data: "Fordonsmodellen kunde inte skapas.",
        });
      }
    }

    case "PUT": {
      try {
        const { _id, name } = req.body as UpdateVehicleBody;

        if (!_id || !Types.ObjectId.isValid(_id)) {
          return res.status(400).json({
            success: false,
            data: "Ogiltigt fordonsmodell-id.",
          });
        }

        if (!name?.trim()) {
          return res.status(400).json({
            success: false,
            data: "Fordonsmodellens namn måste anges.",
          });
        }

        const existingVehicle = await Vehicle.findOne({
          name: caseInsensitive(name.trim()),
          _id: { $ne: _id },
        });

        if (existingVehicle) {
          return res.status(409).json({
            success: false,
            data: "Det finns redan en fordonsmodell med det namnet.",
          });
        }

        const vehicle = await Vehicle.findByIdAndUpdate(
          _id,
          {
            $set: {
              name: name.trim(),
            },
          },
          {
            new: true,
            runValidators: true,
          },
        );

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
        console.error("Update vehicle error:", error);

        return res.status(500).json({
          success: false,
          data: "Fordonsmodellen kunde inte uppdateras.",
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
