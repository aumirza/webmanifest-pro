import { CropAndPreview } from "@/components/CropAndPreview";
import { Button } from "@/components/ui/Button";
import { base64ToFile } from "@/helpers/converter";
import { compressImage } from "@/helpers/imageCompresser";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Crop } from "react-image-crop";

const Adjust = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const cropProps = useRef<Crop | undefined>();
  const setCropProps = (crop: Crop) => {
    cropProps.current = crop;
  };

  const router = useRouter();

  const uploadHandler = async () => {
    if (generating) return;

    if (!image) return console.error("No image available.");
    if (!cropProps.current) return console.error("No crop properties.");

    setGenerating(true);

    let compressedImage;

    try {
      // Compress image if needed
      if (image.size > 1000000) {
        compressedImage = await compressImage(image);
      }
      // Prepare form data for upload
      const formData = new FormData();
      formData.append("image", compressedImage ?? image);
      formData.append("crop", JSON.stringify(cropProps.current));

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
      localStorage.removeItem("imageDetails");
      localStorage.removeItem("imageDataBase64");
    }
  };

  useEffect(() => {
    if (!localStorage) return;
    const imageJson = localStorage.getItem("imageDetails");
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
    <div className="flex flex-col items-center justify-center gap-5 py-10">
      <h3 className="text-xl font-bold">
        Adjust the crop to your liking and then click generate
      </h3>

      {imageURL && (
        <CropAndPreview setCropProps={setCropProps} imageUrl={imageURL} />
      )}
      <Button
        className="px-6 py-2"
        disabled={generating}
        onClick={uploadHandler}
      >
        {generating ? "Generating..." : "Generate"}
      </Button>
    </div>
  );
};

export default Adjust;
