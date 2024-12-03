import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Document } from "@/models/Document";
import mongoose from "mongoose";

// Función para obtener la instancia de GridFS
async function getGridFS() {
  await connectDB();
  const conn = mongoose.connection;
  return new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "documents",
  });
}

export async function GET() {
  try {
    const documents = await Document.find().sort({ uploadDate: -1 });
    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching documents" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const uploadedBy = (formData.get("uploadedBy") as string) || "anonymous";

    // Obtener instancia de GridFS
    const gfs = await getGridFS();

    // Convertir el archivo a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;

    // Crear writeStream para subir el archivo
    const uploadStream = gfs.openUploadStream(filename, {
      contentType: file.type,
    });

    // Subir el archivo
    await new Promise((resolve, reject) => {
      const writeStream = uploadStream;
      writeStream.write(buffer, (error: any) => {
        if (error) {
          reject(error);
          return;
        }
        writeStream.end(() => {
          resolve(true);
        });
      });
    });

    // Crear documento en la colección
    const document = await Document.create({
      title,
      description,
      category,
      fileId: uploadStream.id,
      fileName: file.name,
      fileSize: file.size,
      uploadedBy,
      contentType: file.type,
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      { error: "Error creating document" },
      { status: 500 }
    );
  }
}
