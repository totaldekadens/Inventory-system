import dbConnect from "@/lib/dbConnect";
import TransactionHistory, {
  TransactionHistoryDocument,
} from "@/models/TransactionHistoryModel";
import { Types } from "mongoose";
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
      // Gets all transactions history from specific article
      try {
        const getSpecificTransactionHistory =
          await TransactionHistory.aggregate([
            { $unwind: "$article" },
            { $match: { "article.artno": Number(id) } },
          ]);

        if (!getSpecificTransactionHistory) {
          return res.status(403).send({
            success: false,
            data: "History not found",
          });
        }

        res
          .status(201)
          .json({ success: true, data: getSpecificTransactionHistory });
      } catch (error) {
        res.json({ success: false, data: error });
      }
      break;

    case "DELETE":
      try {
        // Todo:  Check if an article is on the location, it shall not be able to delete before the article is moved to a new location.
        const deletedTransactionHistory = await TransactionHistory.deleteOne({
          _id: id,
        });
        if (deletedTransactionHistory.deletedCount < 1) {
          return res
            .status(400)
            .json({ success: false, data: "TransactionHistory not deleted" });
        }
        res.status(200).json({
          success: true,
          data: "TransactionHistory is successfully deleted",
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
