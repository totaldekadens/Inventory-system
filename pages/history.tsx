import Head from "next/head";
import Header from "@/components/Layout/Header";
import { GetServerSideProps } from "next";
import dbConnect from "@/lib/dbConnect";
import TransactionHistory, {
  TransactionHistoryDocument,
} from "@/models/TransactionHistoryModel";
import TableHistory from "@/components/TableHistory";
import { useState } from "react";
import SearchBar from "@/components/searchbars/SearchBarTransactionHistory";

interface Props {
  history: TransactionHistoryDocument[];
}

export default function Index({ history }: Props) {
  const [currentArticle, setCurrentArtice] =
    useState<TransactionHistoryDocument[]>(history);
  return (
    <>
      <Head>
        <title>Transaktionshistorik</title>
      </Head>
      <Header />
      <main className="flex min-h-full items-center justify-center px-2  sm:px-6 lg:px-8 w-full ">
        <div className="px-2 sm:px-6 lg:px-8 mt-10 md:mt-10 sm:mt-8 w-full pb-20 max-w-8xl">
          <div className="flow-root">
            <div className="w-full text-3xl mb-14 ">Transaktionshistorik</div>
            {/* Searchbars and filter */}
            <SearchBar
              setFilteredObjectList={setCurrentArtice}
              listOfObjects={currentArticle}
              history={history}
            />
            <TableHistory history={currentArticle} />
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  await dbConnect();

  const getTransactionHistory: TransactionHistoryDocument[] | null =
    await TransactionHistory.find({});
  // Sort keys from Ö - A
  const descendingHistory = getTransactionHistory.sort((a, b) =>
    a.createdDate < b.createdDate ? 1 : -1
  );

  return {
    props: {
      history: JSON.parse(JSON.stringify(descendingHistory)),
    },
  };
};
