import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import ArticlesProvider from "@/components/context/ArticleProvider";
import InventoryLocationProvider from "@/components/context/InventoryLocationProvider";
import VehicleProvider from "@/components/context/VehicleProvider";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <VehicleProvider>
        <InventoryLocationProvider>
          <ArticlesProvider>
            <Component {...pageProps} />
          </ArticlesProvider>
        </InventoryLocationProvider>
      </VehicleProvider>
    </SessionProvider>
  );
}
