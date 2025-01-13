import Image from "next/image";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Crop } from "react-image-crop";
import { Cropper } from "./Cropper";

interface CropperProps {
  imageUrl: string;
  setCropProps: (cropProps: Crop) => void;
}

export const CropAndPreview: React.FC<CropperProps> = ({
  imageUrl,
  setCropProps,
}) => {
  const [croppedImage, setCroppedImage] = useState<string | undefined>(
    undefined
  );
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [crop, setCrop] = useState<Crop | undefined>();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageElementRef = useRef<HTMLImageElement>(null);

  const renderCroppedImage = useCallback(() => {
    if (!crop || !imageElementRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y, width, height } = crop;
    const { x: scaleX, y: scaleY } = scale;

    canvas.width = Math.round(width ?? 0);
    canvas.height = Math.round(height ?? 0);

    ctx.drawImage(
      imageElementRef.current,
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

  useEffect(() => {
    if (!crop) return;
    const adjustedCrop: Crop = {
      x: Math.round((crop.x ?? 0) * scale.x),
      y: Math.round((crop.y ?? 0) * scale.y),
      width: Math.round((crop.width ?? 0) * scale.x),
      height: Math.round((crop.height ?? 0) * scale.y),
      unit: crop.unit ?? "px", // Ensure unit is provided
    };
    setCropProps(adjustedCrop);
    renderCroppedImage();
  }, [crop, scale, renderCroppedImage, setCropProps]);

  return (
    <div className="flex flex-col-reverse items-center gap-10 p-5 bg-slate-400 shadow-3xl rounded-xl md:flex-row">
      <Cropper
        imageUrl={imageUrl}
        setCrop={setCrop}
        setScale={setScale}
        imageRef={imageElementRef}
      />

      <canvas className="hidden" ref={canvasRef} />

      <div className="w-48 h-48 overflow-hidden bg-white rounded-lg">
        {croppedImage && (
          <Image
            className="object-cover w-48 h-48"
            height={192}
            width={192}
            alt="Cropped"
            src={croppedImage}
          />
        )}
      </div>
    </div>
  );
};
