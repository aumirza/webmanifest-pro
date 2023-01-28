import { Cropper } from "@/components/Cropper";
import Compress from "compress.js";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Crop } from "react-image-crop";

export const Adjust = () => {
  const [image, setImage] = React.useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [cropProps, setCropProps] = React.useState<Crop | undefined>();
  const [generating, setGenerating] = React.useState(false);

  const router = useRouter();

  const uploadHandler = async () => {
    if (generating) return;
    if (!image) return console.error("No image");
    if (!cropProps) return console.error("No crop props");

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
        setImageURL(null);
        setImage(null);
        localStorage.removeItem("image");
        localStorage.removeItem("imageDataBase64");
        router.push("/download");
      });
  };

  useEffect(() => {
    const imageJson = localStorage.getItem("image");
    if (imageJson) {
      const imageDetails = JSON.parse(imageJson);
      const imageDataBase64 = localStorage.getItem("imageDataBase64");
      if (imageDataBase64) {
        setImageURL(imageDataBase64);
        var base64Parts = imageDataBase64.split(",");
        var fileContent = base64Parts[1];
        var file = new File([fileContent], imageDetails.name, {
          type: imageDetails.type,
        });
        setImage(file);
      }
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="max-w-[95%] text-center">
        <h3 className="text-xl font-bold text-white">
          Adjust the crop to your liking and then click generate
        </h3>
      </div>
      {imageURL && <Cropper setCropProps={setCropProps} imageUrl={imageURL} />}
      <button
        disabled={generating}
        onClick={uploadHandler}
        className="border-2 border-white hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {generating ? "Generating..." : "Generate"}
      </button>
    </div>
  );
};

export default Adjust;
