import { scrapCauses } from "@/lib/config";
import dbConnect from "@/lib/dbConnect";
import Article from "@/models/ArticleModel";
import InventoryLocation from "@/models/InventoryLocationModel";
import TransactionHistory from "@/models/TransactionHistoryModel";
import mongoose, { Types } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

type UpdateMode = "set" | "add" | "remove";

interface UpdateQuantityBody {
  articleId: string;
  updateMode: UpdateMode;
  enteredQty: number;
  newLocationId?: string;
  cause?: string;
  pricePerUnit?: number;
  comment?: string;
}

const VIRTUAL_LOCATION_ID = "64a95847dec1488ee60d10cd";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);

    return res.status(405).json({
      success: false,
      data: "Method not allowed.",
    });
  }

  await dbConnect();

  const {
    articleId,
    updateMode,
    enteredQty,
    newLocationId,
    cause,
    pricePerUnit,
    comment,
  } = req.body as UpdateQuantityBody;

  /*
   * Grundläggande validering innan databassessionen startas.
   */
  if (!articleId || !updateMode || enteredQty === undefined) {
    return res.status(400).json({
      success: false,
      data: "Artikel, uppdateringsläge och antal måste anges.",
    });
  }

  if (!Types.ObjectId.isValid(articleId)) {
    return res.status(400).json({
      success: false,
      data: "Ogiltigt artikel-id.",
    });
  }

  if (!["set", "add", "remove"].includes(updateMode)) {
    return res.status(400).json({
      success: false,
      data: "Ogiltigt uppdateringsläge.",
    });
  }

  const numericEnteredQty = Number(enteredQty);

  if (
    !Number.isFinite(numericEnteredQty) ||
    !Number.isInteger(numericEnteredQty) ||
    numericEnteredQty < 0
  ) {
    return res.status(400).json({
      success: false,
      data: "Antalet måste vara ett heltal som är 0 eller större.",
    });
  }

  if (
    (updateMode === "add" || updateMode === "remove") &&
    numericEnteredQty === 0
  ) {
    return res.status(400).json({
      success: false,
      data: "Antalet att lägga till eller ta bort måste vara större än 0.",
    });
  }

  if (newLocationId && !Types.ObjectId.isValid(newLocationId)) {
    return res.status(400).json({
      success: false,
      data: "Ogiltigt lagerplats-id.",
    });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /*
     * Läs artikelns aktuella information från databasen.
     * Backend ska inte förlita sig på ett saldo från frontend.
     */
    const article = await Article.findById(articleId).session(session);

    if (!article) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        data: "Artikeln hittades inte.",
      });
    }

    const oldQty = article.qty;
    const oldLocationId = article.inventoryLocation;

    const newQty =
      updateMode === "set"
        ? numericEnteredQty
        : updateMode === "add"
          ? oldQty + numericEnteredQty
          : oldQty - numericEnteredQty;

    if (newQty < 0) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        data: "Du kan inte ta bort mer än vad som finns tillgängligt.",
      });
    }

    if (newQty === oldQty) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        data: "Lagersaldot har inte ändrats.",
      });
    }

    const isIncrease = newQty > oldQty;
    const isDecrease = newQty < oldQty;
    const quantityChange = Math.abs(newQty - oldQty);

    /*
     * Vid minskning måste en giltig uttagsorsak anges.
     */
    const selectedCause = isDecrease
      ? scrapCauses.find((item) => item.value === cause)
      : undefined;

    if (isDecrease && !selectedCause) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        data: "Anledning till uttaget måste anges.",
      });
    }

    const isSold = isDecrease && cause === "sold";

    if (
      isSold &&
      (!Number.isFinite(Number(pricePerUnit)) || Number(pricePerUnit) < 0)
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        data: "Ett giltigt försäljningspris per enhet måste anges.",
      });
    }

    /*
     * En artikel med saldo 0 ligger på den virtuella platsen 00.
     * När saldot höjs igen måste användaren välja en riktig plats.
     */
    const articleIsOnVirtualLocation =
      String(oldLocationId) === VIRTUAL_LOCATION_ID;

    const requiresNewLocation = articleIsOnVirtualLocation && newQty > 0;

    if (requiresNewLocation && !newLocationId) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        data: "En ny lagerplats måste väljas när saldot höjs från 0.",
      });
    }

    /*
     * Hämta eventuell ny vald lagerplats.
     */
    const selectedNewLocation =
      requiresNewLocation && newLocationId
        ? await InventoryLocation.findById(newLocationId).session(session)
        : null;

    if (requiresNewLocation && !selectedNewLocation) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        data: "Den valda lagerplatsen hittades inte.",
      });
    }

    if (
      selectedNewLocation &&
      String(selectedNewLocation._id) === VIRTUAL_LOCATION_ID
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        data: "Lagerplats 00 kan inte användas när saldot är större än 0.",
      });
    }

    /*
     * Bestäm artikelns lagerplats efter saldoförändringen:
     *
     * saldo 0        → plats 00
     * saldo över 0,
     * tidigare 00    → den nya valda platsen
     * annars         → behåll nuvarande plats
     */
    const resultingLocationId =
      newQty === 0
        ? new Types.ObjectId(VIRTUAL_LOCATION_ID)
        : requiresNewLocation && selectedNewLocation
          ? selectedNewLocation._id
          : oldLocationId;

    const locationHasChanged =
      String(oldLocationId) !== String(resultingLocationId);

    /*
     * Hämta platsinformation innan artikeln uppdateras.
     * Namnen sparas i historiken som historiska värden.
     */
    const oldLocation =
      await InventoryLocation.findById(oldLocationId).session(session);

    if (!oldLocation) {
      throw new Error("Artikelns nuvarande lagerplats kunde inte hittas.");
    }

    const resultingLocation =
      String(resultingLocationId) === String(oldLocationId)
        ? oldLocation
        : await InventoryLocation.findById(resultingLocationId).session(
            session,
          );

    if (!resultingLocation) {
      throw new Error("Artikelns nya lagerplats kunde inte hittas.");
    }

    const now = new Date();

    const articleUpdate: Record<string, unknown> = {
      qty: newQty,
      inventoryLocation: resultingLocationId,
      lastUpdated: now,
    };

    /*
     * Behåll endast detta om artikelns vanliga pris ska uppdateras
     * till det senaste försäljningspriset när artiklar säljs.
     *
     * Om price är artikelns annonserade pris bör blocket tas bort.
     */
    if (isSold) {
      articleUpdate.price = Number(pricePerUnit);
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      {
        $set: articleUpdate,
      },
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updatedArticle) {
      throw new Error("Artikeln kunde inte uppdateras.");
    }

    /*
     * Spara saldoförändringen i historiken.
     *
     * TransactionHistory innehåller en inbäddad kopia av artikeln.
     */
    await TransactionHistory.create(
      [
        {
          direction: isIncrease ? "+" : "-",
          cause: isDecrease ? selectedCause?.label : undefined,
          pricePerUnit: isSold ? Number(pricePerUnit) : undefined,
          qty: quantityChange,
          article: updatedArticle.toObject(),
          comment: comment?.trim() || undefined,
          createdDate: now,
        },
      ],
      { session },
    );

    /*
     * Om saldoförändringen även flyttade artikeln skapas en separat
     * flyttrad i historiken.
     *
     * Det gäller både:
     * 00 → riktig lagerplats
     * riktig lagerplats → 00
     */
    if (locationHasChanged) {
      await TransactionHistory.create(
        [
          {
            direction: "",
            cause: "Flytt till ny lagerplats",
            qty: updatedArticle.qty,
            article: updatedArticle.toObject(),

            fromLocation: {
              _id: oldLocation._id,
              name: oldLocation.name,
            },

            toLocation: {
              _id: resultingLocation._id,
              name: resultingLocation.name,
            },

            comment: `Flytt från "${oldLocation.name}" till "${resultingLocation.name}"`,
            createdDate: now,
          },
        ],
        { session },
      );
    }

    /*
     * Först när både artikeluppdateringen och historiken har lyckats
     * genomförs transaktionen.
     */
    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      data: {
        articleId: updatedArticle._id,
        previousQty: oldQty,
        qty: newQty,
        quantityChange,
        direction: isIncrease ? "+" : "-",
        price: updatedArticle.price,
        inventoryLocation: {
          _id: resultingLocation._id,
          name: resultingLocation.name,
          description: resultingLocation.description,
        },
      },
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("Update article quantity error:", error);

    return res.status(500).json({
      success: false,
      data: "Lagersaldot kunde inte uppdateras. Inga ändringar har sparats.",
    });
  } finally {
    await session.endSession();
  }
}
