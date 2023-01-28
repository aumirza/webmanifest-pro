import { AppProps } from "next/app";
import "../styles/globals.tailwind.css";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
