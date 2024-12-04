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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const document = await Document.findById(params.id);
    if (!document) {
      return NextResponse.json(
        { error: "Documento no encontrado" },
        { status: 404 }
      );
    }

    // Obtener instancia de GridFS
    const gfs = await getGridFS();

    // Eliminar el archivo de GridFS
    try {
      await gfs.delete(new mongoose.Types.ObjectId(document.fileId));
    } catch (error) {
      console.error("Error al eliminar archivo de GridFS:", error);
    }

    // Eliminar el documento de la colección
    await Document.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: "Documento eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar documento:", error);
    return NextResponse.json(
      { error: "Error al eliminar el documento" },
      { status: 500 }
    );
  }
}
