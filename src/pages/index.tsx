import React from "react";
import { Uploader } from "@/components/Uploader";
import { DragAndPasteUploader } from "@/components/DragAndPasteUploader";
import { useRouter } from "next/router";
import { SupportedFormats } from "@/components/SupportedFormats";
import { Compatiblity } from "@/components/Compatiblity";
import Image from "next/image";
import webmanifestHeroImage from "@/assets/images/webmanifest-hero.gif";
import webmanifestLogo from "@/assets/images/webmanifest-pro-logo.png";
import { allowedMimeTypes, maxFileSizeInMB } from "@/constants";
import { useToast } from "@/hooks/useToast";

const Home = () => {
  const router = useRouter();
  const toast = useToast();

  const fileChooseHandler = (file: File) => {
    if (!allowedMimeTypes.includes(file.type)) {
      toast.addToast("File type not supported", "error");
      return;
    }
    if (file.size > maxFileSizeInMB * 1024 * 1024) {
      toast.addToast(
        `File size should be less than ${maxFileSizeInMB}MB`,
        "error"
      );
      return;
    }
    // save the file in the local storage
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        localStorage.setItem("imageDataBase64", reader.result);
      }
    };
    reader.readAsDataURL(file);
    const imageDetails = {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
    };
    localStorage.setItem("imageDetails", JSON.stringify(imageDetails));

    // redirect to the adjust page
    router.push("/adjust");
  };

  return (
    <div className="flex flex-col items-center font-medium ">
      <div className="gap-5 items-center flex flex-col max-w-[90%] md:max-w-4xl">
        <div className="flex flex-col items-center justify-between gap-5 py-10 md:flex-row">
          <div className="flex flex-col items-center md:items-start">
            <Image
              height={250}
              src={webmanifestLogo}
              alt="logo"
              className="size-52 md:size-60"
            />
            <h2 className="text-4xl font-extrabold text-center md:text-7xl md:text-start">
              Generate your icons
            </h2>
            <p className="mt-5 text-lg">
              Generate Icons and Manifests with Ease
            </p>
            <p className="text-lg font-bold ">
              Its fully&nbsp;
              <span className="border-b-2 border-[#33b8ff]">free.</span>
            </p>
          </div>
          <div className="flex flex-col items-center gap-5 md:items-start">
            <Uploader uploadHandler={fileChooseHandler} />
            <SupportedFormats />
          </div>
        </div>
        <div className="flex flex-col items-center justify-between w-full gap-10 py-10 md:flex-row">
          <Compatiblity />
          <Image
            height={300}
            src={webmanifestHeroImage}
            alt="logo"
            className=""
          />
        </div>
      </div>

      <DragAndPasteUploader uploadHandler={fileChooseHandler} />
    </div>
  );
};

export default Home;
