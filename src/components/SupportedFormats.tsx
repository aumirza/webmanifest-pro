import React from "react";
import { allowedMimeTypes } from "@/constants";
import Link from "next/link";

export const SupportedFormats = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex">
        <span className="">Supported formats: &nbsp;</span>
        <div className="flex gap-1">
          {allowedMimeTypes.map((mimeType) => (
            <kbd
              key={mimeType}
              className="border p-0.5 px-1 bg-white dark:bg-slate-600 rounded"
            >
              {mimeType.split("/")[1]}
            </kbd>
          ))}
        </div>
      </div>
      <div className="text-[0.7rem]">
        <ul>
          <li>
            By uploading an image or URL you agree to our&nbsp;
            <Link className="underline" href="/tos">
              Terms of Service.
            </Link>
          </li>
          <li>
            To learn more about how we handle your personal data, check
            our&nbsp;
            <Link className="underline" href="/privacy">
              Privacy Policy.
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
