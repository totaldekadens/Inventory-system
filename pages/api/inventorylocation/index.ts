import caseInsensitive from "@/lib/caseCheck";
import dbConnect from "@/lib/dbConnect";
import InventoryLocation, {
  InventoryLocationDocument,
} from "@/models/InventoryLocationModel";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        if (!req.body) {
          return res.status(400).json({ success: false, data: "Bad request" });
        }
        const inventoryLocationTaken: InventoryLocationDocument | null =
          await InventoryLocation.findOne({
            name: caseInsensitive(req.body.name),
          });
        if (inventoryLocationTaken) {
          return res.status(403).send({
            success: false,
            data: "Location name already exist",
          });
        }

        let newInventoryLocation: InventoryLocationDocument =
          new InventoryLocation(req.body);

        const inventoryLocation = await InventoryLocation.create(
          newInventoryLocation
        );

        res.status(201).json({ success: true, data: inventoryLocation._id });
      } catch (error) {
        res.json({ success: false, data: error });
      }
      break;

    case "PUT":
      try {
        const inventoryLocationTaken: InventoryLocationDocument[] | null =
          await InventoryLocation.find({
            name: caseInsensitive(req.body.name),
          });

        if (
          inventoryLocationTaken.length > 0 &&
          inventoryLocationTaken[0]._id != req.body._id
        ) {
          return res.status(403).send({
            success: false,
            data: "Location name already exist",
          });
        }

        const updateInventoryLocation: InventoryLocationDocument =
          new InventoryLocation(req.body);

        const inventoryLocation = await InventoryLocation.findOneAndUpdate(
          { _id: req.body._id },
          updateInventoryLocation,
          {
            new: true,
            runValidators: true,
          }
        );

        if (!inventoryLocation) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: inventoryLocation });
      } catch (error) {
        res.status(400).json({ success: false, data: error });
      }
      break;

    default:
      res.json({ success: false, data: "break error" });
      break;
  }
}
