import mongoose from "mongoose";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

/**
 * Försöker konvertera ett äldre datumvärde till ett giltigt Date-objekt.
 *
 * Stödjer både:
 * - MongoDB Date
 * - ISO-strängar
 * - Äldre datumformat: "YYYY-MM-DD HH:mm"
 *
 * Returnerar `null` om värdet inte kan tolkas som ett giltigt datum.
 */
function parseLegacyDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.includes("T") ? value : value.replace(" ", "T");

  const parsedDate = new Date(normalizedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

/**
 * Migrerar samtliga artiklar.
 *
 * Konverterar äldre datumsträngar till Date och säkerställer att alla artiklar
 * har ett giltigt `lastUpdated`. Om `lastUpdated` saknas används `createdDate`
 * som fallback.
 */
async function migrateArticles() {
  const collection = mongoose.connection.collection("articles");

  const articles = await collection.find({}).toArray();

  let updatedCreatedDate = 0;
  let updatedLastUpdated = 0;
  let fallbackLastUpdated = 0;
  let skipped = 0;
  let failed = 0;

  for (const article of articles) {
    const updates: Record<string, Date> = {};

    //
    // createdDate
    //
    const createdDate = parseLegacyDate(article.createdDate);

    if (!createdDate) {
      console.error(
        `❌ Kunde inte tolka createdDate för artikel ${article._id}:`,
        article.createdDate,
      );

      failed++;
      continue;
    }

    if (!(article.createdDate instanceof Date)) {
      updates.createdDate = createdDate;
      updatedCreatedDate++;
    }

    //
    // lastUpdated
    //
    const lastUpdated = parseLegacyDate(article.lastUpdated);

    if (!lastUpdated) {
      // Saknas, är null eller innehåller ett ogiltigt datum.
      // Använd createdDate som fallback.
      updates.lastUpdated = createdDate;
      fallbackLastUpdated++;

      console.log(
        `↪️ ${article._id}: lastUpdated saknas/är ogiltigt → använder createdDate`,
      );
    } else if (!(article.lastUpdated instanceof Date)) {
      // lastUpdated finns och går att tolka,
      // men ligger fortfarande som string i MongoDB.
      updates.lastUpdated = lastUpdated;
      updatedLastUpdated++;
    }

    if (Object.keys(updates).length === 0) {
      skipped++;
      continue;
    }

    await collection.updateOne(
      { _id: article._id },
      {
        $set: updates,
      },
    );
  }

  console.log("\n📦 Artiklar");
  console.log(`✅ createdDate konverterade: ${updatedCreatedDate}`);
  console.log(`✅ lastUpdated konverterade: ${updatedLastUpdated}`);
  console.log(`↪️ lastUpdated satta från createdDate: ${fallbackLastUpdated}`);
  console.log(`⏭️ Redan korrekta: ${skipped}`);
  console.log(`❌ Misslyckade: ${failed}`);
}

/**
 * Migrerar transaktionshistoriken genom att konvertera `createdDate`
 * från äldre strängformat till MongoDB Date.
 */
async function migrateTransactionHistory() {
  const collection = mongoose.connection.collection("transactionhistories");

  const transactions = await collection.find({}).toArray();

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const transaction of transactions) {
    const createdDate = parseLegacyDate(transaction.createdDate);

    if (!createdDate) {
      console.error(
        `❌ Kunde inte tolka createdDate för transaktion ${transaction._id}:`,
        transaction.createdDate,
      );

      failed++;
      continue;
    }

    if (transaction.createdDate instanceof Date) {
      skipped++;
      continue;
    }

    await collection.updateOne(
      { _id: transaction._id },
      {
        $set: {
          createdDate,
        },
      },
    );

    updated++;
  }

  console.log("\n📜 Transaktionshistorik");
  console.log(`✅ createdDate konverterade: ${updated}`);
  console.log(`⏭️ Redan korrekta: ${skipped}`);
  console.log(`❌ Misslyckade: ${failed}`);
}

/**
 * Migrerar äldre datumfält i MongoDB till riktiga BSON Date-objekt.
 *
 * Bakgrund:
 * Tidigare sparades `createdDate` och `lastUpdated` som formatterade strängar,
 * exempelvis "2026-08-05 15:00". Det fungerade för visning, men gjorde
 * sortering och datumjämförelser mer komplicerade.
 *
 * Detta script konverterar därför äldre datumsträngar till riktiga `Date`-objekt
 * som MongoDB lagrar som BSON Date.
 *
 * Artiklar:
 * - Konverterar `createdDate` från string till Date.
 * - Konverterar `lastUpdated` från string till Date.
 * - Om `lastUpdated` saknas, är `null` eller inte kan tolkas som ett datum,
 *   sätts den till samma värde som `createdDate`.
 *
 * Transaktionshistorik:
 * - Konverterar `createdDate` från string till Date.
 *
 * Scriptet är idempotent, vilket innebär att det kan köras flera gånger utan
 * att redan migrerade dokument påverkas.
 *
 * Körs endast vid behov som ett engångsscript och ska inte användas som en del
 * av den ordinarie applikationen.
 */
async function migrateDates() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI saknas i .env.local.");
  }

  try {
    console.log("Ansluter till databasen...");

    await mongoose.connect(mongoUri);

    console.log("✅ Ansluten\n");
    console.log("Startar datummigrering...");

    await migrateArticles();
    await migrateTransactionHistory();

    console.log("\n🎉 Migreringen är klar!");
  } catch (error) {
    console.error("\n❌ Migreringen misslyckades:");
    console.error(error);
  } finally {
    await mongoose.disconnect();

    console.log("\nDatabasanslutningen stängdes.");
  }
}

migrateDates();
