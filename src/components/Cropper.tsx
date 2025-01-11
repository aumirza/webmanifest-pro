import Image from "next/image";
import React, { useEffect, useState, useRef, useCallback } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface CropperProps {
  imageUrl: string;
  setCropProps: (cropProps: Crop) => void;
}

export const Cropper: React.FC<CropperProps> = ({ imageUrl, setCropProps }) => {
  const [croppedImage, setCroppedImage] = useState<string | undefined>(
    undefined
  );
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [crop, setCrop] = useState<Crop | undefined>();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageElement = useRef<HTMLImageElement>(null);

  const renderCroppedImage = useCallback(() => {
    if (!crop || !imageElement.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y, width, height } = crop;
    const { x: scaleX, y: scaleY } = scale;

    canvas.width = Math.round(width ?? 0);
    canvas.height = Math.round(height ?? 0);

    ctx.drawImage(
      imageElement.current,
      Math.round((x ?? 0) * scaleX),
      Math.round((y ?? 0) * scaleY),
      Math.round((width ?? 0) * scaleX),
      Math.round((height ?? 0) * scaleY),
      0,
      0,
      Math.round(width ?? 0),
      Math.round(height ?? 0)
    );

    const croppedImage = canvas.toDataURL("image/png");
    setCroppedImage(croppedImage);
  }, [crop, scale]);

  const handleCropChange = (crop: Crop) => {
    setCrop(crop);
  };

  const handleImageLoad = () => {
    if (!imageElement.current) return;

    const { naturalWidth, naturalHeight } = imageElement.current;
    const width = imageElement.current.clientWidth || naturalWidth;
    const height = imageElement.current.clientHeight || naturalHeight;

    console.log({ naturalWidth, naturalHeight, width, height });

    const scaleX = naturalWidth / width;
    const scaleY = naturalHeight / height;
    setScale({ x: scaleX, y: scaleY });

    const size = Math.min(width, height);
    setCrop({ x: 0, y: 0, width: size, height: size, unit: "px" });
  };

  useEffect(() => {
    if (!crop) return;
    const adjustedCrop: Crop = {
      x: Math.round((crop.x ?? 0) * scale.x),
      y: Math.round((crop.y ?? 0) * scale.y),
      width: Math.round((crop.width ?? 0) * scale.x),
      height: Math.round((crop.height ?? 0) * scale.y),
      unit: crop.unit ?? "px", // Ensure unit is provided
    };
    // console.log(adjustedCrop, crop, scale);
    setCropProps(adjustedCrop);
    renderCroppedImage();
  }, [crop, scale, renderCroppedImage, setCropProps]);

  return (
    <div className="flex flex-col-reverse items-center gap-10 p-5 bg-slate-400 shadow-3xl rounded-xl md:flex-row">
      {imageUrl && (
        <ReactCrop
          aspect={1}
          crop={crop}
          onChange={handleCropChange}
          className="max-w-['18rem'] max-h-72"
        >
          <Image
            ref={imageElement}
            onLoad={handleImageLoad}
            alt="Source"
            src={imageUrl}
          />
        </ReactCrop>
      )}

      <canvas className="hidden" ref={canvasRef} />

      {croppedImage && (
        <div className="w-48 h-48 bg-white border rounded-lg">
          <Image
            className="object-cover w-48 h-48"
            alt="Cropped"
            src={croppedImage}
          />
        </div>
      )}
    </div>
  );
};

export default Cropper;
