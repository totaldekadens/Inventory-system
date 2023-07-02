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
    default:
      res.json({ success: false, data: "break error" });
      break;
  }
}
