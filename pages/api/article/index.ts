import dbConnect from "@/lib/dbConnect";
import { todayDate } from "@/lib/setDate";
import Article, { ArticleDocument } from "@/models/ArticleModel";
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
        const getAllArticles: ArticleDocument[] | null = await Article.find({});

        if (!getAllArticles) {
          return res.status(500).send({
            success: false,
            data: "Server problem",
          });
        }

        res.status(200).json({ success: true, data: getAllArticles });
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

        newArticle.createdDate = todayDate;

        const article = await Article.create(newArticle);

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
