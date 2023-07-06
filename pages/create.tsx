import Head from "next/head";
import Header from "@/components/Layout/Header";
import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import { PopulatedArticleDocument } from "@/components/context/ArticleProvider";
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
      <main className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6  lg:px-8">
        <CreateArticle />
      </main>
    </>
  );
}
