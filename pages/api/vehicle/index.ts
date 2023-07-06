import caseInsensitive from "@/lib/caseCheck";
import dbConnect from "@/lib/dbConnect";
import Vehicle, { VehicleDocument } from "@/models/VehicleModel";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const getAllVehicles: VehicleDocument[] | null = await Vehicle.find({});

        if (!getAllVehicles) {
          return res.status(500).send({
            success: false,
            data: "Server problem",
          });
        }

        res.status(200).json({ success: true, data: getAllVehicles });
      } catch (error) {
        res.status(400).json({ success: false, data: error });
      }
      break;
    case "POST":
      try {
        if (!req.body) {
          return res
            .status(400)
            .json({ success: false, data: "Bad request, check body" });
        }
        const vehicleTaken: VehicleDocument | null = await Vehicle.findOne({
          name: caseInsensitive(req.body.name),
        });
        if (vehicleTaken) {
          return res.status(403).send({
            success: false,
            data: "Vehicle name already exist",
          });
        }

        let newVehicle: VehicleDocument = new Vehicle(req.body);

        const vehicle = await Vehicle.create(newVehicle);

        res.status(201).json({ success: true, data: vehicle._id });
      } catch (error) {
        res.json({ success: false, data: error });
      }
      break;

    case "PUT":
      try {
        if (!req.body) {
          return res
            .status(400)
            .json({ success: false, data: "Bad request, check body" });
        }
        const vehicleTaken: VehicleDocument[] | null = await Vehicle.find({
          name: caseInsensitive(req.body.name),
        });

        if (vehicleTaken.length > 0 && vehicleTaken[0]._id != req.body._id) {
          return res.status(403).send({
            success: false,
            data: "Vehicle name already exist",
          });
        }

        const updateVehicle: VehicleDocument = new Vehicle(req.body);

        const vehicle = await Vehicle.findOneAndUpdate(
          { _id: req.body._id },
          updateVehicle,
          {
            new: true,
            runValidators: true,
          }
        );

        if (!vehicle) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: vehicle });
      } catch (error) {
        res.status(400).json({ success: false, data: error });
      }
      break;

    default:
      res.json({ success: false, data: "break error" });
      break;
  }
}
