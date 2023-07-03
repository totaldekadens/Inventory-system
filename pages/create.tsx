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
import CreateArticle from "@/components/CreateArticle";

interface Props {
  articles: PopulatedArticleDocument[];
  inventoryLocations: InventoryLocationDocument[];
}

export default function Index({ articles, inventoryLocations }: Props) {
  return (
    <>
      <Head>
        <title>Skapa artikel</title>
      </Head>
      <Header />
      <main className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 mt-20 md:mt-20 lg:px-8">
        <CreateArticle />
      </main>
    </>
  );
}
