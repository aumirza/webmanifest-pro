import React from "react";
import { Uploader } from "@/components/Uploader";
import { DragAndPasteUploader } from "@/components/DragAndPasteUploader";
import { useRouter } from "next/router";
import { SupportedFormats } from "@/components/SupportedFormats";
import { Compatiblity } from "@/components/Compatiblity";
import Image from "next/image";
import webmanifestHeroImage from "@/assets/images/webmanifest-hero.gif";
import webmanifestLogo from "@/assets/images/webmanifest-pro-logo.png";

const Home = () => {
  const router = useRouter();

  const fileChooseHandler = (file: File) => {
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 py-10">
          <div className="flex flex-col items-center md:items-start">
            <Image
              height={250}
              src={webmanifestLogo}
              alt="logo"
              className="size-52 md:size-60"
            />
            <h2 className="font-extrabold text-4xl md:text-7xl text-center md:text-start">
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
          <div className="flex flex-col items-center md:items-start gap-5">
            <Uploader uploadHandler={fileChooseHandler} />
            <SupportedFormats />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 w-full py-10">
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
