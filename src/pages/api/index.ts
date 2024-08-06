// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import {
  cleanupFiles,
  cropToSquare,
  ensureDirectoriesExist,
  generateImagesAndArchive,
  getSquareCropDimensions,
  validateImage,
} from "../../helpers/ImageMaker";

// Define the Crop interface to type crop properties
interface Crop {
  width: number;
  height: number;
  x: number;
  y: number;
}

// API handler function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Create a new formidable form instance to handle file uploads
  const form = new formidable.IncomingForm({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    // Handle form parsing errors
    if (err) {
      console.error("Error parsing form data:", err);
      return res.status(500).json({ message: "Error parsing form data" });
    }

    // Extract image file and crop data from parsed fields
    const image = files.image as formidable.File;
    const cropJsonString = fields.crop as string;

    try {
      // Parse crop data or get default crop dimensions
      let crop: Crop | null = null;
      if (cropJsonString) {
        try {
          crop = JSON.parse(cropJsonString) as Crop;
        } catch (error) {
          throw new Error("Invalid crop JSON format");
        }
      }
      if (!crop) {
        crop = await getSquareCropDimensions(image);
      }

      // Validate image type and size
      validateImage(image);

      // Ensure necessary directories exist
      ensureDirectoriesExist(image.newFilename);

      // Crop the image and update the file path
      const croppedImagePath = await cropToSquare(image, crop);
      (image as formidable.File).filepath = croppedImagePath;

      // Generate images of different sizes and create a ZIP archive
      const zipFilePath = await generateImagesAndArchive(image);

      // Check if the ZIP file exists
      if (!fs.existsSync(zipFilePath)) {
        throw new Error("ZIP file not found");
      }

      // Set response headers for file download
      const stat = fs.statSync(zipFilePath);
      res.setHeader(
        "Content-Disposition",
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

      // Stream the ZIP file to the response
      const fileStream = fs.createReadStream(zipFilePath);
      fileStream.pipe(res);

      fileStream.on("error", (err) => {
        console.error("File stream error:", err);
        res.status(500).json({ message: "Internal Server Error" });
      });

      fileStream.on("end", () => {
        if (fs.existsSync(zipFilePath)) fs.unlinkSync(zipFilePath);
      });
    } catch (error) {
      if (error instanceof Error) {
        // Handle known error types
        console.error("Processing error:", error.message);
        res.status(500).json({ message: error.message });
      } else {
        // Handle unknown error types
        console.error("Unknown error:", error);
        res.status(500).json({ message: "Something went wrong" });
      }
    } finally {
      // Clean up temporary files
      cleanupFiles(image);
    }
  });
}

// Disable default body parsing to handle file uploads with formidable
export const config = {
  api: {
    bodyParser: false,
  },
};
