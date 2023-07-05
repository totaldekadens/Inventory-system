import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body
        style={{
          display: "fixed",
          inset: 0,
          backgroundImage: `url("/bg4.png")`,
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
