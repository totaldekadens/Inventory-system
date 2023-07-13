import dbConnect from "@/lib/dbConnect";
import TransactionHistory, {
  TransactionHistoryDocument,
} from "@/models/TransactionHistoryModel";
import Article from "@/models/ArticleModel";
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
        const getTransactionHistory: TransactionHistoryDocument[] | null =
          await TransactionHistory.find({}).populate({
            path: "article",
            model: Article,
          });

        if (!getTransactionHistory) {
          return res.status(500).send({
            success: false,
            data: "Server problem",
          });
        }

        res.status(200).json({ success: true, data: getTransactionHistory });
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

        console.log(req.body);
        let newTransactionHistory: TransactionHistoryDocument =
          new TransactionHistory(req.body);

        const transactionHistory = await TransactionHistory.create(
          newTransactionHistory
        );

        res.status(201).json({ success: true, data: transactionHistory._id });
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

        const updateTransactionHistory: TransactionHistoryDocument =
          new TransactionHistory(req.body);

        const transactionHistory = await TransactionHistory.findOneAndUpdate(
          { _id: req.body._id },
          updateTransactionHistory,
          {
            new: true,
            runValidators: true,
          }
        );

        if (!transactionHistory) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: transactionHistory });
      } catch (error) {
        res.status(400).json({ success: false, data: error });
      }
      break;

    default:
      res.json({ success: false, data: "break error" });
      break;
  }
}
