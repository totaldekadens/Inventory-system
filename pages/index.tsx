import Head from "next/head";
import Header from "@/components/layout/Header";
import { GetServerSideProps } from "next";
import Article from "@/models/ArticleModel";
import dbConnect from "@/lib/dbConnect";
import Overview from "@/components/overview/Overview";
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

interface Props {
  articles: PopulatedArticleDocument[];
  inventoryLocations: InventoryLocationDocument[];
  vehicleModels: VehicleDocument[];
}

export default function Index({
  articles,
  inventoryLocations,
  vehicleModels,
}: Props) {
  const { setCurrentArticles, setArticles } = useContext(articleContext);
  const { setVehicles } = useContext(vehicleContext);
  const { setInventoryLocations } = useContext(inventoryLocationContext);

  useEffect(() => {
    setCurrentArticles(articles);
    setArticles(articles);
    setInventoryLocations(inventoryLocations);
    setVehicles(vehicleModels);
  }, []);

  return (
    <>
      <Head>
        <title>Överblick</title>
      </Head>
      <Header />
      <main className="flex min-h-full items-center justify-center px-2  sm:px-6 lg:px-8 w-full ">
        <Overview />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  await dbConnect();

  const getArticles = await Article.find({})
    .populate({
      path: "inventoryLocation",
      model: InventoryLocation,
    })
    .populate({
      path: "vehicleModels",
      model: Vehicle,
    })
    .sort({
      lastUpdated: -1,
    });
  const getInventoryLocations = await InventoryLocation.find({});
  const getVehicleModels = await Vehicle.find({});

  return {
    props: {
      articles: JSON.parse(JSON.stringify(getArticles)),
      inventoryLocations: JSON.parse(JSON.stringify(getInventoryLocations)),
      vehicleModels: JSON.parse(JSON.stringify(getVehicleModels)),
    },
  };
};
