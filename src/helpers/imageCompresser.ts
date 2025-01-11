import Compress from "compress.js";
import { base64ToFile } from "./converter";

export async function compressImage(image: File) {
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
  return imageFile;
}
