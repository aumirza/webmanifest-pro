import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="author" content="Ahmadullah mirza" />

        <link rel="manifest" href="/manifest.json" />

        <meta
          name="description"
          content="Generate Icons and Manifests with Ease"
        />
        <meta
          property="og:description"
          content="Generate Icons and Manifests with Ease"
        />
        <meta
          name="twitter:description"
          content="Generate Icons and Manifests with Ease"
        />
        {/* <meta property="og:url" content="https://www.yourwebsite.com/" /> */}

        {/* <meta property="og:image" content="/images/og-image.png" /> */}
        {/*   <meta name="twitter:card" content="summary_large_image" />*/}
        <meta name="twitter:image" content="/webmanifest_pro_logo.png" />

        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="android_chrome_192X192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="android_chrome_512X512.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="180x180"
          href="apple_touch_icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="favicon_16X16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="favicon_32X32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="favicon_96X96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="150x150"
          href="mstile_150X150.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="safari_pinned_tab.png"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
