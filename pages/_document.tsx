import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body
        className="bg-bg-mobile sm:bg-bg-desktop"
        style={{
          display: "fixed",
          inset: 0,
          minHeight: "100vh",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
