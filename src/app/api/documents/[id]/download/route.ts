import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { Document } from "@/models/Document";

async function getGridFS() {
  await connectDB();
  const conn = mongoose.connection;
  return new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "documents",
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const document = await Document.findById(params.id);
    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const gfs = await getGridFS();
    const downloadStream = gfs.openDownloadStream(
      new mongoose.Types.ObjectId(document.fileId)
    );

    // Convertir el stream a buffer
    const chunks: any[] = [];
    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Crear respuesta con el archivo
    const response = new NextResponse(buffer);
    response.headers.set("Content-Type", document.contentType);

    return response;
  } catch (error) {
    console.error("Error downloading document:", error);
    return NextResponse.json(
      { error: "Error downloading document" },
      { status: 500 }
    );
  }
}
