// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { generateImages } from "../../helpers/ImageMaker";
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
    const { image } = files;
    // create unique identifier for request
    const uid =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // generate images

    try {
      const zipPath = await generateImages(image, uid);

      if (!fs.existsSync(zipPath)) {
        throw new Error("Zip file not found");
      }
      const zip = fs.readFileSync(zipPath);

      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Length", zip.length);
      res.setHeader("Content-Transfer-Encoding", "binary");
      res.setHeader("Expires", "0");
      res.setHeader(
        "Cache-Control",
        "must-revalidate, post-check=0, pre-check=0"
      );
      res.setHeader("Pragma", "public");

      res.status(200).send(zip);
    } catch (error) {
      res.status(500).json({ message: (error as any).message });
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
