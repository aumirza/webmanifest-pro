import React from "react";
import { Crop } from "react-image-crop";
import Compress from "compress.js";

import { Uploader } from "@/components/Uploader";
import { DragAndPasteUploader } from "@/components/DragAndPasteUploader";
import { Header } from "@/components/Header";
import { Cropper } from "@/components/Cropper";
import { Footer } from "@/components/Footer";
import { SuccessMessage } from "@/components/SuccessMessage";

const Home = () => {
  const [image, setImage] = React.useState<File | undefined>(undefined);
  const [imageURL, setImageURL] = React.useState<string | undefined>(undefined);

  const [cropProps, setCropProps] = React.useState<Crop | undefined>();
  const [generating, setGenerating] = React.useState(false);
  const [generated, setGenerated] = React.useState(false);

  const uploadHandler = (file: File) => {
    setImage(file);
    const reader = new FileReader();
    reader.onload = () => setImageURL(reader.result as string);
    reader.readAsDataURL(file);
  };

  const saveHandler = async () => {
    if (generating) return;
    if (!image) {
      console.error("No image to save");
      return;
    }

    if (!cropProps) {
      console.error("No crop to save");
      return;
    }

    setGenerating(true);

    if (image.size > 1000000) {
      console.log("Compressing image");
      const compress = new Compress();
      await compress
        .compress([image], {
          size: 0.8, // the max size in MB, defaults to 2MB
          quality: 0.75, // the quality of the image, max is 1,
          maxWidth: 800, // the max width of the output image, defaults to 1920px
          maxHeight: 800, // the max height of the output image, defaults to 1920px
          resize: true, // defaults to true, set false if you do not want to resize the image width and height
        })
        .then((data) => {
          const img = data[0];
          const extension = img.ext.split("/")[1];
          img.alt = `cropped.${extension}`;

          const imageBlob = new Blob([img.data], { type: img.ext });
          const imageFile = new File([imageBlob], img.alt, {
            type: img.ext,
          });
          setImage(imageFile);
        });
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("crop", JSON.stringify(cropProps));

    fetch("/api", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        return new Promise((resolve, reject) => {
          if (res.status === 200) {
            resolve(res.blob());
          } else {
            res.json().then((json) => reject(json));
          }
        });
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob as Blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `generated.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setGenerating(false);
        setGenerated(true);
        setImage(undefined);
        setImageURL(undefined);
      });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-sky-600 dark:bg-gray-700">
      <Header />
      <main>
        <div className="flex flex-col items-center ">
          {generated ? (
            <SuccessMessage />
          ) : imageURL ? (
            <>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Adjust the crop to your liking and then click generate
                </h3>
              </div>
              <Cropper setCropProps={setCropProps} image={imageURL} />
              <button
                disabled={generating}
                onClick={saveHandler}
                className="border-2 border-white hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {generating ? "Generating..." : "Generate"}
              </button>
            </>
          ) : (
            <>
              <div className="text-white flex flex-col items-center">
                <h2 className="text-2xl font-bold">
                  Upload an image to get started
                </h2>
                <p>
                  It will create multiple sizes of the image for your webApp
                </p>
              </div>
              <Uploader uploadHandler={uploadHandler} />
              <DragAndPasteUploader uploadHandler={uploadHandler} />
              <div className="">
                <p>
                  <span className="text-white">Supported formats:</span>{" "}
                  <span className="text-blue-200">
                    <span>jpg</span>, <span>jpeg</span>, <span>png</span>,
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
