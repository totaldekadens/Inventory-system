import dbConnect from "@/lib/dbConnect";
import { getTodayDate } from "@/lib/setDate";
import Article, { ArticleDocument } from "@/models/ArticleModel";
import InventoryLocation, {
  InventoryLocationDocument,
} from "@/models/InventoryLocationModel";
import TransactionHistory from "@/models/TransactionHistoryModel";
import mongoose, { Types } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

interface MoveArticleBody {
  articleId: string;
  newLocationId: string;
}

type PopulatedArticle = Omit<ArticleDocument, "inventoryLocation"> & {
  inventoryLocation: InventoryLocationDocument;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);

    return res.status(405).json({
      success: false,
      data: "Method not allowed",
    });
  }

  await dbConnect();

  const { articleId, newLocationId } = req.body as MoveArticleBody;
  const createdDate = getTodayDate();
  if (!articleId || !newLocationId) {
    return res.status(400).json({
      success: false,
      data: "Artikel och lagerplats måste anges.",
    });
  }

  if (
    !Types.ObjectId.isValid(articleId) ||
    !Types.ObjectId.isValid(newLocationId)
  ) {
    return res.status(400).json({
      success: false,
      data: "Ogiltigt artikel-id eller lagerplats-id.",
    });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const article = await Article.findById(articleId)
      .populate("inventoryLocation")
      .session(session);

    if (!article) {
      throw new Error("Artikeln hittades inte.");
    }

    const populatedArticle = article as unknown as PopulatedArticle;
    const oldLocation = populatedArticle.inventoryLocation;

    if (!oldLocation) {
      throw new Error("Artikeln saknar lagerplats.");
    }

    const newLocation =
      await InventoryLocation.findById(newLocationId).session(session);

    if (!newLocation) {
      throw new Error("Den nya lagerplatsen hittades inte.");
    }

    if (String(oldLocation._id) === String(newLocation._id)) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        data: "Artikeln ligger redan på den valda lagerplatsen.",
      });
    }

    const virtualLocationId = "64a95847dec1488ee60d10cd";

    if (
      populatedArticle.qty > 0 &&
      String(newLocation._id) === virtualLocationId
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        data: "Lagerplats 00 är endast till för artiklar med lagersaldo 0.",
      });
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      {
        inventoryLocation: newLocation._id,
        lastUpdated: createdDate,
      },
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    console.log("updatedArticle in backend", updatedArticle);

    if (!updatedArticle) {
      throw new Error("Artikeln kunde inte uppdateras.");
    }

    await TransactionHistory.create(
      [
        {
          direction: "",
          cause: "Flytt till ny lagerplats",

          article: {
            _id: updatedArticle._id,
            artno: updatedArticle.artno,
            supplierArtno: updatedArticle.supplierArtno,
            vehicleModels: updatedArticle.vehicleModels,
            title: updatedArticle.title,
            description: updatedArticle.description,
            qty: updatedArticle.qty,
            condition: updatedArticle.condition,
            forSale: updatedArticle.forSale,
            price: updatedArticle.price,
            inventoryLocation: updatedArticle.inventoryLocation,
            images: updatedArticle.images,
            purchaseValue: updatedArticle.purchaseValue,
            comment: updatedArticle.comment,
            issue: updatedArticle.issue,
            createdDate: updatedArticle.createdDate,
            lastUpdated: updatedArticle.lastUpdated,
          },

          fromLocation: {
            _id: oldLocation._id,
            name: oldLocation.name,
          },

          toLocation: {
            _id: newLocation._id,
            name: newLocation.name,
          },

          qty: updatedArticle.qty,

          comment: `Flytt från "${oldLocation.name}" till "${newLocation.name}"`,

          createdDate,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      data: updatedArticle,
    });
  } catch (error) {
    await session.abortTransaction();

    console.error("Move article error:", error);

    return res.status(500).json({
      success: false,
      data: "Flytten kunde inte genomföras. Inga ändringar sparades.",
    });
  } finally {
    await session.endSession();
  }
}
