import im, { Features } from "imagemagick";
import fs from "fs";
import archiver from "archiver";
import path from "path";
import formidable from "formidable";
import { namedSizes } from "@/constants";

const publicPath = path.join(process.cwd(), "public");
const imagesPath = path.join(publicPath, "images");
const tempPath = path.join(imagesPath, "temp");
const archievesPath = path.join(publicPath, "archieves");

const getFileExtension = (image: any) => {
  const { originalFilename } = image;
  const ext = originalFilename.split(".").pop();
  return ext;
};

const getDimension = async (image: formidable.File): Promise<Features> => {
  const { filepath } = image;

  return new Promise((resolve, reject) => {
    im.identify(filepath, function (err, features) {
      if (err) {
        reject(err);
      }
      const { width, height } = features;
      resolve({ width, height });
    });
  });
};

const resizeImage = async (srcPath: string, dstPath: string, width: number) => {
  await new Promise((resolve, reject) => {
    im.resize(
      {
        srcPath,
        dstPath,
        width,
      },

      function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
    return dstPath;
  });
};

const cropImage = async (
  srcPath: string,
  dstPath: string,
  width: number,
  height: number,
  x: number = 0,
  y: number = 0
) => {
  return new Promise((resolve, reject) => {
    im.convert(
      [
        srcPath,
        "-crop",
        `${width}x${height}+${x}+${y}`,
        // "-quality",
        // "100",
        dstPath,
      ],
      function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

export const getCrop = async (image: formidable.File) => {
  const { width, height } = await getDimension(image);
  const crop = {
    width: (width as number) > (height as number) ? height : width,
    height: (width as number) > (height as number) ? height : width,
    x: 0,
    y: 0,
  };
  return crop;
};

export const cropSquareImage = async (image: formidable.File, crop: any) => {
  const { filepath, newFilename } = image;
  const ext = getFileExtension(image);
  const newPath = path.join(tempPath, `${newFilename}.${ext}`);
  await cropImage(filepath, newPath, crop.width, crop.height, crop.x, crop.y);
  return newPath;
};

interface NamedSize {
  name: string;
  value: number;
}

const generateImageOfSize = async (image: formidable.File, size: NamedSize) => {
  const ext = getFileExtension(image);
  const newPath = path.join(
    imagesPath,
    image.newFilename,
    `${size.name}.${ext}`
  );
  await resizeImage(image.filepath, newPath, size.value);
  return newPath;
};

const generateImagesOfDifferentSizes = async (image: formidable.File) => {
  for await (const size of namedSizes) {
    const newPath = await generateImageOfSize(image, size);
  }

  return;
};

const makeZipFile = async (dirName: string) => {
  const archieve = archiver("zip", {
    zlib: { level: 9 },
  });

  const ZipPath = path.join(archievesPath, `${dirName}.zip`);

  const output = fs.createWriteStream(ZipPath);
  archieve.pipe(output);
  archieve.directory(path.join(imagesPath, dirName), false);
  await archieve.finalize();

  return ZipPath;
};

export const makeFolders = (dirName: string) => {
  if (!fs.existsSync(imagesPath)) fs.mkdirSync(imagesPath);
  if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath);
  if (!fs.existsSync(archievesPath)) fs.mkdirSync(archievesPath);

  fs.mkdirSync(path.join(imagesPath, dirName));
};

export const preCheck = (image: any) => {
  // check if image is png or jpeg
  if (image.mimetype !== "image/png" && image.mimetype !== "image/jpeg") {
    throw new Error("File type not supported");
  }

  const oneMegaByte = 1024 * 1024;

  // check if image is too large
  if (image.size > oneMegaByte) {
    throw new Error("File too large");
  }
};

export const generateImages = async (image: formidable.File) => {
  // generate different sizes of images using imageMagick
  const paths = await generateImagesOfDifferentSizes(image);

  // make zip file
  const zipFilePath = await makeZipFile(image.newFilename);

  return zipFilePath;
};

export const cleanUp = (image: formidable.File) => {
  const ext = getFileExtension(image);
  const tempImagePath = path.join(tempPath, `${image.newFilename}.${ext}`);
  if (fs.existsSync(tempImagePath)) fs.unlinkSync(tempImagePath);

  const tempDirPath = path.join(imagesPath, image.newFilename);
  fs.rmdirSync(tempDirPath, { recursive: true });
};
