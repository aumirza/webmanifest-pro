// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import {
  cleanUp,
  cropSquareImage,
  generateImages,
  getCrop,
  makeFolders,
  preCheck,
} from "../../helpers/ImageMaker";
import fs from "fs";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const form = new formidable.IncomingForm({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error", err);
      throw err;
    }

    const image = files.image as formidable.File;
    const cropJsonString = fields.crop as string;

    try {
      let crop = cropJsonString ? (JSON.parse(cropJsonString) as object) : null;
      if (!crop) {
        crop = await getCrop(image);
      }
      preCheck(image);
      makeFolders(image.newFilename);
      const newPath = await cropSquareImage(image, crop);
      (image as formidable.File).filepath = newPath;
      const zipPath = await generateImages(image);
      cleanUp(image);

      if (!fs.existsSync(zipPath)) {
        throw new Error("Zip file not found");
      }

      const stat = fs.statSync(zipPath);
      const zip = fs.readFileSync(zipPath);

      res.setHeader(
        "Content-disposition",
        "attachment; filename=generated.zip"
      );
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Length", stat.size);
      res.setHeader("Content-Transfer-Encoding", "binary");
      res.setHeader("Expires", "0");
      res.setHeader(
        "Cache-Control",
        "must-revalidate, post-check=0, pre-check=0"
      );
      res.setHeader("Pragma", "public");

      res.status(200).send(zip);
      // fs.unlinkSync(zipPath);
    } catch (error) {
      res.status(500).json({
        message: (error as any).message
          ? (error as any).message
          : "Something went wrong",
      });
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
