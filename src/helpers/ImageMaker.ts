import fs from "fs";
import archiver from "archiver";
import path from "path";
import formidable from "formidable";
import sharp from "sharp";
import { namedSizes } from "@/constants";

const publicPath = path.join(process.cwd(), "public");
const imagesPath = path.join(publicPath, "images");
const tempPath = path.join(imagesPath, "temp");
const archivesPath = path.join(publicPath, "archives");

const getFileExtension = (file: any) => {
  const { originalFilename } = file;
  return originalFilename.split(".").pop();
};

const getImageDimensions = async (file: formidable.File) => {
  const { filepath } = file;
  const { width, height } = await sharp(filepath).metadata();
  return { width, height };
};

const resizeImage = async (srcPath: string, dstPath: string, size: number) => {
  //console.log("Resizing image:", srcPath, dstPath, size);
  const resizedImage = await sharp(srcPath).resize(size, size).toFile(dstPath);
  //console.log("Resized image:", resizedImage);
  return resizedImage;
};

const cropImage = async (
  srcPath: string,
  dstPath: string,
  width: number,
  height: number,
  x: number = 0,
  y: number = 0
) => {
  //console.log("Cropping image:", srcPath, dstPath, width, height, x, y);
  const croppedImage = await sharp(srcPath)
    .extract({ width, height, left: x, top: y })
    .toFile(dstPath);
  return croppedImage;
};

export const getSquareCropDimensions = async (file: formidable.File) => {
  const { width, height } = await getImageDimensions(file);
  const cropSize = Math.min(width as number, height as number);
  return {
    width: cropSize,
    height: cropSize,
    x: 0,
    y: 0,
  };
};

export const cropToSquare = async (
  file: formidable.File,
  cropDimensions: any
) => {
  const { filepath, newFilename } = file;
  const ext = getFileExtension(file);
  const outputPath = path.join(tempPath, `${newFilename}.${ext}`);
  //console.log("Cropping image to square:", outputPath);
  await cropImage(
    filepath,
    outputPath,
    cropDimensions.width,
    cropDimensions.height,
    cropDimensions.x,
    cropDimensions.y
  );
  //console.log("Image cropped to square");
  return outputPath;
};

interface Size {
  name: string;
  value: number;
}

const createImageOfSize = async (file: formidable.File, size: Size) => {
  //console.log("Creating image of size:", size);
  const ext = getFileExtension(file);
  const outputPath = path.join(
    imagesPath,
    file.newFilename,
    `${size.name}.${ext}`
  );
  await resizeImage(file.filepath, outputPath, size.value);
  return outputPath;
};

const createAllSizedImages = async (file: formidable.File) => {
  for (const size of namedSizes) {
    await createImageOfSize(file, size);
  }
  return;
};

const createZipArchive = async (dirName: string) => {
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  const zipPath = path.join(archivesPath, `${dirName}.zip`);
  const output = fs.createWriteStream(zipPath);

  return new Promise<string>((resolve, reject) => {
    output.on("close", () => {
      //console.log(`ZIP file created: ${archive.pointer()} total bytes`);
      resolve(zipPath);
    });

    output.on("error", (err) => {
      //console.error("Stream error:", err);
      reject(err);
    });

    archive.on("error", (err) => {
      //console.error("Archiver error:", err);
      reject(err);
    });

    archive.pipe(output);
    archive.directory(path.join(imagesPath, dirName), false);
    archive.finalize();
  });
};

export const ensureDirectoriesExist = (dirName: string) => {
  if (!fs.existsSync(imagesPath)) fs.mkdirSync(imagesPath);
  if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath);
  if (!fs.existsSync(archivesPath)) fs.mkdirSync(archivesPath);

  fs.mkdirSync(path.join(imagesPath, dirName));
};

export const validateImage = (file: formidable.File) => {
  // Default options
  const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];

  const maxSizeMB = 1;
  const maxFileSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes

  // Check file type
  if (
    allowedMimeTypes &&
    file.mimetype &&
    !allowedMimeTypes.includes(file.mimetype)
  ) {
    throw new Error("Unsupported file type");
  }

  // Check file size
  if (file.size > maxFileSize) {
    throw new Error(`File size exceeds ${maxSizeMB} MB limit`);
  }
};

export const generateImagesAndArchive = async (file: formidable.File) => {
  //console.log("Generating images in different sizes");
  await createAllSizedImages(file);
  const zipFilePath = await createZipArchive(file.newFilename);
  return zipFilePath;
};

export const cleanupFiles = (file: formidable.File) => {
  const ext = getFileExtension(file);
  const tempImagePath = path.join(tempPath, `${file.newFilename}.${ext}`);
  if (fs.existsSync(tempImagePath)) fs.unlinkSync(tempImagePath);

  const tempDirPath = path.join(imagesPath, file.newFilename);
  fs.rmdirSync(tempDirPath, { recursive: true });
};
