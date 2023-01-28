import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AppProps } from "next/app";
import "../styles/globals.tailwind.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen max-w-screen overflow-hidden  flex flex-col justify-between text-white bg-sky-600 dark:bg-gray-700">
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}

export default MyApp;
