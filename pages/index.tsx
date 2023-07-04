import Head from "next/head";
import Header from "@/components/Layout/Header";
import { GetServerSideProps } from "next";
import Article, { ArticleDocument } from "@/models/ArticleModel";
import dbConnect from "@/lib/dbConnect";
import Overview from "@/components/Overview";
import InventoryLocation, {
  InventoryLocationDocument,
} from "@/models/InventoryLocationModel";
import { useContext, useEffect } from "react";
import {
  PopulatedArticleDocument,
  articleContext,
} from "@/components/context/ArticleProvider";
import { inventoryLocationContext } from "@/components/context/InventoryLocationProvider";

interface Props {
  articles: PopulatedArticleDocument[];
  inventoryLocations: InventoryLocationDocument[];
}

export default function Index({ articles, inventoryLocations }: Props) {
  const { setCurrentArticles, setArticles } = useContext(articleContext);
  const { setInventoryLocations } = useContext(inventoryLocationContext);

  useEffect(() => {
    setCurrentArticles(articles);
    setArticles(articles);
    setInventoryLocations(inventoryLocations);
  }, []);

  return (
    <>
      <Head>
        <title>Överblick</title>
      </Head>
      <Header />
      <main className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 md:mt-20 lg:px-8">
        <Overview />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  await dbConnect();

  const getArticles = await Article.find({}).populate({
    path: "inventoryLocation",
    model: InventoryLocation,
  });

  const getInventoryLocations = await InventoryLocation.find({});

  return {
    props: {
      articles: JSON.parse(JSON.stringify(getArticles)),
      inventoryLocations: JSON.parse(JSON.stringify(getInventoryLocations)),
    },
  };
};
