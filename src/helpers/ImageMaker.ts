import im from "imagemagick";
import fs from "fs";
import archiver from "archiver";
import path from "path";

const publicPath = path.join(process.cwd(), "public");
const imagesPath = path.join(publicPath, "images");
const tempPath = path.join(imagesPath, "temp");
const archievesPath = path.join(publicPath, "archieves");

const getImageDimension = async (image: any) => {
  const features: Promise<im.Features> = new Promise((resolve, reject) => {
    im.identify(image.filepath, (err, features) => {
      if (err) throw err;
      resolve(features);
    });
  });

  let { width, height } = (await features) as any;

  return { width, height };
};

const getSquareDimension = async (image: any) => {
  const { width, height } = await getImageDimension(image);
  const size = width > height ? height : width;
  const x = width > height ? (width - height) / 2 : 0;
  const y = width > height ? 0 : (height - width) / 2;
  return { width: size, height: size, x, y };
};

const getFileExtension = (image: any) => {
  const { originalFilename } = image;
  const ext = originalFilename.split(".").pop();
  return ext;
};

const cropImage = async (
  srcPath: string,
  dstPath: string,
  width: number,
  height: number
) => {
  await new Promise((resolve, reject) => {
    im.crop(
      {
        srcPath,
        dstPath,
        width,
        height,
        quality: 1,
        customArgs: ["-gravity", "center"],
      },
      function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
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

const cropSquareImage = async (image: any, fileName: string) => {
  const { width, height } = await getSquareDimension(image);
  const { filepath } = image;
  const ext = getFileExtension(image);
  const newPath = path.join(tempPath, `${fileName}.${ext}`);
  await cropImage(filepath, newPath, width, height);
  return newPath;
};

const generateImageOfSize = async (image: any, size: any, dirName: string) => {
  const ext = getFileExtension(image);
  const newPath = path.join(imagesPath, dirName, `${size.name}.${ext}`);
  await resizeImage(image.filepath, newPath, size.value);
  return newPath;
};

const generateImagesOfDifferentSizes = async (image: any, dirName: string) => {
  const namedSizes = [
    { name: "android_chrome_192X192", value: 192 },
    { name: "android_chrome_512X512", value: 512 },
    { name: "apple_touch_icon", value: 180 },
    { name: "favicon_16X16", value: 16 },
    { name: "favicon_32X32", value: 32 },
    { name: "favicon_96X96", value: 96 },
    { name: "mstile_150X150", value: 150 },
    { name: "safari_pinned_tab", value: 512 },
  ];

  for await (const size of namedSizes) {
    const newPath = await generateImageOfSize(image, size, dirName);
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

const makeFolders = (dirName: string) => {
  if (!fs.existsSync(imagesPath)) fs.mkdirSync(imagesPath);
  if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath);
  if (!fs.existsSync(archievesPath)) fs.mkdirSync(archievesPath);

  fs.mkdirSync(path.join(imagesPath, dirName));
};

export const generateImages = async (image: any, dirName: string) => {
  // check if image is png or jpeg
  if (image.mimetype !== "image/png" && image.mimetype !== "image/jpeg") {
    throw new Error("File type not supported");
  }

  // check if image is too large
  if (image.size > 1000000) {
    throw new Error("File too large");
  }

  // make folder
  makeFolders(dirName);

  // check if image is square
  const { width, height } = await getImageDimension(image);
  if (width !== height) {
    const newPath = await cropSquareImage(image, dirName);
    image.filepath = newPath;
  }

  // generate different sizes of images using imageMagick
  const paths = await generateImagesOfDifferentSizes(image, dirName);

  // make zip file
  const zipFilePath = await makeZipFile(dirName);

  // delete temp file
  const ext = getFileExtension(image);

  // delete temp file if it exists
  const tempImagePath = path.join(tempPath, `${dirName}.${ext}`);
  // if (fs.existsSync(tempImagePath)) fs.unlinkSync(tempImagePath);

  // delete folder
  fs.rmdirSync(path.join(imagesPath, dirName), { recursive: true });
  return zipFilePath;
};
