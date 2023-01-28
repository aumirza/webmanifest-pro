import React from "react";
import { Uploader } from "@/components/Uploader";
import { DragAndPasteUploader } from "@/components/DragAndPasteUploader";
import { useRouter } from "next/router";

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
    const image = {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
    };
    localStorage.setItem("image", JSON.stringify(image));

    // redirect to the adjust page
    router.push("/adjust");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-white flex flex-col items-center text-center max-w-[90%]">
        <h2 className="text-2xl font-bold">Upload an image to get started</h2>
        <p>It will create multiple sizes of the image for your webApp</p>
      </div>
      <Uploader uploadHandler={fileChooseHandler} />
      <DragAndPasteUploader uploadHandler={fileChooseHandler} />
      <div className="">
        <p>
          <span className="text-white">Supported formats:</span>
          <span className="text-blue-200">
            <span>jpg</span>, <span>jpeg</span>, <span>png</span>,
          </span>
        </p>
      </div>
    </div>
  );
};

export default Home;
