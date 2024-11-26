import multer from "multer";
import DataParser from "datauri/parser.js";
import path from "path";

const storage = multer.memoryStorage();

const upload = multer({ storage });

const parser = new DataParser();

// Define the file type
interface UploadedFile {
  originalname: string;
  buffer: Buffer;
}

export const formatImage = (file: UploadedFile): string | undefined => {
  const fileExtension = path.extname(file.originalname.toString());
  return parser.format(fileExtension, file.buffer).content;
};

export default upload;
