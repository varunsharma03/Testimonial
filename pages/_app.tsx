import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Toaster component for displaying notifications */}
      <Toaster position="top-right" />
      {/* Render the page component */}
      <Component {...pageProps} />
    </>
  );
}
