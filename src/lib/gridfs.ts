import { GridFsStorage } from "multer-gridfs-storage";
import multer from "multer";
import { connectDB } from "./mongodb";

const storage = new GridFsStorage({
  url: process.env.MONGODB_URI as string,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: "documents",
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

export const upload = multer({ storage });
