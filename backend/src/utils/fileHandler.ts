// import fs from "fs/promises";
// import path from "path";
// import { fileURLToPath } from "url";
// import { dirname } from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// export class FileHandler {
//   private uploadDir: string;

//   constructor(uploadDir: string = "../public/uploads/") {
//     this.uploadDir = path.join(__dirname, uploadDir);
//   }

//   /**
//    * Process multiple uploaded files
//    * @param {Express.Multer.File[]} files - Array of uploaded files
//    * @returns {Promise<Array>} Array of processed file objects
//    */
//   async processUploadedFiles(files: Express.Multer.File[]): Promise<
//     {
//       filename: string;
//       originalname: string;
//       mimetype: string;
//       size: number;
//       path: string;
//     }[]
//   > {
//     if (!files || files.length === 0) {
//       throw new Error("No files provided");
//     }

//     return files.map((file) => ({
//       filename: file.filename,
//       originalname: file.originalname,
//       mimetype: file.mimetype,
//       size: file.size,
//       path: `/uploads/${file.filename}`,
//     }));
//   }

//   /**
//    * Delete multiple files by their filenames
//    * @param {string[]} filenames - Array of filenames to delete
//    * @returns {Promise<Array>} Array of results indicating success/failure for each file
//    */
//   async deleteFiles(
//     filenames: string[]
//   ): Promise<{ filename: string; success: boolean; error?: string }[]> {
//     if (!Array.isArray(filenames)) {
//       filenames = [filenames];
//     }

//     const results = await Promise.allSettled(
//       filenames.map(async (filename) => {
//         try {
//           const filepath = path.join(this.uploadDir, filename);
//           await fs.unlink(filepath);
//           return { filename, success: true };
//         } catch (error) {
//           return { filename, success: false, error: (error as Error).message };
//         }
//       })
//     );

//     return results.map((result) => {
//       if (result.status === "fulfilled") {
//         return result.value;
//       }
//       return { success: false, error: result.reason as string };
//     });
//   }

//   /**
//    * Delete files by their full paths
//    * @param {string[]} paths - Array of file paths to delete
//    * @returns {Promise<Array>} Array of results
//    */
//   async deleteFilesByPaths(
//     paths: string[]
//   ): Promise<{ filename: string; success: boolean; error?: string }[]> {
//     const filenames = paths.map((filePath) => filePath.split("/").pop() || "");
//     return this.deleteFiles(filenames);
//   }
// }

/* Demonstration of how to use the FileHandler class

const fileHandler = new FileHandler();

app.post("/api/v1/images", upload.array("imageUrls", 5), async (req, res) => {
  try {
    // Process uploaded images
    const images = await fileHandler.processUploadedFiles(req.files);


    res.status(201).json({ status: "success", data: images });
  } catch (error) {
    // Handle error
  }
});

app.delete("/api/v1/images", async (req, res) => {
  try {
    // Process uploaded images
    // Delete associated images
    const a = await fileHandler.deleteFilesByPaths([req.body.url]);

    res.status(201).json({ status: "success", a });
  } catch (error) {
    // Handle error
  }
});

*/
