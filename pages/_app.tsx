import type { AppProps } from "next/app";

/**
 * Minimal _app for App Router projects.
 * Next.js 15's pages-manifest references this file; providing it prevents
 * ENOENT errors when navigating to certain routes.
 */
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
