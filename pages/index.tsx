import Head from "next/head";
import { useSession } from "next-auth/react";
import Header from "@/components/Layout/Header";
import { GetStaticProps } from "next";
import Article, { ArticleDocument } from "@/models/ArticleModel";
import dbConnect from "@/lib/dbConnect";
import Overview from "@/components/Overview";
import InventoryLocation from "@/models/InventoryLocationModel";

interface Props {
  articles: any[]; // Fix
}

export default function Index({ articles }: Props) {
  const session = useSession();

  return (
    <>
      <Head>
        <title>Överblick</title>
      </Head>
      <Header />
      <main className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 md:mt-20 lg:px-8">
        <Overview articles={articles} />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  await dbConnect();

  const getArticles = await Article.find({}).populate({
    path: "inventoryLocation",
    model: InventoryLocation,
  });

  return {
    props: { articles: JSON.parse(JSON.stringify(getArticles)) },
  };
};
