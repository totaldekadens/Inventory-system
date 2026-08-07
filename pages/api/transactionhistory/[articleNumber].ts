import dbConnect from "@/lib/dbConnect";
import TransactionHistory from "@/models/TransactionHistoryModel";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { articleNumber } = req.query;

  if (
    typeof articleNumber !== "string" ||
    !Number.isInteger(Number(articleNumber))
  ) {
    return res.status(400).json({
      success: false,
      data: "Ogiltigt artikelnummer.",
    });
  }

  await dbConnect();

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);

    return res.status(405).json({
      success: false,
      data: "Method not allowed.",
    });
  }

  try {
    const transactionHistory = await TransactionHistory.find({
      "article.artno": Number(articleNumber),
    }).sort({
      createdDate: -1,
    });

    return res.status(200).json({
      success: true,
      data: transactionHistory,
    });
  } catch (error) {
    console.error("Get article transaction history error:", error);

    return res.status(500).json({
      success: false,
      data: "Artikelns transaktionshistorik kunde inte hämtas.",
    });
  }
}
