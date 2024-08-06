import { Guide } from "@/components/Guide";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const download = () => {
  const [url, setUrl] = useState<string | null>(null);
  const downloadButton = React.useRef<HTMLAnchorElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!url) return;
    downloadButton.current?.click();
    localStorage.removeItem("zip-url");
  }, [url]);

  useEffect(() => {
    const ZipUrl = localStorage.getItem("zip-url");
    if (!ZipUrl) {
      router.push("/");
      return;
    }
    setUrl(ZipUrl);
  }, []);

  return (
    <div className="my-10 flex flex-col justify-center">
      <div className="flex justify-center">
        <p className="mb-5">
          The zip will be automatically downloaded to your computer within a few
          seconds. if it doesn't, click the button.
        </p>
        {url ? (
          <a
            className="underline mx-0.5"
            ref={downloadButton}
            download="generated.zip"
            href={url}
          >
            download
          </a>
        ) : null}
      </div>
      <Guide />
    </div>
  );
};

export default download;
