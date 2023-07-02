import Head from "next/head";
import { useSession } from "next-auth/react";
import Header from "@/components/Layout/Header";

export default function Index() {
  const session = useSession();

  return (
    <>
      <Head>
        <title>Överblick</title>
      </Head>
      <Header />
      <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 md:mt-20 lg:px-8">
        DU ÄR INLOGGAD!!!
      </div>
    </>
  );
}
