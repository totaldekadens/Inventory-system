import Head from "next/head";
import Header from "@/components/Layout/Header";
import { GetServerSideProps } from "next";
import Article from "@/models/ArticleModel";
import dbConnect from "@/lib/dbConnect";
import TransactionHistory, {
  TransactionHistoryDocument,
} from "@/models/TransactionHistoryModel";
import TableHistory from "@/components/TableHistory";
import Filter from "@/components/Filter";

interface Props {
  history: TransactionHistoryDocument[];
}

export default function Index({ history }: Props) {
  return (
    <>
      <Head>
        <title>Transaktionshistorik</title>
      </Head>
      <Header />
      <main className="flex min-h-full items-center justify-center px-2  sm:px-6 lg:px-8 w-full ">
        <div className="px-4 sm:px-6 lg:px-8 mt-10 md:mt-10 sm:mt-8 w-full pb-20 max-w-8xl">
          <div className="flow-root">
            <div className="w-full text-3xl mb-7 ">Transaktionshistorik</div>
            {/* Searchbars and filter */}
            {/*  <Filter /> */}
            <TableHistory history={history} />
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  await dbConnect();

  const getTransactionHistory: TransactionHistoryDocument[] | null =
    await TransactionHistory.find({}).populate({
      path: "article",
      model: Article,
    });
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
