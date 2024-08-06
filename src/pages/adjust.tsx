import { Cropper } from "@/components/Cropper";
import { base64ToFile } from "@/helpers/converter";
import Compress from "compress.js";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Crop } from "react-image-crop";

const Adjust = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [cropProps, setCropProps] = useState<Crop | undefined>();
  const [generating, setGenerating] = useState(false);

  const router = useRouter();

  const uploadHandler = async () => {
    if (generating) return;
    if (!image) return console.error("No image available.");
    if (!cropProps) return console.error("No crop properties.");

    setGenerating(true);

    try {
      // Compress image if needed
      if (image.size > 1000000) {
        const compress = new Compress();
        const compressedFiles = await compress.compress([image], {
          size: 0.8, // Max size in MB
          quality: 0.75, // Quality of the image
          maxWidth: 800, // Max width of the output image
          maxHeight: 800, // Max height of the output image
          resize: true, // Resize image
        });

        const compressedImage = compressedFiles[0];
        const { data, ext } = compressedImage;
        const fileName = `cropped.${ext}`;
        const imageFile = base64ToFile(data, fileName, ext);
        setImage(imageFile);
      }

      // Prepare form data for upload
      const formData = new FormData();
      formData.append("image", image);
      formData.append("crop", JSON.stringify(cropProps));

      const response = await fetch("/api", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blobData = await response.blob();
        const url = window.URL.createObjectURL(blobData);
        localStorage.setItem("zip-url", url);
        router.push("/download");
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData);
      }
    } catch (error) {
      console.error("Error during upload:", error);
    } finally {
      setGenerating(false);
      setImageURL(null);
      setImage(null);
      localStorage.removeItem("image");
      localStorage.removeItem("imageDataBase64");
    }
  };

  useEffect(() => {
    const imageJson = localStorage.getItem("image");
    if (imageJson) {
      const imageDetails = JSON.parse(imageJson);
      const imageDataBase64 = localStorage.getItem("imageDataBase64");
      if (imageDataBase64) {
        setImageURL(imageDataBase64);
        const file = base64ToFile(
          imageDataBase64,
          imageDetails.name,
          imageDetails.type
        );
        setImage(file);
      }
    } else {
      router.push("/");
    }
  }, [router]);

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
