import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

async function getGridFS() {
  await connectDB();
  const conn = mongoose.connection;
  
  if (!conn.db) {
    throw new Error("No se pudo conectar a la base de datos");
  }
  
  return new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "media",
  });
}

export async function uploadFiles(files: File[]) {
  try {
    const media = [];
    const gfs = await getGridFS();

    // Procesar cada archivo
    for (const file of files) {
      if (file instanceof File) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name}`;

        // Subir archivo a GridFS
        const uploadStream = gfs.openUploadStream(filename, {
          contentType: file.type,
        });

        await new Promise((resolve, reject) => {
          const writeStream = uploadStream;
          writeStream.write(buffer, (error) => {
            if (error) {
              reject(error);
              return;
            }
            writeStream.end(() => {
              resolve(true);
            });
          });
        });

        media.push({
          type: file.type,
          url: `/api/media/${uploadStream.id}`,
          filename: filename,
          fileId: uploadStream.id,
        });
      }
    }

    return media;
  } catch (error) {
    console.error("Error al subir archivos:", error);
    throw new Error("Error al subir los archivos");
  }
} 