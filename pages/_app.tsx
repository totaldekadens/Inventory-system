import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import ArticlesProvider from "@/components/context/ArticleProvider";
import InventoryLocationProvider from "@/components/context/InventoryLocationProvider";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <InventoryLocationProvider>
        <ArticlesProvider>
          <Component {...pageProps} />
        </ArticlesProvider>
      </InventoryLocationProvider>
    </SessionProvider>
  );
}
