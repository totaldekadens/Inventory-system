import Head from "next/head";
import Header from "@/components/layout/Header";
import { GetServerSideProps } from "next";
import dbConnect from "@/lib/dbConnect";
import TransactionHistory, {
  TransactionHistoryDocument,
} from "@/models/TransactionHistoryModel";
import { useState } from "react";
import Article from "@/models/ArticleModel";
import InventoryLocation, {
  InventoryLocationDocument,
} from "@/models/InventoryLocationModel";
import Vehicle, { VehicleDocument } from "@/models/VehicleModel";
import { useContext, useEffect } from "react";
import {
  PopulatedArticleDocument,
  articleContext,
} from "@/components/context/ArticleProvider";
import { inventoryLocationContext } from "@/components/context/InventoryLocationProvider";
import { vehicleContext } from "@/components/context/VehicleProvider";
import Active from "@/components/Active";

interface Props {
  history: TransactionHistoryDocument[];
  articles: PopulatedArticleDocument[];
  inventoryLocations: InventoryLocationDocument[];
  vehicleModels: VehicleDocument[];
}

export default function Index({
  history,
  articles,
  inventoryLocations,
  vehicleModels,
}: Props) {
  const { setCurrentArticles, setArticles } = useContext(articleContext);
  const { vehicles, setVehicles } = useContext(vehicleContext);
  const { setInventoryLocations } = useContext(inventoryLocationContext);

  const [currentArticle, setCurrentArticle] =
    useState<TransactionHistoryDocument[]>(history);

  useEffect(() => {
    setCurrentArticles(articles);
    setArticles(articles);
    setInventoryLocations(inventoryLocations);
    setVehicles(vehicleModels);
  }, []);

  return (
    <>
      <Head>
        <title>Transaktionshistorik</title>
      </Head>
      <Header />
      <main className="flex min-h-full items-center justify-center px-2  sm:px-6 lg:px-8 w-full ">
        <div className="px-2 sm:px-6 lg:px-8 mt-10 md:mt-10 sm:mt-8 w-full max-w-8xl">
          <Active
            history={{
              setFilteredObjectList: setCurrentArticle,
              listOfObjects: currentArticle,
              history: history,
            }}
          />
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  await dbConnect();

  const getArticles: PopulatedArticleDocument[] = await Article.find({})
    .populate({
      path: "inventoryLocation",
      model: InventoryLocation,
    })
    .populate({
      path: "vehicleModels",
      model: Vehicle,
    });

  const descendingArticles = getArticles.sort((a, b) =>
    a.createdDate < b.createdDate ? 1 : -1
  );

  const getInventoryLocations = await InventoryLocation.find({});
  const getVehicleModels = await Vehicle.find({});

  const getTransactionHistory: TransactionHistoryDocument[] | null =
    await TransactionHistory.find({});
  // Sort keys from Ö - A
  const descendingHistory = getTransactionHistory.sort((a, b) =>
    a.createdDate < b.createdDate ? 1 : -1
  );

  return {
    props: {
      history: JSON.parse(JSON.stringify(descendingHistory)),
      articles: JSON.parse(JSON.stringify(descendingArticles)),
      inventoryLocations: JSON.parse(JSON.stringify(getInventoryLocations)),
      vehicleModels: JSON.parse(JSON.stringify(getVehicleModels)),
    },
  };
};
