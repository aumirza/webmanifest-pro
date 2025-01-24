import { debounce } from "@/utils/debounce";
import React, { FC, useState, useEffect } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface CropperProps {
  setScale: (scale: { x: number; y: number }) => void;
  setCrop: (crop: Crop) => void;
  imageUrl: string;
  imageRef: React.RefObject<HTMLImageElement>;
}

export const Cropper: FC<CropperProps> = ({
  setScale,
  imageUrl,
  setCrop,
  imageRef,
}) => {
  const [tempCrop, setTempCrop] = useState<Crop | undefined>();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!tempCrop) return;

    const moveAmount = e.shiftKey ? 10 : 1;
    let newCrop = { ...tempCrop };

    switch (e.key) {
      case "ArrowUp":
        newCrop.y = Math.max(0, tempCrop.y - moveAmount);
        break;
      case "ArrowDown":
        newCrop.y = tempCrop.y + moveAmount;
        break;
      case "ArrowLeft":
        newCrop.x = Math.max(0, tempCrop.x - moveAmount);
        break;
      case "ArrowRight":
        newCrop.x = tempCrop.x + moveAmount;
        break;
      case "+":
      case "=":
        newCrop.width = tempCrop.width + moveAmount;
        newCrop.height = tempCrop.height + moveAmount;
        break;
      case "-":
      case "_":
        newCrop.width = Math.max(10, tempCrop.width - moveAmount);
        newCrop.height = Math.max(10, tempCrop.height - moveAmount);
        break;
      default:
        return;
    }

    setTempCrop(newCrop);
    setCrop(newCrop);
  };

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener("keydown", handleKeyDown, {
      signal: controller.signal,
    });
    return () => controller.abort();
  }, [tempCrop]);

  const handleImageLoad = () => {
    if (!imageRef.current) return;

    const { naturalWidth, naturalHeight } = imageRef.current;
    const width = imageRef.current.clientWidth || naturalWidth;
    const height = imageRef.current.clientHeight || naturalHeight;

    const scaleX = naturalWidth / width;
    const scaleY = naturalHeight / height;
    setScale({ x: scaleX, y: scaleY });

    const size = Math.min(width, height);
    const cropValue: Crop = {
      x: 0,
      y: 0,
      width: size,
      height: size,
      unit: "px",
    };
    setTempCrop(cropValue);
    setCrop(cropValue);
  };

  const handleCropChange = debounce((tempCrop: Crop) => {
    setTempCrop(tempCrop);
    debounce(() => setCrop(tempCrop), 100)(); // total 200
  }, 100);

  return (
    <ReactCrop
      aspect={1}
      crop={tempCrop}
      onChange={handleCropChange}
      className="max-w-['18rem'] max-h-72"
    >
      {/*  eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        onLoad={handleImageLoad}
        alt="Source"
        src={imageUrl}
      />
    </ReactCrop>
  );
};
