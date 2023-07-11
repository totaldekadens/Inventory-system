import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import ArticlesProvider from "@/components/context/ArticleProvider";
import InventoryLocationProvider from "@/components/context/InventoryLocationProvider";
import VehicleProvider from "@/components/context/VehicleProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ThreeDots } from "react-loader-spinner";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url: any) => url !== router.asPath && setLoading(true);
    const handleComplete = (url: any) =>
      url === router.asPath && setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });
  return (
    <>
      <SessionProvider session={session}>
        <VehicleProvider>
          <InventoryLocationProvider>
            <ArticlesProvider>
              <Component {...pageProps} />
            </ArticlesProvider>
          </InventoryLocationProvider>
        </VehicleProvider>
      </SessionProvider>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#4fa94d"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            visible={true}
          />
        </div>
      )}
    </>
  );
}
