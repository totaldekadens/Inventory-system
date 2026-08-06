import dbConnect from "@/lib/dbConnect";
import TransactionHistory from "@/models/TransactionHistoryModel";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      try {
        const transactionHistory = await TransactionHistory.find({}).sort({
          createdDate: -1,
        });

        return res.status(200).json({
          success: true,
          data: transactionHistory,
        });
      } catch (error) {
        console.error("Get transaction history error:", error);

        return res.status(500).json({
          success: false,
          data: "Transaktionshistoriken kunde inte hämtas.",
        });
      }
    }

    case "POST": {
      try {
        if (!req.body) {
          return res.status(400).json({
            success: false,
            data: "Underlag för transaktionen saknas.",
          });
        }

        const transactionHistory = await TransactionHistory.create(req.body);

        return res.status(201).json({
          success: true,
          data: transactionHistory._id,
        });
      } catch (error) {
        console.error("Create transaction history error:", error);

        return res.status(500).json({
          success: false,
          data: "Transaktionshistoriken kunde inte skapas.",
        });
      }
    }

    default: {
      res.setHeader("Allow", ["GET", "POST"]);

      return res.status(405).json({
        success: false,
        data: "Method not allowed.",
      });
    }
  }
}
