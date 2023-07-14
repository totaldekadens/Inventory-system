import dbConnect from "@/lib/dbConnect";
import { todayDate } from "@/lib/setDate";
import Article, { ArticleDocument } from "@/models/ArticleModel";
import { NextApiRequest, NextApiResponse } from "next";
import InventoryLocation from "@/models/InventoryLocationModel";
import Vehicle from "@/models/VehicleModel";
import TransactionHistory from "@/models/TransactionHistoryModel";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const getAllArticles: ArticleDocument[] | null = await Article.find({})
          .populate({
            path: "inventoryLocation",
            model: InventoryLocation,
          })
          .populate({
            path: "vehicleModels",
            model: Vehicle,
          });

        if (!getAllArticles) {
          return res.status(500).send({
            success: false,
            data: "Server problem",
          });
        }

        const descendingArticles = getAllArticles.sort((a, b) =>
          a.createdDate < b.createdDate ? 1 : -1
        );

        res.status(200).json({ success: true, data: descendingArticles });
      } catch (error) {
        res.status(400).json({ success: false, data: error });
      }
      break;
    case "POST":
      try {
        if (!req.body) {
          return res.status(400).json({ success: false, data: "Bad request" });
        }

        let newArticle: ArticleDocument = new Article(req.body);

        const getHeightestArtNo = await TransactionHistory.aggregate([
          {
            $unwind: "$article",
          },
          { $sort: { "article.artno": -1 } },
          { $limit: 1 },
        ]);

        const newArticleNumber = Number(getHeightestArtNo[0].article.artno) + 1;

        newArticle.artno = newArticleNumber;
        newArticle.createdDate = todayDate;

        const article = await Article.create(newArticle);

        if (!article) {
          return res.status(400).json({
            success: false,
            data: "Något gick fel, kunde inte skapa artikel. Kolla ditt underlag",
          });
        }

        const createTransactionHistory = {
          direction: "+",
          cause: "Artikel skapad",
          qty: article.qty,
          article,
          comment: "",
          createdDate: todayDate,
        };

        const transactionHistory = await TransactionHistory.create(
          createTransactionHistory
        );

        if (!transactionHistory) {
          return res.status(400).json({
            success: false,
            data: "Något gick fel. Artikeln är skapad, men ingen transaktionshistorik skapades",
          });
        }
        res.status(201).json({ success: true, data: article._id });
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

        // Continue with this one later. Not done.

        const updateArticle: ArticleDocument = new Article(req.body);

        updateArticle.lastUpdated = todayDate;

        const article = await Article.findOneAndUpdate(
          { _id: req.body._id },
          updateArticle,
          {
            new: true,
            runValidators: true,
          }
        );

        if (!article) {
          return res
            .status(400)
            .json({ success: false, data: "Article not updated" });
        }
        res.status(200).json({ success: true, data: article });
      } catch (error) {
        res.status(400).json({ success: false, data: error });
      }
      break;
    default:
      res.json({ success: false, data: "break error" });
      break;
  }
}
