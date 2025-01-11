import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AppProps } from "next/app";
import "../styles/globals.tailwind.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col justify-between min-h-screen overflow-hidden text-gray-700 max-w-screen dark:bg-gray-600 dark:text-white">
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}

export default MyApp;
