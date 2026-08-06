import dbConnect from "@/lib/dbConnect";
import { getTodayDate } from "@/lib/setDate";
import Article from "@/models/ArticleModel";
import InventoryLocation from "@/models/InventoryLocationModel";
import TransactionHistory from "@/models/TransactionHistoryModel";
import Vehicle from "@/models/VehicleModel";
import mongoose, { Types } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      data: "Ogiltigt artikel-id.",
    });
  }

  await dbConnect();

  if (req.method === "GET") {
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
        return res.status(404).json({
          success: false,
          data: "Artikeln hittades inte.",
        });
      }

      return res.status(200).json({
        success: true,
        data: article,
      });
    } catch (error) {
      console.error("Get article error:", error);

      return res.status(500).json({
        success: false,
        data: "Artikeln kunde inte hämtas.",
      });
    }
  }

  if (req.method === "DELETE") {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const article = await Article.findById(id).session(session);

      if (!article) {
        await session.abortTransaction();

        return res.status(404).json({
          success: false,
          data: "Artikeln hittades inte.",
        });
      }

      await TransactionHistory.create(
        [
          {
            direction: "-",
            cause: "Artikel permanent borttagen",
            qty: article.qty,
            article: article.toObject(),
            comment: "",
            createdDate: getTodayDate(),
          },
        ],
        { session },
      );

      const deleteResult = await Article.deleteOne({ _id: id }, { session });

      if (deleteResult.deletedCount !== 1) {
        throw new Error("Artikeln kunde inte tas bort.");
      }

      await session.commitTransaction();

      return res.status(200).json({
        success: true,
        data: "Artikeln är borttagen.",
      });
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }

      console.error("Delete article error:", error);

      return res.status(500).json({
        success: false,
        data: "Artikeln kunde inte tas bort. Inga ändringar har sparats.",
      });
    } finally {
      await session.endSession();
    }
  }

  res.setHeader("Allow", ["GET", "DELETE"]);

  return res.status(405).json({
    success: false,
    data: "Method not allowed.",
  });
}
