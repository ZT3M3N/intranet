import { NextRequest, NextResponse } from "next/server";
import { AnnouncementService } from "@/services/announcementService";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

async function getGridFS() {
  await connectDB();
  const conn = mongoose.connection;
  return new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "media",
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const author = formData.get("author") as string;
    const content = formData.get("content") as string;
    const mediaFiles = formData.getAll("media");

    const media = [];
    const gfs = await getGridFS();

    // Procesar cada archivo
    for (const file of mediaFiles) {
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

    const announcementData = {
      author,
      content,
      media: media.length > 0 ? media : undefined,
      avatar:
        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    };

    const announcement = await AnnouncementService.createAnnouncement(
      announcementData
    );
    return NextResponse.json(announcement);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Error al crear el anuncio" },
      { status: 500 }
    );
  }
}

// Configurar el tamaño máximo de la carga
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

export async function GET() {
  try {
    const announcements = await AnnouncementService.getAllAnnouncements();
    return NextResponse.json(announcements);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error fetching announcements" },
      { status: 500 }
    );
  }
}
