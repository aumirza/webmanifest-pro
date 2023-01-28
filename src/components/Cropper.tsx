import React, { useEffect } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface CropperProps {
  imageUrl: string;
  setCropProps: (cropProp: any) => void;
}

export const Cropper: React.FC<CropperProps> = ({ imageUrl, setCropProps }) => {
  const [croppedImage, setCroppedImage] = React.useState<string | undefined>(
    undefined
  );

  const [scale, setScale] = React.useState({ x: 1, y: 1 });
  const [crop, setCrop] = React.useState<Crop | undefined>();

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const imageElement = React.useRef<HTMLImageElement>(null);

  const getCroppedImg = () => {
    if (!crop || !crop.height || !crop.width) return;

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
    if (!crop || !imageElement.current || !imageUrl) return;
    const croppedImage = getCroppedImg();
    setCroppedImage(croppedImage as string);
  };

  useEffect(() => {
    const currentImageElement = imageElement.current;
    if (!currentImageElement) return;
    const scaleX = currentImageElement.naturalWidth / currentImageElement.width;
    const scaleY =
      currentImageElement.naturalHeight / currentImageElement.height;
    setScale({ x: scaleX, y: scaleY });
    const size = Math.min(
      currentImageElement.width,
      currentImageElement.height
    );
    setCrop({ x: 0, y: 0, width: size, height: size, unit: "px" });
  }, [imageUrl]);

  useEffect(() => {
    if (!crop || !crop.height || !crop.width || !scale.x || !scale.y) return;
    setCropProps({
      x: crop.x * scale.x,
      y: crop.y * scale.y,
      width: crop.width * scale.x,
      height: crop.height * scale.y,
    });
    makeClientCrop(crop);
  }, [crop, scale]);

  return (
    <div className="p-5 flex flex-col-reverse md:flex-row gap-2 my-5 items-center border-2 border-gray-300 rounded-md">
      <ReactCrop
        aspect={1}
        crop={crop}
        onChange={setCrop}
        className="max-w-['18rem'] max-h-72"
      >
        {imageUrl ? (
          <img ref={imageElement} alt="image" src={imageUrl} />
        ) : null}
      </ReactCrop>

      <canvas className="hidden" ref={canvasRef} />

      <div className="h-48 w-48">
        {crop?.width && crop?.height && croppedImage ? (
          <img
            className="h-48 w-48 object-cover"
            alt="cropped"
            src={croppedImage}
          />
        ) : null}
      </div>
    </div>
  );
};
