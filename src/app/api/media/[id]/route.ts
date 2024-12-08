import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

async function getGridFS() {
  await connectDB();
  const conn = mongoose.connection;
  return new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "media",
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gfs = await getGridFS();

    // Obtener el archivo de GridFS
    const downloadStream = gfs.openDownloadStream(
      new mongoose.Types.ObjectId(params.id)
    );

    // Convertir el stream a buffer
    const chunks = [];
    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Obtener información del archivo
    const files = await gfs
      .find({ _id: new mongoose.Types.ObjectId(params.id) })
      .toArray();
    const file = files[0];

    // Crear respuesta con el archivo y su tipo MIME
    const response = new NextResponse(buffer);
    response.headers.set("Content-Type", file.contentType);
    return response;
  } catch (error) {
    console.error("Error serving media:", error);
    return NextResponse.json(
      { error: "Error al obtener el archivo multimedia" },
      { status: 500 }
    );
  }
}
