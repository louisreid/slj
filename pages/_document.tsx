import { Html, Head, Main, NextScript } from "next/document";

/**
 * Minimal _document for App Router projects.
 * Next.js 15's pages-manifest references this file; providing it prevents
 * ENOENT errors when navigating to certain routes (e.g. /auth/sign-in).
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
