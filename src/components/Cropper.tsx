import React, { useEffect } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface CropperProps {
  image: string | undefined;
  setCropProps: (cropProp: any) => void;
}

export const Cropper: React.FC<CropperProps> = ({ image, setCropProps }) => {
  const [croppedImage, setCroppedImage] = React.useState<string | undefined>(
    undefined
  );

  const [scale, setScale] = React.useState({ x: 1, y: 1 });
  const [crop, setCrop] = React.useState<Crop | undefined>();

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const imageElement = React.useRef<HTMLImageElement>(null);

  const getCroppedImg = (image: string, crop: Crop) => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.width = crop.width as number;
    canvas.height = crop.height as number;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const currentImageElement = imageElement.current;
    if (!currentImageElement) return;

    ctx.drawImage(
      currentImageElement,
      crop.x * scale.x,
      crop.y * scale.y,
      crop.width * scale.x,
      crop.height * scale.y,
      0,
      0,
      crop.width,
      crop.height
    );

    return ctx?.canvas.toDataURL("image/jpeg");
  };

  const makeClientCrop = (crop: Crop | undefined) => {
    if (image && crop?.width && crop.height) {
      const croppedImage = getCroppedImg(image, crop);
      setCroppedImage(croppedImage as string);
    }
  };

  useEffect(() => {
    if (!image) return;
    if (!imageElement.current) return;
    const currentImageElement = imageElement.current;
    const scaleX = currentImageElement.naturalWidth / currentImageElement.width;
    const scaleY =
      currentImageElement.naturalHeight / currentImageElement.height;
    setScale({ x: scaleX, y: scaleY });
    const size = Math.min(
      currentImageElement.width,
      currentImageElement.height
    );

    setCrop({
      x: 0,
      y: 0,
      width: size,
      height: size,
      unit: "px",
    });
  }, [image]);

  React.useEffect(() => {
    if (!crop) return;
    setCropProps({
      x: crop.x * scale.x,
      y: crop.y * scale.y,
      width: crop.width * scale.x,
      height: crop.height * scale.y,
    });
    makeClientCrop(crop);
  }, [crop]);

  return (
    <div className="p-5 flex gap-2 my-5 items-center border-2 border-gray-300 rounded-md">
      <ReactCrop
        aspect={1}
        crop={crop}
        onChange={(newCrop) => setCrop(newCrop)}
        className="max-w-['18rem'] max-h-72"
      >
        <img ref={imageElement} className="" src={image} />
      </ReactCrop>

      <canvas className="hidden" ref={canvasRef} />

      <div className="h-48 w-48">
        {crop?.width && crop?.height ? (
          <img className="h-48 w-48 object-cover" src={croppedImage} />
        ) : null}
      </div>
    </div>
  );
};
