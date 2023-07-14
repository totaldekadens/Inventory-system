import dbConnect from "@/lib/dbConnect";
import Article from "@/models/ArticleModel";
import { NextApiRequest, NextApiResponse } from "next";
import InventoryLocation from "@/models/InventoryLocationModel";
import Vehicle from "@/models/VehicleModel";
import { todayDate } from "@/lib/setDate";
import TransactionHistory from "@/models/TransactionHistoryModel";
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
        const findArticle = await Article.findById(id);

        if (!findArticle) {
          return res
            .status(400)
            .json({ success: false, data: "Artikel ej borttagen" });
        }

        const createTransactionHistory = {
          direction: "-",
          cause: "Artikel permanent borttagen",
          qty: findArticle.qty,
          article: findArticle,
          comment: "",
          createdDate: todayDate,
        };

        const transactionHistory = await TransactionHistory.create(
          createTransactionHistory
        );

        if (!transactionHistory) {
          return res.status(400).json({
            success: false,
            data: "Något gick fel, artikel ej borttagen",
          });
        }

        const deletedLocation = await Article.deleteOne({ _id: id });
        if (deletedLocation.deletedCount < 1) {
          return res.status(400).json({
            success: false,
            data: "Något gick fel, artikel ej borttagen",
          });
        }

        res.status(200).json({
          success: true,
          data: "Artikeln är borttagen",
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
