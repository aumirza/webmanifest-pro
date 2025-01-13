import { scan } from "react-scan"; // import this BEFORE react
import React from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AppProps } from "next/app";
import "../styles/globals.tailwind.css";
import Head from "next/head";

if (typeof window !== "undefined") {
  scan({
    enabled: process.env.NODE_ENV === "development", // enable in development (default: false)
    log: false, // logs render info to console (default: false)
  });
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Webmanifest Pro</title>
        <meta property="og:title" content="Webmanifest Pro" />
        <meta name="twitter:title" content="Webmanifest Pro" />
      </Head>
      <div className="flex flex-col justify-between min-h-screen overflow-hidden text-gray-700 max-w-screen dark:bg-gray-600 dark:text-white">
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default MyApp;
