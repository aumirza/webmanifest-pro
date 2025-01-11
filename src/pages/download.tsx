import { Guide } from "@/components/Guide";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Download = () => {
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
    <div className="flex flex-col items-center justify-center gap-10 my-10 max-w-7xl">
      <div className="flex justify-center">
        <p className="">
          The zip will be automatically downloaded to your computer within a few
          seconds. if it doesn't, click the button.
        </p>
        {url ? (
          <a
            className="underline mx-0.5"
            ref={downloadButton}
            download="webmanifest-generated.zip"
            href={url}
          >
            download
          </a>
        ) : null}
      </div>
      <Guide />
      <Button onClick={() => window.location.reload()}>
        Generate another image
      </Button>
    </div>
  );
};

export default Download;
